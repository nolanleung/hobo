import { cors as baseCors } from "hono/cors";

export const cors = (env: any) =>
  baseCors({
    origin: env.WEB_ORIGIN || "*",
    credentials: true,
  });
