import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const range = request.nextUrl.searchParams.get('range') || '7days'

    // Mock analytics data
    const mockData = [
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        totalUsers: 38,
        totalTranslations: 142,
        totalRevenue: 3850.50,
        translationsCompleted: 128,
        translationsFailed: 6,
        averageWordCount: 2150,
        averageCost: 27.12,
        topEngine: 'DeepL',
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        totalUsers: 40,
        totalTranslations: 154,
        totalRevenue: 4200.00,
        translationsCompleted: 142,
        translationsFailed: 7,
        averageWordCount: 2340,
        averageCost: 27.27,
        topEngine: 'DeepL',
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        totalUsers: 42,
        totalTranslations: 156,
        totalRevenue: 4250.50,
        translationsCompleted: 142,
        translationsFailed: 8,
        averageWordCount: 2200,
        averageCost: 27.24,
        topEngine: 'Claude',
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        totalUsers: 44,
        totalTranslations: 165,
        totalRevenue: 4500.00,
        translationsCompleted: 150,
        translationsFailed: 9,
        averageWordCount: 2280,
        averageCost: 27.27,
        topEngine: 'DeepL',
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        totalUsers: 45,
        totalTranslations: 168,
        totalRevenue: 4600.00,
        translationsCompleted: 155,
        translationsFailed: 8,
        averageWordCount: 2310,
        averageCost: 27.38,
        topEngine: 'DeepL',
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        totalUsers: 46,
        totalTranslations: 172,
        totalRevenue: 4750.00,
        translationsCompleted: 160,
        translationsFailed: 7,
        averageWordCount: 2350,
        averageCost: 27.61,
        topEngine: 'Libre',
      },
      {
        date: new Date(),
        totalUsers: 48,
        totalTranslations: 178,
        totalRevenue: 4900.00,
        translationsCompleted: 165,
        translationsFailed: 8,
        averageWordCount: 2400,
        averageCost: 27.53,
        topEngine: 'DeepL',
      },
    ]

    return NextResponse.json({
      range,
      data: mockData,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
}
