'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Halil Sert',
    email: 'halil@example.com',
    language: 'tr',
    notifications: true,
    newsletter: false,
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target as any
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary">⚙️ Ayarlar</h1>
          <Link href="/dashboard" className="btn btn-secondary">← Geri</Link>
        </div>

        {saved && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6 text-green-600">
            ✅ Ayarlarınız kaydedildi
          </div>
        )}

        <div className="space-y-8">
          {/* Profil */}
          <div className="card">
            <h2 className="text-2xl font-bold text-primary mb-6">👤 Profil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Tercihler */}
          <div className="card">
            <h2 className="text-2xl font-bold text-primary mb-6">🎨 Tercihler</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dil</label>
                <select
                  name="language"
                  value={profile.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bildirimler */}
          <div className="card">
            <h2 className="text-2xl font-bold text-primary mb-6">🔔 Bildirimler</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={profile.notifications}
                  onChange={handleChange}
                />
                <span>Bildirim e-postaları gönder</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={profile.newsletter}
                  onChange={handleChange}
                />
                <span>Haber bülteni abone ol</span>
              </label>
            </div>
          </div>

          {/* Tehlikeli İşlemler */}
          <div className="card border-red-200 bg-red-50">
            <h2 className="text-2xl font-bold text-red-600 mb-6">⚠️ Tehlikeli İşlemler</h2>
            <button className="btn w-full text-red-600 border border-red-300 hover:bg-red-100">
              Hesabı Sil
            </button>
          </div>

          <button onClick={handleSave} className="btn btn-primary w-full text-lg">
            💾 Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
