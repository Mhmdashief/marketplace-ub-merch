import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            status: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: string;
        status: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        status: string;
        /** Unix timestamp (detik) terakhir kali JWT di-revalidasi ke database */
        dbCheckedAt?: number;
    }
}