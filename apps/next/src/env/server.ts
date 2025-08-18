/* eslint-disable eslint-plugin-n/no-process-env */
import "server-only";

import { createEnv } from "@t3-oss/env-nextjs";
// import * as v from "valibot";

export const env = createEnv({
  server: {},
  experimental__runtimeEnv: process.env,
});
