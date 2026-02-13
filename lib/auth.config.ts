import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            authorization: { params: { prompt: "select_account" } },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role as string || "USER";
                token.status = user.status as string || "ACTIVE";
                console.log("JWT Callback - Initial Sign In:", { role: token.role, status: token.status });
            }

            if (trigger === "update" && session) {
                token = { ...token, ...session };
                console.log("JWT Callback - Update:", token);
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
} satisfies NextAuthConfig;
