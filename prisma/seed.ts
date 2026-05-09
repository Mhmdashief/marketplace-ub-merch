import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Kredensial Default Superadmin
// Bisa di-override lewat env var saat dijalankan.
// Ganti nilai default di sini sebelum pertama kali seed di production!
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL ?? "mhmdashief@gmail.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD ?? "Mochamad_123!";
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME ?? "Super Admin UB Merch";

async function main() {
  console.log(" Memulai proses seed database...\n");

  // Cek apakah SUPER_ADMIN sudah ada
  const existing = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
  });

  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

  if (existing) {
    console.log(`SUPER_ADMIN sudah ada dengan email: ${existing.email}`);
    console.log("Mereset/mengonfigurasi ulang kredensial SUPER_ADMIN...");

    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        status: "ACTIVE",
      },
    });

    console.log("Akun SUPER_ADMIN berhasil direset!\n");
    console.log("─────────────────────────────────────────");
    console.log(`   Nama    : ${updated.name}`);
    console.log(`   Email   : ${updated.email}`);
    console.log(`   Password: ${SUPER_ADMIN_PASSWORD}`);
    console.log(`   Role    : ${updated.role}`);
    console.log("─────────────────────────────────────────\n");
    return;
  }

  // ── Buat akun SUPER_ADMIN baru jika belum ada
  const superAdmin = await prisma.user.create({
    data: {
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Akun SUPER_ADMIN baru berhasil dibuat!\n");
  console.log("─────────────────────────────────────────");
  console.log(`   Nama    : ${superAdmin.name}`);
  console.log(`   Email   : ${superAdmin.email}`);
  console.log(`   Password: ${SUPER_ADMIN_PASSWORD}`);
  console.log(`   Role    : ${superAdmin.role}`);
  console.log("─────────────────────────────────────────");
  console.log("\n Segera ganti password setelah pertama kali login!\n");
}

main()
  .catch((e) => {
    console.error(" Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });