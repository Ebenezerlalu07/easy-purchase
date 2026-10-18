"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
    ArrowUpRight,
    Check,
    ChevronDown,
    ChevronRight,
    Globe2,
    Menu,
    ShoppingBag,
    X,
} from "lucide-react";

const CART_STORAGE_KEY = "toprange_cart";
const LANGUAGE_STORAGE_KEY = "easy_purchase_language";

const languages = [
    {
        name: "English",
        native: "English",
        code: "en",
    },
    {
        name: "Hindi",
        native: "हिन्दी",
        code: "hi",
    },
    {
        name: "Urdu",
        native: "اردو",
        code: "ur",
    },
    {
        name: "Telugu",
        native: "తెలుగు",
        code: "te",
    },
];

const navItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Contact",
        href: "/contact",
    },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);

    const [cart, setCart] = useState([]);

    const [languageOpen, setLanguageOpen] =
        useState(false);

    const [selectedLanguage, setSelectedLanguage] =
        useState(languages[0]);

    /* =========================================================
       ACTIVE LINK
    ========================================================= */

    const isActive = (href) => {
        return pathname === href;
    };

    /* =========================================================
       CART
    ========================================================= */

    const readCart = () => {
        try {
            const savedCart =
                localStorage.getItem(CART_STORAGE_KEY);

            if (!savedCart) {
                setCart([]);
                return;
            }

            const parsedCart = JSON.parse(savedCart);

            if (Array.isArray(parsedCart)) {
                setCart(parsedCart);
            } else {
                setCart([]);
            }
        } catch (error) {
            console.error(
                "Unable to read cart:",
                error,
            );

            setCart([]);
        }
    };

    useEffect(() => {
        readCart();

        const handleStorage = (event) => {
            if (
                event.key === CART_STORAGE_KEY
            ) {
                readCart();
            }
        };

        const handleCartUpdated = () => {
            readCart();
        };

        window.addEventListener(
            "storage",
            handleStorage,
        );

        window.addEventListener(
            "toprange-cart-updated",
            handleCartUpdated,
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage,
            );

            window.removeEventListener(
                "toprange-cart-updated",
                handleCartUpdated,
            );
        };
    }, []);

    const cartCount = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 1),
            0,
        );
    }, [cart]);

    /* =========================================================
       GOOGLE TRANSLATE
       Loads only when required.
       No permanent interval.
       No MutationObserver.
    ========================================================= */

    const hideGoogleTranslateUi = () => {
        document.documentElement.style.top =
            "0px";

        document.body.style.top = "0px";
    };

    const initializeGoogleTranslate = () => {
        if (
            !window.google?.translate
                ?.TranslateElement
        ) {
            return false;
        }

        const host =
            document.getElementById(
                "google_translate_element",
            );

        if (
            host &&
            !host.dataset.initialized
        ) {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",

                    includedLanguages:
                        "en,hi,ur,te",

                    autoDisplay: false,
                },

                "google_translate_element",
            );

            host.dataset.initialized =
                "true";
        }

        hideGoogleTranslateUi();

        return true;
    };

    const loadGoogleTranslate = () => {
        return new Promise(
            (resolve, reject) => {
                if (
                    initializeGoogleTranslate()
                ) {
                    resolve(true);
                    return;
                }

                const existingScript =
                    document.getElementById(
                        "google-translate-script",
                    );

                let finished = false;

                const complete = () => {
                    if (finished) {
                        return;
                    }

                    finished = true;

                    if (
                        initializeGoogleTranslate()
                    ) {
                        resolve(true);
                    } else {
                        reject(
                            new Error(
                                "Google Translate failed to initialize.",
                            ),
                        );
                    }
                };

                window.easyPurchaseTranslateInit =
                    complete;

                if (existingScript) {
                    existingScript.addEventListener(
                        "load",
                        complete,
                        {
                            once: true,
                        },
                    );

                    return;
                }

                const script =
                    document.createElement(
                        "script",
                    );

                script.id =
                    "google-translate-script";

                script.src =
                    "https://translate.google.com/translate_a/element.js?cb=easyPurchaseTranslateInit";

                script.async = true;
                script.defer = true;

                script.onerror = () => {
                    reject(
                        new Error(
                            "Google Translate failed to load.",
                        ),
                    );
                };

                document.body.appendChild(
                    script,
                );
            },
        );
    };

    const applyLanguage = async (
        languageCode,
    ) => {
        if (languageCode === "en") {
            const combo =
                document.querySelector(
                    ".goog-te-combo",
                );

            if (combo) {
                combo.value = "en";

                combo.dispatchEvent(
                    new Event("change", {
                        bubbles: true,
                    }),
                );
            }

            hideGoogleTranslateUi();

            return;
        }

        try {
            await loadGoogleTranslate();

            for (
                let attempt = 0;
                attempt < 10;
                attempt += 1
            ) {
                const combo =
                    document.querySelector(
                        ".goog-te-combo",
                    );

                if (combo) {
                    combo.value =
                        languageCode;

                    combo.dispatchEvent(
                        new Event("change", {
                            bubbles: true,
                        }),
                    );

                    hideGoogleTranslateUi();

                    return;
                }

                await new Promise(
                    (resolve) =>
                        window.setTimeout(
                            resolve,
                            100,
                        ),
                );
            }
        } catch (error) {
            console.error(
                "Unable to change language:",
                error,
            );
        }
    };

    useEffect(() => {
        const savedCode =
            localStorage.getItem(
                LANGUAGE_STORAGE_KEY,
            ) || "en";

        const savedLanguage =
            languages.find(
                (language) =>
                    language.code === savedCode,
            ) || languages[0];

        setSelectedLanguage(
            savedLanguage,
        );

        if (savedCode !== "en") {
            const timer =
                window.setTimeout(() => {
                    applyLanguage(savedCode);
                }, 600);

            return () => {
                window.clearTimeout(timer);
            };
        }
    }, []);

    const changeLanguage = async (
        language,
    ) => {
        setSelectedLanguage(language);

        setLanguageOpen(false);

        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            language.code,
        );

        await applyLanguage(
            language.code,
        );
    };

    /* =========================================================
       HIDE GOOGLE UI
    ========================================================= */

    useEffect(() => {
        const styleId =
            "easy-purchase-google-hide";

        if (
            document.getElementById(
                styleId,
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id = styleId;

        style.innerHTML = `
      html,
      body {
        top: 0 !important;
      }

      body > .skiptranslate {
        display: none !important;
      }

      iframe.goog-te-banner-frame,
      iframe.skiptranslate,
      .goog-te-banner-frame,
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        min-height: 0 !important;
      }

      #goog-gt-tt,
      .goog-te-balloon-frame,
      .goog-te-spinner-pos,
      .goog-te-gadget-icon {
        display: none !important;
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
    `;

        document.head.appendChild(
            style,
        );

        hideGoogleTranslateUi();
    }, []);

    /* =========================================================
       MOBILE SCROLL LOCK
    ========================================================= */

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const handleEscape = (event) => {
            if (
                event.key === "Escape"
            ) {
                setMenuOpen(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleEscape,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleEscape,
            );
        };
    }, [menuOpen]);

    /* =========================================================
       ROUTE CHANGE
    ========================================================= */

    useEffect(() => {
        setMenuOpen(false);

        setLanguageOpen(false);
    }, [pathname]);

    const navigateMobile = (href) => {
        setMenuOpen(false);

        setLanguageOpen(false);

        router.push(href);
    };

    return (
        <>
            <div
                id="google_translate_element"
                aria-hidden="true"
                className="fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden opacity-0 pointer-events-none"
            />

            {/* ======================================================
          HEADER
      ====================================================== */}

            <header
                id="siteHeader"
                className="fixed left-0 top-0 z-[1000] w-full px-4 md:px-7"
                style={{
                    paddingTop:
                        "max(16px, env(safe-area-inset-top))",
                }}
            >
                <nav className="mx-auto flex max-w-[1450px] items-center justify-between rounded-full border border-white/10 bg-[#101411] px-4 py-3 md:px-5">
                    {/* LOGO */}

                    <Link
                        href="/"
                        aria-label="Easy Purchase"
                        onClick={() =>
                            setMenuOpen(false)
                        }
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

                    {/* DESKTOP NAV */}

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
                                <span>
                                    {item.name}
                                </span>

                                <ArrowUpRight
                                    className="h-3.5 w-3.5"
                                    strokeWidth={2}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-2">
                        {/* CART */}

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

                        {/* DESKTOP LANGUAGE */}

                        <div className="relative hidden md:block">
                            <button
                                type="button"
                                aria-label="Select language"
                                aria-expanded={
                                    languageOpen
                                }
                                onClick={() =>
                                    setLanguageOpen(
                                        (previous) =>
                                            !previous,
                                    )
                                }
                                className="flex h-[46px] items-center gap-2 rounded-full bg-[#D8FF65] px-5 text-sm font-semibold text-[#101411]"
                            >
                                <Globe2
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                />

                                <span>
                                    {
                                        selectedLanguage.name
                                    }
                                </span>

                                <ChevronDown
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                />
                            </button>

                            {languageOpen && (
                                <div className="absolute right-0 top-[calc(100%+12px)] z-[1100] w-[230px] overflow-hidden rounded-[22px] border border-black/[0.07] bg-[#F4F5EF] p-2 text-[#101411] shadow-[0_18px_45px_rgba(0,0,0,.22)]">
                                    {languages.map(
                                        (language) => {
                                            const active =
                                                selectedLanguage.code ===
                                                language.code;

                                            return (
                                                <button
                                                    key={
                                                        language.code
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        changeLanguage(
                                                            language,
                                                        )
                                                    }
                                                    className={`flex w-full items-center justify-between rounded-[14px] px-3.5 py-3 text-left ${active
                                                            ? "bg-[#D8FF65]"
                                                            : "hover:bg-white"
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="text-[12px] font-semibold">
                                                            {
                                                                language.name
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-[10px] text-[#687069]">
                                                            {
                                                                language.native
                                                            }
                                                        </p>
                                                    </div>

                                                    {active && (
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#101411] text-[#D8FF65]">
                                                            <Check className="h-3.5 w-3.5" />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </div>

                        {/* HAMBURGER */}

                        <button
                            type="button"
                            aria-expanded={
                                menuOpen
                            }
                            aria-controls="mobileNavigation"
                            aria-label={
                                menuOpen
                                    ? "Close navigation"
                                    : "Open navigation"
                            }
                            onClick={() => {
                                setMenuOpen(
                                    (previous) =>
                                        !previous,
                                );

                                setLanguageOpen(
                                    false,
                                );
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

            {/* ======================================================
          MOBILE MENU
          IMPORTANT:
          Not mounted until menuOpen === true.
      ====================================================== */}

            {menuOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="fixed inset-0 z-[998] bg-black/60 lg:hidden"
                    />

                    <div
                        id="mobileNavigation"
                        className="
              fixed
              left-4
              right-4
              top-[84px]
              z-[1001]
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#101411]
              shadow-[0_20px_55px_rgba(0,0,0,.32)]
              md:left-7
              md:right-7
              lg:hidden
            "
                        style={{
                            marginTop:
                                "env(safe-area-inset-top)",
                        }}
                    >
                        <div className="p-4 sm:p-5">
                            {/* MOBILE LINKS */}

                            <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#171C18]">
                                {navItems.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <button
                                            key={
                                                item.name
                                            }
                                            type="button"
                                            onClick={() =>
                                                navigateMobile(
                                                    item.href,
                                                )
                                            }
                                            className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        px-5
                        py-4
                        text-left
                        text-[15px]
                        font-medium

                        ${index !==
                                                    navItems.length -
                                                    1
                                                    ? "border-b border-white/10"
                                                    : ""
                                                }

                        ${isActive(
                                                    item.href,
                                                )
                                                    ? "bg-[#1B211C] text-[#D8FF65]"
                                                    : "text-white/80"
                                                }
                      `}
                                        >
                                            <span>
                                                {item.name}
                                            </span>

                                            <span
                                                className={`
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full

                          ${isActive(
                                                    item.href,
                                                )
                                                        ? "bg-[#D8FF65] text-[#101411]"
                                                        : "bg-[#202621] text-white/60"
                                                    }
                        `}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </span>
                                        </button>
                                    ),
                                )}
                            </div>

                            {/* CART + LANGUAGE */}

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigateMobile(
                                            "/cart",
                                        )
                                    }
                                    className="
                    flex
                    min-w-0
                    items-center
                    justify-between
                    rounded-[18px]
                    border
                    border-white/10
                    bg-[#171C18]
                    px-4
                    py-4
                    text-sm
                    font-semibold
                    text-white
                  "
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <ShoppingBag className="h-4 w-4 shrink-0" />

                                        <span>
                                            Cart
                                        </span>
                                    </span>

                                    {cartCount > 0 && (
                                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D8FF65] px-1.5 text-[10px] font-bold text-[#101411]">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLanguageOpen(
                                            (previous) =>
                                                !previous,
                                        )
                                    }
                                    className="
                    flex
                    min-w-0
                    items-center
                    justify-between
                    rounded-[18px]
                    bg-[#D8FF65]
                    px-4
                    py-4
                    text-sm
                    font-semibold
                    text-[#101411]
                  "
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <Globe2 className="h-4 w-4 shrink-0" />

                                        <span className="truncate">
                                            {
                                                selectedLanguage.name
                                            }
                                        </span>
                                    </span>

                                    <ChevronDown className="h-4 w-4 shrink-0" />
                                </button>
                            </div>

                            {/* MOBILE LANGUAGE OPTIONS */}

                            {languageOpen && (
                                <div className="mt-2 grid grid-cols-2 gap-2 rounded-[20px] border border-white/10 bg-[#171C18] p-2">
                                    {languages.map(
                                        (language) => {
                                            const active =
                                                selectedLanguage.code ===
                                                language.code;

                                            return (
                                                <button
                                                    key={
                                                        language.code
                                                    }
                                                    type="button"
                                                    onClick={async () => {
                                                        await changeLanguage(
                                                            language,
                                                        );

                                                        setMenuOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`rounded-[15px] px-4 py-3 text-left ${active
                                                            ? "bg-[#D8FF65] text-[#101411]"
                                                            : "bg-[#202621] text-white"
                                                        }`}
                                                >
                                                    <p className="truncate text-[12px] font-semibold">
                                                        {
                                                            language.name
                                                        }
                                                    </p>

                                                    <p
                                                        className={`mt-0.5 truncate text-[10px] ${active
                                                                ? "text-[#596159]"
                                                                : "text-white/55"
                                                            }`}
                                                    >
                                                        {
                                                            language.native
                                                        }
                                                    </p>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}