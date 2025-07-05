import { auth } from "./config";
export { auth } from "./config";
export type { Session } from "./config";

export const authHandler = auth.handler;
export const getSession = auth.api.getSession;
export const listSessions = auth.api.listSessions;
export const revokeSession = auth.api.revokeSession;
