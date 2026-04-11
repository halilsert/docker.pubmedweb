import type { ReactNode } from 'react'

export const metadata = {
  title: 'PubMed Translate - Bilimsel Makale Çevirisi',
  description: 'PubMed makalelerini akıllı fiyatlandırma ile çevirin',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #000000; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
