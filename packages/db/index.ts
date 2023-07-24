import { drizzle } from "drizzle-orm/postgres-js";
// import type { Sql } from "postgres";
import postgres from "postgres";
import * as schema from "./src/schema";
import { env } from "@acme/env";

export const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, {
  schema: { ...schema },
  logger: true,
});

export const { users, sessions } = schema;

export const x = 3;

// type FirstArg<T extends (...args: any) => any> = T extends (
//   arg1: infer U,
//   ...args: any
// ) => any
//   ? U
//   : never;

// export const initDb = async <T extends FirstArg<typeof drizzle>>(client: T) => {
//   const db = drizzle(client, {
//     schema: { ...schema },
//     logger: true,
//   });

//   return db;
// };
