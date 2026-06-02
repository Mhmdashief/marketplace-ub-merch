"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
    const [isChecking, setIsChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const activeSession = sessionStorage.getItem("admin_active_session");

        if (!activeSession) {
            signOut({ callbackUrl: "/admin/login?reason=browser_closed" });
            return;
        }

        let myTabId = sessionStorage.getItem("my_tab_session_id");
        if (!myTabId) {
            myTabId = Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9);
            sessionStorage.setItem("my_tab_session_id", myTabId);
            localStorage.setItem("admin_active_tab_session_id", myTabId);
        }

        setAuthorized(true);
        setIsChecking(false);
        sessionStorage.setItem("admin_active_session", "true");

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "admin_active_tab_session_id") {
                const activeTabId = e.newValue;
                const currentTabId = sessionStorage.getItem("my_tab_session_id");

                if (activeTabId && activeTabId !== currentTabId) {
                    signOut({ callbackUrl: "/admin/login?reason=another_tab" });
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    if (isChecking || !authorized) {
        return (
            <div className="fixed inset-0 bg-[#0B0F19] flex flex-col items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-slate-800 border-t-yellow-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Memverifikasi sesi...</p>
            </div>
        );
    }

    return <>{children}</>;
}
