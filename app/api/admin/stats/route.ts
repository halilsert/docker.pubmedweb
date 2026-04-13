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

    // İstatistikleri hesapla
    const totalUsers = await prisma.user.count()
    const totalTranslations = await prisma.translation.count()
    const completedTranslations = await prisma.translation.count({
      where: { status: 'completed' },
    })
    const failedTranslations = await prisma.translation.count({
      where: { status: 'failed' },
    })

    // Toplam gelir
    const payments = await prisma.payment.findMany({
      where: { status: 'completed' },
    })
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    const averageCost = totalTranslations > 0 ? totalRevenue / totalTranslations : 0

    // Son işlemler
    const transactions = await prisma.payment.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        translation: {
          select: { fileName: true },
        },
      },
    })

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      userName: t.user.name || 'N/A',
      userEmail: t.user.email,
      fileName: t.translation.fileName,
      amount: t.amount,
      status: t.status,
      createdAt: t.createdAt,
    }))

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTranslations,
        totalRevenue,
        completedTranslations,
        failedTranslations,
        averageCost: parseFloat(averageCost.toFixed(2)),
      },
      transactions: formattedTransactions,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
}
