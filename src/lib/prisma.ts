import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  // Opcional: Loga todas as queries executadas pelo Prisma
  log: ['query'],
});
