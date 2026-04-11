import { NextRequest, NextResponse } from 'next/server'

// Stripe entegrasyonu için gerekli
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_demo'

export async function POST(request: NextRequest) {
  try {
    const { article, cost, cardData } = await request.json()

    // Basit validasyon
    if (!cardData.cardNumber || !cardData.cvc || !cardData.name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tüm alanları doldurunuz' 
      }, { status: 400 })
    }

    // TODO: Gerçek Stripe entegrasyonu
    // const stripe = require('stripe')(STRIPE_SECRET_KEY)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(cost.totalCost * 100),
    //   currency: 'usd',
    //   metadata: { articleId: article.id, articleTitle: article.title }
    // })

    // Demo modda başarılı kabul et
    console.log('Payment processed:', {
      article: article.title,
      amount: cost.totalCost,
      cardLast4: cardData.cardNumber.slice(-4),
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Ödeme başarılı!',
      transactionId: `TXN_${Date.now()}`,
      accessToken: Buffer.from(`${article.id}_${Date.now()}`).toString('base64'),
      articleUrl: `/translate/${article.id}`,
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { success: false, error: 'Ödeme işlemi başarısız' },
      { status: 500 }
    )
  }
}
