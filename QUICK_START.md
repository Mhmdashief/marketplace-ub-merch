# Quick Start Guide - Admin Dashboard

## 🚀 Cara Menggunakan Dashboard Admin

### 1. Setup Admin User

Pertama, Anda perlu membuat user dengan role ADMIN. Ada beberapa cara:

#### Option A: Via Prisma Studio (Recommended)
```bash
npx prisma studio
```
- Buka browser ke `http://localhost:5555`
- Pilih model `User`
- Edit user yang ingin dijadikan admin
- Ubah field `role` menjadi `ADMIN` atau `SUPER_ADMIN`
- Save

#### Option B: Via Database Query
```sql
-- Update existing user
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';

-- Atau create new admin user (jika sudah ada hash password)
INSERT INTO users (id, name, email, password, role, status, "createdAt", "updatedAt")
VALUES (
  'cuid_here',
  'Admin User',
  'admin@example.com',
  'hashed_password_here',
  'ADMIN',
  'ACTIVE',
  NOW(),
  NOW()
);
```

### 2. Login ke Dashboard

1. Buka browser ke `http://localhost:3000/auth/login`
2. Login dengan credentials admin user
3. Setelah login sukses, akan otomatis redirect ke `/admin/dashboard`

### 3. Navigasi Dashboard

Dashboard memiliki menu navigasi di sidebar kiri:

- **Dashboard** (`/admin/dashboard`)
  - Overview statistics
  - Recent orders
  - Quick actions

- **Products** (`/admin/products`)
  - Manage merchandise products
  - (Coming soon - perlu Product model)

- **Orders** (`/admin/orders`)
  - Track customer orders
  - (Coming soon - perlu Order model)

- **Categories** (`/admin/categories`)
  - Organize product categories
  - (Coming soon - perlu Category model)

- **Users** (`/admin/users`)
  - ✅ **ACTIVE** - Manage all users
  - View, search, and manage user accounts

- **Reports** (`/admin/reports`)
  - Sales analytics and reports
  - (Coming soon)

## 🔐 Security Features

### Middleware Protection
Semua route `/admin/*` dilindungi oleh middleware:
- Cek authentication status
- Cek role authorization (ADMIN atau SUPER_ADMIN)
- Auto redirect jika tidak authorized

### Server-Side Verification
Setiap admin page juga melakukan server-side check:
```typescript
const session = await auth();
if (!session?.user || session.user.role !== "ADMIN") {
  redirect("/");
}
```

## 📊 Features yang Sudah Aktif

### ✅ Dashboard Page
- **Statistics Cards**
  - Total Users (live data)
  - Total Products (placeholder)
  - Total Orders (placeholder)
  - Revenue (placeholder)

- **Welcome Banner**
  - Personalized greeting
  - Gradient design

- **Recent Orders**
  - Preview of latest orders
  - (Currently using placeholder data)

- **Quick Actions**
  - Quick links to common tasks

### ✅ Users Management
- **Users Table**
  - Search by name or email
  - Display user avatars
  - Role badges (USER, ADMIN, SUPER_ADMIN)
  - Status badges (ACTIVE, SUSPENDED, BANNED)
  - Join date
  - Live data from database

- **Features**
  - Real-time search
  - Responsive table
  - Color-coded badges

## 🎨 UI Features

### Design Elements
- **Gradient Backgrounds**
  - Modern, premium look
  - Color-coded by section

- **Smooth Animations**
  - Hover effects
  - Transitions
  - Shadow effects

- **Responsive Layout**
  - Desktop: Fixed sidebar
  - Mobile: (Coming soon)

### Color Coding
- 🔵 Blue: Dashboard & Users
- 🟢 Green: Products
- 🟣 Purple: Orders
- 🟠 Orange: Categories
- 🔴 Indigo: Reports

## 🛠️ Development Commands

### Start Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Clean Cache
```bash
# Remove Next.js cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
pnpm install
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@/components/admin/...'"
**Solution:**
```bash
Remove-Item -Recurse -Force .next
pnpm dev
```

### Error: "status does not exist in type UserSelect"
**Solution:**
```bash
npx prisma generate
```

### Cannot Access Admin Dashboard
**Check:**
1. Apakah sudah login?
2. Apakah user memiliki role ADMIN atau SUPER_ADMIN?
3. Check console untuk error messages

### TypeScript Errors
**Solution:**
```bash
# Restart TypeScript server di VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Atau clean dan rebuild
Remove-Item -Recurse -Force .next
pnpm dev
```

## 📝 Next Development Steps

### 1. Add Product Management
- [ ] Create Product model in schema
- [ ] Run migration
- [ ] Create CRUD operations
- [ ] Build product management UI

### 2. Add Order Management
- [ ] Create Order & OrderItem models
- [ ] Run migration
- [ ] Create order tracking system
- [ ] Build order management UI

### 3. Add Categories
- [ ] Create Category model
- [ ] Run migration
- [ ] Create category hierarchy
- [ ] Build category management UI

### 4. Add Analytics
- [ ] Install chart library (recharts)
- [ ] Create analytics components
- [ ] Implement data aggregation
- [ ] Build reports page

### 5. Mobile Responsiveness
- [ ] Implement mobile sidebar
- [ ] Make tables responsive
- [ ] Add touch-friendly interactions

## 💡 Tips

1. **Always backup database before migrations**
   ```bash
   # Export data
   npx prisma db pull
   ```

2. **Use Prisma Studio for quick data management**
   ```bash
   npx prisma studio
   ```

3. **Check logs for debugging**
   - Browser console
   - Terminal output
   - Network tab

4. **Test on different browsers**
   - Chrome
   - Firefox
   - Safari
   - Edge

## 📞 Support

Jika menemukan issues:
1. Check `TROUBLESHOOTING.md` untuk common issues
2. Check `ADMIN_DASHBOARD.md` untuk dokumentasi lengkap
3. Check browser console untuk error messages
4. Check terminal output untuk server errors

## 🎯 Quick Links

- **Admin Dashboard:** `http://localhost:3000/admin`
- **Login Page:** `http://localhost:3000/auth/login`
- **Prisma Studio:** `http://localhost:5555` (after `npx prisma studio`)
- **Main Site:** `http://localhost:3000`

---

**Happy Coding! 🚀**
