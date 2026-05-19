"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function SessionGuard() {
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const activeSession = sessionStorage.getItem("admin_active_session");

        if (!activeSession) {
            signOut({ callbackUrl: "/admin/login?reason=browser_closed" });
        } else {
            setIsChecking(false);
        }

        sessionStorage.setItem("admin_active_session", "true");
    }, []);

    if (isChecking) {
        return null;
    }

    return null;
}
