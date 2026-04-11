# PubMedWeb

Bilimsel makalelerinizi akıllı fiyatlandırma ile çevirin.

## Özellikler

- **PubMed Arama**: Milyonlarca tıbbi makalede ara
- **Akıllı Fiyatlandırma**: Kelime sayısına göre otomatik maliyet hesaplama
- **Güvenli Ödeme**: Stripe entegrasyonu ile güvenli ödeme
- **DeepL Çevirisi**: Yüksek kalitede profesyonel çeviri
- **Gemini Analizi**: AI destekli makale özeti ve analiz

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS + Apple Design System
- **Ödeme**: Stripe
- **Çeviri**: DeepL API
- **AI**: Google Gemini API
- **Depolama**: Vercel Blob Storage

## Kurulum

```bash
npm install
npm run dev
```

`http://localhost:3000` adresini ziyaret edin.

## Environment Variables

`.env.local` dosyasında gerekli API anahtarlarını ayarlayın:

```
DEEPL_API_KEY=your_deepl_key
GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=your_stripe_key
BLOB_READ_WRITE_TOKEN=your_blob_token
```

## Deploy

Vercel'e deploy edin:

```bash
vercel deploy
```
