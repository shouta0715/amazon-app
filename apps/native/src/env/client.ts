/* eslint-disable eslint-plugin-n/no-process-env */
import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  server: {},
  client: {
    EXPO_PUBLIC_API_URL: v.string(),
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: v.string(),
  },
  runtimeEnv: process.env,
});
