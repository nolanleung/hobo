import { auth } from "@repo/auth";
import { db } from "@repo/database";
import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createTRPCContext = async (
  c: FetchCreateContextFnOptions,
  ctx: any
) => {
  const headers = c.req.headers;
  const authSession = await auth(ctx.env).api.getSession({ headers });
  const client = db(ctx.env);

  return {
    user: authSession?.user,
    headers,
    db: client,
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
      headers: ctx.headers,
    },
  });
});
