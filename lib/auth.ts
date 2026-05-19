import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { headers } from "next/headers";
import { prisma } from "./prisma";
import authConfig from "./auth.config";
import { createAdminLog } from "./audit-log";
import { rateLimit } from "./rate-limit";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;
const DB_REVALIDATION_INTERVAL = 5 * 60; // 5 menit

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,

    providers: [
        CredentialsProvider({
            name: "credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

        async authorize(credentials) {
            try {
                const headerList = await headers();
                const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

                // Rate Limit: Maksimum 10 percobaan login per IP dalam 1 menit
                const limit = await rateLimit(`login_ip:${ip}`, 10, 60 * 1000);

                if(!limit.success) {
                    await createAdminLog({
                        action: "LOGIN_RATE_LIMITED",
                        ip,
                    });
console.warn(`[AUTH] Rate limit exceeded for IP: ${ip}`);
return null;
                    }

const parsed = loginSchema.safeParse(credentials);

if (!parsed.success) {
    console.warn("[AUTH] invalid payload");
    return null;
}

const { email, password } = parsed.data;

const user = await prisma.user.findUnique({
    where: { email },
});

// user tidak ditemukan
if (!user) {
    await createAdminLog({
        email,
        action: "LOGIN_FAILED_NOT_FOUND",
        ip,
    });

    return null;
}

// user tidak punya password
if (!user.password) {
    await createAdminLog({
        userId: user.id,
        action: "LOGIN_FAILED_PASSWORD",
        ip,
    });

    return null;
}

// hanya admin
if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    await createAdminLog({
        userId: user.id,
        action: "LOGIN_FAILED_ROLE",
        ip,
    });

    return null;
}

// inactive
if (user.status !== "ACTIVE") {
    await createAdminLog({
        userId: user.id,
        action: "LOGIN_FAILED_INACTIVE",
        ip,
    });

    return null;
}

// locked
if (user.lockedUntil && user.lockedUntil > new Date()) {
    await createAdminLog({
        userId: user.id,
        action: "LOGIN_FAILED_LOCKED",
        ip,
    });

    return null;
}

// compare password
const isValid = await bcrypt.compare(password, user.password);

// wrong password
if (!isValid) {
    const newAttempts = user.failedLoginAttempts + 1;
    const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            failedLoginAttempts: newAttempts,
            lockedUntil: shouldLock
                ? new Date(
                    Date.now() + LOCK_DURATION_MINUTES * 60 * 1000
                )
                : null,
        },
    });

    await createAdminLog({
        userId: user.id,
        action: "LOGIN_FAILED_PASSWORD",
        ip,
    });

    return null;
}

// reset counter login berhasil
await prisma.user.update({
    where: {
        id: user.id,
    },
    data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip, // track the IP on user row too
    },
});

await createAdminLog({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    ip,
});

return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
};
                } catch (error) {
    console.error("[AUTH_AUTHORIZE_ERROR]", error);
    return null;
}
            },
        }),
    ],

callbacks: {
        async jwt({ token, user }) {
        // initial login
        if (user) {
            token.id = user.id;
            token.role = user.role;
            token.status = user.status;
            token.dbCheckedAt = Math.floor(Date.now() / 1000);

            return token;
        }

        // periodic revalidate
        const now = Math.floor(Date.now() / 1000);
        const lastCheck = (token.dbCheckedAt as number) ?? 0;

        const shouldRevalidate =
            now - lastCheck > DB_REVALIDATION_INTERVAL;

        if (shouldRevalidate && token.id) {
            try {
                const dbUser = await prisma.user.findUnique({
                    where: {
                        id: token.id as string,
                    },
                    select: {
                        role: true,
                        status: true,
                        lockedUntil: true,
                    },
                });

                if (!dbUser) {
                    token.role = "REVOKED";
                    token.status = "INACTIVE";
                } else if (
                    dbUser.lockedUntil &&
                    dbUser.lockedUntil > new Date()
                ) {
                    token.status = "INACTIVE";
                } else {
                    token.role = dbUser.role;
                    token.status = dbUser.status;
                }

                token.dbCheckedAt = now;
            } catch (error) {
                console.error("[AUTH_REVALIDATE_ERROR]", error);
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