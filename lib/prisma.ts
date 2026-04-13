import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as typeof global & {
  prisma?: PrismaClient
}

const connectionString = process.env.DATABASE_URL

export const prisma: PrismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(connectionString || ''),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
