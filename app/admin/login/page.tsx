import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login — UB Merch",
    description: "Halaman login khusus administrator UB Merch.",
    robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
    return <LoginForm />;
}
