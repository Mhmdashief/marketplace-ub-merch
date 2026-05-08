import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;
    const userStatus = req.auth?.user?.status;

    // ─── Halaman login admin: SELALU tampilkan form login ─────────────────────
    // Kecuali jika sudah login sebagai admin valid → redirect ke dashboard
    if (pathname === "/admin/login") {
        if (
            isLoggedIn &&
            userRole &&
            ADMIN_ROLES.includes(userRole) &&
            userStatus === "ACTIVE"
        ) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
        // Belum login, atau session invalid/stale → tampilkan halaman login
        return NextResponse.next();
    }

    // ─── Proteksi semua route /admin lainnya ─────────────────────────────────
    if (pathname.startsWith("/admin")) {

        // 1. Belum login → redirect ke halaman login admin
        if (!isLoggedIn) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // 2. Token direvoke / user dihapus dari DB
        if (userRole === "REVOKED") {
            return NextResponse.redirect(new URL("/admin/login?reason=revoked", req.url));
        }

        // 3. Status akun bermasalah (INACTIVE / LOCKED)
        if (userStatus && userStatus !== "ACTIVE") {
            return NextResponse.redirect(new URL("/admin/login?reason=blocked", req.url));
        }

        // 4. Role tidak valid untuk admin panel → 403
        if (!ADMIN_ROLES.includes(userRole!)) {
            return NextResponse.redirect(new URL("/403", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/admin/:path*",
        "/admin/login",
    ],
};
