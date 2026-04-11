'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16 border-t border-gray-200">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center text-primary text-sm font-bold">
                P
              </div>
              PubMed Pro
            </h4>
            <p className="text-gray-300 text-sm">
              Bilimsel makalelerinizi profesyonel çeviriler ile dünya ile paylaşın.
            </p>
          </div>

          {/* Product */}
          <div>
            <h5 className="font-semibold mb-4">Ürün</h5>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="#features" className="hover:text-accent transition">Özellikler</Link></li>
              <li><Link href="#pricing" className="hover:text-accent transition">Fiyatlandırma</Link></li>
              <li><Link href="#" className="hover:text-accent transition">API Docs</Link></li>
              <li><Link href="#" className="hover:text-accent transition">Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-semibold mb-4">Şirket</h5>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="#about" className="hover:text-accent transition">Hakkımızda</Link></li>
              <li><Link href="#" className="hover:text-accent transition">Kariyer</Link></li>
              <li><Link href="#" className="hover:text-accent transition">İletişim</Link></li>
              <li><Link href="#" className="hover:text-accent transition">Suç Bildirimi</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold mb-4">Yasal</h5>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="#" className="hover:text-accent transition">Gizlilik</Link></li>
              <li><Link href="#" className="hover:text-accent transition">Koşullar</Link></li>
              <li><Link href="#" className="hover:text-accent transition">Çerezler</Link></li>
              <li><Link href="#" className="hover:text-accent transition">KVKK</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-primary-light my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © 2026 PubMed Pro. Tüm hakları saklıdır.
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 bg-primary-light rounded-lg hover:bg-accent hover:text-primary transition">
              ✉️
            </Link>
            <Link href="#" className="p-2 bg-primary-light rounded-lg hover:bg-accent hover:text-primary transition">
              in
            </Link>
            <Link href="#" className="p-2 bg-primary-light rounded-lg hover:bg-accent hover:text-primary transition">
              ⚙️
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-accent text-primary rounded-full hover:bg-accent-light transition shadow-lg"
      >
        ↑
      </button>
    </footer>
  )
}
