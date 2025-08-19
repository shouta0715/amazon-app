import * as v from "valibot";

export const createArticleSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  price: v.number(),
  imageUrl: v.optional(v.string()),
  glbUrl: v.optional(v.string()),
});

export const updateArticleSchema = v.object({
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  price: v.optional(v.number()),
  imageUrl: v.optional(v.string()),
  glbUrl: v.optional(v.string()),
});
