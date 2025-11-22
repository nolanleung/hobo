import { GoogleOptions } from "better-auth/social-providers";

export function google(env: any) {
  if (!env.AUTH_GOOGLE_CLIENT_ID || !env.AUTH_GOOGLE_CLIENT_SECRET) {
    console.warn(
      "Google social provider is not configured. Please set AUTH_GOOGLE_CLIENT_ID and AUTH_GOOGLE_CLIENT_SECRET in your environment variables."
    );
    return undefined;
  }

  return {
    clientId: env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
  } satisfies GoogleOptions;
}
