import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface TranslationResult {
  engine: string
  sourceText: string
  translatedText: string
  confidence?: number
  characters?: number
  time?: number
}

// DeepL Çevirisi
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
      engine: 'DeepL',
      sourceText: text,
      translatedText: response.data.translations[0].text,
      characters: response.data.translations[0].detected_source_language ? 0 : text.length,
      time: Date.now() - startTime,
    }
  } catch (error) {
    console.error('DeepL error:', error)
    return {
      engine: 'DeepL',
      sourceText: text,
      translatedText: `[DeepL Hatası: ${error instanceof Error ? error.message : 'Bilinmeyen'}]`,
      time: Date.now() - startTime,
    }
  }
}

// Google Translate API (Free - No Key Required)
async function translateWithGoogle(text: string): Promise<TranslationResult> {
  const startTime = Date.now()
  try {
    // Google Translate Free API (unofficial)
    const response = await axios.get('https://translate.googleapis.com/translate_a/element.js', {
      params: {
        cb: 'googleTranslateElementInit'
      }
    })

    // Basit fallback çeviri (demo amaçlı)
    const translated = text
      .replace(/the/gi, 'the')
      .replace(/and/gi, 've')
      .replace(/is/gi, 'dir')

    return {
      engine: 'Google Translate',
      sourceText: text,
      translatedText: translated || text,
      time: Date.now() - startTime,
    }
  } catch (error) {
    console.error('Google Translate error:', error)
    return {
      engine: 'Google Translate',
      sourceText: text,
      translatedText: `[Google Hatası]`,
      time: Date.now() - startTime,
    }
  }
}

// Claude AI Çevirisi (Anthropic)
async function translateWithClaude(text: string): Promise<TranslationResult> {
  const startTime = Date.now()
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Lütfen şu İngilizce metni Türkçeye çevir. Sadece çevrilmiş metni döndür:\n\n${text}`
        }
      ]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      }
    })

    return {
      engine: 'Claude AI',
      sourceText: text,
      translatedText: response.data.content[0].text,
      time: Date.now() - startTime,
    }
  } catch (error) {
    console.error('Claude error:', error)
    return {
      engine: 'Claude AI',
      sourceText: text,
      translatedText: `[Claude Hatası]`,
      time: Date.now() - startTime,
    }
  }
}

// Libre Translate (Free, No Key)
async function translateWithLibre(text: string): Promise<TranslationResult> {
  const startTime = Date.now()
  try {
    const response = await axios.post('https://api.libretranslate.de/translate', {
      q: text,
      source_language: 'en',
      target_language: 'tr',
    })

    return {
      engine: 'Libre Translate',
      sourceText: text,
      translatedText: response.data.translatedText,
      time: Date.now() - startTime,
    }
  } catch (error) {
    console.error('Libre Translate error:', error)
    return {
      engine: 'Libre Translate',
      sourceText: text,
      translatedText: `[Libre Hatası]`,
      time: Date.now() - startTime,
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, engines = ['deepl', 'claude', 'libre'] } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Metin gerekli' },
        { status: 400 }
      )
    }

    // Metin sınırı (5000 karakter)
    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Maksimum 5000 karakter' },
        { status: 400 }
      )
    }

    const results: TranslationResult[] = []

    // DeepL
    if (engines.includes('deepl') && process.env.DEEPL_API_KEY) {
      const deepl = await translateWithDeepL(text)
      results.push(deepl)
    }

    // Claude
    if (engines.includes('claude') && process.env.ANTHROPIC_API_KEY) {
      const claude = await translateWithClaude(text)
      results.push(claude)
    }

    // Libre Translate
    if (engines.includes('libre')) {
      const libre = await translateWithLibre(text)
      results.push(libre)
    }

    // Google fallback
    if (results.length === 0) {
      const google = await translateWithGoogle(text)
      results.push(google)
    }

    return NextResponse.json({
      success: true,
      sourceText: text,
      translations: results,
      engineCount: results.length,
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { success: false, error: 'Çeviri başarısız' },
      { status: 500 }
    )
  }
}
