import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { db, users } from "@acme/db";
import argon2 from "argon2";
import { eq } from "drizzle-orm";

import { randomBytes } from "crypto";
export const generateToken = (size = 64) => {
  return randomBytes(size).toString("hex");
};

const loginSchema = z.object({
  username: z.string().min(6).max(20),
  password: z.string().min(6).max(100),
});

export const authRouter = router({
  register: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/register",
        summary: "Register",
        description: "Register to the application",
        tags: ["auth"],
      },
    })
    .input(loginSchema)
    .output(z.void())
    .mutation(async ({ input }) => {
      const user = (
        await db
          .insert(users)
          .values({
            username: input.username,
            hashedPassword: await argon2.hash(input.password),
          })
          .returning()
      )[0];

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register",
        });
      }

      return;
    }),

  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/login",
        summary: "Login",
        description: "Login to the application",
        tags: ["auth"],
      },
    })
    .input(loginSchema)
    .output(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.username, input.username),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const validPassword = await argon2.verify(
        user.hashedPassword,
        input.password
      );

      if (!validPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      return {
        token: generateToken(),
      };
    }),
});
