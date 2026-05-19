import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import SessionGuard from "@/components/admin/SessionGuard";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/admin/login");
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
        redirect("/");
    }

    return (
        <>
            <SessionGuard />
            <AdminLayoutClient user={session.user}>
                {children}
            </AdminLayoutClient>
        </>
    );
}
