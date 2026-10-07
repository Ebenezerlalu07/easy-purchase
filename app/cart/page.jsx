"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronDown,
    ChevronRight,
    Minus,
    PackageCheck,
    Plus,
    ShoppingBag,
    Trash2,
    X,
} from "lucide-react";

const CART_STORAGE_KEY = "toprange_cart";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [quoteOpen, setQuoteOpen] = useState(false);

    /* =========================================================
       LOAD CART
    ========================================================= */

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (!savedCart) {
                setCart([]);
                setLoaded(true);
                return;
            }

            const parsedCart = JSON.parse(savedCart);

            if (Array.isArray(parsedCart)) {
                setCart(parsedCart);
            } else {
                setCart([]);
            }
        } catch (error) {
            console.error("Unable to load cart:", error);

            setCart([]);
        } finally {
            setLoaded(true);
        }
    }, []);

    /* =========================================================
       SAVE CART
    ========================================================= */

    const saveCart = (updatedCart) => {
        setCart(updatedCart);

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(updatedCart)
        );

        /*
         * Updates navbar cart count immediately.
         */
        window.dispatchEvent(
            new Event("toprange-cart-updated")
        );
    };

    /* =========================================================
       INCREASE QUANTITY
    ========================================================= */

    const increaseQuantity = (id) => {
        const updatedCart = cart.map((item) => {
            if (item.id !== id) {
                return item;
            }

            return {
                ...item,
                quantity: Number(item.quantity || 1) + 1,
            };
        });

        saveCart(updatedCart);
    };

    /* =========================================================
       DECREASE QUANTITY
    ========================================================= */

    const decreaseQuantity = (id) => {
        const updatedCart = cart.map((item) => {
            if (item.id !== id) {
                return item;
            }

            return {
                ...item,
                quantity: Math.max(
                    1,
                    Number(item.quantity || 1) - 1
                ),
            };
        });

        saveCart(updatedCart);
    };

    /* =========================================================
       REMOVE PRODUCT
    ========================================================= */

    const removeProduct = (id) => {
        const updatedCart = cart.filter(
            (item) => item.id !== id
        );

        saveCart(updatedCart);
    };

    /* =========================================================
       CLEAR CART
    ========================================================= */

    const clearCart = () => {
        saveCart([]);
    };

    /* =========================================================
       TOTAL COUNT
    ========================================================= */

    const cartCount = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 1),
            0
        );
    }, [cart]);

    /* =========================================================
       TOTAL PRICE
    ========================================================= */

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const price = Number(item.price || 0);
            const quantity = Number(item.quantity || 1);

            return total + price * quantity;
        }, 0);
    }, [cart]);

    /* =========================================================
       LOADING
    ========================================================= */

    if (!loaded) {
        return (
            <main
                className="
          min-h-screen
          bg-[#F4F5EF]
          pt-32
        "
            >
                <div
                    className="
            mx-auto
            max-w-[1450px]
            px-5
            md:px-10
            lg:px-14
          "
                >
                    <div className="animate-pulse">
                        <div className="h-5 w-28 rounded-full bg-black/10" />

                        <div className="mt-5 h-16 max-w-xl rounded-2xl bg-black/10" />

                        <div
                            className="
                mt-12
                grid
                gap-5
                xl:grid-cols-[minmax(0,1fr)_390px]
              "
                        >
                            <div className="h-[400px] rounded-[28px] bg-black/10" />

                            <div className="h-[400px] rounded-[28px] bg-black/10" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <>
            <main
                className="
        min-h-screen
        overflow-x-hidden
        bg-[#F4F5EF]
        pb-20
        pt-28
        md:pt-32
      "
            >
                {/* =====================================================
          HERO / PAGE HEADER
      ====================================================== */}

                <section>
                    <div
                        className="
            mx-auto
            max-w-[1450px]
            px-5
            md:px-10
            lg:px-14
          "
                    >
                        {/* Breadcrumb */}

                        <div
                            className="
              flex
              items-center
              gap-2
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-black/35
            "
                        >
                            <Link
                                href="/"
                                className="
                transition
                hover:text-black
              "
                            >
                                Home
                            </Link>

                            <ChevronRight className="h-3 w-3" />

                            <span className="text-black/65">
                                Cart
                            </span>
                        </div>

                        {/* Header */}

                        <div
                            className="
              mt-7
              flex
              flex-col
              gap-7
              border-b
              border-black/10
              pb-10
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
                        >
                            <div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#D8FF65]
                  "
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                    </span>

                                    <span
                                        className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-black/40
                  "
                                    >
                                        Product Enquiry
                                    </span>
                                </div>

                                <h1
                                    className="
                  mt-5
                  font-display
                  text-[40px]
                  font-medium
                  leading-[0.95]
                  tracking-[-0.055em]
                  text-[#101411]
                  min-[380px]:text-[44px]
                  sm:text-[58px]
                  md:text-[70px]
                  lg:text-[78px]
                "
                                >
                                    Your product
                                    <br />

                                    <span className="text-black/30">
                                        selection.
                                    </span>
                                </h1>
                            </div>

                            <div className="max-w-md">
                                <p
                                    className="
                  text-sm
                  leading-7
                  text-black/45
                "
                                >
                                    Review your selected products, adjust quantities and
                                    send your requirements to our team for a quotation.
                                </p>

                                <div
                                    className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-black/60
                "
                                >
                                    <span className="h-2 w-2 rounded-full bg-[#94BE26]" />

                                    {cartCount}{" "}
                                    {cartCount === 1
                                        ? "product"
                                        : "products"}{" "}
                                    selected
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
          EMPTY CART
      ====================================================== */}

                {cart.length === 0 ? (
                    <section
                        className="
            mx-auto
            max-w-[1450px]
            px-5
            py-16
            md:px-10
            md:py-20
            lg:px-14
          "
                    >
                        <div
                            className="
              relative
              overflow-hidden
              rounded-[32px]
              bg-[#101411]
              px-6
              py-16
              text-center
              text-white
              md:px-12
              md:py-24
            "
                        >
                            {/* Glow */}

                            <div
                                className="
                pointer-events-none
                absolute
                -right-28
                -top-32
                h-[420px]
                w-[420px]
                rounded-full
                bg-[#D8FF65]/10
                blur-[120px]
              "
                            />

                            <div
                                className="
                pointer-events-none
                absolute
                -bottom-32
                -left-24
                h-[360px]
                w-[360px]
                rounded-full
                bg-[#C47A36]/10
                blur-[110px]
              "
                            />

                            <div className="relative z-10">
                                <span
                                    className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.06]
                "
                                >
                                    <ShoppingBag className="h-7 w-7 text-[#D8FF65]" />
                                </span>

                                <p
                                    className="
                  mt-7
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white/35
                "
                                >
                                    Your Selection
                                </p>

                                <h2
                                    className="
                  mx-auto
                  mt-4
                  max-w-2xl
                  text-[36px]
                  font-medium
                  leading-[1]
                  tracking-[-0.04em]
                  md:text-[52px]
                "
                                >
                                    Your cart is
                                    <span className="text-[#D8FF65]">
                                        {" "}empty.
                                    </span>
                                </h2>

                                <p
                                    className="
                  mx-auto
                  mt-5
                  max-w-md
                  text-sm
                  leading-7
                  text-white/40
                "
                                >
                                    Browse our product catalogue and add the materials you
                                    need for your project.
                                </p>

                                <Link
                                    href="/products"
                                    className="
                  group
                  mt-8
                  inline-flex
                  items-center
                  gap-5
                  rounded-full
                  bg-[#D8FF65]
                  py-2
                  pl-6
                  pr-2
                  text-sm
                  font-semibold
                  text-[#101411]
                  transition
                  duration-300
                  hover:bg-white
                "
                                >
                                    Explore Products

                                    <span
                                        className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-[#101411]
                    text-white
                  "
                                    >
                                        <ArrowUpRight
                                            className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:rotate-45
                    "
                                        />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </section>
                ) : (
                    /* =====================================================
                       CART CONTENT
                    ====================================================== */

                    <section className="py-10 md:py-12">
                        <div
                            className="
              mx-auto
              grid
              w-full
              max-w-[1450px]
              gap-6
              px-4
              sm:px-5
              md:px-8
              lg:px-10
              xl:grid-cols-[minmax(0,1fr)_390px]
              xl:items-start
              xl:px-14
            "
                        >
                            {/* =================================================
                LEFT - PRODUCTS
            ================================================== */}

                            <div>
                                {/* Top actions */}

                                <div
                                    className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  gap-4
                "
                                >
                                    <p
                                        className="
                    text-sm
                    font-semibold
                    text-[#101411]
                  "
                                    >
                                        Selected Products
                                    </p>

                                    <button
                                        type="button"
                                        onClick={clearCart}
                                        className="
                    group
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-black/35
                    transition
                    hover:text-red-500
                  "
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />

                                        Clear Cart
                                    </button>
                                </div>

                                {/* Products */}

                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <CartProduct
                                            key={item.id}
                                            item={item}
                                            increaseQuantity={increaseQuantity}
                                            decreaseQuantity={decreaseQuantity}
                                            removeProduct={removeProduct}
                                        />
                                    ))}
                                </div>

                                {/* Continue */}

                                <Link
                                    href="/products"
                                    className="
                  group
                  mt-6
                  inline-flex
                  items-center
                  gap-3
                  text-sm
                  font-semibold
                  text-[#101411]
                "
                                >
                                    <span
                                        className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/10
                    bg-white
                    transition
                    group-hover:bg-[#101411]
                    group-hover:text-white
                  "
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </span>

                                    Continue Shopping
                                </Link>
                            </div>

                            {/* =================================================
                RIGHT - SUMMARY
            ================================================== */}

                            <aside
                                className="
                w-full
                min-w-0
                xl:sticky
                xl:top-28
              "
                            >
                                <div
                                    className="
                  relative
                  isolate
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-white/10
                  bg-[#101411]
                  p-6
                  text-white
                  shadow-[0_30px_90px_rgba(0,0,0,.14)]
                  md:p-7
                "
                                >
                                    {/* Glows */}

                                    <div
                                        className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-56
                    w-56
                    rounded-full
                    bg-[#D8FF65]/10
                    blur-[80px]
                  "
                                    />

                                    <div
                                        className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-20
                    h-52
                    w-52
                    rounded-full
                    bg-[#C47A36]/10
                    blur-[80px]
                  "
                                    />

                                    <div className="relative z-10">
                                        {/* Header */}

                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p
                                                    className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.19em]
                          text-white/35
                        "
                                                >
                                                    Enquiry Summary
                                                </p>

                                                <h2
                                                    className="
                          mt-2
                          text-[26px]
                          font-medium
                          tracking-[-0.03em]
                        "
                                                >
                                                    Your selection
                                                </h2>
                                            </div>

                                            <span
                                                className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-[#D8FF65]
                        text-[#101411]
                      "
                                            >
                                                <ShoppingBag className="h-4 w-4" />
                                            </span>
                                        </div>

                                        {/* Summary rows */}

                                        <div
                                            className="
                      mt-8
                      space-y-4
                      border-y
                      border-white/10
                      py-6
                    "
                                        >
                                            <div
                                                className="
                        flex
                        items-center
                        justify-between
                        gap-5
                      "
                                            >
                                                <span className="text-sm text-white/40">
                                                    Products
                                                </span>

                                                <span className="text-sm font-semibold">
                                                    {cart.length}
                                                </span>
                                            </div>

                                            <div
                                                className="
                        flex
                        items-center
                        justify-between
                        gap-5
                      "
                                            >
                                                <span className="text-sm text-white/40">
                                                    Total Quantity
                                                </span>

                                                <span className="text-sm font-semibold">
                                                    {cartCount}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Estimated Total */}

                                        <div className="py-6">
                                            <p
                                                className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-white/30
                      "
                                            >
                                                Estimated Total
                                            </p>

                                            <div
                                                className="
                        mt-2
                        flex
                        items-end
                        gap-2
                      "
                                            >
                                                <span
                                                    className="
                          pb-1
                          text-sm
                          font-semibold
                          text-[#D8FF65]
                        "
                                                >
                                                    AED
                                                </span>

                                                <span
                                                    className="
                          text-[38px]
                          font-semibold
                          leading-none
                          tracking-[-0.045em]
                        "
                                                >
                                                    {cartTotal.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            <p
                                                className="
                        mt-3
                        text-[11px]
                        leading-5
                        text-white/30
                      "
                                            >
                                                Final pricing, availability and delivery charges
                                                can be confirmed by our sales team.
                                            </p>
                                        </div>

                                        {/* Quote CTA */}

                                        <button
                                            type="button"
                                            onClick={() => setQuoteOpen(true)}
                                            className="
                      group
                      flex
                      h-[58px]
                      w-full
                      items-center
                      justify-between
                      rounded-full
                      bg-[#D8FF65]
                      pl-6
                      pr-2
                      text-sm
                      font-semibold
                      text-[#101411]
                      transition
                      duration-300
                      hover:bg-white
                    "
                                        >
                                            Request Quotation

                                            <span
                                                className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-[#101411]
                        text-white
                      "
                                            >
                                                <ArrowRight
                                                    className="
                          h-4
                          w-4
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                                                />
                                            </span>
                                        </button>

                                        {/* Benefits */}

                                        <div
                                            className="
                      mt-6
                      space-y-3
                      border-t
                      border-white/10
                      pt-6
                    "
                                        >
                                            <SummaryFeature>
                                                Product availability confirmation
                                            </SummaryFeature>

                                            <SummaryFeature>
                                                Competitive project pricing
                                            </SummaryFeature>

                                            <SummaryFeature>
                                                Material sourcing assistance
                                            </SummaryFeature>
                                        </div>
                                    </div>
                                </div>

                                {/* Support card */}

                                <div
                                    className="
                  mt-3
                  rounded-[24px]
                  border
                  border-black/[0.07]
                  bg-white
                  p-5
                "
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#EEF2E5]
                    "
                                        >
                                            <PackageCheck className="h-5 w-5" />
                                        </span>

                                        <div>
                                            <p
                                                className="
                        text-sm
                        font-semibold
                        text-[#101411]
                      "
                                            >
                                                Need assistance?
                                            </p>

                                            <p
                                                className="
                        mt-1
                        text-xs
                        leading-5
                        text-black/40
                      "
                                            >
                                                Our team can help identify the right materials
                                                for your project.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </section>
                )}
            </main>

            {quoteOpen && (
                <QuoteModal
                    cart={cart}
                    onClose={() => setQuoteOpen(false)}
                />
            )}
        </>
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
                    className="relative z-10 w-full min-w-0 rounded-[22px] bg-[#F4F5EF] shadow-[0_40px_120px_rgba(0,0,0,.28)] sm:rounded-[30px] lg:rounded-[36px]"
                    onMouseDown={(event) => event.stopPropagation()}
                >

                    {/* Glow */}

                    <div className="pointer-events-none absolute -right-24 -top-24 h-[260px] w-[260px] rounded-full bg-[#D8FF65]/10 blur-[100px] sm:-right-40 sm:-top-40 sm:h-[420px] sm:w-[420px] sm:blur-[120px]" />

                    <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">

                        {/* Header */}

                        <div className="flex items-start justify-between gap-3 sm:gap-6">

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#727972] sm:text-[11px]">
                                    Project Enquiry
                                </p>

                                <h2 className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#101411] sm:mt-4 sm:text-[38px] md:text-[44px] lg:text-[48px]">
                                    Get a Quote
                                </h2>

                                {cart.length >
                                    0 && (

                                        <p className="mt-4 text-[14px] leading-6 text-[#626963]">

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
                                className="relative z-30 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#101411] shadow-[0_8px_25px_rgba(0,0,0,.08)] transition hover:bg-[#101411] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#D8FF65]/30 sm:h-12 sm:w-12"
                            >

                                <X className="pointer-events-none h-4 w-4" />

                            </button>

                        </div>

                        {/* =================================================
                SELECTED PRODUCTS
            ================================================= */}

                        {cart.length >
                            0 && (

                                <div className="mt-8 rounded-[22px] border border-black/[0.07] bg-white p-4 sm:p-5">

                                    <div className="flex items-center justify-between gap-4">

                                        <div>

                                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#697069]">
                                                Selected Products
                                            </p>

                                            <p className="mt-1 text-[13px] font-medium text-[#454B45]">
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
                                                    className="flex min-w-0 items-center gap-3 rounded-[16px] bg-[#F4F5EF] p-3"
                                                >



                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-[13px] font-semibold text-[#101411]">
                                                            {
                                                                item.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[10px] font-medium text-[#656C66]">

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
                            className="mt-9"
                        >

                            <div className="grid min-w-0 gap-x-5 gap-y-6 lg:grid-cols-2">

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

                            <div className="mt-6">

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
                                    className="w-full resize-none rounded-[18px] border border-black/[0.10] bg-white p-5 text-[14px] leading-7 text-[#202521] outline-none transition-all placeholder:text-black/30 hover:border-black/20 focus:border-[#101411]/30 focus:ring-4 focus:ring-[#D8FF65]/20"
                                />

                            </div>

                            {/* Footer */}

                            <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

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
                                    className="group flex h-[58px] w-full items-center justify-between gap-7 rounded-full bg-[#101411] pl-7 pr-2 text-[14px] font-semibold text-white transition hover:bg-[#1B211D] lg:w-auto lg:min-w-[200px]"
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
        <div>

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
                className="h-[58px] w-full rounded-[16px] border border-black/[0.10] bg-white px-4 text-[14px] font-medium text-[#202521] outline-none transition-all placeholder:text-black/30 hover:border-black/20 focus:border-[#101411]/30 focus:ring-4 focus:ring-[#D8FF65]/20"
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
        <div className="relative z-[60]">

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
          h-[58px]
          w-full
          items-center
          justify-between
          gap-4
          rounded-[16px]
          border
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

                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[500] overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-2 shadow-[0_25px_70px_rgba(0,0,0,.16)]">

                    <div className="border-b border-black/[0.06] px-3 pb-2 pt-1">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/40">

                            Choose {label}

                        </p>

                    </div>

                    <div className="mt-2 max-h-[190px] space-y-1 overflow-y-auto sm:max-h-[220px] lg:max-h-[250px]">

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

/* =========================================================
   CART PRODUCT
========================================================= */

function CartProduct({
    item,
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
}) {
    const quantity = Number(item.quantity || 1);

    const price = Number(item.price || 0);

    const total = price * quantity;

    return (
        <article
            className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-black/[0.06]
        bg-white
        p-4
        transition-all
        duration-300
        hover:border-black/10
        hover:shadow-[0_18px_50px_rgba(16,20,17,.06)]
        sm:p-5
      "
        >
            <div
                className="
          flex
          min-w-0
          flex-col
          gap-5
        "
            >
                {/* =================================================
            PRODUCT INFO
        ================================================== */}

                <div
                    className="
            min-w-0
            flex-1
            rounded-[20px]
            bg-[#F8F9F5]
            p-4
            sm:p-5
          "
                >
                    <div
                        className="
              flex
              items-start
              justify-between
              gap-5
            "
                    >
                        <div className="min-w-0">
                            <p
                                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#778073]
                "
                            >
                                {item.brand || "Top Range"}
                            </p>

                            <h3
                                className="
                  mt-2
                  text-[19px]
                  font-semibold
                  leading-6
                  tracking-[-0.025em]
                  text-[#101411]
                  md:text-[21px]
                "
                            >
                                {item.name || "Product"}
                            </h3>

                            {item.sku && (
                                <p
                                    className="
                    mt-2
                    text-[11px]
                    text-black/30
                  "
                                >
                                    SKU: {item.sku}
                                </p>
                            )}
                        </div>

                        {/* Remove */}

                        <button
                            type="button"
                            aria-label={`Remove ${item.name || "product"}`}
                            onClick={() =>
                                removeProduct(item.id)
                            }
                            className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#F4F5EF]
                text-black/35
                transition
                duration-300
                hover:bg-red-50
                hover:text-red-500
              "
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Bottom */}

                    <div
                        className="
              mt-5
              flex
              flex-col
              gap-4
              border-t
              border-black/[0.06]
              pt-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
                    >
                        {/* Quantity */}

                        <div>
                            <p
                                className="
                  mb-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-black/30
                "
                            >
                                Quantity
                            </p>

                            <div
                                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-black/[0.07]
                  bg-[#F4F5EF]
                  p-1
                "
                            >
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    onClick={() =>
                                        decreaseQuantity(item.id)
                                    }
                                    disabled={quantity <= 1}
                                    className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-[#101411]
                    transition
                    hover:bg-white
                    disabled:cursor-not-allowed
                    disabled:opacity-25
                  "
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>

                                <span
                                    className="
                    min-w-[42px]
                    text-center
                    text-sm
                    font-bold
                    tabular-nums
                  "
                                >
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    onClick={() =>
                                        increaseQuantity(item.id)
                                    }
                                    className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#101411]
                    text-white
                    transition
                    hover:bg-[#D8FF65]
                    hover:text-[#101411]
                  "
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Price */}

                        <div className="sm:text-right">
                            <p
                                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-black/30
                "
                            >
                                Item Total
                            </p>

                            <p
                                className="
                  mt-2
                  text-[21px]
                  font-bold
                  tracking-[-0.025em]
                  text-[#101411]
                "
                            >
                                <span
                                    className="
                    mr-1
                    text-[11px]
                    font-semibold
                    text-black/40
                  "
                                >
                                    AED
                                </span>

                                {total.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </p>

                            {price > 0 && quantity > 1 && (
                                <p className="mt-1 text-[10px] text-black/30">
                                    AED{" "}
                                    {price.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}{" "}
                                    each
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

/* =========================================================
   SUMMARY FEATURE
========================================================= */

function SummaryFeature({ children }) {
    return (
        <div
            className="
        flex
        items-center
        gap-3
        text-xs
        text-white/45
      "
        >
            <span
                className="
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#D8FF65]/10
          text-[#D8FF65]
        "
            >
                <Check className="h-3 w-3" />
            </span>

            {children}
        </div>
    );
}
