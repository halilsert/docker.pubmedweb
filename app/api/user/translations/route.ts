import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

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

    // Kullanıcının çevirilerini al
    const translations = await prisma.translation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        payment: true,
      },
    })

    return NextResponse.json({
      success: true,
      translations,
    })
  } catch (error) {
    console.error('Translations error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
