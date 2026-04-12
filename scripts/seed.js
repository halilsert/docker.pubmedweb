// scripts/seed.js - Seed the database with sample data
const { Client } = require("pg");

const dbUrl = process.env.DATABASE_URL || "postgresql://pubmedweb:pubmedweb_password@localhost:5432/pubmedweb";

async function main() {
  const client = new Client(dbUrl);
  
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    // Delete existing data in order (respecting foreign keys)
    await client.query("DELETE FROM notifications");
    await client.query("DELETE FROM payments");
    await client.query("DELETE FROM translations");
    await client.query("DELETE FROM analytics");
    await client.query("DELETE FROM users");

    // Insert users
    await client.query(`
      INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES 
        ($1, $2, $3, $4, $5, NOW(), NOW()),
        ($6, $7, $8, $9, $10, NOW(), NOW())
    `, [
      "user_test", "test@example.com", "$2a$10$7kzOZ7sCkVNMjFKxw7gzWO8Pxq7YqNXqWqL5xG0XcZr3V8F9G0m2a", "Test User", "user",
      "user_admin", "admin@example.com", "$2a$10$7kzOZ7sCkVNMjFKxw7gzWO8Pxq7YqNXqWqL5xG0XcZr3V8F9G0m2a", "Admin User", "admin"
    ]);

    // Insert translations
    await client.query(`
      INSERT INTO translations (id, "userId", "fileName", "wordCount", cost, status, "sourceLanguage", "targetLanguage", "sourceText", "translatedText", "translatedBy", "createdAt", "updatedAt", "completedAt")
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), NOW()),
        ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW() - interval '2 days', NOW() - interval '2 days', NOW() - interval '2 days')
    `, [
      "trans_1", "user_test", "sample_paper.pdf", 2500, 100.0, "completed", "en", "tr", 
      "This is a sample scientific article about machine learning...", "Bu, makine öğrenimi hakkında örnek bir bilimsel makaledir...", "deepl",
      "trans_2", "user_test", "research_article.pdf", 1800, 72.0, "completed", "en", "de",
      "Another research document on AI...", "Ein anderes Forschungsdokument zu KI...", "claude"
    ]);

    // Insert payments
    await client.query(`
      INSERT INTO payments (id, "userId", "translationId", amount, currency, status, "stripePaymentId", "createdAt", "updatedAt", "paidAt")
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()),
        ($8, $9, $10, $11, $12, $13, $14, NOW() - interval '2 days', NOW() - interval '2 days', NOW() - interval '2 days')
    `, [
      "pay_1", "user_test", "trans_1", 100.0, "USD", "completed", "pi_test123",
      "pay_2", "user_test", "trans_2", 72.0, "USD", "completed", "pi_test456"
    ]);

    // Insert notifications
    await client.query(`
      INSERT INTO notifications (id, "userId", type, title, message, read, "emailSent", "createdAt")
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, NOW()),
        ($8, $9, $10, $11, $12, $13, $14, NOW() - interval '1 day')
    `, [
      "notif_1", "user_test", "payment_success", "Payment Successful", "Your payment of $100.00 has been processed.", true, true,
      "notif_2", "user_test", "translation_complete", "Translation Complete", "Your translation has been completed successfully.", true, true
    ]);

    // Insert analytics
    await client.query(`
      INSERT INTO analytics (id, date, "totalUsers", "totalTranslations", "totalRevenue", "translationsCompleted", "translationsFailed", "averageWordCount", "averageCost", "topEngine")
      VALUES ($1, NOW()::date, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      "analytics_1", 2, 2, 172.0, 2, 0, 2150, 86.0, "deepl"
    ]);

    console.log("✅ Database seeded successfully!");
    console.log("   - Created 2 users (test + admin)");
    console.log("   - Created 2 sample translations");
    console.log("   - Created 2 sample payments");
    console.log("   - Created 2 sample notifications");
    console.log("   - Created 1 analytics record");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
