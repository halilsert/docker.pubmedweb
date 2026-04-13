import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

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

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Bu email zaten kayıtlı' },
        { status: 409 }
      )
    }

    // Şifreyi hashle
    const hashedPassword = await hash(password, 10)

    // Veritabanına kaydet
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user',
      },
    })

    // Şifreyi response'tan çıkar
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        success: true, 
        message: 'Hesap başarıyla oluşturuldu', 
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
