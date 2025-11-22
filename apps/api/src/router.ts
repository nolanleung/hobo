import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { todosRouter } from "./routes";
import { router } from "./trpc";

export const appRouter = router({
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;
export type AppInput = inferRouterInputs<AppRouter>;
export type AppOutput = inferRouterOutputs<AppRouter>;
