import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Database bağlantısı test et
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime(),
      database: 'connected',
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'error',
      timestamp: new Date(),
      database: 'disconnected',
      error: 'Database connection failed',
    }, { status: 503 })
  } finally {
    await prisma.$disconnect()
  }
}
