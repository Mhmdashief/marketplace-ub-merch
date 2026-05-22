import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email: string, token: string) {
    try {
    // Jika konfigurasi SMTP belum lengkap, fallback ke console log (development)
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("=".repeat(60));
        console.log("📧 PASSWORD RESET OTP (Development Mode)");
        console.log("=".repeat(60));
        console.log(`To: ${email}`);
        console.log(`OTP Code: ${token}`);
        console.log("=".repeat(60));
        console.log("⚠️  SMTP Configuration not found. Add it to .env for production.");
        console.log("=".repeat(60));
      }
      return { success: true, otp: token };
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'UB Merch <admin@ubmerch.ac.id>',
      to: email,
      subject: 'Kode OTP Reset Password - UB Merch',
      html: getOTPEmailTemplate(token),
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('[EMAIL] OTP sent. Message ID:', info.messageId);
    }

    return { success: true, otp: token, emailId: info.messageId };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[EMAIL_ERROR]', err.message);
    throw error;
  }
}

/**
 * HTML Email Template untuk Reset Password dengan OTP
 */
function getOTPEmailTemplate(otp: string): string {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kode OTP Reset Password - UB Merch</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                    🔐 Reset Password OTP
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                    UB Merch - Marketplace Universitas Brawijaya
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                    Halo! 👋
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Kami menerima permintaan untuk mereset password akun UB Merch Anda. Gunakan kode OTP di bawah ini untuk melanjutkan proses penyetelan ulang sandi:
                  </p>

                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <div style="display: inline-block; padding: 18px 40px; background-color: #f3f4f6; border: 2px dashed #3b82f6; border-radius: 12px; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e3a8a; font-family: monospace; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">
                          ${otp}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Warning Box -->
                  <div style="margin-top: 30px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      ⚠️ <strong>Penting:</strong> Kode OTP ini hanya berlaku selama <strong>2 menit</strong>. Jangan bagikan kode ini kepada siapa pun demi keamanan akun Anda. Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                    Email ini dikirim oleh <strong>UB Merch</strong>
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Marketplace Official Universitas Brawijaya
                  </p>
                  <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                    © 2026 UB Merch. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
