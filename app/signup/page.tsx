'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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

    // Validasyon
    if (!form.name || !form.email || !form.password) {
      setError('Tüm alanları doldurunuz')
      setLoading(false)
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setLoading(false)
      return
    }

    if (!form.agreeTerms) {
      setError('Şartları kabul etmelisiniz')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (data.success) {
        window.location.href = '/login?message=registered'
      } else {
        setError(data.error || 'Kayıt başarısız')
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
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">Hesap Oluştur</h1>
          <p className="text-center text-text-light mb-6">
            Bilimsel çevirilerinize başlayın
          </p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Şifreyi Onayla
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
                className="mt-1"
                required
              />
              <span className="text-sm text-text-light">
                <Link href="#" className="text-primary hover:underline">
                  Hizmet Şartları
                </Link>{' '}
                ve{' '}
                <Link href="#" className="text-primary hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı kabul ediyorum
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg mt-6"
            >
              {loading ? '⏳ Kaydediliyor...' : '✓ Hesap Oluştur'}
            </button>
          </form>

          <p className="text-center text-text-light mt-6">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
