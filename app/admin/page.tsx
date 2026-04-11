'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  totalTranslations: number
  totalRevenue: number
  completedTranslations: number
  failedTranslations: number
  averageCost: number
}

interface RecentTransaction {
  id: string
  userName: string
  fileName: string
  amount: number
  status: string
  createdAt: string
}

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [transactions, setTransactions] = useState<RecentTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: {
            'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || '',
          },
        })

        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
          setTransactions(data.transactions)
        }
      } catch (error) {
        console.error('Admin data fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Her 30 saniye yenile

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-text-light">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">🔧 Admin Panel</h1>
            <p className="text-text-light mt-2">Sistem yönetimi ve istatistikler</p>
          </div>
          <Link href="/dashboard" className="btn btn-secondary">
            ← Dashboard'a Dön
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: '👥 Toplam Kullanıcı', value: stats?.totalUsers || 0, color: 'from-blue-500 to-blue-600' },
            { label: '📄 Toplam Çeviri', value: stats?.totalTranslations || 0, color: 'from-green-500 to-green-600' },
            { label: '💰 Toplam Gelir', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, color: 'from-amber-500 to-amber-600' },
            { label: '✅ Tamamlanan', value: stats?.completedTranslations || 0, color: 'from-emerald-500 to-emerald-600' },
          ].map((stat, idx) => (
            <div key={idx} className={`card bg-gradient-to-br ${stat.color} text-white`}>
              <p className="text-white/80 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <h3 className="text-xl font-bold text-primary mb-4">📊 Başarı Oranı</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-dark">Tamamlanan</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(((stats?.completedTranslations || 0) / Math.max(stats?.totalTranslations || 1, 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${((stats?.completedTranslations || 0) / Math.max(stats?.totalTranslations || 1, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-dark">Başarısız</span>
                  <span className="font-semibold text-red-600">
                    {Math.round(((stats?.failedTranslations || 0) / Math.max(stats?.totalTranslations || 1, 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${((stats?.failedTranslations || 0) / Math.max(stats?.totalTranslations || 1, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-primary mb-4">💵 Finansal</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-light">Toplam Gelir:</span>
                <span className="font-bold text-accent">${(stats?.totalRevenue || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">Ort. İşlem:</span>
                <span className="font-bold">${(stats?.averageCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">İşlem Sayısı:</span>
                <span className="font-bold">{stats?.totalTranslations || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-primary mb-4">⚙️ Sistem</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>API Canlı</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Database Canlı</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Stripe Bağlı</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Email Service Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-2xl font-bold text-primary mb-6">💳 Son İşlemler</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-text-light">
              Henüz işlem yok
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Kullanıcı</th>
                    <th className="text-left py-3 px-4 font-semibold">Dosya</th>
                    <th className="text-left py-3 px-4 font-semibold">Tutar</th>
                    <th className="text-left py-3 px-4 font-semibold">Durum</th>
                    <th className="text-left py-3 px-4 font-semibold">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-secondary transition">
                      <td className="py-4 px-4">{tx.userName}</td>
                      <td className="py-4 px-4 text-text-light">{tx.fileName}</td>
                      <td className="py-4 px-4 font-semibold text-accent">${tx.amount.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.status === 'completed' ? '✓ Tamamlandı' :
                           tx.status === 'pending' ? '⏱️ Bekleniyor' :
                           '❌ Başarısız'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-text-light">
                        {new Date(tx.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
