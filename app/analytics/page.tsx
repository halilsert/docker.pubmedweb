'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AnalyticsData {
  date: string
  totalUsers: number
  totalTranslations: number
  totalRevenue: number
  translationsCompleted: number
  translationsFailed: number
  averageWordCount: number
  averageCost: number
  topEngine: string
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [timeRange, setTimeRange] = useState('7days')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?range=${timeRange}`)
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">📈 İleri Analitik</h1>
            <p className="text-text-light mt-2">Detaylı istatistikler ve raporlar</p>
          </div>
          <Link href="/dashboard" className="btn btn-secondary">
            ← Geri
          </Link>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8 flex gap-4">
          {[
            { value: '24hours', label: '24 Saat' },
            { value: '7days', label: '7 Gün' },
            { value: '30days', label: '30 Gün' },
            { value: '90days', label: '90 Gün' },
            { value: 'all', label: 'Tümü' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === range.value
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-text-dark hover:border-primary'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="card">
            <h3 className="text-lg font-bold text-primary mb-4">💰 Gelir Trendi</h3>
            <div className="h-64 bg-gradient-to-b from-accent/10 to-accent/5 rounded-lg flex items-end justify-start gap-2 p-4">
              {analytics.map((data, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-accent to-accent/60 rounded-t"
                  style={{
                    height: `${Math.max(20, (data.totalRevenue / 500) * 100)}%`,
                  }}
                  title={`$${data.totalRevenue.toFixed(2)}`}
                />
              ))}
            </div>
            <p className="text-sm text-text-light mt-4 text-center">
              Toplam: ${analytics.reduce((sum, d) => sum + d.totalRevenue, 0).toFixed(2)}
            </p>
          </div>

          {/* Translations Chart */}
          <div className="card">
            <h3 className="text-lg font-bold text-primary mb-4">📄 Çeviri İstatistikleri</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-dark">Tamamlanan</span>
                  <span className="font-semibold text-green-600">
                    {analytics.reduce((sum, d) => sum + d.translationsCompleted, 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-dark">Başarısız</span>
                  <span className="font-semibold text-red-600">
                    {analytics.reduce((sum, d) => sum + d.translationsFailed, 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Ort. Kelime Sayısı',
              value: analytics.length ? Math.round(analytics[0].averageWordCount) : 0,
              icon: '📊',
            },
            {
              label: 'Ort. Maliyet',
              value: `$${analytics.length ? analytics[0].averageCost.toFixed(2) : '0.00'}`,
              icon: '💵',
            },
            {
              label: 'Başarı Oranı',
              value: analytics.length
                ? Math.round(
                    (analytics[0].translationsCompleted /
                      (analytics[0].translationsCompleted + analytics[0].translationsFailed)) *
                      100
                  ) + '%'
                : '0%',
              icon: '✅',
            },
            {
              label: 'Popüler Motor',
              value: analytics[0]?.topEngine || 'DeepL',
              icon: '🤖',
            },
          ].map((metric, idx) => (
            <div key={idx} className="card">
              <p className="text-text-light text-sm mb-2">{metric.label}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl">{metric.icon}</span>
                <p className="text-2xl font-bold text-primary">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Table */}
        <div className="card">
          <h3 className="text-lg font-bold text-primary mb-6">📋 Günlük Detaylar</h3>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-light">Yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Tarih</th>
                    <th className="text-left py-3 px-4 font-semibold">Kullanıcı</th>
                    <th className="text-left py-3 px-4 font-semibold">Çeviriler</th>
                    <th className="text-left py-3 px-4 font-semibold">Gelir</th>
                    <th className="text-left py-3 px-4 font-semibold">Başarı</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((data, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-secondary transition">
                      <td className="py-4 px-4 font-semibold">
                        {new Date(data.date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-4 px-4 text-text-light">{data.totalUsers}</td>
                      <td className="py-4 px-4">{data.totalTranslations}</td>
                      <td className="py-4 px-4 font-semibold text-accent">
                        ${data.totalRevenue.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-green-600 font-semibold">
                          {Math.round(
                            (data.translationsCompleted /
                              (data.translationsCompleted + data.translationsFailed)) *
                              100
                          )}%
                        </span>
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
