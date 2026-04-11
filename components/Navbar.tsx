'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const isLoggedIn = false

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">P</div>
          PubMed Pro
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-text-light hover:text-primary font-medium">Anasayfa</Link>
          <Link href="#features" className="text-text-light hover:text-primary font-medium">Özellikler</Link>
          <Link href="#pricing" className="text-text-light hover:text-primary font-medium">Fiyatlandırma</Link>
          <Link href="/api-docs" className="text-text-light hover:text-primary font-medium">API</Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/notifications" className="relative p-2 hover:bg-secondary rounded-lg">
                🔔 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <div className="relative">
                <button onClick={() => setIsUserOpen(!isUserOpen)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-gray-100">
                  <span className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></span>▼
                </button>
                {isUserOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <Link href="/dashboard" className="block px-4 py-2 text-text-light hover:bg-secondary">Dashboard</Link>
                    <Link href="/settings" className="block px-4 py-2 text-text-light hover:bg-secondary">⚙️ Ayarlar</Link>
                    <Link href="/notifications" className="block px-4 py-2 text-text-light hover:bg-secondary">🔔 Bildirimler</Link>
                    <hr className="my-2" />
                    <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-secondary">🚪 Çıkış</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary hidden sm:inline-flex">Giriş</Link>
              <Link href="/signup" className="btn btn-primary">Başla</Link>
            </>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-secondary rounded-lg">
            {isOpen ? '✕' : '≡'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-secondary border-t border-gray-200 py-4">
          <div className="container flex flex-col gap-4">
            <Link href="/" className="py-2 text-primary font-medium">Anasayfa</Link>
            <Link href="#features" className="py-2 text-text-light">Özellikler</Link>
            <Link href="/api-docs" className="py-2 text-text-light">API Docs</Link>
            <hr />
            {!isLoggedIn && (
              <>
                <Link href="/login" className="btn btn-secondary justify-center">Giriş</Link>
                <Link href="/signup" className="btn btn-primary justify-center">Başla</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
