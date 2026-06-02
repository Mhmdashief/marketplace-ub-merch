import { prisma } from "./prisma";

export type AdminAction =
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED_NOT_FOUND"
    | "LOGIN_FAILED_PASSWORD"
    | "LOGIN_FAILED_LOCKED"
    | "LOGIN_FAILED_INACTIVE"
    | "LOGIN_FAILED_ROLE"
    | "LOGIN_RATE_LIMITED"
    | "LOGOUT"
    | "PASSWORD_RESET_REQUEST"
    | "PASSWORD_RESET_SUCCESS";

type AuditLogInput = {
    userId?: string;
    email?: string;
    action: AdminAction;
    ip?: string | null;
};

export async function createAdminLog({
    userId,
    email,
    action,
    ip,
}: AuditLogInput) {
    try {
        if (userId) {
            await prisma.adminLog.create({
                data: {
                    userId,
                    action,
                    ip: ip ?? null,
                },
            });

            return;
        }
        console.warn(
            `[AUDIT] ${action} | email=${email ?? "-"} | ip=${ip ?? "-"}`
        );
    } catch (error) {
        console.error("[AUDIT_LOG_ERROR]", error);
    }
}