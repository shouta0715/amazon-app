import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { db } from "@/db";
import { users } from "@/db/schema";
import { clerkUserCreatedSchema } from "@/schemas/webhook";

const router = new Hono();

// POST /webhooks/clerk - handle Clerk user.created event
router.post("/clerk", vValidator("json", clerkUserCreatedSchema), async (c) => {
  const event = c.req.valid("json");
  try {
    // Clerk user.created webhook payload structure
    // See: https://clerk.com/docs/reference/webhooks#user.created
    const clerkUserId = event.data.id;
    const email = event.data.email_addresses[0]?.email_address;

    if (!clerkUserId || !email) {
      return c.json(
        { error: "Missing Clerk user id or email in webhook payload" },
        400,
      );
    }
    await db.insert(users).values({ clerkUserId, email });

    return c.json({ created: true }, 201);
  } catch (err) {
    if (err instanceof v.ValiError) {
      return c.json({ error: "Invalid webhook payload" }, 400);
    }

    console.error("Error handling Clerk webhook:", err);

    return c.json({ error: "Failed to create user from Clerk webhook" }, 500);
  }
});

export { router as webhooksRouter };
