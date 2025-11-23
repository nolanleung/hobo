import { betterAuth, BetterAuthOptions, DBAdapterInstance } from "better-auth";
import { username } from "better-auth/plugins";

type AuthOptions = {
  WEB_ORIGIN: string;
  adapter: DBAdapterInstance;
};

export const auth = (env: AuthOptions) => {
  const authConfig = {
    telemetry: { enabled: false },
    trustedOrigins: [env.WEB_ORIGIN!],
    database: env.adapter,

    emailAndPassword: {
      enabled: true,
    },

    plugins: [username()],
  } satisfies BetterAuthOptions;

  return betterAuth(authConfig) as ReturnType<
    typeof betterAuth<typeof authConfig>
  >;
};

export { prismaAdapter } from "better-auth/adapters/prisma";

export { fromNodeHeaders, toNodeHandler } from "better-auth/node";

export type Session = ReturnType<typeof auth>["$Infer"]["Session"];
