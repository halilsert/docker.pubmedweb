-- Seed script for PubMed Pro database
-- Run with: DATABASE_URL="..." psql < prisma/seed.sql

-- Insert sample users
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt") VALUES
('user_1', 'test@example.com', '$2a$10$7kzOZ7sCkVNMjFKxw7gzWO8Pxq7YqNXqWqL5xG0XcZr3V8F9G0m2a', 'Test User', 'user', NOW(), NOW()),
('admin_1', 'admin@example.com', '$2a$10$7kzOZ7sCkVNMjFKxw7gzWO8Pxq7YqNXqWqL5xG0XcZr3V8F9G0m2a', 'Admin User', 'admin', NOW(), NOW());

-- Insert sample translations
INSERT INTO translations (id, "userId", "fileName", "wordCount", cost, status, "sourceLanguage", "targetLanguage", "sourceText", "translatedText", "translatedBy", "createdAt", "updatedAt", "completedAt") VALUES
('trans_1', 'user_1', 'sample_paper.pdf', 2500, 100.0, 'completed', 'en', 'tr', 'This is a sample scientific article...', 'Bu örnek bir bilimsel makale...', 'deepl', NOW(), NOW(), NOW()),
('trans_2', 'user_1', 'research_article.pdf', 1800, 72.0, 'completed', 'en', 'de', 'Another research document...', 'Ein anderes Forschungsdokument...', 'claude', NOW() - interval '2 days', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert sample payments
INSERT INTO payments (id, "userId", "translationId", amount, currency, status, "stripePaymentId", "createdAt", "updatedAt", "paidAt") VALUES
('pay_1', 'user_1', 'trans_1', 100.0, 'USD', 'completed', 'pi_test123', NOW(), NOW(), NOW()),
('pay_2', 'user_1', 'trans_2', 72.0, 'USD', 'completed', 'pi_test456', NOW() - interval '2 days', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert sample notifications
INSERT INTO notifications (id, "userId", type, title, message, read, "emailSent", "createdAt") VALUES
('notif_1', 'user_1', 'payment_success', 'Payment Successful', 'Your payment of $100.00 has been processed.', true, true, NOW()),
('notif_2', 'user_1', 'translation_complete', 'Translation Complete', 'Your translation has been completed successfully.', true, true, NOW() - interval '1 day');

-- Insert sample analytics
INSERT INTO analytics (id, date, "totalUsers", "totalTranslations", "totalRevenue", "translationsCompleted", "translationsFailed", "averageWordCount", "averageCost", "topEngine") VALUES
('analytics_1', NOW()::date, 1, 2, 172.0, 2, 0, 2150, 86.0, 'deepl');
