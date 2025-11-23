import { PrismaD1 } from "@prisma/adapter-d1";
import { auth, prismaAdapter } from "@repo/auth";
import { db } from "@repo/database";
import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { noop } from "./lib/noop";

export const createTRPCContext =
  (env: Env) => async (c: FetchCreateContextFnOptions, ctx: any) => {
    const headers = c.req.headers;
    const adapter = new PrismaD1(env.HOBO_DB);
    const prisma = await db({ adapter });
    const betterAuthAdapter = prismaAdapter(prisma, {
      provider: "sqlite",
    });

    const authSession = await auth({
      adapter: betterAuthAdapter,
      WEB_ORIGIN: env.WEB_ORIGIN,
    })
      .api.getSession({ headers })
      .catch(noop);

    return {
      user: authSession?.user,
      db: prisma,
      env: ctx.env,
    };
  };
type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
      // headers: ctx.headers,
    },
  });
});
