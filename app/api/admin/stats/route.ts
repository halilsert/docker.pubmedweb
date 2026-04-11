import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Admin token kontrol
    const token = request.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json(
        { error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    // Stats hesapla (Mock data ile devam et)
    const stats = {
      totalUsers: 42,
      totalTranslations: 156,
      totalRevenue: 4250.50,
      completedTranslations: 142,
      failedTranslations: 8,
      averageCost: 27.24,
    }

    // Mock transactions
    const transactions = [
      {
        id: '1',
        userName: 'John Doe',
        fileName: 'covid-19-research.pdf',
        amount: 85.00,
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: '2',
        userName: 'Jane Smith',
        fileName: 'cancer-treatment.pdf',
        amount: 60.00,
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: '3',
        userName: 'Ahmed Hassan',
        fileName: 'genetics-study.pdf',
        amount: 110.00,
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ]

    return NextResponse.json({
      stats,
      transactions,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
}
