import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
    try {
        console.log("📝 Registration request received");

        const body = await request.json();
        console.log("📦 Request body:", { ...body, password: "[REDACTED]" });

        const { name, email, password } = registerSchema.parse(body);
        console.log("✅ Validation passed");

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("❌ User already exists:", email);
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        console.log("🔐 Hashing password...");
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("💾 Creating user in database...");
        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
            },
        });

        console.log("✅ User created successfully:", user.id);

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("❌ Validation error:", error.issues);
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("❌ Registration error:", error);

        // Provide more specific error messages
        if (error instanceof Error) {
            // Check for Prisma-specific errors
            if (error.message.includes("Unique constraint")) {
                return NextResponse.json(
                    { error: "Email already registered" },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: `Registration failed: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
