"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    Check,
    ChevronDown,
    Globe2,
    Menu,
    ShoppingBag,
    X,
} from "lucide-react";

const CART_STORAGE_KEY = "toprange_cart";
const LANGUAGE_STORAGE_KEY = "toprange_language";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
];

const languages = [
    { name: "English", native: "English", code: "en" },
    { name: "Hindi", native: "हिन्दी", code: "hi" },
    { name: "Urdu", native: "اردو", code: "ur" },
    { name: "Telugu", native: "తెలుగు", code: "te" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
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

        const savedCode = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
        const savedLanguage =
            languages.find((language) => language.code === savedCode) || languages[0];
        setSelectedLanguage(savedLanguage);

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
        setLanguageOpen(false);
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

    const initGoogleTranslate = () => {
        if (!window.google?.translate?.TranslateElement) return false;

        const host = document.getElementById("google_translate_element");

        if (host && !host.dataset.initialized) {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,hi,ur,te",
                    autoDisplay: false,
                },
                "google_translate_element",
            );

            host.dataset.initialized = "true";
        }

        return true;
    };

    const loadGoogleTranslate = () =>
        new Promise((resolve, reject) => {
            if (initGoogleTranslate()) {
                resolve(true);
                return;
            }

            const existingScript = document.getElementById("google-translate-script");

            if (existingScript) {
                existingScript.addEventListener(
                    "load",
                    () => resolve(initGoogleTranslate()),
                    { once: true },
                );
                existingScript.addEventListener("error", reject, { once: true });
                return;
            }

            window.topRangeGoogleTranslateInit = () => {
                resolve(initGoogleTranslate());
            };

            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
                "https://translate.google.com/translate_a/element.js?cb=topRangeGoogleTranslateInit";
            script.async = true;
            script.defer = true;
            script.onerror = reject;
            document.body.appendChild(script);
        });

    const setGoogleLanguage = async (code) => {
        try {
            await loadGoogleTranslate();

            for (let attempt = 0; attempt < 10; attempt += 1) {
                const combo = document.querySelector(".goog-te-combo");

                if (combo) {
                    combo.value = code;
                    combo.dispatchEvent(new Event("change", { bubbles: true }));
                    return;
                }

                await new Promise((resolve) => window.setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error("Google Translate failed to load:", error);
        }
    };

    const changeLanguage = async (language) => {
        setSelectedLanguage(language);
        setLanguageOpen(false);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);

        // Keep normal English browsing instant. Google Translate is loaded only
        // when translation is actually needed, or when reverting an active
        // translated session back to English.
        if (language.code === "en") {
            const combo = document.querySelector(".goog-te-combo");

            if (!combo) return;

            combo.value = "en";
            combo.dispatchEvent(new Event("change", { bubbles: true }));
            return;
        }

        await setGoogleLanguage(language.code);
    };

    return (
        <>
            {/* Hide Google Translate's injected banners, tooltips and overlays.
          This is CSS-only: no MutationObserver, polling interval or DOM watcher. */}
            <style jsx global>{`
        html,
        body {
          top: 0 !important;
        }

        body > .skiptranslate,
        iframe.goog-te-banner-frame,
        iframe.skiptranslate,
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-te-spinner-pos,
        .goog-te-gadget-icon,
        .goog-te-menu-frame {
          display: none !important;
          visibility: hidden !important;
        }

        iframe.goog-te-banner-frame,
        iframe.skiptranslate,
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate {
          height: 0 !important;
          min-height: 0 !important;
          border: 0 !important;
        }

        .goog-text-highlight {
          background: transparent !important;
          box-shadow: none !important;
        }

        #google_translate_element {
          position: fixed !important;
          left: -99999px !important;
          top: -99999px !important;
          width: 1px !important;
          height: 1px !important;
          overflow: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>

            <div
                id="google_translate_element"
                className="fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden opacity-0 pointer-events-none"
                aria-hidden="true"
            />

            <header
                id="siteHeader"
                className="fixed left-0 top-0 z-[1000] w-full px-4 md:px-7"
                style={{
                    paddingTop: "max(16px, env(safe-area-inset-top))",
                }}
            >
                <nav className="mx-auto flex max-w-[1450px] items-center justify-between rounded-full border border-white/10 bg-[#101411] px-4 py-3 md:px-5">
                    <Link
                        href="/"
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

                    <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#171C18] p-1 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium ${isActive(item.href)
                                        ? "bg-[#242B25] text-white"
                                        : "text-white/75 hover:bg-[#202621] hover:text-white"
                                    }`}
                            >
                                <span>{item.name}</span>

                                <ArrowUpRight
                                    className="h-3.5 w-3.5"
                                    strokeWidth={2}
                                />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/cart"
                            aria-label="Open cart"
                            className="relative hidden h-[46px] items-center gap-2.5 rounded-full border border-white/15 bg-[#171C18] px-5 text-sm font-semibold text-white hover:bg-white hover:text-[#101411] md:flex"
                        >
                            <ShoppingBag
                                className="h-4 w-4"
                                strokeWidth={2}
                            />

                            <span>Cart</span>

                            {cartCount > 0 && (
                                <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#D8FF65] px-1.5 text-[10px] font-bold text-[#101411]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="relative hidden md:block">
                            <button
                                type="button"
                                aria-label="Select language"
                                aria-expanded={languageOpen}
                                onClick={() =>
                                    setLanguageOpen((previous) => !previous)
                                }
                                className="flex h-[46px] items-center gap-2 rounded-full bg-[#D8FF65] px-5 text-sm font-semibold text-[#101411]"
                            >
                                <Globe2
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                />

                                <span>{selectedLanguage.name}</span>

                                <ChevronDown
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                />
                            </button>

                            {languageOpen && (
                                <div className="absolute right-0 top-[calc(100%+12px)] z-[1100] w-[230px] overflow-hidden rounded-[22px] border border-black/[0.07] bg-[#F4F5EF] p-2 text-[#101411] shadow-[0_18px_45px_rgba(0,0,0,.22)]">
                                    {languages.map((language) => {
                                        const active =
                                            selectedLanguage.code === language.code;

                                        return (
                                            <button
                                                key={language.code}
                                                type="button"
                                                onClick={() =>
                                                    changeLanguage(language)
                                                }
                                                className={`flex w-full items-center justify-between rounded-[14px] px-3.5 py-3 text-left ${active
                                                        ? "bg-[#D8FF65]"
                                                        : "hover:bg-white"
                                                    }`}
                                            >
                                                <div>
                                                    <p className="text-[12px] font-semibold">
                                                        {language.name}
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-[#687069]">
                                                        {language.native}
                                                    </p>
                                                </div>

                                                {active && (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#101411] text-[#D8FF65]">
                                                        <Check className="h-3.5 w-3.5" />
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            aria-expanded={menuOpen}
                            aria-controls="mobileNavigation"
                            aria-label={
                                menuOpen
                                    ? "Close navigation"
                                    : "Open navigation"
                            }
                            onClick={() => {
                                setMenuOpen((previous) => !previous);
                                setLanguageOpen(false);
                            }}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#171C18] text-white lg:hidden"
                        >
                            {menuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
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

                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive(item.href)
                                                ? "bg-[#D8FF65] text-[#101411]"
                                                : "bg-white/[0.08] text-white"
                                                }`}
                                        >
                                            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <Link
                                    href="/cart"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-4 text-sm font-semibold text-white"
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

                                <button
                                    type="button"
                                    onClick={() => setLanguageOpen((previous) => !previous)}
                                    className="flex items-center justify-between rounded-[18px] bg-[#D8FF65] px-4 py-4 text-sm font-semibold text-[#101411]"
                                >
                                    <span className="flex items-center gap-2">
                                        <Globe2 className="h-4 w-4" />
                                        <span className="truncate">{selectedLanguage.name}</span>
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>

                            {languageOpen && (
                                <div className="mt-2 grid grid-cols-2 gap-2 rounded-[20px] border border-white/[0.08] bg-white/[0.035] p-2">
                                    {languages.map((language) => {
                                        const active = selectedLanguage.code === language.code;

                                        return (
                                            <button
                                                key={language.code}
                                                type="button"
                                                onClick={() => changeLanguage(language)}
                                                className={`flex items-center justify-between rounded-[14px] px-4 py-3 text-left ${active
                                                    ? "bg-[#D8FF65] text-[#101411]"
                                                    : "bg-white/[0.06] text-white"
                                                    }`}
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-[12px] font-semibold">
                                                        {language.name}
                                                    </p>
                                                    <p
                                                        className={`mt-0.5 truncate text-[10px] ${active ? "text-[#596159]" : "text-white/55"
                                                            }`}
                                                    >
                                                        {language.native}
                                                    </p>
                                                </div>

                                                {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
