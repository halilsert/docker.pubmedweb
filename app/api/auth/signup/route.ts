import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validasyon
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanlar gerekli' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz email adresi' },
        { status: 400 }
      )
    }

    // Şifreyi hashle (demo amaçlı)
    const hashedPassword = await hash(password, 10)

    // Mock: Veritabanına kaydedilmiş gibi yap
    const mockUserId = Buffer.from(email).toString('base64').slice(0, 12)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Hesap başarıyla oluşturuldu', 
        userId: mockUserId 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
