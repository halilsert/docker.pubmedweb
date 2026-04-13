import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

interface TranslationResult {
  engine: string
  sourceText: string
  translatedText: string
  time?: number
}

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
    ) as { id: string }
    return decoded.id
  } catch {
    return null
  }
}

async function translateWithDeepL(text: string): Promise<TranslationResult> {
  const startTime = Date.now()
  try {
    const response = await axios.post('https://api-free.deepl.com/v1/translate', {
      text: text,
      source_language: 'EN',
      target_language: 'TR',
    }, {
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      }
    })

    return {
      engine: 'deepl',
      sourceText: text,
      translatedText: response.data.translations[0].text,
      time: Date.now() - startTime,
    }
  } catch (error) {
    throw new Error(`DeepL error: ${error instanceof Error ? error.message : 'Unknown'}`)
  }
}

async function translateWithLibre(text: string): Promise<TranslationResult> {
  const startTime = Date.now()
  try {
    const response = await axios.post('https://api.libretranslate.de/translate', {
      q: text,
      source_language: 'en',
      target_language: 'tr',
    })

    return {
      engine: 'libre',
      sourceText: text,
      translatedText: response.data.translatedText,
      time: Date.now() - startTime,
    }
  } catch (error) {
    throw new Error(`Libre error: ${error instanceof Error ? error.message : 'Unknown'}`)
  }
}

async function translateWithClaude(text: string): Promise<TranslationResult> {
  const startTime = Date.now()
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Çeviri: İngilizce'den Türkçe'ye. Sadece çevirilmiş metni döndür:\n\n${text}`
        }
      ]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      }
    })

    return {
      engine: 'claude',
      sourceText: text,
      translatedText: response.data.content[0].text,
      time: Date.now() - startTime,
    }
  } catch (error) {
    throw new Error(`Claude error: ${error instanceof Error ? error.message : 'Unknown'}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı yetkilendirmesi
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    const userId = await getUserFromToken(token)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const { text, engine = 'deepl', fileName = 'document.pdf' } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Metin gerekli' },
        { status: 400 }
      )
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { success: false, error: 'Maksimum 50000 karakter' },
        { status: 400 }
      )
    }

    // Kelime sayısını hesapla
    const wordCount = text.trim().split(/\s+/).length
    const cost = wordCount <= 500 ? wordCount * 0.0005 : 500 * 0.0005 + (wordCount - 500) * 0.0004

    // Çeviriye başla (status: translating)
    const translation = await prisma.translation.create({
      data: {
        userId,
        fileName,
        wordCount,
        cost,
        status: 'translating',
        sourceLanguage: 'en',
        targetLanguage: 'tr',
        sourceText: text,
        translatedBy: engine,
      },
    })

    try {
      let result: TranslationResult

      // Motor seçimine göre çeviri yap
      if (engine === 'deepl' && process.env.DEEPL_API_KEY) {
        result = await translateWithDeepL(text)
      } else if (engine === 'claude' && process.env.ANTHROPIC_API_KEY) {
        result = await translateWithClaude(text)
      } else {
        result = await translateWithLibre(text)
      }

      // Çeviriyi güncelle
      const completedTranslation = await prisma.translation.update({
        where: { id: translation.id },
        data: {
          translatedText: result.translatedText,
          status: 'completed',
          completedAt: new Date(),
        },
      })

      // Ödeme kaydı oluştur
      const payment = await prisma.payment.create({
        data: {
          userId,
          translationId: translation.id,
          amount: cost,
          currency: 'USD',
          status: 'pending',
        },
      })

      return NextResponse.json({
        success: true,
        translation: completedTranslation,
        payment,
        cost,
      })
    } catch (translationError) {
      // Çeviri başarısız olursa status'u güncelle
      await prisma.translation.update({
        where: { id: translation.id },
        data: { status: 'failed' },
      })

      throw translationError
    }
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { success: false, error: 'Çeviri başarısız' },
      { status: 500 }
    )
  }
}
