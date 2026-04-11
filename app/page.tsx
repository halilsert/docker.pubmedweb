'use client'

import { useState } from 'react'
import { ChevronRight, FileText, DollarSign, Zap } from 'lucide-react'

interface Example {
  title: string
  original: string
  translated: string
  lang: string
}

const EXAMPLES: Example[] = [
  {
    title: 'Tıbbi İçerik',
    original: 'The COVID-19 pandemic has significantly impacted global healthcare systems and epidemiological patterns.',
    translated: 'COVID-19 pandemisi, küresel sağlık sistemlerini ve epidemiyolojik desenleri önemli ölçüde etkilemiştir.',
    lang: 'en'
  },
  {
    title: 'Araştırma Özeti',
    original: 'Our study demonstrates that machine learning algorithms can effectively predict patient outcomes with 94% accuracy.',
    translated: 'Çalışmamız, makine öğrenmesi algoritmalarının %94 doğruluk oranıyla hasta sonuçlarını etkili bir şekilde tahmin edebileceğini göstermektedir.',
    lang: 'en'
  },
  {
    title: 'Moleküler Biyoloji',
    original: 'The CRISPR-Cas9 system has revolutionized genetic engineering and gene therapy applications.',
    translated: 'CRISPR-Cas9 sistemi, genetik mühendisliği ve gen terapisi uygulamalarında devrim yaratmıştır.',
    lang: 'en'
  }
]

export default function Home() {
  const [step, setStep] = useState<'home' | 'upload'>('home')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {step === 'home' ? (
        <>
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="container py-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={32} className="text-blue-500" />
                <h1 className="text-4xl font-bold text-gray-900">PubMed Translate</h1>
              </div>
              <p className="text-xl text-gray-600">Bilimsel makalelerinizi profesyonelce çevirin</p>
            </div>
          </header>

          {/* Hero Section */}
          <section className="container py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Araştırma Makalelerinizi Dünyanın Diline Çevirin
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Tıbbi ve bilimsel içerikler için özel olarak tasarlanmış çeviri hizmeti. 
                PDF dosyasını yükle, fiyatı gör, ve ödeme yap. O kadar basit.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => setStep('upload')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition shadow-lg"
              >
                <FileText size={24} />
                PDF Dosyası Yükle
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center hover:border-blue-400 transition">
                <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı İşlem</h3>
                <p className="text-gray-600">Saniye içinde fiyat hesaplaması ve anında çeviri başlatma</p>
              </div>

              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center hover:border-blue-400 transition">
                <DollarSign className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Şeffaf Fiyatlandırma</h3>
                <p className="text-gray-600">Ödeme yapmadan önce tam fiyatı gör. Gizli ücret yok.</p>
              </div>

              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center hover:border-blue-400 transition">
                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Profesyonel Çeviri</h3>
                <p className="text-gray-600">DeepL ve Gemini AI ile akademik düzeyde çeviri</p>
              </div>
            </div>
          </section>

          {/* Examples Section */}
          <section className="bg-white py-16 border-t border-gray-200">
            <div className="container">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Çeviri Örnekleri
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {EXAMPLES.map((example, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-400 transition">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{example.title}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">📝 Orijinal (İngilizce):</p>
                        <p className="text-gray-700 italic">{example.original}</p>
                      </div>

                      <div className="border-t border-gray-300 pt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">🇹🇷 Çeviri (Türkçe):</p>
                        <p className="text-gray-700 font-medium">{example.translated}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="container py-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Fiyatlandırma
            </h2>

            <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                  <span className="text-gray-700">İlk 500 Kelime</span>
                  <span className="text-lg font-semibold text-blue-600">$0.05 / kelime</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">500+ Kelime</span>
                  <span className="text-lg font-semibold text-blue-600">$0.04 / kelime</span>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Örnek: 2000 kelimeli makale</p>
                  <p className="text-2xl font-bold text-blue-600">
                    (500 × $0.05) + (1500 × $0.04) = <span className="text-3xl">$85</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="bg-blue-500 py-12 text-white">
            <div className="container text-center">
              <h2 className="text-3xl font-bold mb-4">Hemen Başla</h2>
              <p className="text-lg text-blue-100 mb-6">
                PDF dosyanızı yükleyin ve 30 saniye içinde fiyat öğrenin
              </p>
              <button
                onClick={() => setStep('upload')}
                className="px-8 py-4 bg-white text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition text-lg inline-flex items-center gap-2"
              >
                <FileText size={24} />
                PDF Dosyası Yükle
              </button>
            </div>
          </section>
        </>
      ) : (
        // Upload Page
        <div className="min-h-screen bg-white py-12">
          <div className="container max-w-2xl">
            {/* Back Button */}
            <button
              onClick={() => setStep('home')}
              className="text-blue-500 hover:text-blue-600 font-medium mb-8 flex items-center gap-2"
            >
              ← Geri Dön
            </button>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">PDF Dosyasını Yükle</h2>
              <p className="text-gray-600">Çevirdiğiniz makalenin PDF dosyasını seçin</p>
            </div>

            {/* Upload Component */}
            <PDFUploader onSuccess={() => setStep('home')} />
          </div>
        </div>
      )}
    </div>
  )
}

interface PDFUploaderProps {
  onSuccess: () => void
}

function PDFUploader({ onSuccess }: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [cost, setCost] = useState<any>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setLoading(true)

    try {
      // PDF'i FormData ile gönder
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
      alert('PDF işleme hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {!cost ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50 hover:border-blue-500 transition">
          <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          
          <label className="cursor-pointer">
            <p className="text-lg font-semibold text-gray-900 mb-2">PDF Dosyası Seç</p>
            <p className="text-gray-600 mb-4">veya sürükle bırak</p>
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
                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                input.click()
              }}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            >
              {loading ? 'İşleniyor...' : 'Dosya Seç'}
            </button>
          </label>

          {file && (
            <div className="mt-4 p-4 bg-white rounded border border-blue-200">
              <p className="text-gray-700">Seçilen dosya: <strong>{file.name}</strong></p>
              <p className="text-gray-600 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cost Summary */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-green-900 mb-6">✅ Dosya İşlendi</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-white rounded border border-green-200">
                <span className="text-gray-700 font-medium">Dosya Adı:</span>
                <span className="font-semibold text-gray-900">{file?.name}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded border border-green-200">
                <span className="text-gray-700 font-medium">Toplam Kelime:</span>
                <span className="font-semibold text-lg text-blue-600">{cost.wordCount} kelime</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded border border-green-200">
                <span className="text-gray-700 font-medium">Birim Fiyat (Ort.):</span>
                <span className="font-semibold text-blue-600">${cost.unitPrice.toFixed(4)}/kelime</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-600 text-white rounded font-bold text-lg">
                <span>Toplam Ücret:</span>
                <span className="text-3xl">${cost.totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Details */}
            <div className="text-sm text-gray-700 space-y-2 p-4 bg-white rounded border border-green-200">
              <p>📊 <strong>Hesaplama Detayı:</strong></p>
              <p className="ml-4">
                • İlk 500 kelime: 500 × $0.05 = $25.00<br/>
                • Kalan {Math.max(0, cost.wordCount - 500)} kelime: {Math.max(0, cost.wordCount - 500)} × $0.04 = ${((Math.max(0, cost.wordCount - 500)) * 0.04).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setFile(null)
                setCost(null)
              }}
              className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
            >
              ← Başka Dosya Seç
            </button>
            <button
              onClick={onSuccess}
              className="flex-1 px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition flex items-center justify-center gap-2"
            >
              💳 Ödemeye Devam Et
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
