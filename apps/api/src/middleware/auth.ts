import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { Env } from "@/types";

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = getAuth(c);
  if (!auth || !auth.userId) {
    return c.json({ error: "Could not find user" }, 401);
  }

  return next();
});

export const clerkAuthMiddleware = createMiddleware(async (c, next) => {
  const { CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, CLERK_JWT_KEY } =
    env<Env>(c);

  const clerkAuth = clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLISHABLE_KEY,
    jwtKey: CLERK_JWT_KEY,
  });

  return clerkAuth(c, next);
});
