import { NextRequest, NextResponse } from 'next/server'

// Kelime sayısına göre fiyat hesapla
function calculateCost(text: string): { wordCount: number; unitPrice: number; totalCost: number } {
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
  
  // Fiyat: ilk 500 kelime $0.05/kelime, 500+ kelime $0.04/kelime
  let unitPrice = 0.05
  let totalCost = wordCount * unitPrice

  if (wordCount > 500) {
    const firstPart = 500 * 0.05
    const remainingWords = wordCount - 500
    const secondPart = remainingWords * 0.04
    totalCost = firstPart + secondPart
    unitPrice = totalCost / wordCount
  }

  return {
    wordCount,
    unitPrice: Math.round(unitPrice * 10000) / 10000,
    totalCost: Math.round(totalCost * 100) / 100,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, abstract } = body

    // Çevirilecek metni birleştir
    const fullText = `${title}. ${abstract}`
    const cost = calculateCost(fullText)

    return NextResponse.json(cost)
  } catch (error) {
    console.error('Cost calculation error:', error)
    return NextResponse.json({ error: 'Hesaplama başarısız' }, { status: 400 })
  }
}
