'use client'

import { useState } from 'react'
import { ChevronLeft, Loader } from 'lucide-react'

interface Article {
  id: string
  title: string
  authors: string
  abstract: string
  journal: string
  pubDate: string
}

interface Cost {
  wordCount: number
  unitPrice: number
  totalCost: number
}

interface CardData {
  cardNumber: string
  expiry: string
  cvc: string
  name: string
}

interface PaymentModalProps {
  article: Article
  cost: Cost
  onSuccess: () => void
  onBack: () => void
}

export default function PaymentModal({ article, cost, onSuccess, onBack }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  })

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article,
          cost,
          cardData,
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert('✅ Ödeme başarılı!\n\nÇeviriye erişim sağlanmıştır. İşlem ID: ' + data.transactionId)
        onSuccess()
      } else {
        alert('❌ Ödeme başarısız: ' + data.error)
      }
    } catch (error) {
      alert('❌ Ödeme hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-500 mb-8 hover:text-blue-600"
      >
        <ChevronLeft size={20} />
        Geri Dön
      </button>

      <div className="max-w-2xl mx-auto">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg">📋 Sipariş Özeti</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Makale:</span>
              <span className="text-gray-600">{article.title.substring(0, 40)}...</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Kelime Sayısı:</span>
              <span className="text-gray-600">{cost.wordCount} kelime</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Toplam Ücret:</span>
              <span className="text-3xl font-bold text-blue-500">${cost.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">💳 Kart Bilgileri</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
            <input
              type="text"
              required
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              placeholder="Halil Sert"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kart Numarası</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              required
              value={cardData.cardNumber}
              onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value.replace(/\s/g, '') })}
              maxLength={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Demo: 4242 4242 4242 4242</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geçerlilik Tarihi</label>
              <input
                type="text"
                placeholder="12/25"
                required
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
              <input
                type="text"
                placeholder="123"
                required
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-6"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : '✓'}
            ${cost.totalCost.toFixed(2)} Öde
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          🔒 Ödemeniz 256-bit SSL ile güvenli olarak işlenir. Kart bilgileriniz sunucularımızda saklanmaz.
        </p>
      </div>
    </div>
  )
}
