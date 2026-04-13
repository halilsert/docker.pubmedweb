import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function getAuthToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  return null
}

async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'default-secret-key'
    ) as { id: string }
    return decoded.id
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    const userId = await getUserFromToken(token)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const filter = request.nextUrl.searchParams.get('filter') || 'all'

    let whereClause: any = { userId }

    if (filter === 'unread') {
      whereClause.read = false
    } else if (filter !== 'all') {
      whereClause.type = filter
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json(
      { success: false, error: 'Bildirimler alınamadı' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    const userId = await getUserFromToken(token)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const { notificationId, read } = await request.json()

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Bildirim ID gerekli' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read },
    })

    return NextResponse.json({
      success: true,
      updated: notification.count,
    })
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { success: false, error: 'Bildirim güncellenemedi' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
