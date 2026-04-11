import nodemailer from 'nodemailer'

interface EmailParams {
  to: string
  subject: string
  html: string
  name?: string
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  // Resend API kullan (Gmail yerine)
  if (process.env.RESEND_API_KEY) {
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    })
  } else {
    // Fallback: Gmail App Password
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  return transporter
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const transporter = getTransporter()

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@pubmedpro.com',
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    console.log('Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}

// Email templates
export const emailTemplates = {
  paymentSuccess: (name: string, amount: number, translationFile: string) => ({
    subject: '✅ Ödemeniz Başarıyla Alındı',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f3a7d;">Merhaba ${name},</h2>
        <p>Ödemeniz başarıyla işlenmiştir. Çeviriye erişim sağlandı.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Ödenen Tutar:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Durum:</strong> <span style="color: #10b981;">✓ Tamamlandı</span></p>
        </div>

        <p>
          <a href="${translationFile}" style="background: #0f3a7d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            📥 Çevirilen Dosyayı İndir
          </a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          © 2026 PubMed Pro. Tüm hakları saklıdır.
        </p>
      </div>
    `,
  }),

  translationComplete: (name: string, fileName: string, downloadUrl: string) => ({
    subject: '✅ Çevirisi Tamamlandı!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f3a7d;">Çevirisi Tamamlandı!</h2>
        <p>Merhaba ${name},</p>
        <p>Dosyanızın çevirisi tamamlandı: <strong>${fileName}</strong></p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="color: #10b981;">✅ Dosya başarıyla çevrildi ve hazır!</p>
        </div>

        <p>
          <a href="${downloadUrl}" style="background: #0f3a7d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            📥 Çevirilen Dosyayı İndir
          </a>
        </p>

        <p style="color: #666; font-size: 14px;">
          Dosya 30 gün boyunca indirilmeye hazır olacak.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          © 2026 PubMed Pro
        </p>
      </div>
    `,
  }),

  translationFailed: (name: string, fileName: string) => ({
    subject: '❌ Çeviri Başarısız Oldu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f3a7d;">Çeviri Başarısız</h2>
        <p>Merhaba ${name},</p>
        <p>Maalesef dosyanızın çevirisi başarısız oldu: <strong>${fileName}</strong></p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p style="color: #991b1b;">⚠️ Hata oluştu. Lütfen tekrar deneyin.</p>
        </div>

        <p>
          <a href="https://pubmedpro.com/support" style="color: #0f3a7d;">Destek ile İletişime Geç</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          © 2026 PubMed Pro
        </p>
      </div>
    `,
  }),

  welcomeEmail: (name: string) => ({
    subject: '🎉 PubMed Pro\'ya Hoş Geldiniz!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f3a7d;">Hoş Geldiniz, ${name}!</h2>
        <p>PubMed Pro'ya kaydolduğunuz için teşekkürler.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0f3a7d; margin-top: 0;">Nasıl Başlayacaksınız?</h3>
          <ol>
            <li>Giriş yapın ve dashboard'a gidin</li>
            <li>PDF dosyanızı yükleyin</li>
            <li>Çeviri maliyetini görün</li>
            <li>Ödeyin ve çeviriye erişin</li>
          </ol>
        </div>

        <p>
          <a href="https://pubmedpro.com/dashboard" style="background: #0f3a7d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Dashboard'a Git
          </a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          © 2026 PubMed Pro
        </p>
      </div>
    `,
  }),
}
