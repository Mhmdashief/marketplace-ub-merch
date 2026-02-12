// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetToken, deleteResetToken } from "@/lib/password-reset";
import bcrypt from "bcrypt";
import { z } from "zod";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, password } = resetPasswordSchema.parse(body);

        // Verifikasi token
        const verification = await verifyResetToken(token);

        if (!verification.valid) {
            return NextResponse.json(
                { success: false, error: verification.error },
                { status: 400 }
            );
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password user
        await prisma.user.update({
            where: { email: verification.email },
            data: { password: hashedPassword },
        });

        // Hapus token setelah digunakan
        await deleteResetToken(token);

        return NextResponse.json({
            success: true,
            message: "Password berhasil diubah",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.errors[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan, silakan coba lagi" },
            { status: 500 }
        );
    }
}
