import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { articles } from "@/db/schema";

async function main() {
  const filePath = path.join("src/assets/products/dummy_items.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  for (const item of data) {
    await db.insert(articles).values({
      title: item.title,
      description: item.description,
      price: Math.round(item.price),
      imageUrl: item.image || null,
      glbUrl: item.glb || null,
    });
  }

  console.debug("Import complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
