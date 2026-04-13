import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
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

export async function GET(request: NextRequest) {
  try {
    // Token'i al (cookie veya header'dan)
    let token = getAuthToken(request)
    if (!token) {
      const cookieStore = await cookies()
      token = cookieStore.get('auth_token')?.value
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    // Token'i doğrula
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'default-secret-key'
    ) as { id: string; email: string }

    // Veritabanından kullanıcı bilgisini al
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Yetkilendirilmemiş' },
      { status: 401 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
