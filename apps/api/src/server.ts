import { trpcServer } from "@hono/trpc-server";
import { auth } from "@repo/auth";
import { cors } from "@repo/middleware";
import { Hono } from "hono";
import { appRouter } from "./router";
import { createTRPCContext } from "./trpc";

export const app = new Hono<{ Bindings: {} }>();

app.use(cors(process.env));
app.all("/api/auth/*", (c) => auth(process.env).handler(c.req.raw));
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: createTRPCContext,
  })
);

export default app;
