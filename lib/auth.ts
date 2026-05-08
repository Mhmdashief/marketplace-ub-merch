import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import authConfig from "./auth.config";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;
// Re-validasi ke DB setiap 5 menit (dalam detik)
const DB_REVALIDATION_INTERVAL = 5 * 60;

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const parsed = loginSchema.safeParse(credentials);
                    if (!parsed.success) return null;

                    const { email, password } = parsed.data;
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user || !user.password) return null;

                    // Hanya ADMIN dan SUPER_ADMIN
                    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") return null;

                    // Cek akun terkunci
                    if (user.lockedUntil && user.lockedUntil > new Date()) return null;

                    // Cek status aktif
                    if (user.status !== "ACTIVE") return null;

                    const isValid = await bcrypt.compare(password, user.password);

                    if (!isValid) {
                        const newAttempts = user.failedLoginAttempts + 1;
                        const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;
                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                failedLoginAttempts: newAttempts,
                                lockedUntil: shouldLock
                                    ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
                                    : undefined,
                            },
                        });
                        return null;
                    }

                    // Login berhasil — reset counter
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            failedLoginAttempts: 0,
                            lockedUntil: null,
                            lastLoginAt: new Date(),
                        },
                    });

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        status: user.status,
                    };
                } catch (err) {
                    console.error("[Auth] authorize error:", err);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },
    callbacks: {
        ...authConfig.callbacks,

        async jwt({ token, user, trigger }) {
            // Initial sign-in: set semua data dari user object
            if (user) {
                const u = user as { id: string; role: string; status: string };
                token.id = u.id;
                token.role = u.role;
                token.status = u.status;
                // Simpan waktu terakhir validasi ke DB
                token.dbCheckedAt = Math.floor(Date.now() / 1000);
                return token;
            }

            // Setiap request: cek apakah sudah waktunya re-validasi ke DB
            const now = Math.floor(Date.now() / 1000);
            const lastCheck = (token.dbCheckedAt as number) ?? 0;
            const shouldRevalidate = now - lastCheck > DB_REVALIDATION_INTERVAL;

            if (shouldRevalidate && token.id) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { role: true, status: true, lockedUntil: true },
                    });

                    if (!dbUser) {
                        // User dihapus dari DB — invalidasi token
                        token.role = "REVOKED";
                        token.status = "INACTIVE";
                    } else if (dbUser.lockedUntil && dbUser.lockedUntil > new Date()) {
                        token.status = "LOCKED";
                    } else {
                        // Sinkronkan role dan status terbaru dari DB
                        token.role = dbUser.role;
                        token.status = dbUser.status;
                    }
                    token.dbCheckedAt = now;
                } catch (err) {
                    console.error("[Auth] JWT DB revalidation error:", err);
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.status = token.status as string;
            }
            return session;
        },
    },
});