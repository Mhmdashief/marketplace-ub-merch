import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import authConfig from "./auth.config";

// Schema validasi dengan Zod
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
                    const validatedFields = loginSchema.safeParse(credentials);
                    if (!validatedFields.success) {
                        return null;
                    }
                    const { email, password } = validatedFields.data;
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });
                    if (!user || !user.password) return null;
                    if (user.status !== "ACTIVE") {
                        return null;
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
                    console.error("Internal Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    debug: false,
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