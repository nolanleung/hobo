import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";

export const db = () => {
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  return prisma;
};
