// Mock Prisma Client (Real veritabanı kurulduktan sonra güncellenecek)
// npx prisma generate komutu çalıştırıldıktan sonra otomatik oluşacak

type PrismaClient = any

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = {} // Real Prisma client
} else {
  if (!global.prisma) {
    global.prisma = {} // Real Prisma client
  }
  prisma = global.prisma
}

declare global {
  var prisma: PrismaClient | undefined
}

export default prisma
