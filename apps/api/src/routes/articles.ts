import { vValidator } from "@hono/valibot-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { createArticleSchema, updateArticleSchema } from "@/schemas/articles";
import type { CloudflareBindings } from "@/types";

const router = new Hono<{ Bindings: CloudflareBindings }>();

// GET /articles - list all articles
router.get("/", async (c) => {
  const all = await db.select().from(articles);
  const host = c.req.header("host");
  const protocol = c.req.header("x-forwarded-proto") || "http";
  // Map imageUrl and glbUrl to R2 URLs if present
  const mapped = all.map((article) => ({
    ...article,
    imageUrl: article.imageUrl
      ? `${protocol}://${host}/articles/image/${encodeURIComponent(article.imageUrl)}`
      : null,
    glbUrl: article.glbUrl
      ? `${protocol}://${host}/articles/glb/${encodeURIComponent(article.glbUrl)}`
      : null,
  }));

  return c.json(mapped);
});

// GET /articles/:id - get one article by id
router.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid article id" }, 400);
  }
  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  if (!article) {
    return c.json({ error: "Article not found" }, 404);
  }
  const host = c.req.header("host");
  const protocol = c.req.header("x-forwarded-proto") || "http";
  // Map imageUrl and glbUrl to R2 URLs if present
  const mapped = {
    ...article,
    imageUrl: article.imageUrl
      ? `${protocol}://${host}/articles/image/${encodeURIComponent(article.imageUrl)}`
      : null,
    glbUrl: article.glbUrl
      ? `${protocol}://${host}/articles/glb/${encodeURIComponent(article.glbUrl)}`
      : null,
  };

  return c.json(mapped);
});

// PATCH /articles/:id - update article
router.patch("/:id", vValidator("json", updateArticleSchema), async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid article id" }, 400);
  }
  const { title, description, price, imageUrl, glbUrl } = c.req.valid("json");
  const [updated] = await db
    .update(articles)
    .set({ title, description, price, imageUrl, glbUrl })
    .where(eq(articles.id, id))
    .returning();
  if (!updated) {
    return c.json({ error: "Article not found" }, 404);
  }

  return c.json(updated);
});

// DELETE /articles/:id - delete article
router.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid article id" }, 400);
  }
  const [deleted] = await db
    .delete(articles)
    .where(eq(articles.id, id))
    .returning();
  if (!deleted) {
    return c.json({ error: "Article not found" }, 404);
  }

  return c.json({ success: true });
});

// POST /articles - create new article
router.post("/", vValidator("json", createArticleSchema), async (c) => {
  const { title, description, price, imageUrl, glbUrl } = c.req.valid("json");

  const [created] = await db
    .insert(articles)
    .values({ title, description, price, imageUrl, glbUrl })
    .returning();

  return c.json(created, 201);
});

// GET /articles/image/:imageUrl - serve an image by filename from R2
router.get("/image/:imageUrl", async (c) => {
  const imageUrl = c.req.param("imageUrl");
  if (!imageUrl) {
    return c.json({ error: "Missing image filename" }, 400);
  }

  try {
    const r2Object = await c.env.AMAZON_R2_BUCKET.get(`images/${imageUrl}`);

    if (!r2Object) {
      return c.json({ error: "Image file not found" }, 404);
    }

    const ext = imageUrl.split(".").pop()?.toLowerCase();
    if (!ext) {
      return c.json({ error: "Invalid image filename" }, 400);
    }

    let contentType = "application/octet-stream";

    switch (ext) {
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "webp":
        contentType = "image/webp";
        break;
    }

    return new Response(r2Object.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // 24時間キャッシュ
      },
    });
  } catch (error) {
    console.error("Error serving image from R2:", error);

    return c.json({ error: "Failed to load image" }, 500);
  }
});

// GET /articles/glb/:glbUrl - serve a glb file by filename from R2
router.get("/glb/:glbUrl", async (c) => {
  const glbUrl = c.req.param("glbUrl");
  if (!glbUrl) {
    return c.json({ error: "Missing glb filename" }, 400);
  }

  try {
    const r2Object = await c.env.AMAZON_R2_BUCKET.get(`models/${glbUrl}`);

    if (!r2Object) {
      return c.json({ error: "GLB file not found" }, 404);
    }

    return new Response(r2Object.body, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Cache-Control": "public, max-age=86400", // 24時間キャッシュ
      },
    });
  } catch (error) {
    console.error("Error serving GLB file from R2:", error);

    return c.json({ error: "Failed to load GLB file" }, 500);
  }
});

// POST /articles/upload - ファイルアップロード用エンドポイント
router.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as unknown as File;
    const type = formData.get("type") as string; // "image" or "model"

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    if (!type || !["image", "model"].includes(type)) {
      return c.json({ error: "Invalid type. Must be 'image' or 'model'" }, 400);
    }

    // ファイル名を生成（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    // R2フォルダを決定
    const folder = type === "image" ? "images" : "models";
    const r2Key = `${folder}/${fileName}`;

    // R2にアップロード
    await c.env.AMAZON_R2_BUCKET.put(r2Key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    return c.json({
      success: true,
      fileName,
      url: `/${folder}/${fileName}`,
      type,
    });
  } catch (error) {
    console.error("Error uploading file to R2:", error);

    return c.json({ error: "Failed to upload file" }, 500);
  }
});

export { router as articlesRouter };
