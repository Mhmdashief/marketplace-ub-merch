import { prisma } from "./prisma";
import crypto from "crypto";

export function generateResetToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createPasswordResetToken(email: string) {
    await prisma.passwordResetToken.deleteMany({
        where: { email },
    });
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 120000); // 2 minutes
    await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expiresAt,
        },
    });

    return token;
}
export async function verifyResetToken(token: string) {
    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    if (!resetToken) {
        return { valid: false, error: "Token tidak valid" };
    }
    if (resetToken.expiresAt < new Date()) {
        await prisma.passwordResetToken.delete({
            where: { token },
        });
        return { valid: false, error: "Token sudah kadaluarsa" };
    }

    return { valid: true, email: resetToken.email };
}
export async function deleteResetToken(token: string) {
    try {
        await prisma.passwordResetToken.delete({
            where: { token },
        });
    } catch (error) {
        console.log('Token already deleted or not found');
    }
}
