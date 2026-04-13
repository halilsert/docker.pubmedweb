import { type PrismaClient } from '.prisma/client/default'

const globalForPrisma = global as typeof global & {
  prisma?: PrismaClient
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? (() => {
  // @ts-expect-error - Prisma generates this at build time
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client/default')
  return new PrismaClient()
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
