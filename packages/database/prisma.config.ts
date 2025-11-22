import "dotenv/config";
import { defineConfig } from "prisma/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export default defineConfig({
  schema: "./prisma",
  datasource: {
    url: DATABASE_URL,
  },
});
