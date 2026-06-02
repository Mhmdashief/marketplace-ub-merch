# 📧 Setup Resend untuk Forgot Password

Panduan lengkap setup Resend email service untuk fitur forgot password.

## 🚀 Quick Start

### 1. Install Package (✅ Sudah Selesai)

```bash
pnpm add resend
```

### 2. Dapatkan API Key dari Resend

#### Langkah-langkah:

1. **Buka [Resend.com](https://resend.com)**
   - Klik "Sign Up" di pojok kanan atas
   - Pilih sign up dengan GitHub atau Email

2. **Verifikasi Email**
   - Cek inbox email Anda
   - Klik link verifikasi

3. **Buat API Key**
   - Setelah login, buka dashboard
   - Klik **"API Keys"** di sidebar kiri
   - Klik tombol **"Create API Key"**
   - Beri nama: `UB Merch Development` atau `UB Merch Production`
   - Klik **"Create"**
   - **PENTING**: Copy API key yang muncul (format: `re_...`)
   - Simpan di tempat aman (hanya muncul sekali!)

4. **Update .env File**

   Buka file `.env` dan update:

   ```env
   RESEND_API_KEY="re_abc123xyz..."  # Paste API key Anda di sini
   EMAIL_FROM="UB Merch <onboarding@resend.dev>"
   ```

5. **Restart Development Server**

   ```bash
   # Stop server dengan Ctrl+C
   pnpm dev
   ```

## 🎯 Testing

### Test 1: Request Reset Password

1. Buka browser: `http://localhost:3000/auth/login`
2. Klik **"Forgot your password?"**
3. Masukkan email Anda (email real yang bisa Anda akses)
4. Klik **"Kirim Link Reset"**
5. Cek inbox email Anda
6. Anda akan menerima email dengan subject: **"Reset Password - UB Merch"**

### Test 2: Reset Password

1. Buka email yang diterima
2. Klik tombol **"Reset Password Saya"**
3. Masukkan password baru (minimal 6 karakter)
4. Konfirmasi password
5. Klik **"Reset Password"**
6. Anda akan diredirect ke halaman login
7. Login dengan password baru

## 📊 Monitoring Email

### Cek Status Email di Dashboard Resend

1. Login ke [Resend Dashboard](https://resend.com/emails)
2. Buka **"Emails"** di sidebar
3. Anda akan melihat list semua email yang terkirim:
   - ✅ **Delivered**: Email berhasil terkirim
   - ⏳ **Queued**: Email dalam antrian
   - ❌ **Failed**: Email gagal terkirim

### Troubleshooting Email Tidak Terkirim

**Problem**: Email tidak masuk ke inbox

**Solutions**:
1. ✅ Cek folder **Spam/Junk**
2. ✅ Verify API key benar di `.env`
3. ✅ Pastikan server sudah di-restart setelah update `.env`
4. ✅ Cek Resend dashboard untuk error messages
5. ✅ Pastikan email recipient valid

## 🌐 Setup Domain Kustom (Production)

Untuk production, setup domain kustom agar email tidak masuk spam:

### 1. Tambah Domain di Resend

1. Login ke Resend Dashboard
2. Klik **"Domains"** di sidebar
3. Klik **"Add Domain"**
4. Masukkan domain Anda (contoh: `ubmerch.com`)
5. Klik **"Add"**

### 2. Setup DNS Records

Resend akan memberikan DNS records yang harus ditambahkan:

```
Type: TXT
Name: resend._domainkey
Value: [diberikan oleh Resend]

Type: TXT  
Name: @
Value: [diberikan oleh Resend]
```

### 3. Tambahkan ke Domain Provider

**Contoh untuk Cloudflare:**
1. Login ke Cloudflare
2. Pilih domain Anda
3. Buka **DNS** → **Records**
4. Klik **"Add record"**
5. Masukkan Type, Name, dan Value dari Resend
6. Klik **"Save"**

**Untuk provider lain** (Namecheap, GoDaddy, etc):
- Prosesnya mirip, cari menu DNS Management
- Tambahkan TXT records yang diberikan Resend

### 4. Verifikasi Domain

1. Kembali ke Resend Dashboard
2. Tunggu 5-15 menit untuk DNS propagation
3. Klik **"Verify"** di domain Anda
4. Status akan berubah menjadi **"Verified"** ✅

### 5. Update EMAIL_FROM

Setelah domain verified, update `.env`:

```env
EMAIL_FROM="UB Merch <noreply@ubmerch.com>"
```

## 💰 Resend Pricing

### Free Tier (Perfect untuk Development)
- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ Semua fitur tersedia
- ✅ No credit card required

### Pro Plan ($20/month)
- ✅ 50,000 emails per month
- ✅ Custom domains
- ✅ Email analytics
- ✅ Priority support

### Estimasi Usage UB Merch:
- Password reset: ~10-50 emails/day
- Free tier sudah cukup untuk small-medium traffic
- Upgrade ke Pro jika > 100 password resets/day

## 🔒 Security Best Practices

1. **Jangan commit API key ke Git**
   - ✅ `.env` sudah ada di `.gitignore`
   - ✅ Gunakan `.env.example` untuk template

2. **Gunakan API key berbeda untuk dev/prod**
   - Development: `UB Merch Development`
   - Production: `UB Merch Production`

3. **Rotate API keys secara berkala**
   - Setiap 3-6 bulan
   - Atau jika ada security breach

4. **Monitor email usage**
   - Cek Resend dashboard regularly
   - Set up alerts untuk unusual activity

## 📝 Environment Variables

Berikut semua env vars yang dibutuhkan:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Google OAuth
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Resend Email (REQUIRED untuk forgot password)
RESEND_API_KEY="re_..."
EMAIL_FROM="UB Merch <noreply@yourdomain.com>"
```

## 🎨 Email Template Preview

Email yang dikirim memiliki design professional:

- 🎨 **Header**: Gradient blue dengan logo UB Merch
- 📝 **Content**: Clear message dengan greeting
- 🔘 **CTA Button**: Prominent "Reset Password Saya" button
- 🔗 **Alternative Link**: Plain text link untuk fallback
- ⚠️ **Warning Box**: Security notice dengan expiration info
- 📧 **Footer**: Branding dan copyright

## ❓ FAQ

**Q: Apakah harus setup Resend untuk development?**
A: Tidak wajib. Jika `RESEND_API_KEY` tidak ada, link reset akan muncul di console log.

**Q: Berapa lama token reset password berlaku?**
A: 1 jam. Setelah itu token akan expired dan user harus request ulang.

**Q: Apakah bisa pakai email service lain?**
A: Ya, bisa. Tapi Resend paling mudah setup-nya. Alternatif: SendGrid, AWS SES, Nodemailer.

**Q: Email masuk spam, bagaimana?**
A: Setup custom domain dan DNS records. Email dari domain verified jarang masuk spam.

**Q: Berapa limit email di free tier?**
A: 100 emails/day atau 3,000 emails/month.

## 🆘 Support

Jika ada masalah:

1. **Cek dokumentasi Resend**: https://resend.com/docs
2. **Cek Resend status**: https://status.resend.com
3. **Contact Resend support**: support@resend.com
4. **Cek logs di terminal** untuk error messages

## ✅ Checklist Setup

- [ ] Install `resend` package
- [ ] Buat akun di Resend.com
- [ ] Generate API key
- [ ] Update `RESEND_API_KEY` di `.env`
- [ ] Update `EMAIL_FROM` di `.env`
- [ ] Restart development server
- [ ] Test kirim email
- [ ] Verify email diterima
- [ ] Test reset password flow
- [ ] (Optional) Setup custom domain untuk production

---

**Last Updated**: 2026-02-12  
**Resend Version**: Latest  
**Status**: ✅ Ready to Use
