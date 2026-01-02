// import { PrismaClient } from "../prisma/generated/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;



import { PrismaClient } from '../prisma/generated/client';

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}


// @ts-ignore
const prisma = globalThis.prisma ?? PrismaClient();


// @ts-ignore
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
export default prisma;