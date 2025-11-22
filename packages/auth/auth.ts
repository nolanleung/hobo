import { db } from "@repo/database";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";

export const auth = (env: { WEB_ORIGIN: string }) => {
  const authConfig = {
    telemetry: { enabled: false },
    trustedOrigins: [env.WEB_ORIGIN!],
    database: prismaAdapter(db(), {
      provider: "postgresql",
    }),

    emailAndPassword: {
      enabled: true,
    },

    plugins: [username()],
  } satisfies BetterAuthOptions;

  return betterAuth(authConfig) as ReturnType<
    typeof betterAuth<typeof authConfig>
  >;
};

export { fromNodeHeaders, toNodeHandler } from "better-auth/node";

export type Session = ReturnType<typeof auth>["$Infer"]["Session"];

const client = auth({
  WEB_ORIGIN: "http://localhost:3000",
});

export default client;
