import type { Config } from "drizzle-kit";
import { env } from "@acme/env";

export default {
  schema: "./src/schema/index.ts",
  out: "./migrations",
  verbose: true,
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
