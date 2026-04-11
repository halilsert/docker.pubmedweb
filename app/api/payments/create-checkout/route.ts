import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    const [userId] = Buffer.from(token, 'base64').toString().split(':')
    const { translationId, amount } = await request.json()

    if (!translationId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    // Mock: Session ID oluştur
    const sessionId = 'cs_test_' + Buffer.from(translationId).toString('base64').slice(0, 20)
    const paymentId = 'pay_' + Date.now()

    return NextResponse.json({
      success: true,
      sessionId,
      paymentId,
      amount,
      message: 'Ödeme hazırlandı. Stripe webhook setup yapıldığında canlı olacak.',
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Ödeme oluşturulamadı' },
      { status: 500 }
    )
  }
}
