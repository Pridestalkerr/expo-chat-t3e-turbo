import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    API_PORT: z.coerce.number(),
  },
  runtimeEnv: process.env,
});
