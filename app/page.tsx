'use client'

import { useState } from 'react'
import Search from '@/components/Search'
import CostCalculator from '@/components/CostCalculator'
import PaymentModal from '@/components/PaymentModal'

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

export default function Home() {
  const [step, setStep] = useState('search') // search | calculate | payment
  const [article, setArticle] = useState<Article | null>(null)
  const [cost, setCost] = useState<Cost | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container py-6">
          <h1 className="text-4xl font-bold">PubMed Translate</h1>
          <p className="text-gray-600 mt-2">Bilimsel makalelerinizi çevirin, akıllı fiyatlandırma ile</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {step === 'search' && (
          <Search 
            onArticleSelect={(article: Article) => {
              setArticle(article)
              setStep('calculate')
            }}
          />
        )}

        {step === 'calculate' && article && (
          <CostCalculator
            article={article}
            onCostCalculate={(cost: Cost) => {
              setCost(cost)
              setStep('payment')
            }}
            onBack={() => setStep('search')}
          />
        )}

        {step === 'payment' && article && cost && (
          <PaymentModal
            article={article}
            cost={cost}
            onSuccess={() => {
              setStep('search')
              setArticle(null)
              setCost(null)
            }}
            onBack={() => setStep('calculate')}
          />
        )}
      </main>
    </div>
  )
}
