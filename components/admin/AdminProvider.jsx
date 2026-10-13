"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshSession = async () => {
        try {
            const response = await fetch("/api/admin/auth/me", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                setAdmin(null);
                return null;
            }

            const data = await response.json();
            setAdmin(data.admin || null);
            return data.admin || null;
        } catch {
            setAdmin(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        fetch("/api/admin/auth/me", { method: "GET", cache: "no-store" })
            .then(async (response) => {
                if (!active) return;
                if (!response.ok) {
                    setAdmin(null);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                if (active) {
                    setAdmin(data.admin || null);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (active) {
                    setAdmin(null);
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const logout = async () => {
        await fetch("/api/admin/auth/logout", { method: "POST" });
        setAdmin(null);
        router.replace("/admin/login");
    };

    const value = { admin, loading, refreshSession, logout };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);

    if (!context) {
        throw new Error("useAdmin must be used inside AdminProvider");
    }

    return context;
}
