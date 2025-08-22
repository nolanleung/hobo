import { db, schema } from "@repo/database";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { google } from "./providers/social/google";

export const auth = (env = process.env) => {
  const authConfig = {
    telemetry: { enabled: false },
    trustedOrigins: [env.WEB_ORIGIN!],
    database: drizzleAdapter(db(env), {
      provider: "pg",
      schema,
    }),

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      google: google(env),
    },

    plugins: [username()],
  } satisfies BetterAuthOptions;

  return betterAuth(authConfig) as ReturnType<
    typeof betterAuth<typeof authConfig>
  >;
};

export { fromNodeHeaders, toNodeHandler } from "better-auth/node";

export type Session = ReturnType<typeof auth>["$Infer"]["Session"];
