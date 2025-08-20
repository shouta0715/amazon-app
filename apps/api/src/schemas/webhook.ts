import * as v from "valibot";

export const clerkUserCreatedSchema = v.object({
  data: v.object({
    id: v.string(),
    email_addresses: v.array(v.object({ email_address: v.string() })),
  }),
});

export type ClerkUserCreated = v.InferOutput<typeof clerkUserCreatedSchema>;
