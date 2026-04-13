import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Veritabanından kullanıcı bul
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email veya şifre yanlış' },
        { status: 401 }
      )
    }

    // Şifre kontrol et
    const isPasswordValid = await compare(password, user.password || '')

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Email veya şifre yanlış' },
        { status: 401 }
      )
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET || 'default-secret-key',
      { expiresIn: '30d' }
    )

    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Başarıyla giriş yapıldı', 
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      },
      { status: 200 }
    )

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
