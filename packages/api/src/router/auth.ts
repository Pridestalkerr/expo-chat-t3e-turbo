import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { db, users, sessions } from "@acme/db";
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

      const token = generateToken();
      // could handle this in a transaction but itll do for now
      const sesh = (
        await db
          .insert(sessions)
          .values({
            userId: user.id,
            sessionToken: token,
          })
          .returning()
      )[0];

      if (!sesh) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to login",
        });
      }

      return {
        token: sesh.sessionToken,
      };
    }),
  me: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/me",
        summary: "Me",
        description: "Get current user",
        tags: ["auth"],
      },
    })
    .input(
      z.object({
        token: z.string(),
      })
    )
    .output(
      z
        .object({
          username: z.string(),
        })
        .or(z.null())
    )
    .query(async ({ input }) => {
      const sesh = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, input.token),
        with: {
          user: true,
        },
      });

      if (!sesh) {
        return null;
      }

      return {
        username: sesh.user.username,
      };
    }),
});
