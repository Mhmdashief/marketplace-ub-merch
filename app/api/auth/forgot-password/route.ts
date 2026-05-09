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
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({
                success: true,
                message: "Jika email terdaftar, link reset password telah dikirim",
            });
        }

        const token = await createPasswordResetToken(email);
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
            { success: false, error: error instanceof Error ? error.message : "Terjadi kesalahan pada sistem email" },
            { status: 500 }
        );
    }
}
