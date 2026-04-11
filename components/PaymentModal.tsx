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
        alert('Ödeme başarılı! Çeviriye erişim açıldı.')
        onSuccess()
      } else {
        alert('Ödeme başarısız: ' + data.error)
      }
    } catch (error) {
      alert('Ödeme hatası: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-semibold mb-4">Sipariş Özeti</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{article.title.substring(0, 50)}...</span>
              <span className="font-semibold">${cost.totalCost.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Toplam Ücret</span>
                <span className="text-blue-500">${cost.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ad Soyad</label>
            <input
              type="text"
              required
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kart Numarası</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              required
              value={cardData.cardNumber}
              onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Geçerlilik Tarihi</label>
              <input
                type="text"
                placeholder="MM/YY"
                required
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVC</label>
              <input
                type="text"
                placeholder="123"
                required
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : null}
            ${cost.totalCost.toFixed(2)} Öde
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Ödemeniz güvenli olarak işlenir. Banka bilgileriniz saklanmaz.
        </p>
      </div>
    </div>
  )
}
