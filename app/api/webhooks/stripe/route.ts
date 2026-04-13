import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new (require('stripe'))(process.env.STRIPE_SECRET_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ received: false, error: 'Stripe not configured' }, { status: 400 })
    }

    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ received: false }, { status: 400 })
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (error) {
      console.error('Webhook verification failed:', error)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Payment başarılı oldu
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const { translationId, userId } = session.metadata

      // Payment kaydını güncelle
      const payment = await prisma.payment.findFirst({
        where: { stripeSessionId: session.id },
      })

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            stripePaymentId: session.payment_intent,
            paidAt: new Date(),
          },
        })

        // Bildirim oluştur
        await prisma.notification.create({
          data: {
            userId,
            type: 'payment_success',
            title: 'Ödeme Başarılı',
            message: `$${(payment.amount).toFixed(2)} ödeme alındı.`,
            read: false,
            emailSent: false,
          },
        })
      }
    }

    // Payment başarısız
    if (event.type === 'charge.failed') {
      const charge = event.data.object
      const sessionId = charge.payment_intent

      const payment = await prisma.payment.findFirst({
        where: { stripePaymentId: sessionId },
      })

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'failed' },
        })

        // Bildirim oluştur
        await prisma.notification.create({
          data: {
            userId: payment.userId,
            type: 'payment_failed',
            title: 'Ödeme Başarısız',
            message: 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.',
            read: false,
            emailSent: false,
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
