import { db, schema } from "@repo/database";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const WEB_ORIGIN = process.env.WEB_ORIGIN || "http://localhost:3000";

const authConfig = {
  trustedOrigins: [WEB_ORIGIN],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig) as ReturnType<
  typeof betterAuth<typeof authConfig>
>;

export { toNodeHandler } from "better-auth/node";

export type Session = typeof auth.$Infer.Session;
