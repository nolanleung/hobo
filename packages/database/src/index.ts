import { prisma } from "./client";

export * as DB from "../generated/client"; // exports generated types from prisma

export { prisma } from "./client"; // exports instance of prisma

export type PrismaClient = typeof prisma;
