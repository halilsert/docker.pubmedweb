'use client'

import Link from 'next/link'

const endpoints = [
  {
    method: 'POST',
    path: '/api/translate',
    desc: 'Metin çevir (3 motor)',
    params: 'text, engines: string[]'
  },
  {
    method: 'POST',
    path: '/api/extract-pdf',
    desc: 'PDF\'den metin çıkar',
    params: 'file: File'
  },
  {
    method: 'POST',
    path: '/api/auth/signup',
    desc: 'Yeni hesap oluştur',
    params: 'email, password, name'
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    desc: 'Giriş yap',
    params: 'email, password'
  },
  {
    method: 'GET',
    path: '/api/user/profile',
    desc: 'Kullanıcı profili',
    params: 'Token gerekli'
  },
  {
    method: 'GET',
    path: '/api/user/translations',
    desc: 'Çeviri geçmişi',
    params: 'Token gerekli'
  },
  {
    method: 'POST',
    path: '/api/files/upload',
    desc: 'Dosya yükle',
    params: 'file, translationId'
  },
  {
    method: 'GET',
    path: '/api/notifications',
    desc: 'Bildirimler',
    params: 'filter: all|unread|payment|translation'
  },
  {
    method: 'GET',
    path: '/api/admin/stats',
    desc: 'Admin istatistikleri',
    params: 'admin_token header'
  },
  {
    method: 'GET',
    path: '/api/analytics',
    desc: 'Analytics verileri',
    params: 'range: 24hours|7days|30days|all'
  },
]

export default function APIDoc() {
  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">📚 API Dokumentasyon</h1>
          <p className="text-text-light">PubMed Pro REST API endpoints</p>
        </div>

        <div className="grid gap-6">
          {endpoints.map((ep, i) => (
            <div key={i} className="card">
              <div className="flex items-start gap-4">
                <span className={`px-3 py-1 rounded font-bold text-sm text-white whitespace-nowrap ${
                  ep.method === 'GET' ? 'bg-blue-500' : 'bg-green-500'
                }`}>{ep.method}</span>
                <div className="flex-1">
                  <p className="font-mono text-lg font-bold text-primary mb-2">{ep.path}</p>
                  <p className="text-text-light mb-2">{ep.desc}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Parametreler:</span> {ep.params}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold text-primary mb-4">🔐 Kimlik Doğrulama</h2>
          <p className="text-text-light mb-4">
            Most endpoints require authentication. Include the auth token in HttpOnly cookies automatically after login.
          </p>
          <p className="text-sm font-mono bg-white p-4 rounded border border-blue-200">
            Cookie: auth_token={"<base64_encoded_token>"}
          </p>
        </div>

        <Link href="/" className="btn btn-primary w-full mt-8">← Ana Sayfa</Link>
      </div>
    </div>
  )
}
