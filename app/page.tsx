'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [step, setStep] = useState<'home' | 'upload'>('home')

  if (step === 'upload') {
    return <UploadPage onBack={() => setStep('home')} />
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b border-gray-200">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary leading-tight">
                Bilimsel Makalelerinizi Dünya Diline Çevirin
              </h1>
              <p className="text-xl text-text-light mb-8 leading-relaxed">
                DeepL ve Gemini AI teknolojisi ile akademik düzeyde çeviriler. Hızlı, güvenli, şeffaf fiyatlandırma.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => setStep('upload')}
                  className="btn btn-primary text-lg px-6 py-3"
                >
                  📄 PDF Yükle ve Fiyat Gör →
                </button>
                <Link
                  href="#features"
                  className="btn btn-secondary text-lg px-6 py-3"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-text-dark">⭐ 1,234+ Memnun Kullanıcı</p>
                  <p className="text-sm text-accent">★★★★★ 4.9/5</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                  <div className="text-6xl">📄</div>
                </div>
                <div className="absolute top-8 -left-8 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs animate-bounce">
                  <p className="text-sm font-semibold text-primary">📄 PDF Yükle</p>
                  <p className="text-xs text-text-light mt-1">Makalenizi yükleyin</p>
                </div>
                <div className="absolute bottom-8 -right-8 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs" style={{ animation: 'bounce 1s 0.2s infinite' }}>
                  <p className="text-sm font-semibold text-primary">💰 Fiyat Gör</p>
                  <p className="text-xs text-text-light mt-1">$45.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 border-b border-gray-200">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Neden PubMed Pro Seçmelisiniz?
          </h2>
          <p className="text-center text-text-light max-w-2xl mx-auto mb-12">
            Profesyonel, güvenli ve kullanımı kolay çeviri hizmeti
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Hızlı İşlem', desc: 'Saniyeler içinde PDF yükle ve fiyat gör.' },
              { icon: '🔒', title: 'Güvenli & Gizli', desc: 'Verileriniz 256-bit SSL ile korunur.' },
              { icon: '💰', title: 'Şeffaf Fiyat', desc: 'Gizli ücret yok. Tam fiyatı önceden gör.' },
              { icon: '🤖', title: 'AI + İnsan', desc: 'DeepL ve Gemini AI ile profesyonel çeviri.' },
              { icon: '🎧', title: '24/7 Destek', desc: 'Her zaman yardımcı olmaya hazırız.' },
              { icon: '✅', title: 'Kalite Garantisi', desc: 'Her çeviri kontrol edilir. %99.9 doğruluk.' },
            ].map((feature, idx) => (
              <div key={idx} className="card group hover:border-primary">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-primary">{feature.title}</h3>
                <p className="text-text-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 border-b border-gray-200 bg-secondary">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Basit ve Şeffaf Fiyatlandırma
          </h2>
          <p className="text-center text-text-light max-w-2xl mx-auto mb-12">
            Sadece kullandığınız kadar ödeyin.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { badge: 'Başlangıç', price: '$0.05', range: 'İlk 500 kelime' },
              { badge: '⭐ Popüler', price: '$0.04', range: '500+ kelime', highlight: true },
              { badge: 'Toplu', price: 'Özel', range: '10K+ kelime' },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`card ${plan.highlight ? 'ring-2 ring-accent scale-105 bg-gradient-to-br from-accent/5 to-accent/10' : ''}`}
              >
                <p className="text-accent font-bold mb-4">{plan.badge}</p>
                <p className="text-4xl font-bold text-primary mb-4">{plan.price}</p>
                <p className="text-sm text-text-light mb-6 p-3 bg-white rounded border border-gray-200">
                  {plan.range}
                </p>
                <button className={`btn w-full ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  Seç
                </button>
              </div>
            ))}
          </div>

          {/* Calculator */}
          <div className="max-w-2xl mx-auto bg-white card border-2 border-accent">
            <h3 className="text-2xl font-bold text-primary mb-6">💰 Fiyat Hesaplayıcı</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-text-dark mb-2">Kelime Sayısı</label>
                <input
                  type="number"
                  placeholder="2000"
                  defaultValue="2000"
                  onChange={(e) => {
                    const words = parseInt(e.target.value) || 0
                    const cost = words <= 500 ? words * 0.05 : (500 * 0.05) + ((words - 500) * 0.04)
                    const elem = document.getElementById('result')
                    if (elem) elem.textContent = `$${cost.toFixed(2)}`
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-text-dark mb-2">Toplam Ücret</label>
                <div id="result" className="text-3xl font-bold text-accent">
                  $85.00
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-light">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            PDF yükle → Fiyat gör → Öde. 3 adım, 5 dakika.
          </p>
          <button
            onClick={() => setStep('upload')}
            className="btn btn-accent text-lg px-8 py-4"
          >
            🚀 Şimdi Başla
          </button>
        </div>
      </section>
    </div>
  )
}

function UploadPage({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [cost, setCost] = useState<any>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setCost(data)
      } else {
        alert('Hata: ' + data.error)
      }
    } catch (error) {
      alert('PDF işleme hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 bg-secondary">
      <div className="container max-w-2xl">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary-dark font-semibold mb-8"
        >
          ← Geri Dön
        </button>

        <h2 className="text-4xl font-bold text-primary mb-2">PDF Dosyasını Yükle</h2>
        <p className="text-text-light mb-12">Makalenizin PDF dosyasını seçin ve anında fiyat öğrenin</p>

        {!cost ? (
          <div className="card border-2 border-dashed border-primary p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <label className="cursor-pointer block">
              <p className="text-2xl font-bold text-primary mb-2">PDF Dosyası Seç</p>
              <p className="text-text-light mb-6">veya sürükle bırak (Max 10MB)</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement)
                  input?.click()
                }}
                disabled={loading}
                className="btn btn-primary px-8 py-3 text-lg"
              >
                {loading ? '⏳ İşleniyor...' : '📁 Dosya Seç'}
              </button>
            </label>

            {file && (
              <div className="mt-6 p-4 bg-secondary rounded-lg border border-gray-200">
                <p className="font-semibold text-primary">📄 {file.name}</p>
                <p className="text-sm text-text-light mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500">
            <h3 className="text-2xl font-bold text-green-900 mb-6">✅ Dosya Başarıyla İşlendi</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 rounded-lg bg-white border border-green-200">
                <span className="font-medium text-text-dark">📄 Dosya Adı</span>
                <span className="font-semibold">{file?.name}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-white border border-green-500">
                <span className="font-medium text-text-dark">📊 Toplam Kelime</span>
                <span className="text-2xl font-bold text-primary">{cost.wordCount}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-white border border-green-200">
                <span className="font-medium text-text-dark">💵 Birim Fiyat</span>
                <span className="font-semibold">${cost.unitPrice.toFixed(4)}/kelime</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-accent text-white font-bold text-xl">
                <span>💰 Toplam Ücret</span>
                <span className="text-3xl">${cost.totalCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setFile(null)
                  setCost(null)
                }}
                className="flex-1 btn btn-secondary text-lg"
              >
                ← Başka Dosya
              </button>
              <button className="flex-1 btn btn-primary text-lg">
                💳 Ödemeye Devam Et →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
