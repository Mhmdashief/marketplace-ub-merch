/**
 * Layout untuk /admin/login — standalone tanpa sidebar/navbar admin.
 * Tidak mewarisi admin layout yang memerlukan autentikasi.
 */
export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
