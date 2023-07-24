import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createServer } from "http";
import { appRouter, createTRPCContext, openApiDocument } from "@acme/api";
// import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "@acme/env";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import swagger from "swagger-ui-express";

const main = async () => {
  const app = express();
  console.log(env);
  app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
  });
  // app.use(cors({ origin: "http://localhost:19000", credentials: true }));

  const server = createServer(app);
  app.use(cookieParser());
  //   //   app.use(morgan("tiny"));
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: createTRPCContext,
    })
  );
  app.use(
    "/api",
    createOpenApiExpressMiddleware({
      router: appRouter,
      createContext: createTRPCContext,
    })
  );
  app.use("/swagger", swagger.serve);
  app.get("/swagger", swagger.setup(openApiDocument));

  server.listen(env.API_PORT, () => {
    console.log(`Server started on port ${env.API_PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
