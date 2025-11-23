import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";

export const db = async ({ adapter }: { adapter: any }) => {
  const prisma = new PrismaClient({ adapter });

  return prisma;
};
