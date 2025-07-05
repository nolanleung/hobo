import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001/api/auth",
});

export const {
  signIn,
  signUp,
  signOut,
  getSession,
  useSession,
} = authClient;