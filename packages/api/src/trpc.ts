/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { OpenApiMeta } from "trpc-openapi";

export const createTRPCContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  // const session = await auth();

  return {
    // session,
    req,
    res,
  };
};

type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
// const requireAuth = t.middleware(({ ctx, next }) => {
//   if (!ctx.session?.user) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       // infers the `session` as non-nullable
//       session: { ...ctx.session, user: ctx.session.user },
//     },
//   });
// });

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
// export const protectedProcedure = t.procedure.use(requireAuth);
