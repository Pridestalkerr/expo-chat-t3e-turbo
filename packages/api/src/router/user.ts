// import { TRPCError } from "@trpc/server";
import z from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";

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
      z
        .object({
          id: z.string(),
          username: z.string(),
        })
        .or(z.null())
    )
    .query(async ({ input }) => {
      return null;
    }),
});
