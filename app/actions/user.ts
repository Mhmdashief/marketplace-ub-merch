'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { UserStatus, Role } from "@prisma/client";

export async function createUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as Role;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            status: UserStatus.ACTIVE,
        },
    });

    revalidatePath("/admin/users");
}

export async function toggleUserStatus(userId: string, currentStatus: UserStatus) {
    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.BANNED : UserStatus.ACTIVE;

    await prisma.user.update({
        where: { id: userId },
        data: { status: newStatus },
    });

    revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: { id: userId },
    });

    revalidatePath("/admin/users");
}
