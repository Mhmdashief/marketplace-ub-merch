import type { NextAuthConfig } from "next-auth";

const useSecureCookies = process.env.NODE_ENV === "production";

const authConfig = {
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },

    cookies: {
        sessionToken: {
            name: useSecureCookies ? "__Secure-authjs.session-token" : "authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: undefined,
            },
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },

    providers: [],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.status = user.status;
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

export default authConfig;