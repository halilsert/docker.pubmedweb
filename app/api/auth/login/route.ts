import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Mock authentication (demo amaçlı)
    // Gerçekte veritabanından kullanıcı kontrol edilmeli
    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz email' },
        { status: 401 }
      )
    }

    const mockUserId = Buffer.from(email).toString('base64').slice(0, 12)
    const token = Buffer.from(`${mockUserId}:${Date.now()}`).toString('base64')

    const response = NextResponse.json(
      { success: true, message: 'Başarıyla giriş yapıldı', userId: mockUserId },
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
  }
}
