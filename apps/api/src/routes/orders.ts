import { getAuth } from "@hono/clerk-auth";
import { vValidator } from "@hono/valibot-validator";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { env } from "hono/adapter";
import Stripe from "stripe";
import { db } from "../db";
import { orders, orderItems, articles, users } from "../db/schema";
import { Env } from "../types";
import {
  paymentSheetSchema,
  createOrderSchema,
  updateOrderSchema,
} from "@/schemas/orders";

const router = new Hono();

router.post(
  "/payment-sheet",
  vValidator("json", paymentSheetSchema),
  async (c) => {
    const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = env<Env>(c);

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const { amount, currency, email } = c.req.valid("json");

    const customer = await stripe.customers.create({
      email,
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2025-04-30.basil" },
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    return c.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
    });
  },
);

// GET /orders - list orders for authenticated user (with items)
router.get("/", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Could not find user" }, 401);
  }

  // 1. Find the internal user ID based on the Clerk user ID
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, auth.userId));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // 2. Use the internal user ID to fetch orders
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id));

  const orderIds = userOrders.map((o) => o.id);

  let items = orderIds.length
    ? await db
        .select()
        .from(orderItems)
        .where(inArray(orderItems.orderId, orderIds))
    : [];

  // Fetch all articleIds for these items
  const articleIds = items.map((i) => i.articleId);
  const articlesMap = articleIds.length
    ? (
        await db.select().from(articles).where(inArray(articles.id, articleIds))
      ).reduce(
        (acc, article) => {
          acc[article.id] = article;

          return acc;
        },
        {} as Record<number, typeof articles.$inferSelect>,
      )
    : {};

  // Attach full article info to each item, mapping imageUrl and glbUrl to full URLs
  const host = c.req.header("host");
  const protocol = c.req.header("x-forwarded-proto");
  items = items.map((item) => {
    let article = articlesMap[item.articleId] || null;
    if (article) {
      article = {
        ...article,
        imageUrl: article.imageUrl
          ? `${protocol}://${host}/articles/image/${encodeURIComponent(article.imageUrl)}`
          : null,
        glbUrl: article.glbUrl
          ? `${protocol}://${host}/articles/glb/${encodeURIComponent(article.glbUrl)}`
          : null,
      };
    }

    return {
      ...item,
      article,
    };
  });

  return c.json(
    userOrders.map((order) => ({
      ...order,
      items: items.filter((i) => i.orderId === order.id),
    })),
  );
});

// GET /orders/all - list all orders (admin, no auth for now)
router.get("/all", async (c) => {
  const allOrders = await db.select().from(orders);
  const orderIds = allOrders.map((o) => o.id);
  const items = orderIds.length
    ? await db
        .select()
        .from(orderItems)
        .where(inArray(orderItems.orderId, orderIds))
    : [];

  return c.json(
    allOrders.map((order) => ({
      ...order,
      items: items.filter((i) => i.orderId === order.id),
    })),
  );
});

// GET /orders/:id - get a specific order by ID (no auth)
router.get("/:id", async (c) => {
  const orderId = Number(c.req.param("id"));
  if (isNaN(orderId)) {
    return c.json({ error: "Invalid order id" }, 400);
  }
  // Fetch the order
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }
  // Fetch items for this order
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  // Fetch all articleIds for these items
  const articleIds = items.map((i) => i.articleId);
  const articlesMap = articleIds.length
    ? (
        await db.select().from(articles).where(inArray(articles.id, articleIds))
      ).reduce(
        (acc, article) => {
          acc[article.id] = article;

          return acc;
        },
        {} as Record<number, typeof articles.$inferSelect>,
      )
    : {};

  // Attach full article info to each item, mapping imageUrl and glbUrl to full URLs
  const host = c.req.header("host");
  const protocol = c.req.header("x-forwarded-proto");
  const itemsWithArticles = items.map((item) => {
    let article = articlesMap[item.articleId] || null;
    if (article) {
      article = {
        ...article,
        imageUrl: article.imageUrl
          ? `${protocol}://${host}/articles/image/${encodeURIComponent(article.imageUrl)}`
          : null,
        glbUrl: article.glbUrl
          ? `${protocol}://${host}/articles/glb/${encodeURIComponent(article.glbUrl)}`
          : null,
      };
    }

    return {
      ...item,
      article,
    };
  });

  return c.json({ ...order, items: itemsWithArticles });
});

// POST /orders - create new order with items for authenticated user
router.post("/", vValidator("json", createOrderSchema), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Could not find user" }, 401);
  }

  // 1. Find the internal user ID based on the Clerk user ID
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, auth.userId));
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  const userId = user.id;

  const { items } = c.req.valid("json");

  // Create order
  const [order] = await db.insert(orders).values({ userId }).returning();

  if (!order) {
    return c.json({ error: "Failed to create order" }, 500);
  }

  // Create order items
  const orderItemsToInsert = items.map((item) => ({
    orderId: order.id,
    articleId: item.articleId,
    quantity: item.quantity,
  }));

  await db.insert(orderItems).values(orderItemsToInsert);

  return c.json({ ...order, items: orderItemsToInsert }, 201);
});

// PATCH /orders/:id - update order (e.g., items or status)
router.patch("/:id", vValidator("json", updateOrderSchema), async (c) => {
  const orderId = Number(c.req.param("id"));
  if (isNaN(orderId)) {
    return c.json({ error: "Invalid order id" }, 400);
  }
  const { items } = c.req.valid("json");

  // Delete old items
  await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
  // Insert new items
  const orderItemsToInsert = items.map((item) => ({
    orderId,
    articleId: item.articleId,
    quantity: item.quantity,
  }));
  await db.insert(orderItems).values(orderItemsToInsert);

  // Optionally update other order fields here
  const updatedOrder = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId));
  const updatedItems = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return c.json({ ...updatedOrder[0], items: updatedItems });
});

export { router as ordersRouter };
