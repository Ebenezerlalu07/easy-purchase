"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

const CART_STORAGE_KEY = "toprange_cart";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [cart, setCart] = useState([]);

    const readCart = () => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (!savedCart) {
                setCart([]);
                return;
            }

            const parsedCart = JSON.parse(savedCart);
            setCart(Array.isArray(parsedCart) ? parsedCart : []);
        } catch {
            setCart([]);
        }
    };

    useEffect(() => {
        readCart();

        const handleStorage = (event) => {
            if (event.key === CART_STORAGE_KEY) readCart();
        };

        const handleCartUpdate = () => readCart();

        window.addEventListener("storage", handleStorage);
        window.addEventListener("toprange-cart-updated", handleCartUpdate);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("toprange-cart-updated", handleCartUpdate);
        };
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [menuOpen]);

    const cartCount = useMemo(
        () =>
            cart.reduce(
                (total, item) => total + Number(item?.quantity || 1),
                0,
            ),
        [cart],
    );

    const isActive = (href) =>
        pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return (
        <>
            <header className="fixed left-0 top-0 z-[1000] w-full px-4 pt-4 md:px-7">
                <nav className="mx-auto flex max-w-[1450px] items-center justify-between rounded-full border border-white/10 bg-[#101411] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,.18)] md:px-5">
                    <Link
                        href="/"
                        aria-label="Top Range Building Materials"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center"
                    >
                        <img
                            src="/Assets/Logo.png"
                            alt="Top Range Building Materials"
                            width="160"
                            height="40"
                            loading="eager"
                            decoding="async"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`rounded-full px-5 py-2.5 text-sm font-medium ${isActive(item.href)
                                        ? "bg-white/10 text-white"
                                        : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/cart"
                            aria-label="Open cart"
                            className="relative hidden h-[46px] items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-semibold text-white hover:bg-white hover:text-[#101411] md:flex"
                        >
                            <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                            <span>Cart</span>

                            {cartCount > 0 && (
                                <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#D8FF65] px-1.5 text-[10px] font-bold text-[#101411]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            aria-expanded={menuOpen}
                            aria-controls="mobileNavigation"
                            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                            onClick={() => setMenuOpen((previous) => !previous)}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white lg:hidden"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </header>

            {menuOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 z-[998] bg-black/65 lg:hidden"
                    />

                    <div
                        id="mobileNavigation"
                        className="fixed left-4 right-4 top-[84px] z-[1001] overflow-hidden rounded-[26px] border border-white/10 bg-[#101411] shadow-[0_18px_45px_rgba(0,0,0,.28)] md:left-7 md:right-7 lg:hidden"
                    >
                        <div className="p-4 sm:p-5">
                            <div className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.035]">
                                {navItems.map((item, index) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`flex w-full items-center justify-between px-5 py-4 text-[15px] font-medium ${index !== navItems.length - 1
                                                ? "border-b border-white/[0.08]"
                                                : ""
                                            } ${isActive(item.href)
                                                ? "bg-white/[0.05] text-[#D8FF65]"
                                                : "text-white/75"
                                            }`}
                                    >
                                        <span>{item.name}</span>
                                        <span className="text-white/35">→</span>
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href="/cart"
                                onClick={() => setMenuOpen(false)}
                                className="mt-3 flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-4 text-sm font-semibold text-white"
                            >
                                <span className="flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4" />
                                    Cart
                                </span>

                                {cartCount > 0 && (
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D8FF65] px-1.5 text-[10px] font-bold text-black">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
