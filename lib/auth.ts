import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import authConfig from "./auth.config";

const loginSchema = z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        ...authConfig.providers,
        CredentialsProvider({
            name: "credentials",
            async authorize(credentials) {
                try {
                    const { email, password } = loginSchema.parse(credentials);

                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) return null;

                    // 🔐 SECURITY BLOCK LOGIN
                    if (user.status !== "ACTIVE") {
                        throw new Error("Akun Anda sedang diblokir atau dinonaktifkan");
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) return null;

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                        status: user.status,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (existingUser && existingUser.status !== "ACTIVE") {
                    return false;
                }
            }

            return true;
        },
    },
});
