import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const ADMIN_ROLES = ["ADMIN", "SUPERADMIN"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;
    const userStatus = req.auth?.user?.status;

    // 🔐 Proteksi route admin
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        // Block user non-admin
        if (!ADMIN_ROLES.includes(userRole!)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Block user status bermasalah
        if (userStatus && userStatus !== "ACTIVE") {
            return NextResponse.redirect(new URL("/auth/login?blocked=true", req.url));
        }
    }

    // UX: kalau sudah login, tidak boleh balik ke login page
    if (pathname.startsWith("/auth/login") && isLoggedIn) {
        if (ADMIN_ROLES.includes(userRole!)) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/auth/login"],
};
