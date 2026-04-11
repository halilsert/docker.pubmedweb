# PubMed Pro - Bilimsel Makale Çevirisi

Profesyonel, AI-powered bilimsel makale çeviri hizmeti.

## 🚀 Özellikler

- **Multi-Engine Çeviri**: DeepL, Claude AI, Libre Translate
- **PDF İşleme**: Otomatik metin çıkarma ve kelime sayma
- **Karşılaştırmalı Çeviri**: 3 motorun çevirilerini yan yana gör
- **Kullanıcı Hesapları**: Kayıt, giriş, dashboard
- **Çeviri Geçmişi**: Tüm çevirileriniz kaydedilir
- **Responsive Design**: Desktop & Mobile
- **Docker Support**: Mac, Linux, Windows'ta çalışır
- **Web Terminal**: iPhone/iPad'den komut çalıştır

## 📦 Teknoloji Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Translation**: DeepL API, Claude AI, Libre Translate
- **File Processing**: PDF text extraction
- **Deployment**: Vercel, Docker
- **Payment**: Stripe (Hazır)

## 🛠️ Kurulum

### Gereksinimler
- Node.js 20+
- Docker & Docker Compose (Optional)
- Git

### 1. Projeyi Clone Et
```bash
git clone https://github.com/halilsert/docker.pubmedweb.git
cd docker.pubmedweb
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Environment Variables'ı Ayarla
```bash
cp .env.example .env.local
# .env.local'ı kendi API anahtarlarınla doldur
```

### 4. Veritabanı Kurulumu

**Option A: Docker ile (Önerilir)**
```bash
docker-compose up -d
npx prisma migrate dev
```

**Option B: Vercel Postgres**
```bash
# Vercel Postgres setup et
npx prisma migrate deploy
```

### 5. Geliştirme Sunucusunu Başlat
```bash
npm run dev
# http://localhost:3000 ziyaret et
```

## 📱 iPhone'dan Uzaktan Komut

### 1. Terminal Token Ayarla
```bash
export TERMINAL_TOKEN="your-secret-token"
npm run dev
```

### 2. Web Browser'da Aç
- **Mac**: http://localhost:3000/terminal
- **Canlı Site**: https://pubmedweb.vercel.app/terminal

### 3. iPhone/iPad Safari'de Aç
1. Mac ile aynı Wi-Fi ağında olun
2. Safari'de: `http://[YOUR_MAC_IP]:3000/terminal`
3. Token gir ve komut çalıştır

### 📝 Örnek Komutlar
```bash
npm run build       # Production build
npm run dev         # Dev sunucusu
docker-compose up   # Docker başlat
git status          # Git durumu
ps aux              # Çalışan işlemler
npm run start       # Production start
```

## 🌐 Canlı Site

https://pubmedweb.vercel.app

### Test Hesabı
```
Email: test@example.com
Şifre: password123
```

## 📊 Çeviri Motorları Testi

Tüm motorları karşılaştırmalı görmek için:
https://pubmedweb.vercel.app/translate-test

## 🔄 Çeviri Akışı

1. **PDF Yükle** (`/`) → Dosyayı seç
2. **Fiyat Gör** → Kelime sayısına göre otomatik fiyat
3. **Ödeme Yap** → Stripe ile güvenli ödeme
4. **Çeviri Başla** → Arka planda işleme
5. **Sonuç Al** → Tamamlandığında email bildirim

## 📈 Dashboard

Giriş yaptıktan sonra:
- **İstatistikler**: Toplam çeviri, kelime, harcanan tutar
- **Geçmiş**: Tüm çevirileriniz tablo halinde
- **Durum**: Çeviri durumu (bekleniyor, çeviriliyor, tamamlandı)
- **İndirme**: Çevirilen PDF'leri indir

## 🔐 Güvenlik

- ✅ HTTPS/TLS şifreleme
- ✅ HttpOnly cookies
- ✅ Şifre hashing (bcryptjs)
- ✅ Token-based terminal auth
- ✅ Whitelist'lenmiş komutlar
- ✅ Rate limiting (Vercel)

## 📦 Docker

### Production Build
```bash
docker build -t pubmedweb .
docker run -p 3000:3000 pubmedweb
```

### Docker Compose (Dev + DB)
```bash
docker-compose up
# http://localhost:3000
```

### Docker Compose Durdurmak
```bash
docker-compose down
```

## 🚀 Deployment

### Vercel (Otomatik)
```bash
vercel deploy --prod
```

### Docker ile (Any Cloud)
```bash
docker build -t pubmedweb .
# Push to Docker Hub / Registry
docker push your-registry/pubmedweb
```

## 📚 API Endpoints

### Çeviri
- `POST /api/translate` - Metin çevir (3 motor)
- `POST /api/extract-pdf` - PDF'den metin çıkar

### Kullanıcı
- `POST /api/auth/signup` - Hesap oluştur
- `POST /api/auth/login` - Giriş yap
- `GET /api/user/profile` - Profil bilgisi
- `GET /api/user/translations` - Çeviri geçmişi

### Terminal
- `POST /api/terminal/run` - Komut çalıştır (Güvenli)

### Health
- `GET /api/health` - Sunucu durumu

## 🛠️ Geliştirme

### Branch Stratejisi
```bash
git checkout -b feature/new-feature
# Değişiklikleri yap
git commit -m "feat: açıklama"
git push origin feature/new-feature
# Pull request aç
```

### Build
```bash
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

## 📞 İletişim

- **GitHub**: https://github.com/halilsert/docker.pubmedweb
- **Email**: Halil_sert2002@hotmail.com
- **Issues**: GitHub Issues'de sorunu bildir

## 📄 Lisans

MIT License - Kendi projelerine kullan

## 🎯 Roadmap

- [ ] Vercel Postgres entegrasyonu
- [ ] Stripe gerçek ödeme (Live)
- [ ] Email bildirimleri
- [ ] Admin paneli
- [ ] PDF indirme (çevirilen)
- [ ] Batch işlemler
- [ ] API rate limiting
- [ ] Advanced analytics

---

**Geliştirme**: Gordon & Halil Sert | **2026**
