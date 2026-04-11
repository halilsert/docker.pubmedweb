'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function LoginContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (data.success) {
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Giriş başarısız')
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container max-w-md">
        <div className="card">
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">Giriş Yap</h1>
          <p className="text-center text-text-light mb-6">
            Hesabınıza giriş yaparak devam edin
          </p>

          {message === 'registered' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6 text-green-600 text-sm">
              ✅ Hesabınız başarıyla oluşturuldu. Lütfen giriş yapınız.
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                <span className="text-sm text-text-light">Beni Hatırla</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline">
                Şifremi Unuttum
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg mt-6"
            >
              {loading ? '⏳ Giriş Yapılıyor...' : '✓ Giriş Yap'}
            </button>
          </form>

          <p className="text-center text-text-light mt-6">
            Hesabın yok mu?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Ücretsiz Hesap Oluştur
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
