import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient as baseCreateAuthClient } from "better-auth/react";

export const createAuthClient = (baseURL: string) =>
  baseCreateAuthClient({
    baseURL,
    plugins: [usernameClient()],
  });
