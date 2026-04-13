import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-15',
})

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
    ) as { id: string; email: string }
    return decoded
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    const userInfo = await getUserFromToken(token)
    if (!userInfo) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const { translationId, amount } = await request.json()

    if (!translationId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    // Çeviriyi kontrol et
    const translation = await prisma.translation.findUnique({
      where: { id: translationId },
      include: { payment: true },
    })

    if (!translation || translation.userId !== userInfo.id) {
      return NextResponse.json(
        { success: false, error: 'Çeviri bulunamadı' },
        { status: 404 }
      )
    }

    if (translation.payment?.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Bu çeviri zaten ödendi' },
        { status: 400 }
      )
    }

    // Stripe Checkout Session oluştur
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Çeviri: ${translation.fileName}`,
              description: `${translation.wordCount} sözcük`,
            },
            unit_amount: Math.round(amount * 100), // Cents cinsinden
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'https://pubmedweb.vercel.app'}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'https://pubmedweb.vercel.app'}/dashboard?payment=cancelled`,
      customer_email: userInfo.email,
      metadata: {
        translationId,
        userId: userInfo.id,
      },
    })

    // Payment kaydını güncelle
    if (translation.payment) {
      await prisma.payment.update({
        where: { id: translation.payment.id },
        data: {
          stripeSessionId: session.id,
        },
      })
    } else {
      await prisma.payment.create({
        data: {
          userId: userInfo.id,
          translationId,
          amount,
          currency: 'USD',
          status: 'pending',
          stripeSessionId: session.id,
        },
      })
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Ödeme oluşturulamadı' },
      { status: 500 }
    )
  }
}
