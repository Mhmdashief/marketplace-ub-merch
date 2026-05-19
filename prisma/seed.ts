import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL ?? "mhmdashief@gmail.com";

const SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_PASSWORD ?? "Mochamad_123";

const SUPER_ADMIN_NAME =
  process.env.SUPER_ADMIN_NAME ?? "Super Admin UB Merch";

async function main() {
  console.log("Memulai proses seed database...\n");

  const hashedPassword = await bcrypt.hash(
    SUPER_ADMIN_PASSWORD,
    12
  );

  // cek existing super admin
  const existing = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  // kalau sudah ada → update
  if (existing) {
    console.log(
      `SUPER_ADMIN ditemukan (${existing.email})`
    );
    console.log("Memperbarui kredensial SUPER_ADMIN...\n");

    const updated = await prisma.user.update({
      where: {
        id: existing.id,
      },
      data: {
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        status: "ACTIVE",

        // reset auth state
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        lastLoginIp: null,
      },
    });

    console.log("SUPER_ADMIN berhasil diperbarui\n");
    console.log("─────────────────────────────────────────");
    console.log(`Nama     : ${updated.name}`);
    console.log(`Email    : ${updated.email}`);
    console.log(`Password : ${SUPER_ADMIN_PASSWORD}`);
    console.log(`Role     : ${updated.role}`);
    console.log(`Status   : ${updated.status}`);
    console.log("─────────────────────────────────────────\n");

    return;
  }

  // kalau belum ada → create
  const created = await prisma.user.create({
    data: {
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",

      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: null,
      lastLoginIp: null,
    },
  });

  console.log("SUPER_ADMIN berhasil dibuat\n");
  console.log("─────────────────────────────────────────");
  console.log(`Nama     : ${created.name}`);
  console.log(`Email    : ${created.email}`);
  console.log(`Password : ${SUPER_ADMIN_PASSWORD}`);
  console.log(`Role     : ${created.role}`);
  console.log(`Status   : ${created.status}`);
  console.log("─────────────────────────────────────────\n");

  console.log(
    "Segera ganti password setelah login pertama.\n"
  );
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });