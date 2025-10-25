import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'], // optional: logs every SQL query in the terminal
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
