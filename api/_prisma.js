import { PrismaClient } from '@prisma/client';

// Cached Prisma client for serverless environments (Vercel)
// Prevents exhausting DB connections during hot reloads
let prisma;
if (!global._prisma) {
  global._prisma = new PrismaClient();
}
prisma = global._prisma;

export default prisma;
