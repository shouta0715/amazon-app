import type { R2Bucket } from "@cloudflare/workers-types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

export type Env = {
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_JWT_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  DATABASE_URL: string;
};

export type CloudflareBindings = {
  AMAZON_R2_BUCKET: R2Bucket;
} & Env;

type CloudflareVariables = {
  db: NodePgDatabase<typeof schema>;
};

export type CloudflareEnv = {
  Bindings: CloudflareBindings;
  Variables: CloudflareVariables;
};
