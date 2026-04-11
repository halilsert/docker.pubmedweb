import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { article, cost, cardData } = await request.json()

    // Kart validasyonu (demo amaçlı)
    if (cardData.cardNumber.length < 13 || cardData.cvc.length < 3) {
      return NextResponse.json({ success: false, error: 'Geçersiz kart bilgileri' })
    }

    // Stripe integrasyonu (TODO: Stripe API anahtarı ile gerçek ödeme)
    // Şimdilik demo modda başarılı kabul edelim
    console.log('Payment received:', {
      article: article.title,
      cost: cost.totalCost,
      cardLast4: cardData.cardNumber.slice(-4),
    })

    // Başarılı yanıt
    return NextResponse.json({
      success: true,
      message: 'Ödeme başarılı',
      transactionId: 'TXN_' + Date.now(),
      accessToken: Buffer.from(`${article.id}_${Date.now()}`).toString('base64'),
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ success: false, error: 'Ödeme işlemi başarısız' })
  }
}
