// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from '@prisma/adapter-pg';

// const globalForPrisma = globalThis as typeof globalThis & {
//   prisma?: PrismaClient;
// };

// export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }



import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Critical Error: DATABASE_URL is undefined.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}