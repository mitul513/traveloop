import { PrismaClient } from "@/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
































const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};



























