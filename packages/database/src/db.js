import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";
export var db = function () {
    var connectionString = "".concat(process.env.DATABASE_URL);
    var adapter = new PrismaPg({ connectionString: connectionString });
    var prisma = new PrismaClient({ adapter: adapter });
    return prisma;
};
