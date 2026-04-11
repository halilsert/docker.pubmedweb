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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          PubMed Pro
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-text-light hover:text-primary transition font-medium">
            Anasayfa
          </Link>
          <Link href="#features" className="text-text-light hover:text-primary transition font-medium">
            Özellikler
          </Link>
          <Link href="#pricing" className="text-text-light hover:text-primary transition font-medium">
            Fiyatlandırma
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-gray-100 transition"
              >
                <span className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></span>
                <span>▼</span>
              </button>

              {isUserOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <Link href="/dashboard" className="block px-4 py-2 text-text-light hover:bg-secondary transition">
                    Dashboard
                  </Link>
                  <Link href="/history" className="block px-4 py-2 text-text-light hover:bg-secondary transition">
                    Geçmiş
                  </Link>
                  <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-secondary transition">
                    🚪 Çıkış
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary hidden sm:inline-flex">
                Giriş
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Başla
              </Link>
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
          >
            {isOpen ? '✕' : '≡'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary border-t border-gray-200 py-4">
          <div className="container flex flex-col gap-4">
            <Link href="/" className="py-2 text-primary font-medium">
              Anasayfa
            </Link>
            <Link href="#features" className="py-2 text-text-light">
              Özellikler
            </Link>
            <Link href="#pricing" className="py-2 text-text-light">
              Fiyatlandırma
            </Link>
            <hr />
            {!isLoggedIn && (
              <>
                <Link href="/login" className="btn btn-secondary justify-center">
                  Giriş
                </Link>
                <Link href="/signup" className="btn btn-primary justify-center">
                  Başla
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
