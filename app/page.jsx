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
   PERFORMANCE NOTE
   Heavy blur/backdrop effects, motion transforms and animated
   hover effects were removed to avoid iPhone WebKit scroll jank.
========================================================= */

/* =========================================================
   SETTINGS
========================================================= */

const PRODUCTS_PER_PAGE = 12; // 3 rows × 4 products on desktop

/* =========================================================
   FILTER DATA
========================================================= */

const availabilityOptions = ["All Availability", "In Stock", "Low Stock"];

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
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const productCategories = useMemo(
    () => [
      "All Products",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ],
    [products],
  );

  const productBrands = useMemo(
    () => [
      "All Brands",
      ...new Set(
        products
          .map((product) => product.brand)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ],
    [products],
  );
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [category, setCategory] = useState("All Products");

  const [brand, setBrand] = useState("All Brands");

  const [availability, setAvailability] = useState("All Availability");

  const [sort, setSort] = useState("Default");

  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [cart, setCart] = useState([]);

  const [selectedQuantities, setSelectedQuantities] = useState({});

  const [cartLoaded, setCartLoaded] = useState(false);

  const searchSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return products
      .filter((product) => {
        const fields = [
          product.name,
          product.brand,
          product.category,
          product.sku,
        ];

        return fields.some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(query),
        );
      })
      .slice(0, 6);
  }, [products, search]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError("");
      try {
        const response = await fetch("/api/store/products", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || "Unable to load products.");
        }
        const records = Array.isArray(payload.products) ? payload.products : [];
        setProducts(
          records
            .map((product) => ({
              ...product,
              id: String(product.id ?? product._id ?? ""),
              price: Number(product.price || 0),
              oldPrice:
                product.oldPrice === "" || product.oldPrice == null
                  ? null
                  : Number(product.oldPrice),
              unit: String(product.unit || "").trim(),
              stock: Number(product.stock || 0),
              description:
                product.description ||
                product.shortDescription ||
                "Product details will be available soon.",
            }))
            .filter((product) => product.id),
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load storefront products:", error);
          setProductsError(
            error.message || "Unable to load products. Please try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const [cartOpen, setCartOpen] = useState(false);

  /* =========================================================
        CART DRAWER CLOSE HELPER
     ========================================================= */

  const closeCart = () => {
    setCartOpen(false);
  };

  /* =========================================================
       ESC KEY + BODY SCROLL LOCK
    ========================================================= */

  useEffect(() => {
    if (!cartOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cartOpen]);

  /* =========================================================
       FILTER PRODUCTS
    ========================================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

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
          .includes(searchValue),
      );
    }

    if (category !== "All Products") {
      result = result.filter((product) => product.category === category);
    }

    if (brand !== "All Brands") {
      result = result.filter((product) => product.brand === brand);
    }

    if (availability === "In Stock") {
      result = result.filter((product) => product.stock > 0);
    }

    if (availability === "Low Stock") {
      result = result.filter(
        (product) => product.stock > 0 && product.stock <= 15,
      );
    }

    if (sort === "Price Low to High") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "Name A-Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, category, brand, availability, sort]);

  /* =========================================================
   LOAD SHARED CART
========================================================= */

  useEffect(() => {
    // Read browser storage after mount. Scheduling the state update avoids
    // synchronously cascading another render from inside the effect.
    const timer = window.setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("toprange_cart");

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }
      } catch (error) {
        console.error("Unable to load cart:", error);
      } finally {
        setCartLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  /* =========================================================
       SAVE + SYNC SHARED CART
    ========================================================= */

  useEffect(() => {
    if (!cartLoaded) {
      return;
    }

    try {
      localStorage.setItem("toprange_cart", JSON.stringify(cart));

      window.dispatchEvent(new Event("toprange-cart-updated"));
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart, cartLoaded]);

  /* =========================================================
       PAGINATION
    ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  // Keep pagination within bounds during render, without a corrective effect.
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;

  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    setTimeout(() => {
      document.getElementById("products-section")?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }, 50);
  };

  /* =========================================================
       CART
    ========================================================= */

  const getSelectedQuantity = (product) => {
    const maxQuantity = Math.max(0, Number(product?.stock || 0));
    const selected = Number(selectedQuantities[String(product?.id)] || 1);

    if (maxQuantity <= 0) return 0;

    return Math.min(maxQuantity, Math.max(1, selected));
  };

  const changeSelectedQuantity = (product, amount) => {
    const id = String(product?.id || "");
    const maxQuantity = Math.max(0, Number(product?.stock || 0));

    if (!id || maxQuantity <= 0) return;

    setSelectedQuantities((current) => {
      const currentQuantity = Number(current[id] || 1);

      return {
        ...current,
        [id]: Math.min(maxQuantity, Math.max(1, currentQuantity + amount)),
      };
    });
  };

  const addToCart = (product) => {
    if (!product?.id || Number(product.stock || 0) <= 0) return;

    const selectedQuantity = getSelectedQuantity(product);

    setCart((current) => {
      const existing = current.find(
        (item) => String(item.id) === String(product.id),
      );

      if (existing) {
        return current.map((item) =>
          String(item.id) === String(product.id)
            ? {
              ...item,
              ...product,
              quantity: Math.min(
                Number(product.stock),
                Number(item.quantity || 1) + selectedQuantity,
              ),
            }
            : item,
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: selectedQuantity,
        },
      ];
    });

    setCartOpen(true);
  };

  const updateQuantity = (id, amount) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
              ...item,
              quantity: Math.min(
                Number(item.stock || 0),
                Math.max(0, Number(item.quantity || 1) + amount),
              ),
            }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeProduct = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  /* =========================================================
       RESET FILTERS
    ========================================================= */

  const resetFilters = () => {
    setCurrentPage(1);
    setSearch("");
    setCategory("All Products");
    setBrand("All Brands");
    setAvailability("All Availability");
    setSort("Default");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".search-suggestions-container")) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

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
              backgroundImage: "url('/Assets/Product Banner.jpg')",
            }}
          />

          {/* Dark Overlays */}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,13,0.98)_0%,rgba(7,16,13,0.93)_42%,rgba(7,16,13,0.72)_72%,rgba(7,16,13,0.55)_100%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,16,13,0.98)_0%,rgba(7,16,13,0.28)_55%,rgba(7,16,13,0.12)_100%)]" />

          {/* Glows */}

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
                  <span className="text-[#D8FF65]">project needs.</span>
                </h1>

                <p className="mt-7 max-w-2xl text-[16px] leading-8 text-white/80 md:text-[18px]">
                  Explore professional building materials, power tools,
                  hardware, plumbing, electrical supplies and construction
                  products from trusted manufacturers.
                </p>
              </div>

              {/* Quote Card */}


              <div className="rounded-[30px] border border-white/15 bg-[#111713] p-7 shadow-[0_16px_40px_rgba(0,0,0,.18)]">

                <h3 className="mt-6 text-[29px] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                  Explore in your
                  <br />
                  preferred language.
                </h3>


                <div className="mt-7">
                  <LanguageSelector />
                </div>
              </div>

            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mt-14 flex flex-col gap-2 rounded-[24px] border border-[#698518] bg-[#111713] p-2 shadow-[0_12px_30px_rgba(0,0,0,.14)] md:flex-row">
              <div className="relative min-w-0 flex-1 search-suggestions-container">
                <div className="flex items-center gap-4 px-4">
                  <Search className="h-5 w-5 shrink-0 text-white/75 " />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                      setSearchFocused(true);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchFocused(false);
                      }

                      if (e.key === "Enter" && searchSuggestions.length > 0) {
                        e.preventDefault();
                        setSearch(searchSuggestions[0].name || "");
                        setCurrentPage(1);
                        setSearchFocused(false);
                      }
                    }}
                    placeholder="Search products, brands, categories or SKU..."
                    aria-label="Search products"
                    autoComplete="off"
                    className="h-14 w-full bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/55"
                  />
                </div>

                {searchFocused && search.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[#171917] shadow-2xl">
                    {searchSuggestions.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto py-2">
                        {searchSuggestions.map((product, index) => (
                          <button
                            key={
                              product.id ??
                              product.sku ??
                              `${product.name}-${index}`
                            }
                            type="button"
                            onClick={() => {
                              setSearch(product.name || "");
                              setCurrentPage(1);
                              setSearchFocused(false);
                            }}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left  hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-white">
                                {product.name || "Unnamed product"}
                              </span>

                              <span className="mt-1 block truncate text-xs text-white/55">
                                {[product.brand, product.category, product.sku]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </span>

                            <ArrowUpRight className="h-4 w-4 shrink-0 text-white/60" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-4 py-4 text-sm text-white/60">
                        No matching products found.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="flex h-14 items-center justify-center gap-3 rounded-[17px] bg-[#D8FF65] px-7 text-[14px] font-semibold text-[#101411]  hover:bg-white"
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
              {productCategories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    // Selecting All Products should clear any other
                    // active filters so the full catalogue is visible.
                    if (item === "All Products") {
                      setSearch("");
                      setBrand("All Brands");
                      setAvailability("All Availability");
                      setCurrentPage(1);
                    } else {
                      setCurrentPage(1);
                    }
                  }}
                  className={`
                      rounded-full
                      px-5
                      py-3
                      text-[12px]
                      font-semibold



                      ${category === item
                      ? "bg-[#101411] text-white"
                      : "bg-[#F0F2EC] text-[#3F4540] hover:bg-[#D8FF65] hover:text-black"
                    }
                    `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section id="products-section" className="scroll-mt-24 py-12 md:py-16">
          <div className="mx-auto max-w-[1450px] px-5 md:px-10 lg:px-14">
            {/* =================================================
                FILTER PANEL
            ================================================= */}

            {showFilters && (
              <div className="mb-8 grid gap-4 rounded-[28px] border border-black/[0.07] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,.05)] sm:grid-cols-2 lg:grid-cols-4">
                <FilterDropdown
                  label="Category"
                  value={category}
                  options={productCategories}
                  onChange={(value) => {
                    setCategory(value);
                    setCurrentPage(1);
                  }}
                />

                <FilterDropdown
                  label="Brand"
                  value={brand}
                  options={productBrands}
                  onChange={(value) => {
                    setBrand(value);
                    setCurrentPage(1);
                  }}
                />

                <FilterDropdown
                  label="Availability"
                  value={availability}
                  options={availabilityOptions}
                  onChange={(value) => {
                    setAvailability(value);
                    setCurrentPage(1);
                  }}
                />

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="h-[54px] w-full rounded-[15px] border border-black/10 bg-[#F4F5EF] text-[13px] font-semibold text-[#303530]  hover:bg-[#101411] hover:text-white"
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
                  {productsLoading
                    ? "Loading catalogue…"
                    : productsError
                      ? "Catalogue unavailable"
                      : `${filteredProducts.length} products found`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <FilterDropdown
                  value={sort}
                  options={sortOptions}
                  onChange={(value) => {
                    setSort(value);
                    setCurrentPage(1);
                  }}
                  compact
                />

                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
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

            {!productsLoading &&
              !productsError &&
              filteredProducts.length > 0 && (
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[13px] font-medium text-[#5B625C]">
                    Showing{" "}
                    <span className="font-bold text-[#101411]">
                      {startIndex + 1}
                    </span>{" "}
                    –{" "}
                    <span className="font-bold text-[#101411]">
                      {Math.min(endIndex, filteredProducts.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-[#101411]">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </p>

                  {totalPages > 1 && (
                    <p className="hidden text-[13px] font-medium text-[#606761] sm:block">
                      Page{" "}
                      <span className="font-bold text-[#101411]">
                        {currentPage}
                      </span>{" "}
                      of {totalPages}
                    </p>
                  )}
                </div>
              )}

            {/* =================================================
                PRODUCT GRID
            ================================================= */}

            {productsLoading ? (
              <div
                className="rounded-[30px] border border-black/[0.08] bg-white py-20 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="mx-auto h-8 w-8  rounded-full border-2 border-black/15 border-t-[#101411]" />
                <p className="mt-4 text-[14px] font-medium text-[#626963]">
                  Loading products…
                </p>
              </div>
            ) : productsError ? (
              <div
                className="rounded-[30px] border border-red-200 bg-white px-6 py-16 text-center"
                role="alert"
              >
                <h3 className="text-[22px] font-semibold text-[#101411]">
                  Products could not be loaded
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-[14px] text-[#626963]">
                  {productsError}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-full bg-[#101411] px-7 py-3.5 text-[13px] font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => {
                  const added = cart.some((item) => item.id === product.id);
                  const selectedQuantity = getSelectedQuantity(product);

                  const cardStyle = getCategoryCardStyle();

                  return (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-[28px] border border-black/[0.10] bg-white shadow-[0_10px_28px_rgba(16,20,17,.08)]    hover:border-black/[0.16] "
                    >
                      <div className={`h-2 w-full ${cardStyle.accent}`} />

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

                        <Link href={product.productLink} className="block">
                          <h3 className="mt-4 text-[25px] font-bold leading-[1.13] tracking-[-0.038em] text-[#101411]  hover:text-[#52651A] md:text-[28px]">
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
                              {product.stock <= 0
                                ? "Out of Stock"
                                : product.stock <= 15
                                  ? `Only ${product.stock} left`
                                  : "In Stock"}
                            </p>
                          </div>
                        </div>

                        {/* QUANTITY BY UNIT */}

                        {product.stock > 0 && (
                          <div className="mt-4 flex items-center justify-between gap-4 rounded-[16px] border border-black/[0.06] bg-[#F5F6F1] px-4 py-3">
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A817A]">
                                Quantity
                              </p>

                              <p className="mt-1 truncate text-[12px] font-bold text-[#303630]">
                                {product.unit || "Unit"}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 rounded-full bg-white p-1">
                              <button
                                type="button"
                                aria-label={`Decrease ${product.unit || "unit"} quantity`}
                                disabled={selectedQuantity <= 1}
                                onClick={() =>
                                  changeSelectedQuantity(product, -1)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.07] text-[#303630] disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <Minus className="h-3 w-3" />
                              </button>

                              <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={selectedQuantity}
                                onChange={(e) => {
                                  const value = Math.max(
                                    1,
                                    Math.min(Number(product.stock), Number(e.target.value) || 1)
                                  );

                                  setSelectedQuantities((prev) => ({
                                    ...prev,
                                    [String(product.id)]: value,
                                  }));
                                }}
                                className="h-8 w-[65px] rounded-full bg-transparent text-center text-[12px] font-bold text-[#101411] outline-none"
                              />

                              <button
                                type="button"
                                aria-label={`Increase ${product.unit} quantity`}
                                disabled={
                                  selectedQuantity >= Number(product.stock || 0)
                                }
                                onClick={() =>
                                  changeSelectedQuantity(product, 1)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#101411] text-white disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Price */}

                        <div className="mt-5 flex items-end justify-between border-t border-black/[0.08] pt-5">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#626963]">
                              Starting Price
                            </p>

                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[22px] font-bold tracking-[-0.03em] text-[#101411]">
                                AED {product.price}
                              </span>

                              {product.oldPrice && (
                                <span className="text-[12px] font-medium text-[#8B918C] line-through">
                                  AED {product.oldPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={product.stock <= 0}
                            onClick={() => addToCart(product)}
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



                                ${product.stock <= 0
                                ? "cursor-not-allowed bg-black/10 text-black/40"
                                : added
                                  ? "bg-[#D8FF65] text-[#101411]"
                                  : "bg-[#101411] text-white hover:bg-[#D8FF65] hover:text-[#101411]"
                              }
                              `}
                          >
                            {product.stock <= 0 ? (
                              "Out of Stock"
                            ) : added ? (
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

                        <a
                          href={product.productLink}
                          className="group/details mt-5 flex items-center justify-between border-t border-black/[0.08] pt-4 text-[12px] font-semibold text-[#303630]"
                        >
                          View Product Details
                          <ArrowUpRight className="h-4 w-4    " />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[30px] border border-dashed border-black/15 bg-white py-24 text-center">
                <Search className="mx-auto h-10 w-10 text-black/25" />

                <h3 className="mt-5 text-[25px] font-semibold text-[#101411]">
                  No products found
                </h3>

                <p className="mt-2 text-[14px] text-[#626963]">
                  Try adjusting your search, category or filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-full bg-[#101411] px-7 py-3.5 text-[13px] font-semibold text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}

            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            )}
          </div>
        </section>

        {/* =====================================================
            PROCUREMENT CTA
        ===================================================== */}

        <section className="px-5 pb-20 md:px-10 lg:px-14">
          <div className="relative mx-auto max-w-[1450px] overflow-hidden rounded-[38px] bg-[#101411] text-white shadow-[0_14px_38px_rgba(0,0,0,.10)]">
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
                    <span className="text-white/65">Multiple products.</span>
                  </h2>

                  <p className="mt-7 max-w-2xl text-[15px] leading-8 text-white/75 md:text-[16px]">
                    Planning a project or purchasing in bulk? Share your
                    required products, quantities, preferred brands and delivery
                    requirements.
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
                <div className="flex h-full flex-col justify-between rounded-[30px] border border-white/10 bg-[#1A201C] p-7 sm:p-9">
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
                      Complete one enquiry with your company, products,
                      quantities and delivery details.
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

                  <Link
                    href="/contact"
                    className="group mt-9 flex h-[60px] w-full items-center justify-between rounded-full bg-[#D8FF65] pl-7 pr-2 text-[14px] font-semibold text-black  hover:bg-white"
                  >
                    Get in Touch.
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101411] text-white   ">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
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
            className="absolute inset-0 z-0 cursor-default bg-black/65"
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

                <h3 className="mt-1 text-[27px] font-semibold">Your Cart</h3>
              </div>

              <button
                type="button"
                aria-label="Close cart"
                onClick={closeCart}
                className="relative z-20 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#101411] shadow-[0_8px_24px_rgba(0,0,0,.08)]  hover:bg-[#101411] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#D8FF65]/30"
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
                    Add products to request a quotation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
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

                          {item.unit && (
                            <p className="mt-1 text-[10px] font-semibold text-[#6B726C]">
                              Unit: {item.unit}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeProduct(item.id)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4F5EF] text-black/50  hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Quantity */}

                      <div className="mt-4 flex items-center justify-between border-t border-black/[0.07] pt-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5B625C]">
                          Quantity{item.unit ? ` (${item.unit})` : ""}
                        </span>

                        <div className="flex items-center gap-3 rounded-full bg-[#F4F5EF] p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="min-w-5 text-center text-[12px] font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#101411] text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    {cartTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-[#6A716B]">
                  Final pricing may vary based on quantity, availability and
                  delivery.
                </p>

                <Link
                  href="/cart"
                  className="mt-6 flex h-14 w-full items-center justify-between rounded-full bg-[#101411] pl-6 pr-2 text-[14px] font-semibold text-white"
                >
                  Continue Shopping
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8FF65] text-black">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            )}
          </aside>
        </div>
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
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {label && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#505751]">
          {label}
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex
          items-center
          justify-between
          gap-4
          border
          bg-white
          text-left



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
          className={`h-4 w-4 shrink-0  ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] max-h-[300px] overflow-y-auto rounded-[18px] border border-black/[0.08] bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,.10)]">
          {options.map((option) => (
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


                  ${value === option
                  ? "bg-[#D8FF65] text-[#101411]"
                  : "text-[#454B46] hover:bg-[#F2F4EE]"
                }
                `}
            >
              {option}

              {value === option && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({ currentPage, totalPages, onPageChange }) {
  const createPages = () => {
    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
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

  const pages = createPages();

  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-black/[0.08] pt-8 sm:flex-row">
      <p className="text-[13px] font-medium text-[#5D645E]">
        Page <span className="font-bold text-[#101411]">{currentPage}</span> of{" "}
        <span className="font-bold text-[#101411]">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-[12px] font-semibold  hover:bg-[#101411] hover:text-white disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft className="h-3.5 w-3.5" />

          <span className="hidden sm:inline">Previous</span>
        </button>

        {pages.map((page, index) =>
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
              onClick={() => onPageChange(page)}
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


                  ${currentPage === page
                  ? "bg-[#101411] text-white"
                  : "border border-black/10 bg-white text-[#303530] hover:bg-[#D8FF65]"
                }
                `}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-11 items-center gap-2 rounded-full bg-[#D8FF65] px-4 text-[12px] font-bold text-black  hover:bg-[#101411] hover:text-white disabled:pointer-events-none disabled:opacity-30"
        >
          <span className="hidden sm:inline">Next</span>

          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PROCUREMENT FEATURE
========================================================= */

function ProcurementFeature({ icon: Icon, number, title, description }) {
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

      <h4 className="mt-5 text-[15px] font-semibold text-white">{title}</h4>

      <p className="mt-2 text-[12px] leading-5 text-white/70">{description}</p>
    </div>
  );
}

/* =========================================================
   Language
========================================================= */

function LanguageSelector() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const existingLanguage = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));

    if (existingLanguage) {
      const code = existingLanguage.split("=")[1]?.split("/").pop();
      if (["en", "hi", "ur"].includes(code)) {
        setLanguage(code);
      }
    }

    window.googleTranslateElementInit = function () {
      if (
        window.google?.translate?.TranslateElement &&
        !document.querySelector("#google_translate_element select")
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,ur",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    } else if (
      !document.getElementById("google-translate-script")
    ) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (code) => {
    if (code === language) return;

    setLanguage(code);

    const cookieValue = `/en/${code}`;

    document.cookie =
      `googtrans=${cookieValue};path=/;SameSite=Lax`;

    const select = document.querySelector(
      "#google_translate_element select.goog-te-combo"
    );

    if (select) {
      select.value = code;
      select.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    } else {
      // Reload to apply the selected translation cookie.
      window.location.reload();
    }
  };

  const languages = [
    {
      code: "en",
      name: "English",
      native: "English",
    },
    {
      code: "hi",
      name: "Hindi",
      native: "हिन्दी",
    },
    {
      code: "ur",
      name: "Urdu",
      native: "اردو",
    },
  ];

  return (
    <>
      <div
        id="google_translate_element"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      />

      <div className="space-y-2">
        {languages.map((item) => {
          const active = language === item.code;

          return (
            <button
              key={item.code}
              type="button"
              onClick={() => changeLanguage(item.code)}
              className={`flex w-full items-center justify-between rounded-[16px] border px-4 py-3.5 text-left transition-colors ${active
                ? "border-[#D8FF65] bg-[#D8FF65] text-[#101411]"
                : "border-white/10 bg-white/5 text-white hover:border-[#D8FF65]/60 hover:bg-white/10"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[23px]">
                  {item.flag}
                </span>

                <div>
                  <p className="text-[13px] font-semibold">
                    {item.name}
                  </p>

                  <p
                    className={`mt-0.5 text-[12px] ${active
                      ? "text-black/60"
                      : "text-white/55"
                      }`}
                  >
                    {item.native}
                  </p>
                </div>
              </div>

              {active ? (
                <Check className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}



/* =========================================================
   QUOTE PREVIEW
========================================================= */

function QuotePreviewRow({ title, value }) {
  return (
    <div className="flex gap-4 rounded-[16px] border border-white/10 bg-black/10 p-4">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D8FF65]">
        <Check className="h-3 w-3 text-black" />
      </span>

      <div>
        <p className="text-[13px] font-semibold text-white">{title}</p>

        <p className="mt-1 text-[12px] leading-5 text-white/70">{value}</p>
      </div>
    </div>
  );
}
