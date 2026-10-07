"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronDown,
    Minus,
    Package,
    Plus,
    Search,
    ShieldCheck,
    ShoppingBag,
    SlidersHorizontal,
    Trash2,
    Truck,
    X,
} from "lucide-react";

/* =========================================================
   SETTINGS
========================================================= */

const PRODUCTS_PER_PAGE = 12; // 3 rows × 4 products on desktop

/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [
    {
        id: 1,
        name: "Cordless Hammer Drill",
        category: "Power Tools",
        brand: "DeWalt",
        sku: "TR-PT-001",
        price: 699,
        oldPrice: 749,
        stock: 28,
        description:
            "Professional cordless hammer drill for concrete, steel, timber and demanding construction applications.",
    },
    {
        id: 2,
        name: "Professional Angle Grinder",
        category: "Power Tools",
        brand: "Bosch",
        sku: "TR-PT-002",
        price: 419,
        oldPrice: null,
        stock: 18,
        description:
            "High-performance angle grinder for professional cutting, grinding and finishing work.",
    },
    {
        id: 3,
        name: "Heavy Duty Combination Pliers",
        category: "Hand Tools",
        brand: "Stanley",
        sku: "TR-HT-001",
        price: 69,
        oldPrice: 79,
        stock: 64,
        description:
            "Durable professional combination pliers for gripping, cutting and maintenance applications.",
    },
    {
        id: 4,
        name: "Digital Clamp Meter",
        category: "Electrical",
        brand: "Fluke",
        sku: "TR-EL-001",
        price: 289,
        oldPrice: null,
        stock: 9,
        description:
            "Digital electrical testing meter designed for professional maintenance and diagnostics.",
    },
    {
        id: 5,
        name: "Steel Bars",
        category: "Plumbing",
        brand: "Hepworth",
        sku: "TR-PL-001",
        price: 42,
        oldPrice: null,
        stock: 120,
        description:
            "High-quality PVC pressure pipe for residential, commercial and industrial plumbing systems.",
    },
    {
        id: 6,
        name: "Circular Saw",
        category: "Hardware",
        brand: "Dormakaba",
        sku: "TR-HW-001",
        price: 34,
        oldPrice: 39,
        stock: 85,
        description:
            "Premium stainless steel hinge for commercial and residential door installations.",
    },
    {
        id: 7,
        name: "Chainsaw",
        category: "Fasteners",
        brand: "Fischer",
        sku: "TR-FA-001",
        price: 4.5,
        oldPrice: null,
        stock: 400,
        description:
            "Heavy-duty anchor solution for concrete, structural fixing and professional construction.",
    },
    {
        id: 8,
        name: "Cordless Impact Wrench",
        category: "Safety",
        brand: "3M",
        sku: "TR-SF-001",
        price: 58,
        oldPrice: null,
        stock: 44,
        description:
            "Professional industrial head protection for construction and engineering environments.",
    },

];

/* =========================================================
   FILTER DATA
========================================================= */

const productCategories = [
    "All Products",
    "Power Tools",
    "Hand Tools",
    "Electrical",
    "Plumbing",
    "Hardware",
    "Fasteners",
    "Safety",
    "Paint & Adhesives",
    "Construction Materials",
    "HVAC",
];

const productBrands = [
    "All Brands",
    "3M",
    "Bosch",
    "DeWalt",
    "Dormakaba",
    "Fischer",
    "Fluke",
    "Hepworth",
    "Mueller",
    "Sika",
    "Stanley",
];

const availabilityOptions = [
    "All Availability",
    "In Stock",
    "Low Stock",
];

const sortOptions = [
    "Default",
    "Price Low to High",
    "Price High to Low",
    "Name A-Z",
];

/* =========================================================
   PRODUCT CARD STYLE
========================================================= */

function getCategoryCardStyle() {
    return {
        accent: "bg-[#101411]",
        badge: "bg-[#EEF0EC] text-[#4F5650]",
        panel: "bg-[#F7F8F4]",
    };
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ProductsPage() {
    const [search, setSearch] = useState("");

    const [category, setCategory] =
        useState("All Products");

    const [brand, setBrand] =
        useState("All Brands");

    const [availability, setAvailability] =
        useState("All Availability");

    const [sort, setSort] =
        useState("Default");

    const [showFilters, setShowFilters] =
        useState(false);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [cart, setCart] =
        useState([]);

    const [cartLoaded, setCartLoaded] =
        useState(false);

    const [cartOpen, setCartOpen] =
        useState(false);

    const [quoteOpen, setQuoteOpen] =
        useState(false);

    /* =========================================================
       DRAWER / MODAL CLOSE HELPERS
    ========================================================= */

    const closeCart = () => {
        setCartOpen(false);
    };

    const closeQuote = () => {
        setQuoteOpen(false);
    };

    /* =========================================================
       ESC KEY + BODY SCROLL LOCK
    ========================================================= */

    useEffect(() => {
        if (!cartOpen && !quoteOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const handleKeyDown = (event) => {
            if (event.key !== "Escape") {
                return;
            }

            if (quoteOpen) {
                closeQuote();
                return;
            }

            if (cartOpen) {
                closeCart();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [cartOpen, quoteOpen]);

    /* =========================================================
       FILTER PRODUCTS
    ========================================================= */

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const searchValue =
                search.toLowerCase();

            result = result.filter((product) =>
                [
                    product.name,
                    product.category,
                    product.brand,
                    product.sku,
                    product.description,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue)
            );
        }

        if (
            category !==
            "All Products"
        ) {
            result = result.filter(
                (product) =>
                    product.category ===
                    category
            );
        }

        if (
            brand !==
            "All Brands"
        ) {
            result = result.filter(
                (product) =>
                    product.brand ===
                    brand
            );
        }

        if (
            availability ===
            "In Stock"
        ) {
            result = result.filter(
                (product) =>
                    product.stock > 15
            );
        }

        if (
            availability ===
            "Low Stock"
        ) {
            result = result.filter(
                (product) =>
                    product.stock > 0 &&
                    product.stock <= 15
            );
        }

        if (
            sort ===
            "Price Low to High"
        ) {
            result.sort(
                (a, b) =>
                    a.price - b.price
            );
        }

        if (
            sort ===
            "Price High to Low"
        ) {
            result.sort(
                (a, b) =>
                    b.price - a.price
            );
        }

        if (
            sort ===
            "Name A-Z"
        ) {
            result.sort((a, b) =>
                a.name.localeCompare(
                    b.name
                )
            );
        }

        return result;
    }, [
        search,
        category,
        brand,
        availability,
        sort,
    ]);

    /* =========================================================
   LOAD SHARED CART
========================================================= */

    useEffect(() => {
        try {
            const savedCart =
                localStorage.getItem(
                    "toprange_cart"
                );

            if (savedCart) {
                const parsedCart =
                    JSON.parse(savedCart);

                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            }
        } catch (error) {
            console.error(
                "Unable to load cart:",
                error
            );
        } finally {
            setCartLoaded(true);
        }
    }, []);

    /* =========================================================
       SAVE + SYNC SHARED CART
    ========================================================= */

    useEffect(() => {
        if (!cartLoaded) {
            return;
        }

        try {
            localStorage.setItem(
                "toprange_cart",
                JSON.stringify(cart)
            );

            window.dispatchEvent(
                new Event(
                    "toprange-cart-updated"
                )
            );
        } catch (error) {
            console.error(
                "Unable to save cart:",
                error
            );
        }
    }, [cart, cartLoaded]);

    /* =========================================================
       PAGINATION
    ========================================================= */

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredProducts.length /
            PRODUCTS_PER_PAGE
        )
    );

    const startIndex =
        (currentPage - 1) *
        PRODUCTS_PER_PAGE;

    const endIndex =
        startIndex +
        PRODUCTS_PER_PAGE;

    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            endIndex
        );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        category,
        brand,
        availability,
        sort,
    ]);

    useEffect(() => {
        if (
            currentPage >
            totalPages
        ) {
            setCurrentPage(
                totalPages
            );
        }
    }, [
        currentPage,
        totalPages,
    ]);

    const changePage = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        setTimeout(() => {
            document
                .getElementById(
                    "products-section"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 50);
    };

    /* =========================================================
       CART
    ========================================================= */

    const addToCart = (product) => {
        setCart((current) => {
            const existing =
                current.find(
                    (item) =>
                        item.id ===
                        product.id
                );

            if (existing) {
                return current.map(
                    (item) =>
                        item.id ===
                            product.id
                            ? {
                                ...item,
                                quantity:
                                    item.quantity +
                                    1,
                            }
                            : item
                );
            }

            return [
                ...current,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });

        setCartOpen(true);
    };

    const updateQuantity = (
        id,
        amount
    ) => {
        setCart((current) =>
            current
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            quantity:
                                Math.max(
                                    0,
                                    item.quantity +
                                    amount
                                ),
                        }
                        : item
                )
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    };

    const removeProduct = (id) => {
        setCart((current) =>
            current.filter(
                (item) =>
                    item.id !== id
            )
        );
    };

    const cartCount =
        cart.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );

    const cartTotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );

    /* =========================================================
       RESET FILTERS
    ========================================================= */

    const resetFilters = () => {
        setSearch("");
        setCategory("All Products");
        setBrand("All Brands");
        setAvailability(
            "All Availability"
        );
        setSort("Default");
    };

    return (
        <>
            <main className="min-h-screen bg-[#F4F5EF] text-[#101411]">

                {/* =====================================================
            HERO
        ===================================================== */}

                <section className="relative overflow-hidden bg-[#07100D] px-5 pb-16 pt-36 text-white md:px-10 lg:px-14 lg:pb-20">

                    {/* Banner Background Image */}

                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                "url('/Assets/Product Banner.jpg')",
                        }}
                    />

                    {/* Dark Overlays */}

                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,13,0.98)_0%,rgba(7,16,13,0.93)_42%,rgba(7,16,13,0.72)_72%,rgba(7,16,13,0.55)_100%)]" />

                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,16,13,0.98)_0%,rgba(7,16,13,0.28)_55%,rgba(7,16,13,0.12)_100%)]" />

                    {/* Glows */}

                    <div className="pointer-events-none absolute -right-40 -top-20 h-[600px] w-[600px] rounded-full bg-[#D8FF65]/10 blur-[170px]" />

                    <div className="pointer-events-none absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full bg-[#C6772C]/10 blur-[150px]" />

                    <div className="relative z-10 mx-auto max-w-[1450px]">

                        <div className="grid gap-12 lg:grid-cols-[1fr_390px] lg:items-end">

                            {/* Hero Content */}

                            <div>

                                <div className="flex items-center gap-3">

                                    <span className="h-2.5 w-2.5 rounded-full bg-[#D8FF65] shadow-[0_0_18px_#D8FF65]" />

                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                                        Product Catalogue
                                    </span>

                                </div>

                                <h1 className="mt-6 max-w-[1000px] text-[50px] font-medium leading-[0.92] tracking-[-0.06em] sm:text-[66px] md:text-[80px] lg:text-[94px]">

                                    Everything your
                                    <br />

                                    <span className="text-[#D8FF65]">
                                        project needs.
                                    </span>

                                </h1>

                                <p className="mt-7 max-w-2xl text-[16px] leading-8 text-white/80 md:text-[18px]">

                                    Explore professional
                                    building materials,
                                    power tools, hardware,
                                    plumbing, electrical
                                    supplies and
                                    construction products
                                    from trusted
                                    manufacturers.

                                </p>

                            </div>

                            {/* Quote Card */}

                            <div className="rounded-[30px] border border-white/15 bg-black/25 p-7 shadow-[0_30px_80px_rgba(0,0,0,.25)] backdrop-blur-2xl">

                                <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#D8FF65]">
                                    Project Procurement
                                </p>

                                <h3 className="mt-6 text-[29px] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                                    Buying materials
                                    <br />
                                    in bulk?
                                </h3>

                                <p className="mt-4 text-[14px] leading-7 text-white/75">

                                    Combine multiple
                                    products into one
                                    professional
                                    quotation request.

                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuoteOpen(true)
                                    }
                                    className="group mt-7 flex w-full items-center justify-between border-t border-white/15 pt-5 text-[14px] font-semibold text-white"
                                >

                                    Request quotation

                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8FF65] text-black transition-transform duration-300 group-hover:rotate-45">

                                        <ArrowUpRight className="h-4 w-4" />

                                    </span>

                                </button>

                            </div>

                        </div>

                        {/* =================================================
                SEARCH
            ================================================= */}

                        <div className="mt-14 flex flex-col gap-2 rounded-[24px] border border-white/15 bg-black/25 p-2 shadow-[0_20px_60px_rgba(0,0,0,.2)] backdrop-blur-xl md:flex-row">

                            <div className="flex flex-1 items-center gap-4 px-4">

                                <Search className="h-5 w-5 shrink-0 text-white/75" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search products, brands, categories or SKU..."
                                    className="h-14 w-full bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/55"
                                />

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowFilters(
                                        (prev) => !prev
                                    )
                                }
                                className="flex h-14 items-center justify-center gap-3 rounded-[17px] bg-[#D8FF65] px-7 text-[14px] font-semibold text-[#101411] transition hover:bg-white"
                            >

                                <SlidersHorizontal className="h-4 w-4" />

                                Filters

                            </button>

                        </div>

                    </div>

                </section>

                {/* =====================================================
            CATEGORIES
        ===================================================== */}

                <section className="border-b border-black/[0.07] bg-white">

                    <div className="mx-auto max-w-[1450px] overflow-x-auto px-5 py-5 md:px-10 lg:px-14">

                        <div className="flex min-w-max gap-2">

                            {productCategories.map(
                                (item) => (

                                    <button
                                        type="button"
                                        key={item}
                                        onClick={() =>
                                            setCategory(item)
                                        }
                                        className={`
                      rounded-full
                      px-5
                      py-3
                      text-[12px]
                      font-semibold
                      transition-all
                      duration-300

                      ${category ===
                                                item
                                                ? "bg-[#101411] text-white"
                                                : "bg-[#F0F2EC] text-[#3F4540] hover:bg-[#D8FF65] hover:text-black"
                                            }
                    `}
                                    >
                                        {item}
                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </section>

                {/* =====================================================
            PRODUCTS
        ===================================================== */}

                <section
                    id="products-section"
                    className="scroll-mt-24 py-12 md:py-16"
                >

                    <div className="mx-auto max-w-[1450px] px-5 md:px-10 lg:px-14">

                        {/* =================================================
                FILTER PANEL
            ================================================= */}

                        {showFilters && (

                            <div className="mb-8 grid gap-4 rounded-[28px] border border-black/[0.07] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,.05)] sm:grid-cols-2 lg:grid-cols-4">

                                <FilterDropdown
                                    label="Category"
                                    value={category}
                                    options={
                                        productCategories
                                    }
                                    onChange={
                                        setCategory
                                    }
                                />

                                <FilterDropdown
                                    label="Brand"
                                    value={brand}
                                    options={
                                        productBrands
                                    }
                                    onChange={
                                        setBrand
                                    }
                                />

                                <FilterDropdown
                                    label="Availability"
                                    value={
                                        availability
                                    }
                                    options={
                                        availabilityOptions
                                    }
                                    onChange={
                                        setAvailability
                                    }
                                />

                                <div className="flex items-end">

                                    <button
                                        type="button"
                                        onClick={
                                            resetFilters
                                        }
                                        className="h-[54px] w-full rounded-[15px] border border-black/10 bg-[#F4F5EF] text-[13px] font-semibold text-[#303530] transition hover:bg-[#101411] hover:text-white"
                                    >
                                        Reset Filters
                                    </button>

                                </div>

                            </div>

                        )}

                        {/* =================================================
                PRODUCT HEADER
            ================================================= */}

                        <div className="mb-8 flex flex-col gap-6 border-b border-black/[0.08] pb-7 md:flex-row md:items-end md:justify-between">

                            <div>

                                <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#545B55]">
                                    Product Collection
                                </p>

                                <h2 className="mt-2 text-[35px] font-semibold tracking-[-0.045em] text-[#101411] md:text-[44px]">
                                    {category}
                                </h2>

                                <p className="mt-2 text-[14px] font-medium text-[#626963]">

                                    {
                                        filteredProducts.length
                                    }{" "}
                                    products found

                                </p>

                            </div>

                            <div className="flex flex-wrap items-center gap-2">

                                <FilterDropdown
                                    value={sort}
                                    options={
                                        sortOptions
                                    }
                                    onChange={
                                        setSort
                                    }
                                    compact
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCartOpen(true)
                                    }
                                    className="relative flex h-[50px] items-center gap-3 rounded-full bg-[#101411] px-6 text-[13px] font-semibold text-white"
                                >

                                    <ShoppingBag className="h-4 w-4" />

                                    Cart

                                    {cartCount > 0 && (

                                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D8FF65] px-1.5 text-[10px] font-bold text-black">
                                            {cartCount}
                                        </span>

                                    )}

                                </button>

                            </div>

                        </div>

                        {/* Results Info */}

                        {filteredProducts.length >
                            0 && (

                                <div className="mb-5 flex items-center justify-between">

                                    <p className="text-[13px] font-medium text-[#5B625C]">

                                        Showing{" "}

                                        <span className="font-bold text-[#101411]">
                                            {startIndex + 1}
                                        </span>

                                        {" "}–{" "}

                                        <span className="font-bold text-[#101411]">
                                            {Math.min(
                                                endIndex,
                                                filteredProducts.length
                                            )}
                                        </span>

                                        {" "}of{" "}

                                        <span className="font-bold text-[#101411]">
                                            {
                                                filteredProducts.length
                                            }
                                        </span>

                                        {" "}products

                                    </p>

                                    {totalPages >
                                        1 && (

                                            <p className="hidden text-[13px] font-medium text-[#606761] sm:block">

                                                Page{" "}

                                                <span className="font-bold text-[#101411]">
                                                    {currentPage}
                                                </span>

                                                {" "}of{" "}

                                                {totalPages}

                                            </p>

                                        )}

                                </div>

                            )}

                        {/* =================================================
                PRODUCT GRID
            ================================================= */}

                        {paginatedProducts.length >
                            0 ? (

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                {paginatedProducts.map(
                                    (product) => {

                                        const added =
                                            cart.some(
                                                (item) =>
                                                    item.id ===
                                                    product.id
                                            );

                                        const cardStyle =
                                            getCategoryCardStyle();

                                        return (

                                            <article
                                                key={
                                                    product.id
                                                }
                                                className="group overflow-hidden rounded-[28px] border border-black/[0.10] bg-white shadow-[0_10px_28px_rgba(16,20,17,.08)] transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.16] hover:shadow-[0_18px_42px_rgba(16,20,17,.12)]"
                                            >

                                                <div
                                                    className={`h-2 w-full ${cardStyle.accent}`}
                                                />

                                                {/* Card Content */}

                                                <div className="p-5 md:p-6">

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span
                                                            className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] ${cardStyle.badge}`}
                                                        >
                                                            {product.category}
                                                        </span>

                                                        <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#747B75]">
                                                            {product.sku}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        href="/product-details"
                                                        className="block"
                                                    >
                                                        <h3 className="mt-4 text-[25px] font-bold leading-[1.13] tracking-[-0.038em] text-[#101411] transition-colors hover:text-[#52651A] md:text-[28px]">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    <div
                                                        className={`mt-5 rounded-[18px] border border-black/[0.05] p-4 ${cardStyle.panel}`}
                                                    >
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#6F766F]">
                                                            Product Details
                                                        </p>

                                                        <p className="mt-2 line-clamp-3 min-h-[66px] text-[13px] leading-[1.75] text-[#444B45]">
                                                            {product.description}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between gap-4 rounded-[16px] border border-black/[0.06] bg-[#F5F6F1] px-4 py-3">
                                                        <div>
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A817A]">
                                                                Brand
                                                            </p>

                                                            <p className="mt-1 text-[12px] font-bold text-[#303630]">
                                                                {product.brand}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A817A]">
                                                                Availability
                                                            </p>

                                                            <p
                                                                className={`mt-1 text-[11px] font-bold ${product.stock <= 15
                                                                    ? "text-[#B66B19]"
                                                                    : "text-[#34733D]"
                                                                    }`}
                                                            >
                                                                {product.stock <= 15
                                                                    ? `Only ${product.stock} left`
                                                                    : "In Stock"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Price */}

                                                    <div className="mt-5 flex items-end justify-between border-t border-black/[0.08] pt-5">

                                                        <div>

                                                            <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#626963]">
                                                                Starting Price
                                                            </p>

                                                            <div className="mt-1.5 flex items-center gap-2">

                                                                <span className="text-[22px] font-bold tracking-[-0.03em] text-[#101411]">

                                                                    AED{" "}
                                                                    {
                                                                        product.price
                                                                    }

                                                                </span>

                                                                {product.oldPrice && (

                                                                    <span className="text-[12px] font-medium text-[#8B918C] line-through">

                                                                        AED{" "}
                                                                        {
                                                                            product.oldPrice
                                                                        }

                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                addToCart(
                                                                    product
                                                                )
                                                            }
                                                            className={`
                                inline-flex
                                h-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                px-5
                                text-[11px]
                                font-bold
                                transition-all
                                duration-300

                                ${added
                                                                    ? "bg-[#D8FF65] text-[#101411]"
                                                                    : "bg-[#101411] text-white hover:bg-[#D8FF65] hover:text-[#101411]"
                                                                }
                              `}
                                                        >

                                                            {added ? (
                                                                <>
                                                                    <Check className="mr-2 h-3.5 w-3.5" />
                                                                    Added
                                                                </>
                                                            ) : (
                                                                "Order"
                                                            )}

                                                        </button>

                                                    </div>

                                                    {/* Details */}

                                                    <Link
                                                        href="/product-details"
                                                        className="group/details mt-5 flex items-center justify-between border-t border-black/[0.08] pt-4 text-[12px] font-semibold text-[#303630]"
                                                    >

                                                        View Product Details

                                                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/details:-translate-y-0.5 group-hover/details:translate-x-0.5" />

                                                    </Link>

                                                </div>

                                            </article>

                                        );
                                    }
                                )}

                            </div>

                        ) : (

                            <div className="rounded-[30px] border border-dashed border-black/15 bg-white py-24 text-center">

                                <Search className="mx-auto h-10 w-10 text-black/25" />

                                <h3 className="mt-5 text-[25px] font-semibold text-[#101411]">
                                    No products found
                                </h3>

                                <p className="mt-2 text-[14px] text-[#626963]">
                                    Try adjusting your
                                    search, category or
                                    filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="mt-6 rounded-full bg-[#101411] px-7 py-3.5 text-[13px] font-semibold text-white"
                                >
                                    Reset Filters
                                </button>

                            </div>

                        )}

                        {/* Pagination */}

                        {filteredProducts.length > 0 && (

                            <Pagination
                                currentPage={
                                    currentPage
                                }
                                totalPages={
                                    totalPages
                                }
                                onPageChange={
                                    changePage
                                }
                            />

                        )}

                    </div>

                </section>

                {/* =====================================================
            PROCUREMENT CTA
        ===================================================== */}

                <section className="px-5 pb-20 md:px-10 lg:px-14">

                    <div className="relative mx-auto max-w-[1450px] overflow-hidden rounded-[38px] bg-[#101411] text-white shadow-[0_30px_100px_rgba(0,0,0,.15)]">

                        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#D8FF65]/10 blur-[140px]" />

                        <div className="relative grid lg:grid-cols-[1.08fr_.92fr]">

                            {/* Left */}

                            <div className="flex flex-col justify-between p-8 md:p-12 lg:p-14 xl:p-16">

                                <div>

                                    <div className="flex items-center gap-3">

                                        <span className="h-2.5 w-2.5 rounded-full bg-[#D8FF65]" />

                                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D8FF65]">
                                            Bulk Procurement
                                        </span>

                                    </div>

                                    <h2 className="mt-6 max-w-[760px] text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[50px] md:text-[58px] xl:text-[66px]">

                                        One request.
                                        <br />

                                        <span className="text-white/65">
                                            Multiple products.
                                        </span>

                                    </h2>

                                    <p className="mt-7 max-w-2xl text-[15px] leading-8 text-white/75 md:text-[16px]">

                                        Planning a project or
                                        purchasing in bulk?
                                        Share your required
                                        products, quantities,
                                        preferred brands and
                                        delivery requirements.

                                    </p>

                                </div>

                                <div className="mt-10 grid gap-3 sm:grid-cols-3">

                                    <ProcurementFeature
                                        icon={Package}
                                        number="01"
                                        title="Products"
                                        description="Add multiple product requirements."
                                    />

                                    <ProcurementFeature
                                        icon={Truck}
                                        number="02"
                                        title="Delivery"
                                        description="Specify your project delivery location."
                                    />

                                    <ProcurementFeature
                                        icon={ShieldCheck}
                                        number="03"
                                        title="Brands"
                                        description="Choose preferred or alternative brands."
                                    />

                                </div>

                            </div>

                            {/* Right */}

                            <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0 lg:p-6">

                                <div className="flex h-full flex-col justify-between rounded-[30px] border border-white/10 bg-white/[0.07] p-7 backdrop-blur-2xl sm:p-9">

                                    <div>

                                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/75">
                                            Request a Quotation
                                        </p>

                                        <h3 className="mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-white md:text-[36px]">

                                            Tell us what
                                            <br />
                                            your project needs.

                                        </h3>

                                        <p className="mt-5 text-[14px] leading-7 text-white/70">

                                            Complete one enquiry
                                            with your company,
                                            products, quantities
                                            and delivery details.

                                        </p>

                                        <div className="mt-8 space-y-3">

                                            <QuotePreviewRow
                                                title="Company & Contact"
                                                value="Business and contact information"
                                            />

                                            <QuotePreviewRow
                                                title="Products & Quantity"
                                                value="Automatically fetched from your cart"
                                            />

                                            <QuotePreviewRow
                                                title="Delivery Details"
                                                value="Add your required project location"
                                            />

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuoteOpen(true)
                                        }
                                        className="group mt-9 flex h-[60px] w-full items-center justify-between rounded-full bg-[#D8FF65] pl-7 pr-2 text-[14px] font-semibold text-black transition hover:bg-white"
                                    >

                                        Start Quote Request

                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101411] text-white transition-transform duration-300 group-hover:rotate-45">

                                            <ArrowUpRight className="h-4 w-4" />

                                        </span>

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

            {/* =====================================================
          CART DRAWER
      ===================================================== */}

            {cartOpen && (

                <div
                    className="fixed inset-0 z-[5000]"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Shopping cart"
                >

                    <button
                        type="button"
                        aria-label="Close cart"
                        onClick={closeCart}
                        className="absolute inset-0 z-0 cursor-default bg-black/55 backdrop-blur-sm"
                    />

                    <aside
                        className="absolute right-0 top-0 z-10 flex h-full w-full max-w-[480px] flex-col bg-[#F4F5EF] shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-black/[0.08] p-6">

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5B625C]">
                                    Product Enquiry
                                </p>

                                <h3 className="mt-1 text-[27px] font-semibold">
                                    Your Cart
                                </h3>

                            </div>

                            <button
                                type="button"
                                aria-label="Close cart"
                                onClick={closeCart}
                                className="relative z-20 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#101411] shadow-[0_8px_24px_rgba(0,0,0,.08)] transition hover:bg-[#101411] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#D8FF65]/30"
                            >

                                <X className="pointer-events-none h-4 w-4" />

                            </button>

                        </div>

                        {/* Items */}

                        <div className="flex-1 overflow-y-auto p-6">

                            {cart.length === 0 ? (

                                <div className="flex h-full flex-col items-center justify-center text-center">

                                    <ShoppingBag className="h-10 w-10 text-black/25" />

                                    <h4 className="mt-4 text-xl font-semibold">
                                        Your cart is empty
                                    </h4>

                                    <p className="mt-2 text-[14px] text-[#626963]">
                                        Add products to
                                        request a quotation.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {cart.map(
                                        (item) => (

                                            <div
                                                key={item.id}
                                                className="rounded-[22px] border border-black/[0.05] bg-white p-4"
                                            >

                                                <div className="flex gap-4">



                                                    <div className="min-w-0 flex-1">

                                                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5B625C]">
                                                            {item.brand}
                                                        </p>

                                                        <h4 className="mt-1 text-[14px] font-semibold leading-5 text-[#101411]">
                                                            {item.name}
                                                        </h4>

                                                        <p className="mt-1 text-[14px] font-bold">
                                                            AED {item.price}
                                                        </p>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeProduct(
                                                                item.id
                                                            )
                                                        }
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4F5EF] text-black/50 transition hover:bg-red-50 hover:text-red-500"
                                                    >

                                                        <Trash2 className="h-3.5 w-3.5" />

                                                    </button>

                                                </div>

                                                {/* Quantity */}

                                                <div className="mt-4 flex items-center justify-between border-t border-black/[0.07] pt-3">

                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5B625C]">
                                                        Quantity
                                                    </span>

                                                    <div className="flex items-center gap-3 rounded-full bg-[#F4F5EF] p-1">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    -1
                                                                )
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>

                                                        <span className="min-w-5 text-center text-[12px] font-bold">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    1
                                                                )
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#101411] text-white"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                        {/* Bottom */}

                        {cart.length > 0 && (

                            <div className="border-t border-black/[0.08] bg-white p-6">

                                <div className="flex items-end justify-between gap-5">

                                    <span className="text-[14px] font-medium text-[#5B625C]">
                                        Estimated Total
                                    </span>

                                    <span className="text-[25px] font-bold">

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

                                    </span>

                                </div>

                                <p className="mt-2 text-[11px] leading-5 text-[#6A716B]">

                                    Final pricing may
                                    vary based on
                                    quantity, availability
                                    and delivery.

                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        closeCart();
                                        setQuoteOpen(true);
                                    }}
                                    className="mt-6 flex h-14 w-full items-center justify-between rounded-full bg-[#101411] pl-6 pr-2 text-[14px] font-semibold text-white"
                                >

                                    Request Quotation

                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8FF65] text-black">

                                        <ArrowRight className="h-4 w-4" />

                                    </span>

                                </button>

                            </div>

                        )}

                    </aside>

                </div>

            )}

            {/* =====================================================
          QUOTE MODAL
      ===================================================== */}

            {quoteOpen && (

                <QuoteModal
                    cart={cart}
                    onClose={closeQuote}
                />

            )}

        </>
    );
}

/* =========================================================
   FILTER DROPDOWN
========================================================= */

function FilterDropdown({
    label,
    value,
    options = [],
    onChange,
    compact = false,
}) {
    const [open, setOpen] =
        useState(false);

    return (
        <div className="relative">

            {label && (

                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#505751]">
                    {label}
                </p>

            )}

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (prev) => !prev
                    )
                }
                className={`
          flex
          items-center
          justify-between
          gap-4
          border
          bg-white
          text-left
          transition-all
          duration-300

          ${open
                        ? "border-[#101411]/30 ring-4 ring-[#D8FF65]/15"
                        : "border-black/[0.09] hover:border-black/20"
                    }

          ${compact
                        ? "h-[50px] min-w-[190px] rounded-full px-5"
                        : "h-[54px] w-full rounded-[15px] px-4"
                    }
        `}
            >

                <span className="truncate text-[13px] font-semibold text-[#303530]">
                    {value}
                </span>

                <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${open
                        ? "rotate-180"
                        : ""
                        }`}
                />

            </button>

            {open && (

                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] max-h-[300px] overflow-y-auto rounded-[18px] border border-black/[0.08] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,.15)]">

                    {options.map(
                        (option) => (

                            <button
                                type="button"
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setOpen(false);
                                }}
                                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-[12px]
                  px-4
                  py-3
                  text-left
                  text-[13px]
                  font-medium
                  transition

                  ${value ===
                                        option
                                        ? "bg-[#D8FF65] text-[#101411]"
                                        : "text-[#454B46] hover:bg-[#F2F4EE]"
                                    }
                `}
                            >

                                {option}

                                {value ===
                                    option && (

                                        <Check className="h-3.5 w-3.5" />

                                    )}

                            </button>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    const createPages = () => {
        if (totalPages <= 7) {
            return Array.from(
                {
                    length: totalPages,
                },
                (_, index) =>
                    index + 1
            );
        }

        if (
            currentPage <= 4
        ) {
            return [
                1,
                2,
                3,
                4,
                5,
                "...",
                totalPages,
            ];
        }

        if (
            currentPage >=
            totalPages - 3
        ) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    const pages =
        createPages();

    return (
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-black/[0.08] pt-8 sm:flex-row">

            <p className="text-[13px] font-medium text-[#5D645E]">

                Page{" "}

                <span className="font-bold text-[#101411]">
                    {currentPage}
                </span>

                {" "}of{" "}

                <span className="font-bold text-[#101411]">
                    {totalPages}
                </span>

            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">

                <button
                    type="button"
                    disabled={
                        currentPage === 1
                    }
                    onClick={() =>
                        onPageChange(
                            currentPage - 1
                        )
                    }
                    className="flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-[12px] font-semibold transition hover:bg-[#101411] hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >

                    <ArrowLeft className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">
                        Previous
                    </span>

                </button>

                {pages.map(
                    (page, index) =>
                        page === "..." ? (

                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-11 w-8 items-center justify-center text-[13px] text-black/45"
                            >
                                ...
                            </span>

                        ) : (

                            <button
                                type="button"
                                key={page}
                                onClick={() =>
                                    onPageChange(page)
                                }
                                className={`
                  flex
                  h-11
                  min-w-11
                  items-center
                  justify-center
                  rounded-full
                  px-3
                  text-[12px]
                  font-bold
                  transition

                  ${currentPage ===
                                        page
                                        ? "bg-[#101411] text-white"
                                        : "border border-black/10 bg-white text-[#303530] hover:bg-[#D8FF65]"
                                    }
                `}
                            >
                                {page}
                            </button>

                        )
                )}

                <button
                    type="button"
                    disabled={
                        currentPage ===
                        totalPages
                    }
                    onClick={() =>
                        onPageChange(
                            currentPage + 1
                        )
                    }
                    className="flex h-11 items-center gap-2 rounded-full bg-[#D8FF65] px-4 text-[12px] font-bold text-black transition hover:bg-[#101411] hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >

                    <span className="hidden sm:inline">
                        Next
                    </span>

                    <ArrowRight className="h-3.5 w-3.5" />

                </button>

            </div>

        </div>
    );
}

/* =========================================================
   PROCUREMENT FEATURE
========================================================= */

function ProcurementFeature({
    icon: Icon,
    number,
    title,
    description,
}) {
    return (
        <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-4">

            <div className="flex items-center justify-between">

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8FF65] text-black">

                    <Icon className="h-4 w-4" />

                </span>

                <span className="text-[10px] font-semibold tracking-[0.14em] text-white/55">
                    {number}
                </span>

            </div>

            <h4 className="mt-5 text-[15px] font-semibold text-white">
                {title}
            </h4>

            <p className="mt-2 text-[12px] leading-5 text-white/70">
                {description}
            </p>

        </div>
    );
}

/* =========================================================
   QUOTE PREVIEW
========================================================= */

function QuotePreviewRow({
    title,
    value,
}) {
    return (
        <div className="flex gap-4 rounded-[16px] border border-white/10 bg-black/10 p-4">

            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D8FF65]">

                <Check className="h-3 w-3 text-black" />

            </span>

            <div>

                <p className="text-[13px] font-semibold text-white">
                    {title}
                </p>

                <p className="mt-1 text-[12px] leading-5 text-white/70">
                    {value}
                </p>

            </div>

        </div>
    );
}

/* =========================================================
   QUOTE MODAL
========================================================= */

function QuoteModal({
    cart = [],
    onClose,
}) {
    /* =====================================================
       AUTOMATIC CART DATA
    ===================================================== */

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );

    const selectedProductNames =
        cart
            .map(
                (item) =>
                    item.name
            )
            .join(", ");

    const selectedCategories = [
        ...new Set(
            cart.map(
                (item) =>
                    item.category
            )
        ),
    ];

    const selectedBrands = [
        ...new Set(
            cart.map(
                (item) =>
                    item.brand
            )
        ),
    ];

    const autoCategory =
        selectedCategories.length ===
            1
            ? selectedCategories[0]
            : selectedCategories.length >
                1
                ? "Multiple Categories"
                : "";

    const autoBrand =
        selectedBrands.length ===
            1
            ? selectedBrands[0]
            : selectedBrands.length >
                1
                ? "Multiple Brands"
                : "";

    const autoDescription =
        cart.length > 0
            ? cart
                .map(
                    (
                        item,
                        index
                    ) => `${index + 1}. ${item.name}
SKU: ${item.sku}
Brand: ${item.brand}
Category: ${item.category}
Quantity: ${item.quantity}
Unit Price: AED ${item.price}`
                )
                .join("\n\n")
            : "";

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [form, setForm] =
        useState({
            company: "",
            contactName: "",
            email: "",
            phone: "",

            products:
                selectedProductNames,

            category:
                autoCategory,

            brand:
                autoBrand,

            quantity:
                totalQuantity > 0
                    ? String(
                        totalQuantity
                    )
                    : "",

            refNumber: "",

            deliveryLocation: "",

            description:
                autoDescription,
        });

    const update = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =====================================================
       CUSTOM DROPDOWN UPDATE
    ===================================================== */

    const updateSelect = (
        name,
        value
    ) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =====================================================
       SUBMIT
    ===================================================== */

    const submit = (e) => {
        e.preventDefault();

        const subject =
            encodeURIComponent(
                `Quotation Request - ${form.company ||
                form.contactName ||
                "Top Range"
                }`
            );

        const body =
            encodeURIComponent(`
TOP RANGE BUILDING MATERIALS
PROJECT QUOTATION REQUEST


CUSTOMER DETAILS

Company Name:
${form.company}

Contact Person:
${form.contactName}

Email:
${form.email}

Phone:
${form.phone}


PRODUCT DETAILS

Products:
${form.products}

Category:
${form.category}

Preferred Brand:
${form.brand}

Total Quantity:
${form.quantity}

Ref Number:
${form.refNumber}

Delivery Location:
${form.deliveryLocation}


DESCRIPTION / REQUIREMENT

${form.description || "No additional requirements provided."}
`);

        window.location.href =
            `mailto:info@toprange.ae?subject=${subject}&body=${body}`;
    };

    return (
        <div
            className="fixed inset-0 z-[6000] overflow-x-hidden overflow-y-auto bg-[#07100D]/80 p-2 backdrop-blur-md sm:p-4 md:p-6 lg:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Quotation request"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >

            <div
                className="mx-auto flex min-h-full w-full max-w-[1050px] items-start justify-center py-2 sm:py-4 lg:items-center lg:py-6"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        onClose();
                    }
                }}
            >

                <div
                    className="relative z-10 w-full min-w-0 overflow-x-clip rounded-[22px] bg-[#F4F5EF] shadow-[0_40px_120px_rgba(0,0,0,.28)] sm:rounded-[30px] lg:rounded-[36px]"
                    onMouseDown={(event) => event.stopPropagation()}
                >

                    {/* Glow */}

                    <div className="pointer-events-none absolute -right-24 -top-24 h-[260px] w-[260px] rounded-full bg-[#D8FF65]/10 blur-[90px] sm:-right-40 sm:-top-40 sm:h-[420px] sm:w-[420px] sm:blur-[120px]" />

                    <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">

                        {/* Header */}

                        <div className="flex items-start justify-between gap-3 sm:gap-6">

                            <div className="min-w-0 flex-1">

                                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#727972] sm:text-[11px] sm:tracking-[0.22em]">
                                    Project Enquiry
                                </p>

                                <h2 className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#101411] sm:mt-4 sm:text-[38px] md:text-[44px] lg:text-[48px]">
                                    Get a Quote
                                </h2>

                                {cart.length >
                                    0 && (

                                        <p className="mt-3 max-w-[620px] text-[12px] leading-5 text-[#626963] sm:mt-4 sm:text-[14px] sm:leading-6">

                                            {cart.length ===
                                                1
                                                ? "Selected product details have been added automatically."
                                                : `${cart.length} selected products have been added automatically.`}

                                        </p>

                                    )}

                            </div>

                            <button
                                type="button"
                                aria-label="Close quotation request"
                                onClick={onClose}
                                className="relative z-30 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#101411] shadow-[0_8px_25px_rgba(0,0,0,.08)] transition hover:bg-[#101411] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#D8FF65]/30 sm:h-12 sm:w-12"
                            >

                                <X className="pointer-events-none h-4 w-4" />

                            </button>

                        </div>

                        {/* =================================================
                SELECTED PRODUCTS
            ================================================= */}

                        {cart.length >
                            0 && (

                                <div className="mt-6 min-w-0 rounded-[18px] border border-black/[0.07] bg-white p-3 sm:mt-8 sm:rounded-[22px] sm:p-5">

                                    <div className="flex min-w-0 items-start justify-between gap-3 sm:items-center sm:gap-4">

                                        <div>

                                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#697069]">
                                                Selected Products
                                            </p>

                                            <p className="mt-1 text-[11px] font-medium leading-5 text-[#454B45] sm:text-[13px]">
                                                Automatically added from your cart
                                            </p>

                                        </div>

                                        <span className="rounded-full bg-[#D8FF65] px-3 py-1.5 text-[11px] font-bold text-[#101411]">
                                            {cart.length}
                                        </span>

                                    </div>

                                    <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">

                                        {cart.map(
                                            (item) => (

                                                <div
                                                    key={
                                                        item.id
                                                    }
                                                    className="flex min-w-0 items-center gap-3 rounded-[14px] bg-[#F4F5EF] p-2.5 sm:rounded-[16px] sm:p-3"
                                                >



                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-[12px] font-semibold text-[#101411] sm:text-[13px]">
                                                            {
                                                                item.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-[9px] font-medium text-[#656C66] sm:text-[10px]">

                                                            {
                                                                item.brand
                                                            }{" "}
                                                            ·{" "}
                                                            {
                                                                item.sku
                                                            }

                                                        </p>

                                                    </div>

                                                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#101411]">

                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }

                                                    </span>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                        {/* =================================================
                FORM
            ================================================= */}

                        <form
                            onSubmit={submit}
                            className="mt-7 sm:mt-9"
                        >

                            <div className="grid min-w-0 gap-x-5 gap-y-5 lg:grid-cols-2 lg:gap-y-6">

                                <QuoteField
                                    label="Company Name"
                                    name="company"
                                    value={
                                        form.company
                                    }
                                    onChange={update}
                                    placeholder="Company name"
                                    required
                                />

                                <QuoteField
                                    label="Contact Person"
                                    name="contactName"
                                    value={
                                        form.contactName
                                    }
                                    onChange={update}
                                    placeholder="Full name"
                                    required
                                />

                                <QuoteField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={
                                        form.email
                                    }
                                    onChange={update}
                                    placeholder="name@company.com"
                                    required
                                />

                                <QuoteField
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    value={
                                        form.phone
                                    }
                                    onChange={update}
                                    placeholder="+971"
                                    required
                                />

                                {/* AUTO PRODUCT */}

                                <QuoteField
                                    label="Product"
                                    name="products"
                                    value={
                                        form.products
                                    }
                                    onChange={update}
                                    placeholder="Product name"
                                />

                                {/* AUTO QUANTITY */}

                                <QuoteField
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={
                                        form.quantity
                                    }
                                    onChange={update}
                                    placeholder="Required quantity"
                                />

                                {/* PREMIUM CATEGORY */}

                                <PremiumQuoteDropdown
                                    label="Category"
                                    value={
                                        form.category
                                    }
                                    placeholder="Select category"
                                    options={[
                                        "Power Tools",
                                        "Hand Tools",
                                        "Electrical",
                                        "Plumbing",
                                        "Hardware",
                                        "Fasteners",
                                        "Safety",
                                        "Paint & Adhesives",
                                        "Construction Materials",
                                        "HVAC",
                                        "Multiple Categories",
                                    ]}
                                    onChange={(value) =>
                                        updateSelect(
                                            "category",
                                            value
                                        )
                                    }
                                />

                                {/* PREMIUM BRAND */}

                                <PremiumQuoteDropdown
                                    label="Preferred Brand"
                                    value={
                                        form.brand
                                    }
                                    placeholder="Select preferred brand"
                                    options={[
                                        "DeWalt",
                                        "Bosch",
                                        "Stanley",
                                        "3M",
                                        "Sika",
                                        "Fischer",
                                        "Hepworth",
                                        "Mueller",
                                        "Dormakaba",
                                        "Fluke",
                                        "No Preference",
                                        "Multiple Brands",
                                    ]}
                                    onChange={(value) =>
                                        updateSelect(
                                            "brand",
                                            value
                                        )
                                    }
                                />

                                {/* Reference Number */}

                                <QuoteField
                                    label="Ref Number"
                                    name="refNumber"
                                    value={
                                        form.refNumber
                                    }
                                    onChange={update}
                                    placeholder="Enter reference number"
                                />

                                {/* Delivery */}

                                <div className="lg:col-span-2">

                                    <QuoteField
                                        label="Delivery Location"
                                        name="deliveryLocation"
                                        value={
                                            form.deliveryLocation
                                        }
                                        onChange={update}
                                        placeholder="Dubai, Ajman, Sharjah, Abu Dhabi..."
                                        required
                                    />

                                </div>

                            </div>

                            {/* Description */}

                            <div className="mt-5 sm:mt-6">

                                <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">
                                    Description / Requirement
                                </label>

                                <textarea
                                    rows={7}
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={update}
                                    placeholder="Product specifications and requirements..."
                                    className="min-h-[150px] w-full min-w-0 resize-y rounded-[16px] border border-black/[0.10] bg-white p-4 text-[14px] leading-6 text-[#202521] outline-none transition-all placeholder:text-black/30 hover:border-black/20 focus:border-[#101411]/30 focus:ring-4 focus:ring-[#D8FF65]/20 sm:min-h-[170px] sm:rounded-[18px] sm:p-5 sm:leading-7"
                                />

                            </div>

                            {/* Footer */}

                            <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">

                                <p className="max-w-md text-[11px] leading-5 text-[#737A74]">

                                    Product information
                                    is automatically
                                    fetched from your
                                    cart. You can edit
                                    the details before
                                    submitting.

                                </p>

                                <button
                                    type="submit"
                                    className="group flex h-[56px] w-full items-center justify-between gap-5 rounded-full bg-[#101411] pl-6 pr-2 text-[13px] font-semibold text-white transition hover:bg-[#1B211D] sm:h-[58px] sm:gap-7 sm:pl-7 sm:text-[14px] lg:w-auto lg:min-w-[205px]"
                                >

                                    Submit Quote

                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411] transition-transform duration-300 group-hover:rotate-45">

                                        <ArrowUpRight className="h-4 w-4" />

                                    </span>

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

/* =========================================================
   QUOTE FIELD
========================================================= */

function QuoteField({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    type = "text",
    required = false,
}) {
    return (
        <div className="min-w-0">

            <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">

                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}

            </label>

            <input
                required={required}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-[54px] w-full min-w-0 rounded-[14px] border border-black/[0.10] bg-white px-4 text-[14px] font-medium text-[#202521] outline-none transition-all placeholder:text-black/30 hover:border-black/20 focus:border-[#101411]/30 focus:ring-4 focus:ring-[#D8FF65]/20 sm:h-[58px] sm:rounded-[16px]"
            />

        </div>
    );
}

/* =========================================================
   PREMIUM QUOTE DROPDOWN
========================================================= */

function PremiumQuoteDropdown({
    label,
    value,
    placeholder,
    options = [],
    onChange,
}) {
    const [open, setOpen] =
        useState(false);

    return (
        <div className="relative z-[60] min-w-0">

            {/* Label */}

            <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">
                {label}
            </label>

            {/* Button */}

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (prev) => !prev
                    )
                }
                className={`
          group
          flex
          h-[54px]
          w-full
          min-w-0
          items-center
          justify-between
          gap-4
          rounded-[14px]
          border
          sm:h-[58px]
          sm:rounded-[16px]
          bg-white
          pl-4
          pr-2.5
          text-left
          transition-all
          duration-300

          ${open
                        ? "border-[#101411]/30 ring-4 ring-[#D8FF65]/20"
                        : "border-black/[0.10] hover:border-black/20"
                    }
        `}
            >

                <span
                    className={`
            min-w-0
            flex-1
            truncate
            text-[14px]
            font-medium

            ${value
                            ? "text-[#202521]"
                            : "text-black/35"
                        }
          `}
                >

                    {value ||
                        placeholder}

                </span>

                <span
                    className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            transition-all
            duration-300

            ${open
                            ? "rotate-180 bg-[#D8FF65] text-[#101411]"
                            : "bg-[#F1F3ED] text-[#535A54]"
                        }
          `}
                >

                    <ChevronDown className="h-4 w-4" />

                </span>

            </button>

            {/* Menu */}

            {open && (

                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[500] min-w-0 overflow-hidden rounded-[16px] border border-black/[0.08] bg-white p-2 shadow-[0_25px_70px_rgba(0,0,0,.16)] sm:top-[calc(100%+10px)] sm:rounded-[20px]">

                    <div className="border-b border-black/[0.06] px-3 pb-2 pt-1">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/40">

                            Choose {label}

                        </p>

                    </div>

                    <div className="mt-2 max-h-[190px] space-y-1 overflow-y-auto overscroll-contain sm:max-h-[220px] lg:max-h-[250px]">

                        {options.map(
                            (option) => {

                                const selected =
                                    value ===
                                    option;

                                return (

                                    <button
                                        type="button"
                                        key={option}
                                        onClick={() => {
                                            onChange(
                                                option
                                            );

                                            setOpen(
                                                false
                                            );
                                        }}
                                        className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      rounded-[13px]
                      px-3.5
                      py-3
                      text-left
                      transition-all
                      duration-200

                      ${selected
                                                ? "bg-[#D8FF65] text-[#101411]"
                                                : "text-[#454B46] hover:bg-[#F1F3ED]"
                                            }
                    `}
                                    >

                                        <span className="text-[13px] font-semibold">
                                            {option}
                                        </span>

                                        {selected && (

                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#101411] text-white">

                                                <Check className="h-3 w-3" />

                                            </span>

                                        )}

                                    </button>

                                );
                            }
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}