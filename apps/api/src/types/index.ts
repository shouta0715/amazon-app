import type { R2Bucket } from "@cloudflare/workers-types";

export type Env = {
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
};

export type CloudflareBindings = {
  AMAZON_R2_BUCKET: R2Bucket;
};
