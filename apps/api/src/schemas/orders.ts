import * as v from "valibot";

export const paymentSheetSchema = v.object({
  amount: v.number(),
  currency: v.string(),
  email: v.string(),
});

export const orderItemSchema = v.object({
  articleId: v.number(),
  quantity: v.number(),
});

export const createOrderSchema = v.object({
  items: v.array(orderItemSchema),
});

export const updateOrderSchema = v.object({
  items: v.array(orderItemSchema),
});
