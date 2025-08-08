import { createAuthClient as baseCreateAuthClient } from "better-auth/react";

export const createAuthClient = (baseURL: string = "http://localhost:8080") =>
  baseCreateAuthClient({
    baseURL,
  });
