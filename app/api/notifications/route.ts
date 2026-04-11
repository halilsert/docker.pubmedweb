import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get('filter') || 'all'

  const mockNotifications = [
    {
      id: '1',
      type: 'payment_success',
      title: '✅ Ödeme Başarılı',
      message: '$85.00 ödemeniz alındı. Çeviri başlamıştır.',
      read: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'translation_complete',
      title: '📄 Çeviri Tamamlandı',
      message: 'covid-19-research.pdf dosyası çevrildi',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]

  const filtered = filter === 'unread' ? mockNotifications.filter(n => !n.read) :
                   filter !== 'all' ? mockNotifications.filter(n => n.type.includes(filter)) :
                   mockNotifications

  return NextResponse.json({ notifications: filtered })
}
