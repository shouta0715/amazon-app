import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { factory } from "@/app";
import { users } from "@/db/schema";
import { clerkUserCreatedSchema } from "@/schemas/webhook";

const app = factory.createApp();

// POST /webhooks/clerk - handle Clerk user.created event
app.post("/clerk", vValidator("json", clerkUserCreatedSchema), async (c) => {
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
    await c.var.db.insert(users).values({ clerkUserId, email });

    return c.json({ created: true }, 201);
  } catch (err) {
    if (err instanceof v.ValiError) {
      return c.json({ error: "Invalid webhook payload" }, 400);
    }

    console.error("Error handling Clerk webhook:", err);

    return c.json({ error: "Failed to create user from Clerk webhook" }, 500);
  }
});

export { app as webhooksApp };
