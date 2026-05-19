import { NextRequest, NextResponse } from "next/server";
import { verifyResetToken } from "@/lib/password-reset";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ success: false, error: "Kode OTP wajib diisi" }, { status: 400 });
        }

        const verification = await verifyResetToken(token);

        if (!verification.valid) {
            return NextResponse.json(
                { success: false, error: verification.error },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            email: verification.email,
            message: "Kode OTP valid"
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    }
}
