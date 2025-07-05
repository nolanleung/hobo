/**
 * This a minimal tRPC server
 */
import { authHandler, getSession } from "@repo/auth/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";

const appRouter = router({
  auth: {
    getSession: publicProcedure.query(async ({ ctx }) => {
      const session = await getSession({
        headers: ctx.req.headers as Record<string, string>,
      });
      return session;
    }),
    signIn: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { email, password } = input;
        return authHandler.email.signIn.handler({
          body: { email, password },
          headers: ctx.req.headers as Record<string, string>,
        });
      }),
    signUp: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
          name: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { email, password, name } = input;
        return authHandler.email.signUp.handler({
          body: { email, password, name },
          headers: ctx.req.headers as Record<string, string>,
        });
      }),
    signOut: publicProcedure.mutation(async ({ ctx }) => {
      return authHandler.signOut.handler({
        headers: ctx.req.headers as Record<string, string>,
      });
    }),
  },
  user: {
    list: publicProcedure.query(async () => {
      // const users = [];
      // return users;
    }),
    byId: publicProcedure.input(z.string()).query(async (opts) => {
      const { input } = opts;
      return null;
    }),
    create: publicProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async (opts) => {
        return {};
      }),
  },
  examples: {
    iterable: publicProcedure.query(async function* () {
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  middleware(req, res, next) {
    // Handle auth routes
    if (req.url?.startsWith("/api/auth")) {
      return authHandler(req, res);
    }

    // Custom middleware can be added here
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
  },
});

server.listen(3001);
