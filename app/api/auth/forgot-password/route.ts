// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email("Format email tidak valid"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = forgotPasswordSchema.parse(body);

        // Cek apakah user dengan email ini ada
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Untuk keamanan, selalu return success message
        // Jangan beri tahu apakah email terdaftar atau tidak
        if (!user) {
            return NextResponse.json({
                success: true,
                message: "Jika email terdaftar, link reset password telah dikirim",
            });
        }

        // Generate token dan simpan ke database
        const token = await createPasswordResetToken(email);

        // Kirim email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json({
            success: true,
            message: "Link reset password telah dikirim ke email Anda",
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan, silakan coba lagi" },
            { status: 500 }
        );
    }
}
