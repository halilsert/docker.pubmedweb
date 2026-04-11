'use client'

import { useState } from 'react'

interface TranslationResult {
  engine: string
  sourceText: string
  translatedText: string
  time?: number
}

export default function TranslateTest() {
  const [sourceText, setSourceText] = useState(
    'The COVID-19 pandemic has significantly impacted global healthcare systems and epidemiological patterns.'
  )
  const [results, setResults] = useState<TranslationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTranslate = async () => {
    setError('')
    setResults([])
    setLoading(true)

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          engines: ['deepl', 'claude', 'libre'],
        }),
      })

      const data = await res.json()

      if (data.success) {
        setResults(data.translations)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Çeviri başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container">
        <h1 className="text-4xl font-bold text-primary mb-2">🔄 Çeviri Motoru Testi</h1>
        <p className="text-text-light mb-12">
          DeepL, Claude AI, Libre Translate ile karşılaştırmalı çeviri
        </p>

        {/* Input */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold text-primary mb-4">📝 Orijinal Metin (İngilizce)</h2>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="h-40 mb-4"
              placeholder="Çevirilecek metni girin..."
            />
            <div className="text-sm text-text-light mb-4">
              Karakter: {sourceText.length} / 5000
            </div>
            <button
              onClick={handleTranslate}
              disabled={loading || sourceText.length === 0}
              className="btn btn-primary w-full text-lg"
            >
              {loading ? '⏳ Çeviriliyor...' : '✓ Tüm Motorları Çalıştır'}
            </button>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500">
              <h3 className="text-lg font-bold text-blue-900 mb-4">📊 İstatistikler</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-900">Çalışan Motorlar:</span>
                  <span className="font-bold text-xl text-blue-600">{results.length}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-900">Orijinal Kelime:</span>
                  <span className="font-bold">{sourceText.split(/\s+/).length}</span>
                </div>
                {results.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-blue-900">Hızlı Motor:</span>
                      <span className="font-bold text-green-600">
                        {results.reduce((min, r) => (r.time || 0) < (min.time || 9999) ? r : min).engine}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-900">Ortalama Zaman:</span>
                      <span className="font-bold">
                        {Math.round((results.reduce((sum, r) => sum + (r.time || 0), 0) / results.length))}ms
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Motorlar */}
            <div className="card">
              <h3 className="text-lg font-bold text-primary mb-4">🤖 Motorlar</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟡</span>
                  <span>DeepL - Profesyonel çeviri</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <span>Claude AI - LLM-based çeviri</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔗</span>
                  <span>Libre Translate - Açık kaynak</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-8 text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">📊 Çeviri Sonuçları</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {results.map((result, idx) => (
                <div key={idx} className="card border-2 border-accent">
                  <h3 className="text-lg font-bold text-primary mb-4">
                    {result.engine}
                  </h3>
                  
                  <div className="mb-4 p-4 bg-secondary rounded-lg">
                    <p className="text-sm font-medium text-text-light mb-2">Çeviri:</p>
                    <p className="text-text-dark leading-relaxed">
                      {result.translatedText}
                    </p>
                  </div>

                  {result.time && (
                    <div className="text-sm text-text-light">
                      ⏱️ Süre: <span className="font-semibold">{result.time}ms</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Comparison */}
            <div className="mt-8 card">
              <h3 className="text-xl font-bold text-primary mb-4">🔍 Detaylı Karşılaştırma</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-left py-3 px-4 font-bold">Motor</th>
                      <th className="text-left py-3 px-4 font-bold">Çeviri</th>
                      <th className="text-left py-3 px-4 font-bold">Kelime Sayısı</th>
                      <th className="text-left py-3 px-4 font-bold">Süre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-secondary">
                        <td className="py-3 px-4 font-semibold text-primary">{result.engine}</td>
                        <td className="py-3 px-4">{result.translatedText.substring(0, 50)}...</td>
                        <td className="py-3 px-4 text-center">
                          {result.translatedText.split(/\s+/).length}
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          {result.time}ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
