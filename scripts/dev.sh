#!/bin/bash
# Geliştirme ortamını başlat

echo "📦 Bağımlılıklar yükleniyor..."
npm install

echo "🗄️ Veritabanı başlatılıyor..."
docker-compose up -d postgres

echo "⏳ PostgreSQL başlaması bekleniyor..."
sleep 5

echo "🔄 Prisma migrate çalıştırılıyor..."
npx prisma migrate dev --name init

echo "✅ Geliştirme sunucusu başlatılıyor..."
npm run dev
