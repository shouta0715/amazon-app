import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "@/constant";

export default defineConfig({
  out: "./src/drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
