import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas/schema";

export const db = (env = process.env) => {
  const client = postgres(env.DATABASE_URL!, { prepare: false });
  return drizzle({ client, schema });
};

export { schema };

export * from "drizzle-orm";
