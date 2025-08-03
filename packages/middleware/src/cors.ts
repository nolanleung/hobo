import baseCors, { CorsOptions } from "cors";

const origin = process.env.CORS_ORIGIN || process.env.WEB_ORIGIN || "*";
console.log({ origin });

export const cors = (
  options: CorsOptions = {
    origin,
    credentials: true,
  }
) => baseCors(options);
