// import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { db, users } from "@acme/db";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const helloSchema = z.object({
  name: z.string(),
});

export const userRouter = router({
  sayHello: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/user/sayHello",
        summary: "Say hello",
        description: "Say hello to the user",
        tags: ["user"],
      },
    })
    .input(helloSchema)
    .output(
      z.object({
        message: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        message: `Hello ${input.name}`,
      };
    }),

  find: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/user/find",
        summary: "Find",
        description: "Find a user",
        tags: ["user"],
      },
    })
    .input(
      z.object({
        username: z.string(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.username, input.username),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        id: user.id,
        username: user.username,
      };
    }),
});
