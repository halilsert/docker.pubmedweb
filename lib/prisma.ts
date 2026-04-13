import { PrismaClient as PC } from '.prisma/client/default'

declare global {
  var prisma: PC | undefined
}

const globalForPrisma = global as typeof global & {
  prisma: PC | undefined
}

export const prisma =
  globalForPrisma.prisma ||
  new PC({
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
