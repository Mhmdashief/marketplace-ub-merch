// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Kirim email reset password menggunakan Resend
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  try {
    // Jika RESEND_API_KEY tidak ada, fallback ke console log (development)
    if (!process.env.RESEND_API_KEY) {
      console.log("=".repeat(60));
      console.log("📧 PASSWORD RESET EMAIL (Development Mode)");
      console.log("=".repeat(60));
      console.log(`To: ${email}`);
      console.log(`Reset Link: ${resetUrl}`);
      console.log("=".repeat(60));
      console.log("⚠️  RESEND_API_KEY not found. Add it to .env for production email sending.");
      console.log("=".repeat(60));
      return { success: true, resetUrl };
    }

    // Kirim email menggunakan Resend
    console.log('📧 Attempting to send email via Resend...');
    console.log('From:', process.env.EMAIL_FROM || 'UB Merch <onboarding@resend.dev>');
    console.log('To:', email);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'UB Merch <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Password - UB Merch',
      html: getEmailTemplate(resetUrl),
    });

    if (error) {
      console.error('❌ Resend API Error:');
      console.error('Error object:', JSON.stringify(error, null, 2));
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      throw new Error(`Failed to send email: ${error.message || JSON.stringify(error)}`);
    }

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data?.id);
    return { success: true, resetUrl, emailId: data?.id };
  } catch (error: any) {
    console.error('❌ Error in sendPasswordResetEmail:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

/**
 * HTML Email Template untuk Reset Password
 */
function getEmailTemplate(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password - UB Merch</title>
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
                    🔐 Reset Password
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
                    Kami menerima permintaan untuk mereset password akun UB Merch Anda. Jika Anda yang melakukan permintaan ini, silakan klik tombol di bawah untuk melanjutkan.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                          Reset Password Saya
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Atau copy dan paste link berikut ke browser Anda:
                  </p>
                  
                  <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; word-break: break-all;">
                    <a href="${resetUrl}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                      ${resetUrl}
                    </a>
                  </div>

                  <!-- Warning Box -->
                  <div style="margin-top: 30px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      ⚠️ <strong>Penting:</strong> Link ini akan kadaluarsa dalam <strong>1 jam</strong>. Jika Anda tidak meminta reset password, abaikan email ini dan password Anda akan tetap aman.
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
