import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "./trpc";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
export type AppInput = inferRouterInputs<AppRouter>;
export type AppOutput = inferRouterOutputs<AppRouter>;
