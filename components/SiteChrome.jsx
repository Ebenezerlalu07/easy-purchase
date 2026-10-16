"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteChrome({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <>
            {!isAdmin && <Navbar />}
            {children}
            {!isAdmin && <Footer />}
        </>
    );
}
