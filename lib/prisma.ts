import { type PrismaClient } from '.prisma/client/default'

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // @ts-expect-error - Prisma generates this at build time
  const { PrismaClient } = await import('@prisma/client/default')
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    // @ts-expect-error - Prisma generates this at build time
    const { PrismaClient } = await import('@prisma/client/default')
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
