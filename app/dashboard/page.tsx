'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Translation {
  id: string
  fileName: string
  wordCount: number
  cost: number
  status: string
  createdAt: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kullanıcı verilerini al
        const userRes = await fetch('/api/user/profile')
        const userData = await userRes.json()
        
        if (userData.success) {
          setUser(userData.user)
        }

        // Çevirileri al
        const translationRes = await fetch('/api/user/translations')
        const translationData = await translationRes.json()
        
        if (translationData.success) {
          setTranslations(translationData.translations)
          const total = translationData.translations.reduce((sum: number, t: Translation) => sum + t.cost, 0)
          setTotalSpent(total)
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
          <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
          <Link href="/" className="btn btn-primary">
            ➕ Yeni Çeviri
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Toplam Çeviri', value: translations.length, icon: '📄' },
            { label: 'Toplam Kelime', value: translations.reduce((sum, t) => sum + t.wordCount, 0), icon: '📊' },
            { label: 'Harcanan Tutar', value: `$${totalSpent.toFixed(2)}`, icon: '💰' },
            { label: 'Tamamlanan', value: translations.filter(t => t.status === 'completed').length, icon: '✅' },
          ].map((stat, idx) => (
            <div key={idx} className="card">
              <p className="text-text-light text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-2xl mt-2">{stat.icon}</p>
            </div>
          ))}
        </div>

        {/* Translations Table */}
        <div className="card overflow-x-auto">
          <h2 className="text-2xl font-bold text-primary mb-6">Çeviri Geçmişi</h2>

          {translations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-light mb-4">Henüz çeviri yok</p>
              <Link href="/" className="btn btn-primary">
                Şimdi Başla
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-text-dark">Dosya Adı</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-dark">Kelime</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-dark">Ücret</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-dark">Durum</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-dark">Tarih</th>
                  <th className="text-left py-3 px-4 font-semibold text-text-dark">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {translations.map((translation) => (
                  <tr key={translation.id} className="border-b border-gray-100 hover:bg-secondary transition">
                    <td className="py-4 px-4">{translation.fileName}</td>
                    <td className="py-4 px-4">{translation.wordCount}</td>
                    <td className="py-4 px-4 font-semibold text-accent">${translation.cost.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        translation.status === 'completed' ? 'bg-green-100 text-green-700' :
                        translation.status === 'translating' ? 'bg-blue-100 text-blue-700' :
                        translation.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {translation.status === 'completed' ? '✅ Tamamlandı' :
                         translation.status === 'translating' ? '⏳ Çeviriliyor' :
                         translation.status === 'failed' ? '❌ Başarısız' :
                         '⏱️ Bekleniyor'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-light">
                      {new Date(translation.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-primary hover:text-primary-dark font-semibold">
                        İndir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Info */}
        <div className="mt-8 card">
          <h2 className="text-2xl font-bold text-primary mb-4">Hesap Bilgileri</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-text-light text-sm mb-1">Ad Soyad</p>
              <p className="text-lg font-semibold text-text-dark">{user?.name || '-'}</p>
            </div>
            <div>
              <p className="text-text-light text-sm mb-1">E-posta</p>
              <p className="text-lg font-semibold text-text-dark">{user?.email}</p>
            </div>
            <div>
              <p className="text-text-light text-sm mb-1">Üyelik Tarihi</p>
              <p className="text-lg font-semibold text-text-dark">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-text-light text-sm mb-1">Durum</p>
              <p className="text-lg font-semibold text-success">✅ Aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
