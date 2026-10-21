"use client";



import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

import { ArrowUpRight, ChevronRight, Menu, ShoppingBag, X } from "lucide-react";



const CART_STORAGE_KEY = "toprange_cart";



const navItems = [

    { name: "Home", href: "/" },

    { name: "Contact", href: "/contact" },

];



export default function Navbar() {

    const pathname = usePathname();

    const router = useRouter();

    useEffect(() => {
        router.prefetch("/");
        router.prefetch("/contact");
        router.prefetch("/cart");
    }, [router]);

    const [menuOpen, setMenuOpen] = useState(false);

    const [cart, setCart] = useState([]);



    const isActive = (href) => pathname === href;



    useEffect(() => {

        const readCart = () => {

            try {

                const savedCart = localStorage.getItem(CART_STORAGE_KEY);

                const parsedCart = savedCart ? JSON.parse(savedCart) : [];

                setCart(Array.isArray(parsedCart) ? parsedCart : []);

            } catch (error) {

                console.error("Unable to read cart:", error);

                setCart([]);

            }

        };



        const handleStorage = (event) => {

            if (event.key === CART_STORAGE_KEY) readCart();

        };



        readCart();

        window.addEventListener("storage", handleStorage);

        window.addEventListener("toprange-cart-updated", readCart);



        return () => {

            window.removeEventListener("storage", handleStorage);

            window.removeEventListener("toprange-cart-updated", readCart);

        };

    }, []);



    const cartCount = useMemo(

        () => cart.reduce((total, item) => total + Number(item.quantity || 1), 0),

        [cart],

    );



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



    useEffect(() => {

        setMenuOpen(false);

    }, [pathname]);



    const navigateMobile = (href) => {

        setMenuOpen(false);

        router.push(href);

    };



    return (

        <>

            <header

                id="siteHeader"

                className="fixed left-0 top-0 z-[1000] w-full px-4 md:px-7"

                style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}

            >

                <nav className="mx-auto flex max-w-[1450px] items-center justify-between rounded-full border border-white/10 bg-[#101411] px-4 py-3 md:px-5">

                    <Link

                        href="/"

                        prefetch={true}

                        aria-label="Easy Purchase"

                        onClick={() => setMenuOpen(false)}

                        className="flex items-center"

                    >

                        <img

                            src="/Assets/Logo.png"

                            alt="Easy Purchase"

                            width="160"

                            height="40"

                            loading="eager"

                            decoding="async"

                            className="h-10 w-auto object-contain"

                        />

                    </Link>



                    {/* Desktop navigation */}

                    <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#171C18] p-1 lg:flex">

                        {navItems.map((item) => (

                            <Link

                                key={item.name}

                                href={item.href}

                                prefetch={true}

                                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium ${isActive(item.href)

                                    ? "bg-[#242B25] text-white"

                                    : "text-white/75 hover:bg-[#202621] hover:text-white"

                                    }`}

                            >

                                <span>{item.name}</span>

                                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />

                            </Link>

                        ))}

                    </div>



                    <div className="flex items-center gap-2">

                        {/* Desktop and tablet cart */}

                        <Link

                            href="/cart"

                            prefetch={true}

                            aria-label="Open cart"

                            className="relative hidden h-[46px] items-center gap-2.5 rounded-full border border-white/15 bg-[#171C18] px-5 text-sm font-semibold text-white hover:bg-white hover:text-[#101411] md:flex"

                        >

                            <ShoppingBag className="h-4 w-4" strokeWidth={2} />

                            <span>Cart</span>

                            {cartCount > 0 && (

                                <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#D8FF65] px-1.5 text-[10px] font-bold text-[#101411]">

                                    {cartCount}

                                </span>

                            )}

                        </Link>



                        {/* Mobile/tablet menu toggle */}

                        <button

                            type="button"

                            aria-expanded={menuOpen}

                            aria-controls="mobileNavigation"

                            aria-label={menuOpen ? "Close navigation" : "Open navigation"}

                            onClick={() => setMenuOpen((previous) => !previous)}

                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#171C18] text-white lg:hidden"

                        >

                            {menuOpen ? <X size={20} /> : <Menu size={20} />}

                        </button>

                    </div>

                </nav>

            </header>



            {/* Mobile navigation */}

            {menuOpen && (

                <>

                    <button

                        type="button"

                        aria-label="Close navigation"

                        onClick={() => setMenuOpen(false)}

                        className="fixed inset-0 z-[998] bg-black/60 lg:hidden"

                    />



                    <div

                        id="mobileNavigation"

                        className="fixed left-4 right-4 top-[84px] z-[1001] overflow-hidden rounded-[28px] border border-white/10 bg-[#101411] shadow-[0_20px_55px_rgba(0,0,0,.32)] md:left-7 md:right-7 lg:hidden"

                        style={{ marginTop: "env(safe-area-inset-top)" }}

                    >

                        <div className="p-4 sm:p-5">

                            <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#171C18]">

                                {navItems.map((item, index) => (

                                    <button

                                        key={item.name}

                                        type="button"

                                        onClick={() => navigateMobile(item.href)}

                                        className={`flex w-full items-center justify-between px-5 py-4 text-left text-[15px] font-medium ${index !== navItems.length - 1 ? "border-b border-white/10" : ""

                                            } ${isActive(item.href)

                                                ? "bg-[#1B211C] text-[#D8FF65]"

                                                : "text-white/80"

                                            }`}

                                    >

                                        <span>{item.name}</span>

                                        <span

                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive(item.href)

                                                ? "bg-[#D8FF65] text-[#101411]"

                                                : "bg-[#202621] text-white/60"

                                                }`}

                                        >

                                            <ChevronRight className="h-4 w-4" />

                                        </span>

                                    </button>

                                ))}

                            </div>



                            {/* Mobile cart – no language controls */}

                            <button

                                type="button"

                                onClick={() => navigateMobile("/cart")}

                                className="mt-3 flex w-full items-center justify-between rounded-[18px] border border-white/10 bg-[#171C18] px-4 py-4 text-sm font-semibold text-white"

                            >

                                <span className="flex items-center gap-2">

                                    <ShoppingBag className="h-4 w-4" />

                                    <span>Cart</span>

                                </span>

                                {cartCount > 0 ? (

                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D8FF65] px-1.5 text-[10px] font-bold text-[#101411]">

                                        {cartCount}

                                    </span>

                                ) : (

                                    <ChevronRight className="h-4 w-4 text-white/60" />

                                )}

                            </button>

                        </div>

                    </div>

                </>

            )}

        </>

    );

}
