"use client";



import Link from "next/link";

import {

    usePathname,

    useRouter,

} from "next/navigation";



import {

    useEffect,

    useMemo,

    useState,

} from "react";



import {

    ArrowRight,

    ArrowUpRight,

    Check,

    ChevronDown,

    ChevronRight,

    Globe2,

    Menu,

    ShoppingBag,

    Trash2,

    X,

} from "lucide-react";



const CART_STORAGE_KEY = "toprange_cart";

const LANGUAGE_STORAGE_KEY = "toprange_language";

const languages = [
    { name: "English", native: "English", code: "en" },
    { name: "Hindi", native: "हिन्दी", code: "hi" },
    { name: "Urdu", native: "اردو", code: "ur" },
    { name: "Telugu", native: "తెలుగు", code: "te" },
];



/* =========================================================

   NAV ITEMS

========================================================= */



const navItems = [
    /*
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About",
        href: "/about",
    },
    */


    {

        name: "Products",

        href: "/products",

    },

    {

        name: "Contact",

        href: "/contact",

    },

];



/* =========================================================

   NAVBAR

========================================================= */



export default function Navbar() {

    const pathname = usePathname();

    const router = useRouter();



    const [menuOpen, setMenuOpen] = useState(false);



    const [cartOpen, setCartOpen] = useState(false);



    const [cart, setCart] = useState([]);

    const [languageOpen, setLanguageOpen] =
        useState(false);

    const [selectedLanguage, setSelectedLanguage] =
        useState(languages[0]);



    /* =========================================================
       LANGUAGE TRANSLATION
    ========================================================= */

    useEffect(() => {
        const savedCode =
            localStorage.getItem(
                LANGUAGE_STORAGE_KEY
            ) || "en";

        const savedLanguage =
            languages.find(
                (language) =>
                    language.code === savedCode
            ) || languages[0];

        setSelectedLanguage(savedLanguage);

        const applySavedLanguage = () => {
            let attempts = 0;

            const timer = window.setInterval(() => {
                const combo =
                    document.querySelector(
                        ".goog-te-combo"
                    );

                if (combo) {
                    combo.value = savedCode;
                    combo.dispatchEvent(
                        new Event("change")
                    );

                    window.clearInterval(timer);
                    return;
                }

                attempts += 1;

                if (attempts >= 30) {
                    window.clearInterval(timer);
                }
            }, 150);
        };

        window.topRangeGoogleTranslateInit =
            () => {
                if (
                    !window.google?.translate
                        ?.TranslateElement
                ) {
                    return;
                }

                const host =
                    document.getElementById(
                        "google_translate_element"
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
                        "google_translate_element"
                    );

                    host.dataset.initialized =
                        "true";
                }

                applySavedLanguage();
            };

        if (
            window.google?.translate
                ?.TranslateElement
        ) {
            window.topRangeGoogleTranslateInit();
        } else if (
            !document.getElementById(
                "google-translate-script"
            )
        ) {
            const script =
                document.createElement("script");

            script.id =
                "google-translate-script";

            script.src =
                "https://translate.google.com/translate_a/element.js?cb=topRangeGoogleTranslateInit";

            script.async = true;

            document.body.appendChild(script);
        }
    }, []);

    const changeLanguage = (language) => {
        setSelectedLanguage(language);
        setLanguageOpen(false);

        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            language.code
        );

        let attempts = 0;

        const timer = window.setInterval(() => {
            const combo =
                document.querySelector(
                    ".goog-te-combo"
                );

            if (combo) {
                combo.value = language.code;
                combo.dispatchEvent(
                    new Event("change")
                );

                window.clearInterval(timer);
                return;
            }

            attempts += 1;

            if (attempts >= 30) {
                window.clearInterval(timer);
            }
        }, 100);
    };

    /* =========================================================
       HIDE GOOGLE TRANSLATE CONTROLS / TOP BANNER
    ========================================================= */

    useEffect(() => {
        const styleId =
            "toprange-google-translate-hide";

        if (!document.getElementById(styleId)) {
            const style =
                document.createElement("style");

            style.id = styleId;

            style.innerHTML = `
                html,
                body {
                    top: 0 !important;
                }

                body {
                    position: static !important;
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

            document.head.appendChild(style);
        }

        const hideTranslateUi = () => {
            document.documentElement.style.top =
                "0px";

            document.body.style.top = "0px";

            [
                "iframe.goog-te-banner-frame",
                "iframe.skiptranslate",
                ".goog-te-banner-frame",
                ".goog-te-banner-frame.skiptranslate",
            ].forEach((selector) => {
                document
                    .querySelectorAll(selector)
                    .forEach((element) => {
                        element.style.display =
                            "none";

                        element.style.visibility =
                            "hidden";

                        element.style.height =
                            "0px";
                    });
            });

            document
                .querySelectorAll(
                    "body > .skiptranslate"
                )
                .forEach((element) => {
                    if (
                        element.id !==
                        "google_translate_element"
                    ) {
                        element.style.display =
                            "none";
                    }
                });
        };

        hideTranslateUi();

        const observer =
            new MutationObserver(() => {
                hideTranslateUi();
            });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        const interval =
            window.setInterval(
                hideTranslateUi,
                500
            );

        return () => {
            observer.disconnect();

            window.clearInterval(interval);
        };
    }, []);


    /* =========================================================

       ACTIVE LINK

    ========================================================= */



    const isActive = (href) => {

        if (href === "/") {

            return pathname === "/";

        }



        return (

            pathname === href ||

            pathname.startsWith(`${href}/`)

        );

    };



    /* =========================================================

       CLOSE MOBILE MENU

    ========================================================= */



    const closeMenu = () => {

        setMenuOpen(false);

    };



    /* =========================================================

       MOBILE NAVIGATION



       Using router.push prevents problems where another

       fixed/animated layer intercepts the mobile Link.

    ========================================================= */



    const handleMobileNavigate = (href) => {

        setMenuOpen(false);



        setCartOpen(false);



        /*

         \* If already on same page,

         \* just scroll back to the top.

         */

        if (pathname === href) {

            window.scrollTo({

                top: 0,

                behavior: "smooth",

            });



            return;

        }



        router.push(href);

    };



    /* =========================================================

       READ SHARED CART

    ========================================================= */



    const readCart = () => {

        try {

            const savedCart =

                localStorage.getItem(

                    CART_STORAGE_KEY

                );



            if (!savedCart) {

                setCart([]);



                return;

            }



            const parsedCart =

                JSON.parse(savedCart);



            if (Array.isArray(parsedCart)) {

                setCart(parsedCart);

            } else {

                setCart([]);

            }

        } catch (error) {

            console.error(

                "Unable to read cart:",

                error

            );



            setCart([]);

        }

    };



    /* =========================================================

       CART LISTENERS

    ========================================================= */



    useEffect(() => {

        readCart();



        const handleStorage = (

            event

        ) => {

            if (

                event.key ===

                CART_STORAGE_KEY

            ) {

                readCart();

            }

        };



        const handleCartUpdate =

            () => {

                readCart();

            };



        window.addEventListener(

            "storage",

            handleStorage

        );



        window.addEventListener(

            "toprange-cart-updated",

            handleCartUpdate

        );



        return () => {

            window.removeEventListener(

                "storage",

                handleStorage

            );



            window.removeEventListener(

                "toprange-cart-updated",

                handleCartUpdate

            );

        };

    }, []);



    /* =========================================================

       CLOSE MENUS AFTER ROUTE CHANGE

    ========================================================= */



    useEffect(() => {

        setCartOpen(false);

        setMenuOpen(false);

        setLanguageOpen(false);

    }, [pathname]);



    /* =========================================================

       MOBILE BODY SCROLL LOCK

    ========================================================= */



    useEffect(() => {

        if (!menuOpen) {

            return;

        }



        const previousOverflow =

            document.body.style.overflow;



        document.body.style.overflow =

            "hidden";



        const handleEscape = (

            event

        ) => {

            if (event.key === "Escape") {

                setMenuOpen(false);

            }

        };



        window.addEventListener(

            "keydown",

            handleEscape

        );



        return () => {

            document.body.style.overflow =

                previousOverflow;



            window.removeEventListener(

                "keydown",

                handleEscape

            );

        };

    }, [menuOpen]);



    /* =========================================================

       CART COUNT

    ========================================================= */



    const cartCount =

        useMemo(() => {

            return cart.reduce(

                (total, item) =>

                    total +

                    Number(

                        item.quantity || 1

                    ),

                0

            );

        }, [cart]);



    /* =========================================================

       CART TOTAL

    ========================================================= */



    const cartTotal =

        useMemo(() => {

            return cart.reduce(

                (total, item) =>

                    total +

                    Number(

                        item.price || 0

                    ) *

                    Number(

                        item.quantity || 1

                    ),

                0

            );

        }, [cart]);



    /* =========================================================

       REMOVE PRODUCT

    ========================================================= */



    const removeProduct = (

        id

    ) => {

        const updatedCart =

            cart.filter(

                (item) =>

                    item.id !== id

            );



        setCart(updatedCart);



        localStorage.setItem(

            CART_STORAGE_KEY,

            JSON.stringify(

                updatedCart

            )

        );



        window.dispatchEvent(

            new Event(

                "toprange-cart-updated"

            )

        );

    };



    return (

        <>
            <div
                id="google_translate_element"
                className="fixed -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
                aria-hidden="true"
            />

            {/* =====================================================

          NAVBAR

      ====================================================== */}



            <header

                id="siteHeader"

                className="

          fixed

          left-0

          top-0

          z-[1000]

          w-full

          px-4

          pt-4

          md:px-7

        "

            >

                <nav

                    id="mainNavbar"

                    className="

            relative

            z-[1002]

            mx-auto

            flex

            max-w-[1450px]

            items-center

            justify-between

            rounded-full

            border

            border-white/15

            bg-black/25

            px-4

            py-3

            shadow-2xl

            backdrop-blur-xl

            md:px-5

          "

                >

                    {/* =================================================

              LOGO

          ================================================== */}



                    <Link

                        href="/"

                        aria-label="Top Range home"

                        onClick={() => {

                            closeMenu();



                            setCartOpen(false);

                        }}

                        className="

              relative

              z-10

              flex

              items-center

              gap-3

              text-white

            "

                    >

                        <div className="flex h-10 items-center">

                            <img

                                src="/Assets/Logo.png"

                                alt="Top Range Building Materials"

                                className="

                  h-10

                  w-auto

                  object-contain

                "

                            />

                        </div>

                    </Link>



                    {/* =================================================

              DESKTOP NAVIGATION

          ================================================== */}



                    <div

                        className="

              absolute

              left-1/2

              hidden

              -translate-x-1/2

              items-center

              gap-1

              rounded-full

              border

              border-white/10

              bg-white/10

              p-1

              backdrop-blur-xl

              lg:flex

            "

                    >

                        {navItems.map(

                            (item) => (

                                <Link

                                    key={

                                        item.name

                                    }

                                    href={

                                        item.href

                                    }

                                    className={`

                    nav-link

                    rounded-full

                    px-5

                    py-2.5

                    text-sm

                    font-medium

                    transition-all

                    duration-300



                    ${isActive(

                                        item.href

                                    )

                                            ? "active1 bg-white/10 text-white"

                                            : "text-white/75 hover:bg-white/[0.06] hover:text-white"

                                        }

                  `}

                                >

                                    {

                                        item.name

                                    }

                                </Link>

                            )

                        )}

                    </div>



                    {/* =================================================

              RIGHT

          ================================================== */}



                    <div

                        className="

              relative

              z-10

              flex

              items-center

              gap-2

            "

                    >

                        {/* =================================================

                DESKTOP CART

            ================================================== */}



                        <div className="relative hidden md:block">

                            <button

                                type="button"

                                aria-label="Open cart"

                                aria-expanded={

                                    cartOpen

                                }

                                onClick={() => {

                                    setCartOpen(

                                        (

                                            previous

                                        ) =>

                                            !previous

                                    );



                                    setMenuOpen(

                                        false

                                    );

                                }}

                                className={`

                  group

                  relative

                  flex

                  h-[46px]

                  items-center

                  gap-2.5

                  rounded-full

                  border

                  px-5

                  text-sm

                  font-semibold

                  backdrop-blur-xl

                  transition-all

                  duration-300



                  ${cartOpen

                                        ? "border-white bg-white text-[#101411]"

                                        : "border-white/15 bg-white/10 text-white hover:bg-white hover:text-[#101411]"

                                    }

                `}

                            >

                                <ShoppingBag

                                    size={

                                        16

                                    }

                                    strokeWidth={

                                        2

                                    }

                                />



                                <span>

                                    Cart

                                </span>



                                {cartCount >

                                    0 && (

                                        <span

                                            className="

                      flex

                      h-[22px]

                      min-w-[22px]

                      items-center

                      justify-center

                      rounded-full

                      bg-[#D8FF65]

                      px-1.5

                      text-[10px]

                      font-bold

                      text-[#101411]

                    "

                                        >

                                            {

                                                cartCount

                                            }

                                        </span>

                                    )}

                            </button>



                            {/* =============================================

                  CART DROPDOWN

              ============================================== */}



                            {cartOpen && (

                                <div

                                    className="

                    absolute

                    right-0

                    top-[calc(100%+14px)]

                    z-[1100]

                    w-[390px]

                    overflow-hidden

                    rounded-[28px]

                    border

                    border-black/[0.07]

                    bg-[#F4F5EF]

                    text-[#101411]

                    shadow-[0_30px_100px_rgba(0,0,0,.25)]

                  "

                                >

                                    {/* Header */}



                                    <div

                                        className="

                      flex

                      items-center

                      justify-between

                      border-b

                      border-black/[0.07]

                      px-5

                      py-5

                    "

                                    >

                                        <div>

                                            <p

                                                className="

                          text-[9px]

                          font-semibold

                          uppercase

                          tracking-[0.17em]

                          text-[#6A716B]

                        "

                                            >

                                                Product

                                                Enquiry

                                            </p>



                                            <h3

                                                className="

                          mt-1

                          text-[20px]

                          font-semibold

                          tracking-[-0.025em]

                        "

                                            >

                                                Your

                                                Cart

                                            </h3>

                                        </div>



                                        <button

                                            type="button"

                                            aria-label="Close cart"

                                            onClick={() =>

                                                setCartOpen(

                                                    false

                                                )

                                            }

                                            className="

                        flex

                        h-9

                        w-9

                        items-center

                        justify-center

                        rounded-full

                        bg-white

                        transition

                        hover:bg-[#101411]

                        hover:text-white

                      "

                                        >

                                            <X

                                                className="

                          h-3.5

                          w-3.5

                        "

                                            />

                                        </button>

                                    </div>



                                    {/* EMPTY */}



                                    {cart.length ===

                                        0 ? (

                                        <div

                                            className="

                        px-6

                        py-12

                        text-center

                      "

                                        >

                                            <span

                                                className="

                          mx-auto

                          flex

                          h-14

                          w-14

                          items-center

                          justify-center

                          rounded-full

                          bg-white

                        "

                                            >

                                                <ShoppingBag

                                                    className="

                            h-5

                            w-5

                            text-[#101411]

                          "

                                                />

                                            </span>



                                            <h4 className="mt-4 text-[17px] font-semibold">

                                                Your

                                                cart

                                                is

                                                empty

                                            </h4>



                                            <p

                                                className="

                          mt-2

                          text-[12px]

                          leading-5

                          text-[#686F69]

                        "

                                            >

                                                Add

                                                products

                                                from

                                                the

                                                catalogue

                                                to

                                                request

                                                a

                                                quotation.

                                            </p>



                                            <Link

                                                href="/products"

                                                onClick={() =>

                                                    setCartOpen(

                                                        false

                                                    )

                                                }

                                                className="

                          mt-5

                          inline-flex

                          items-center

                          gap-2

                          rounded-full

                          bg-[#101411]

                          px-5

                          py-3

                          text-[12px]

                          font-semibold

                          text-white

                        "

                                            >

                                                Browse

                                                Products



                                                <ArrowUpRight

                                                    className="

                            h-3.5

                            w-3.5

                          "

                                                />

                                            </Link>

                                        </div>

                                    ) : (

                                        <>

                                            {/* PRODUCTS */}



                                            <div

                                                className="

                          max-h-[390px]

                          space-y-2

                          overflow-y-auto

                          p-4

                        "

                                            >

                                                {cart.map(

                                                    (

                                                        item

                                                    ) => (

                                                        <NavbarCartItem

                                                            key={

                                                                item.id

                                                            }

                                                            item={

                                                                item

                                                            }

                                                            removeProduct={

                                                                removeProduct

                                                            }

                                                        />

                                                    )

                                                )}

                                            </div>



                                            {/* TOTAL */}



                                            <div

                                                className="

                          border-t

                          border-black/[0.07]

                          bg-white

                          p-5

                        "

                                            >

                                                <div className="flex items-center justify-between gap-5">

                                                    <div>

                                                        <p

                                                            className="

                                text-[9px]

                                font-semibold

                                uppercase

                                tracking-[0.13em]

                                text-[#707770]

                              "

                                                        >

                                                            Estimated

                                                            Total

                                                        </p>



                                                        <p

                                                            className="

                                mt-1

                                text-[22px]

                                font-bold

                                tracking-[-0.025em]

                                text-[#101411]

                              "

                                                        >

                                                            AED{" "}



                                                            {cartTotal.toLocaleString(

                                                                undefined,

                                                                {

                                                                    minimumFractionDigits:

                                                                        2,



                                                                    maximumFractionDigits:

                                                                        2,

                                                                }

                                                            )}

                                                        </p>

                                                    </div>



                                                    <span

                                                        className="

                              rounded-full

                              bg-[#F4F5EF]

                              px-3

                              py-2

                              text-[10px]

                              font-bold

                              text-[#4F5650]

                            "

                                                    >

                                                        {

                                                            cartCount

                                                        }{" "}

                                                        item

                                                        {cartCount !==

                                                            1

                                                            ? "s"

                                                            : ""}

                                                    </span>

                                                </div>



                                                <Link

                                                    href="/cart"

                                                    onClick={() =>

                                                        setCartOpen(

                                                            false

                                                        )

                                                    }

                                                    className="

                            group

                            mt-5

                            flex

                            h-[54px]

                            w-full

                            items-center

                            justify-between

                            rounded-full

                            bg-[#101411]

                            pl-6

                            pr-2

                            text-[13px]

                            font-semibold

                            text-white

                          "

                                                >

                                                    View

                                                    Cart



                                                    <span

                                                        className="

                              flex

                              h-10

                              w-10

                              items-center

                              justify-center

                              rounded-full

                              bg-[#D8FF65]

                              text-black

                              transition-transform

                              duration-300

                              group-hover:translate-x-0.5

                            "

                                                    >

                                                        <ArrowRight className="h-4 w-4" />

                                                    </span>

                                                </Link>

                                            </div>

                                        </>

                                    )}

                                </div>

                            )}

                        </div>



                        {/* =================================================
                LANGUAGE
            ================================================== */}

                        <div className="relative hidden md:block">

                            <button
                                type="button"
                                aria-expanded={languageOpen}
                                aria-label="Select language"
                                onClick={() => {
                                    setLanguageOpen(
                                        (previous) =>
                                            !previous
                                    );

                                    setCartOpen(false);
                                }}
                                className="
                group
                flex
                h-[46px]
                items-center
                gap-2
                rounded-full
                bg-[#D8FF65]
                px-5
                text-sm
                font-semibold
                text-[#101411]
                transition-all
                duration-300
                hover:scale-[1.03]
                hover:bg-white
              "
                            >
                                <Globe2
                                    size={16}
                                    strokeWidth={2}
                                />

                                <span>
                                    {selectedLanguage.name}
                                </span>

                                <ChevronDown
                                    size={15}
                                    strokeWidth={2}
                                    className={`transition-transform duration-300 ${languageOpen
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                />
                            </button>

                            {languageOpen && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Close language selector"
                                        onClick={() =>
                                            setLanguageOpen(
                                                false
                                            )
                                        }
                                        className="fixed inset-0 z-[1090] cursor-default"
                                    />

                                    <div
                                        className="
                    absolute
                    right-0
                    top-[calc(100%+14px)]
                    z-[1100]
                    w-[250px]
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-black/[0.07]
                    bg-[#F4F5EF]
                    p-2
                    text-[#101411]
                    shadow-[0_30px_100px_rgba(0,0,0,.25)]
                  "
                                    >
                                        <div className="border-b border-black/[0.07] px-3 pb-3 pt-2">
                                            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#6A716B]">
                                                Language
                                            </p>

                                            <p className="mt-1 text-[12px] font-semibold text-[#101411]">
                                                Select your language
                                            </p>
                                        </div>

                                        <div className="mt-2 space-y-1">
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
                                                                    language
                                                                )
                                                            }
                                                            className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                gap-3
                                rounded-[15px]
                                px-3
                                py-3
                                text-left
                                transition

                                ${active
                                                                    ? "bg-[#D8FF65] text-[#101411]"
                                                                    : "text-[#4F5650] hover:bg-white"
                                                                }
                              `}
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="text-[12px] font-semibold">
                                                                    {language.name}
                                                                </p>

                                                                <p className="mt-0.5 text-[10px] font-medium text-[#717871]">
                                                                    {language.native}
                                                                </p>
                                                            </div>

                                                            {active && (
                                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#101411] text-[#D8FF65]">
                                                                    <Check className="h-3.5 w-3.5" />
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>


                        {/* =================================================

                MOBILE MENU BUTTON

            ================================================== */}



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

                                    (

                                        previous

                                    ) =>

                                        !previous

                                );



                                setCartOpen(

                                    false

                                );

                            }}

                            className="

                relative

                z-[1004]

                flex

                h-11

                w-11

                items-center

                justify-center

                rounded-full

                border

                border-white/15

                bg-white/10

                text-white

                transition

                hover:bg-white/20

                lg:hidden

              "

                        >

                            {menuOpen ? (

                                <X

                                    size={

                                        20

                                    }

                                />

                            ) : (

                                <Menu

                                    size={

                                        20

                                    }

                                />

                            )}

                        </button>

                    </div>

                </nav>

            </header>



            {/* =====================================================

          MOBILE BACKDROP

      ====================================================== */}



            <button

                type="button"

                aria-label="Close navigation"

                onClick={

                    closeMenu

                }

                className={`

          fixed

          inset-0

          z-[998]

          bg-black/55

          backdrop-blur-[3px]

          transition-opacity

          duration-300

          lg:hidden



          ${menuOpen

                        ? "pointer-events-auto opacity-100"

                        : "pointer-events-none opacity-0"

                    }

        `}

            />



            {/* =====================================================

          MOBILE NAVIGATION



          Important:

          This is OUTSIDE the header.

          It uses fixed positioning and explicit pointer-events.

      ====================================================== */}



            <div

                id="mobileNavigation"

                className={`

          fixed

          left-4

          right-4

          top-[84px]

          z-[1001]

          overflow-hidden

          rounded-[28px]

          border

          border-white/10

          bg-[#101411]/95

          shadow-[0_28px_90px_rgba(0,0,0,.45)]

          backdrop-blur-2xl

          transition-all

          duration-300

          md:left-7

          md:right-7

          lg:hidden



          ${menuOpen

                        ? `

                pointer-events-auto

                visible

                translate-y-0

                opacity-100

              `

                        : `

                pointer-events-none

                invisible

                -translate-y-3

                opacity-0

              `

                    }

        `}

            >

                <div className="p-4 sm:p-5">



                    {/* =================================================

              MOBILE LINKS

          ================================================== */}



                    <div

                        className="

              overflow-hidden

              rounded-[20px]

              border

              border-white/[0.08]

              bg-white/[0.035]

            "

                    >

                        {navItems.map(

                            (

                                item,

                                index

                            ) => (

                                <button

                                    key={

                                        item.name

                                    }

                                    type="button"

                                    onClick={() =>

                                        handleMobileNavigate(

                                            item.href

                                        )

                                    }

                                    className={`

                    group

                    flex

                    w-full

                    items-center

                    justify-between

                    px-5

                    py-4

                    text-left

                    text-[15px]

                    font-medium

                    transition-colors

                    duration-200



                    ${index !==

                                            navItems.length -

                                            1

                                            ? "border-b border-white/[0.08]"

                                            : ""

                                        }



                    ${isActive(

                                            item.href

                                        )

                                            ? "bg-white/[0.05] text-[#D8FF65]"

                                            : "text-white/75 hover:bg-white/[0.05] hover:text-white"

                                        }

                  `}

                                >

                                    <span>

                                        {

                                            item.name

                                        }

                                    </span>



                                    <span

                                        className={`

                      flex

                      h-8

                      w-8

                      items-center

                      justify-center

                      rounded-full

                      transition-all

                      duration-200



                      ${isActive(

                                            item.href

                                        )

                                                ? "bg-[#D8FF65] text-[#101411]"

                                                : "bg-white/[0.06] text-white/55 group-hover:bg-white/10 group-hover:text-white"

                                            }

                    `}

                                    >

                                        <ChevronRight

                                            className="

                        h-4

                        w-4

                      "

                                        />

                                    </span>

                                </button>

                            )

                        )}

                    </div>



                    {/* =================================================

              CART + LANGUAGE MOBILE

          ================================================== */}



                    <div

                        className="

              mt-3

              grid

              grid-cols-2

              gap-2

            "

                    >

                        {/* CART */}



                        <button

                            type="button"

                            onClick={() =>

                                handleMobileNavigate(

                                    "/cart"

                                )

                            }

                            className="

                relative

                flex

                min-w-0

                items-center

                justify-between

                rounded-[18px]

                border

                border-white/10

                bg-white/[0.06]

                px-4

                py-4

                text-sm

                font-semibold

                text-white

                transition

                hover:bg-white/10

              "

                        >

                            <span

                                className="

                  flex

                  min-w-0

                  items-center

                  gap-2

                "

                            >

                                <ShoppingBag

                                    className="

                    h-4

                    w-4

                    shrink-0

                  "

                                />



                                <span>

                                    Cart

                                </span>

                            </span>



                            {cartCount >

                                0 && (

                                    <span

                                        className="

                    flex

                    h-6

                    min-w-6

                    items-center

                    justify-center

                    rounded-full

                    bg-[#D8FF65]

                    px-1.5

                    text-[10px]

                    font-bold

                    text-black

                  "

                                    >

                                        {

                                            cartCount

                                        }

                                    </span>

                                )}

                        </button>



                        {/* LANGUAGE */}

                        <button
                            type="button"
                            onClick={() =>
                                setLanguageOpen(
                                    (previous) =>
                                        !previous
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
                transition
                hover:bg-white
              "
                        >
                            <span className="flex min-w-0 items-center gap-2">
                                <Globe2 className="h-4 w-4 shrink-0" />

                                <span className="truncate">
                                    {selectedLanguage.name}
                                </span>
                            </span>

                            <ChevronDown
                                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${languageOpen
                                        ? "rotate-180"
                                        : ""
                                    }`}
                            />
                        </button>

                    </div>

                    {languageOpen && (
                        <div className="mt-2 grid grid-cols-2 gap-2 rounded-[20px] border border-white/[0.08] bg-white/[0.035] p-2">
                            {languages.map(
                                (language) => {
                                    const active =
                                        selectedLanguage.code ===
                                        language.code;

                                    return (
                                        <button
                                            key={language.code}
                                            type="button"
                                            onClick={() =>
                                                changeLanguage(
                                                    language
                                                )
                                            }
                                            className={`
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-2
                        rounded-[15px]
                        px-4
                        py-3
                        text-left
                        transition

                        ${active
                                                    ? "bg-[#D8FF65] text-[#101411]"
                                                    : "bg-white/[0.06] text-white hover:bg-white/10"
                                                }
                      `}
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-[12px] font-semibold">
                                                    {language.name}
                                                </p>

                                                <p
                                                    className={`mt-0.5 truncate text-[10px] ${active
                                                            ? "text-[#596159]"
                                                            : "text-white/55"
                                                        }`}
                                                >
                                                    {language.native}
                                                </p>
                                            </div>

                                            {active && (
                                                <Check className="h-3.5 w-3.5 shrink-0" />
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    )}

                </div>

            </div>

        </>

    );

}



/* =========================================================

   NAVBAR CART ITEM

========================================================= */



function NavbarCartItem({

    item,

    removeProduct,

}) {

    const quantity =

        Number(

            item.quantity || 1

        );



    const itemTotal =

        Number(

            item.price || 0

        ) * quantity;



    return (

        <div

            className="

        rounded-[18px]

        border

        border-black/[0.06]

        bg-white

        p-3

      "

        >

            <div className="flex gap-3">



                {/* IMAGE */}



                <Link

                    href="/product-details"

                    className="

            h-[70px]

            w-[70px]

            shrink-0

            overflow-hidden

            rounded-[14px]

            bg-[#E9ECE5]

          "

                >

                    <img

                        src={

                            item.image ||

                            "/Assets/Logo.png"

                        }

                        alt={

                            item.name ||

                            "Product"

                        }

                        onError={(

                            event

                        ) => {

                            event.currentTarget.onerror =

                                null;



                            event.currentTarget.src =

                                "/Assets/Logo.png";

                        }}

                        className="

              h-full

              w-full

              object-cover

            "

                    />

                </Link>



                {/* CONTENT */}



                <div

                    className="

            min-w-0

            flex-1

          "

                >

                    <div

                        className="

              flex

              items-start

              justify-between

              gap-3

            "

                    >

                        <div className="min-w-0">

                            <p

                                className="

                  text-[9px]

                  font-semibold

                  uppercase

                  tracking-[0.11em]

                  text-[#687069]

                "

                            >

                                {item.brand ||

                                    "Top Range"}

                            </p>



                            <p

                                className="

                  mt-1

                  truncate

                  text-[13px]

                  font-semibold

                  leading-5

                  text-[#101411]

                "

                            >

                                {item.name ||

                                    "Product"}

                            </p>

                        </div>



                        <button

                            type="button"

                            aria-label={`Remove ${item.name ||

                                "product"

                                }`}

                            onClick={() =>

                                removeProduct(

                                    item.id

                                )

                            }

                            className="

                flex

                h-7

                w-7

                shrink-0

                items-center

                justify-center

                rounded-full

                bg-[#F4F5EF]

                text-[#747B75]

                transition

                hover:bg-red-50

                hover:text-red-500

              "

                        >

                            <Trash2

                                className="

                  h-3

                  w-3

                "

                            />

                        </button>

                    </div>



                    <div

                        className="

              mt-2

              flex

              items-end

              justify-between

            "

                    >

                        <p

                            className="

                text-[10px]

                font-medium

                text-[#6B726C]

              "

                        >

                            Qty{" "}



                            <span

                                className="

                  font-bold

                  text-[#101411]

                "

                            >

                                {

                                    quantity

                                }

                            </span>

                        </p>



                        <p

                            className="

                text-[13px]

                font-bold

                text-[#101411]

              "

                        >

                            AED{" "}



                            {itemTotal.toLocaleString(

                                undefined,

                                {

                                    minimumFractionDigits:

                                        2,



                                    maximumFractionDigits:

                                        2,

                                }

                            )}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}