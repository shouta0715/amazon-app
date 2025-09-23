import { drizzle } from "drizzle-orm/node-postgres";
import { createFactory } from "hono/factory";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { CloudflareEnv } from "../types";

export const factory = createFactory<CloudflareEnv>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const pool = new Pool({
        connectionString: c.env.DATABASE_URL,
      });

      const db = drizzle(pool, { schema });
      c.set("db", db);
      await next();
    });
  },
});
