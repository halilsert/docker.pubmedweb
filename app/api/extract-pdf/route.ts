import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

function calculateCost(text: string): { wordCount: number; unitPrice: number; totalCost: number } {
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length

  // Fiyatlandırma: ilk 500 kelime $0.05/kelime, 500+ kelime $0.04/kelime
  let totalCost = 0

  if (wordCount <= 500) {
    totalCost = wordCount * 0.05
  } else {
    const firstPart = 500 * 0.05
    const remainingWords = wordCount - 500
    const secondPart = remainingWords * 0.04
    totalCost = firstPart + secondPart
  }

  const unitPrice = totalCost / wordCount

  return {
    wordCount,
    unitPrice: Math.round(unitPrice * 10000) / 10000,
    totalCost: Math.round(totalCost * 100) / 100,
  }
}

// Basit PDF metin çıkarma (normal metin tabanlı PDF'ler için)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // PDF binary formatında basit metin çıkarma
  const text = buffer.toString('latin1')
  
  // PDF akışlarından metin çıkar
  const matches = text.match(/BT\s+([\s\S]*?)\s+ET/g) || []
  let fullText = ''

  for (const match of matches) {
    const textMatches = match.match(/\((.*?)\)/g) || []
    for (const textMatch of textMatches) {
      fullText += textMatch.replace(/[()]/g, '') + ' '
    }
  }

  // Fallback: düz metin olarak al
  if (fullText.trim().length < 100) {
    // UTF-8 ve ASCII karakterlerini al
    fullText = buffer.toString('utf8').replace(/[^\w\s]/g, ' ')
  }

  return fullText
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir PDF dosyası seçin' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu 10MB\'dan büyük olamaz' },
        { status: 400 }
      )
    }

    // Dosyayı buffer'a dönüştür
    const buffer = Buffer.from(await file.arrayBuffer())

    // PDF'ten metin çıkar
    const text = await extractTextFromPDF(buffer)

    if (text.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'PDF\'den metin çıkarılamadı. Lütfen metin tabanlı PDF dosyası kullanınız.' 
        },
        { status: 400 }
      )
    }

    // Maliyeti hesapla
    const cost = calculateCost(text)

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      ...cost,
    })
  } catch (error) {
    console.error('PDF extract error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'PDF işleme hatası',
      },
      { status: 500 }
    )
  }
}
