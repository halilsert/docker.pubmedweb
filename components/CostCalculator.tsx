'use client'

import { useState } from 'react'
import { Loader, ChevronLeft } from 'lucide-react'

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

interface CostCalculatorProps {
  article: Article
  onCostCalculate: (cost: Cost) => void
  onBack: () => void
}

export default function CostCalculator({ article, onCostCalculate, onBack }: CostCalculatorProps) {
  const [loading, setLoading] = useState(false)
  const [cost, setCost] = useState<Cost | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/calculate-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          abstract: article.abstract,
          language: 'en',
          targetLanguage: 'tr',
        }),
      })
      const data = await res.json()
      setCost(data)
      onCostCalculate(data)
    } catch (error) {
      console.error('Calculation error:', error)
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

      {/* Article Details */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
        <p className="text-gray-600 mb-4">{article.authors}</p>
        <p className="text-gray-700 leading-relaxed">{article.abstract}</p>
      </div>

      {/* Cost Calculation */}
      {!cost ? (
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="animate-spin" size={20} /> : null}
          Çeviri Maliyetini Hesapla
        </button>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Tahmini Ücret</p>
            <p className="text-5xl font-bold text-blue-500">${cost.totalCost.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-600">Kelime Sayısı</p>
              <p className="text-xl font-semibold">{cost.wordCount}</p>
            </div>
            <div>
              <p className="text-gray-600">Birim Fiyat</p>
              <p className="text-xl font-semibold">${cost.unitPrice.toFixed(4)}</p>
            </div>
          </div>
          <button
            onClick={() => onCostCalculate(cost)}
            className="w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            Ödemeye Devam Et
          </button>
        </div>
      )}
    </div>
  )
}
