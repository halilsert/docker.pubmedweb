import { type PrismaClient } from '.prisma/client/default'

const globalForPrisma = global as typeof global & {
  prisma?: PrismaClient
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client/default')

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
