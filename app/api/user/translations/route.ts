import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    // Mock translations data
    const mockTranslations = [
      {
        id: '1',
        fileName: 'covid-19-study.pdf',
        wordCount: 2500,
        cost: 85.00,
        status: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        fileName: 'cancer-research.pdf',
        wordCount: 1800,
        cost: 60.00,
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        fileName: 'genetics-paper.pdf',
        wordCount: 3200,
        cost: 110.00,
        status: 'translating',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ]

    return NextResponse.json({
      success: true,
      translations: mockTranslations,
    })
  } catch (error) {
    console.error('Translations error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
