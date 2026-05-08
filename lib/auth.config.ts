import type { NextAuthConfig } from "next-auth";

export default {
    providers: [],
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role as string;
                token.status = user.status as string;
            }

            if (trigger === "update" && session) {
                token = { ...token, ...session };
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
