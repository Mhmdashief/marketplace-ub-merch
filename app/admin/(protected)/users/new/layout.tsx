import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewUserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (session?.user?.role !== "SUPER_ADMIN") {
        redirect("/admin/users");
    }

    return <>{children}</>;
}
