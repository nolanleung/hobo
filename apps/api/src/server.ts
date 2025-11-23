import { trpcServer } from "@hono/trpc-server";
import { PrismaD1 } from "@prisma/adapter-d1";
import { auth, prismaAdapter } from "@repo/auth";
import { db } from "@repo/database";
import { cors } from "@repo/middleware";
import { Hono } from "hono";
import { appRouter } from "./router";
import { createTRPCContext } from "./trpc";

export const app = new Hono<{ Bindings: Env }>();

app.use((c, next) => cors(c.env)(c, next));
app.all("/api/auth/*", async (c) => {
  const adapter = new PrismaD1(c.env.HOBO_DB);
  const prisma = await db({ adapter });
  const betterAuthAdapter = prismaAdapter(prisma, {
    provider: "sqlite",
  });

  const client = await auth({
    adapter: betterAuthAdapter,
    WEB_ORIGIN: c.env.WEB_ORIGIN,
  });

  return client.handler(c.req.raw);
});
app.use("/trpc/*", (ctx, next) =>
  trpcServer({
    router: appRouter,
    createContext: createTRPCContext(ctx.env),
  })(ctx, next)
);

export default app;
