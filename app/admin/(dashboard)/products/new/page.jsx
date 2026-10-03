"use client";

import { useMemo, useRef, useState } from "react";
import {
    ArrowRight,
    Boxes,
    Check,
    ChevronDown,
    CircleDollarSign,
    Edit3,
    ImagePlus,
    Package,
    PackagePlus,
    Plus,
    Search,
    Sparkles,
    Tag,
    Trash2,
    Upload,
    X,
} from "lucide-react";

/* =========================================================
   OPTIONS
========================================================= */

const categories = [
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

const brands = [
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
];

const productStatuses = ["Active", "Draft", "Inactive"];

/* =========================================================
   PRODUCT DATA
========================================================= */

const initialProducts = [
    {
        id: 1,
        name: "Cordless Hammer Drill",
        sku: "TR-PT-001",
        category: "Power Tools",
        brand: "DeWalt",
        price: 699,
        oldPrice: 749,
        stock: 28,
        status: "Active",
        featured: true,
        image: "/Assets/Products/product1.jpg",
        shortDescription:
            "Professional cordless hammer drill for demanding construction applications.",
        description:
            "Professional cordless hammer drill for concrete, steel, timber and demanding construction applications.",
    },
    {
        id: 2,
        name: "Professional Angle Grinder",
        sku: "TR-PT-002",
        category: "Power Tools",
        brand: "Bosch",
        price: 419,
        oldPrice: "",
        stock: 18,
        status: "Active",
        featured: true,
        image: "/Assets/Products/product3.jpg",
        shortDescription:
            "High-performance angle grinder for professional cutting and finishing.",
        description:
            "High-performance angle grinder for professional cutting, grinding and finishing work.",
    },
    {
        id: 3,
        name: "Heavy Duty Combination Pliers",
        sku: "TR-HT-001",
        category: "Hand Tools",
        brand: "Stanley",
        price: 69,
        oldPrice: 79,
        stock: 64,
        status: "Active",
        featured: false,
        image: "/Assets/Products/product4.jpg",
        shortDescription:
            "Durable professional combination pliers for maintenance applications.",
        description:
            "Durable professional combination pliers for gripping, cutting and maintenance applications.",
    },
    {
        id: 4,
        name: "Digital Clamp Meter",
        sku: "TR-EL-001",
        category: "Electrical",
        brand: "Fluke",
        price: 289,
        oldPrice: "",
        stock: 9,
        status: "Active",
        featured: false,
        image: "/Assets/Products/angle grinder.jpg",
        shortDescription:
            "Professional digital electrical testing meter for maintenance teams.",
        description:
            "Digital electrical testing meter designed for professional maintenance and diagnostics.",
    },
    {
        id: 5,
        name: "Steel Bars",
        sku: "TR-CM-001",
        category: "Construction Materials",
        brand: "Hepworth",
        price: 42,
        oldPrice: "",
        stock: 120,
        status: "Active",
        featured: false,
        image: "/Assets/Products/Steel Bars.jpg",
        shortDescription:
            "Reliable construction material suitable for commercial projects.",
        description:
            "High-quality construction material for residential, commercial and industrial projects.",
    },
    {
        id: 6,
        name: "Circular Saw",
        sku: "TR-PT-003",
        category: "Power Tools",
        brand: "Bosch",
        price: 549,
        oldPrice: 599,
        stock: 22,
        status: "Active",
        featured: false,
        image: "/Assets/Products/Circular saw.jpg",
        shortDescription:
            "Professional circular saw for accurate and efficient cutting.",
        description:
            "Professional circular saw for timber, panels and general construction cutting applications.",
    },
    {
        id: 7,
        name: "Chainsaw",
        sku: "TR-PT-004",
        category: "Power Tools",
        brand: "DeWalt",
        price: 629,
        oldPrice: "",
        stock: 14,
        status: "Draft",
        featured: false,
        image: "/Assets/Products/chain saw.jpg",
        shortDescription:
            "Heavy-duty chainsaw for demanding professional applications.",
        description:
            "Heavy-duty chainsaw designed for reliable cutting performance in professional applications.",
    },
    {
        id: 8,
        name: "Cordless Impact Wrench",
        sku: "TR-PT-005",
        category: "Power Tools",
        brand: "DeWalt",
        price: 589,
        oldPrice: 649,
        stock: 31,
        status: "Active",
        featured: true,
        image: "/Assets/Products/wrench.jpg",
        shortDescription:
            "High-torque cordless impact wrench for construction and maintenance.",
        description:
            "High-torque cordless impact wrench for fastening, automotive and construction applications.",
    },
];

const defaultForm = {
    name: "",
    sku: "",
    category: "",
    brand: "",
    price: "",
    oldPrice: "",
    stock: "",
    status: "Active",
    shortDescription: "",
    description: "",
    featured: false,
};

/* =========================================================
   PAGE
========================================================= */

export default function ProductsPage() {
    const fileInputRef = useRef(null);

    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");

    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [brandOpen, setBrandOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                !query ||
                [
                    product.name,
                    product.sku,
                    product.category,
                    product.brand,
                    product.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "All" || product.status === statusFilter;

            const matchesCategory =
                categoryFilter === "All Categories" ||
                product.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [products, search, statusFilter, categoryFilter]);

    const activeCount = products.filter(
        (product) => product.status === "Active"
    ).length;

    const lowStockCount = products.filter(
        (product) => Number(product.stock) > 0 && Number(product.stock) <= 15
    ).length;

    const totalValue = products.reduce(
        (total, product) =>
            total + Number(product.price || 0) * Number(product.stock || 0),
        0
    );

    const updateForm = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSaved(false);
    };

    const handleImage = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please choose a valid image file.");
            return;
        }

        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        const previewUrl = URL.createObjectURL(file);
        setImageFile(file);
        setImagePreview(previewUrl);
        setError("");
    };

    const removeImage = () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        setImagePreview("");
        setImageFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openAddProduct = () => {
        setEditingProduct(null);
        setForm(defaultForm);
        removeImage();
        setError("");
        setSaved(false);
        setFormOpen(true);
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            sku: product.sku,
            category: product.category,
            brand: product.brand,
            price: String(product.price ?? ""),
            oldPrice: product.oldPrice ? String(product.oldPrice) : "",
            stock: String(product.stock ?? ""),
            status: product.status,
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            featured: Boolean(product.featured),
        });
        setImagePreview(product.image || "");
        setImageFile(null);
        setError("");
        setSaved(false);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingProduct(null);
        setCategoryOpen(false);
        setBrandOpen(false);
        setStatusOpen(false);
        setError("");
    };

    const resetForm = () => {
        if (editingProduct) {
            openEditProduct(editingProduct);
            return;
        }

        setForm(defaultForm);
        removeImage();
        setError("");
        setSaved(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            setError("Please enter the product name.");
            return;
        }

        if (!form.sku.trim()) {
            setError("Please enter the product SKU.");
            return;
        }

        if (!form.category) {
            setError("Please select a category.");
            return;
        }

        if (!form.brand) {
            setError("Please select a brand.");
            return;
        }

        if (!form.price) {
            setError("Please enter the product price.");
            return;
        }

        const productData = {
            name: form.name.trim(),
            sku: form.sku.trim(),
            category: form.category,
            brand: form.brand,
            price: Number(form.price),
            oldPrice: form.oldPrice ? Number(form.oldPrice) : "",
            stock: Number(form.stock || 0),
            status: form.status,
            shortDescription: form.shortDescription,
            description: form.description,
            featured: form.featured,
            image: imagePreview || "/Assets/Products/product1.jpg",
        };

        if (editingProduct) {
            setProducts((current) =>
                current.map((product) =>
                    product.id === editingProduct.id
                        ? { ...product, ...productData }
                        : product
                )
            );
        } else {
            setProducts((current) => [
                {
                    id: Date.now(),
                    ...productData,
                },
                ...current,
            ]);
        }

        setSaved(true);
        setError("");

        setTimeout(() => {
            closeForm();
        }, 600);
    };

    const deleteProduct = (id) => {
        setProducts((current) =>
            current.filter((product) => product.id !== id)
        );
    };

    return (
        <>
            <div className="w-full">
                {/* =====================================================
            HEADER
        ====================================================== */}

                <div className="flex flex-col gap-6 border-b border-black/[0.08] pb-7 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#94BE26]" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6D746D]">
                                Catalogue Management
                            </p>
                        </div>

                        <h1 className="mt-3 text-[36px] font-semibold leading-none tracking-[-0.045em] text-[#151814] sm:text-[42px] lg:text-[48px]">
                            Products
                        </h1>

                        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#686F68]">
                            View and manage all catalogue products, pricing, stock,
                            categories, brands and product status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddProduct}
                        className="group inline-flex h-11 items-center justify-between gap-5 self-start rounded-full bg-[#151814] pl-5 pr-1.5 text-[11px] font-bold text-white transition hover:bg-[#292F2A] lg:self-auto"
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="h-3.5 w-3.5" />
                            Add Product
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D8FF65] text-[#151814]">
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </button>
                </div>

                {/* =====================================================
            STATS
        ====================================================== */}

                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Products"
                        value={products.length}
                        description="Products in the catalogue"
                        icon={Package}
                        dark
                    />

                    <StatCard
                        title="Active Products"
                        value={activeCount}
                        description="Currently visible products"
                        icon={Check}
                    />

                    <StatCard
                        title="Low Stock"
                        value={lowStockCount}
                        description="Products with 15 or fewer items"
                        icon={Boxes}
                    />

                    <StatCard
                        title="Stock Value"
                        value={`AED ${Math.round(totalValue).toLocaleString()}`}
                        description="Estimated catalogue stock value"
                        icon={CircleDollarSign}
                    />
                </div>

                {/* =====================================================
            PRODUCT LIST
        ====================================================== */}

                <div className="mt-6 overflow-hidden rounded-[24px] border border-[#DADCD5] bg-white shadow-[0_12px_35px_rgba(20,24,20,0.04)]">
                    <div className="border-b border-black/[0.07] p-4 sm:p-5 lg:p-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div className="relative w-full xl:max-w-[430px]">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D837D]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search product, SKU, brand or category..."
                                    className="h-12 w-full rounded-[14px] border border-black/[0.08] bg-[#F5F5F0] pl-11 pr-4 text-[12px] font-medium text-[#202420] outline-none transition placeholder:text-[#929792] hover:border-black/15 focus:border-[#94BE26] focus:bg-white focus:ring-4 focus:ring-[#D8FF65]/20"
                                />
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <FilterSelect
                                    value={categoryFilter}
                                    options={["All Categories", ...categories]}
                                    onChange={setCategoryFilter}
                                />

                                <div className="overflow-x-auto">
                                    <div className="flex min-w-max gap-2">
                                        {["All", ...productStatuses].map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => setStatusFilter(item)}
                                                className={`rounded-full px-4 py-2.5 text-[10px] font-bold transition ${statusFilter === item
                                                        ? "bg-[#151814] text-white"
                                                        : "bg-[#F0F1EC] text-[#626862] hover:bg-[#D8FF65] hover:text-[#151814]"
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-black/[0.05] pt-4">
                            <p className="text-[11px] font-medium text-[#737973]">
                                Showing{" "}
                                <span className="font-bold text-[#202420]">
                                    {filteredProducts.length}
                                </span>{" "}
                                products
                            </p>
                        </div>
                    </div>

                    {/* DESKTOP TABLE */}

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[1150px] border-collapse">
                            <thead>
                                <tr className="border-b border-black/[0.07] bg-[#F5F5F0]">
                                    <TableHeading>Product</TableHeading>
                                    <TableHeading>Category</TableHeading>
                                    <TableHeading>Price</TableHeading>
                                    <TableHeading>Stock</TableHeading>
                                    <TableHeading>Status</TableHeading>
                                    <TableHeading>Actions</TableHeading>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-black/[0.055] transition hover:bg-[#FAFAF7] last:border-b-0"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-[#EEF1E8]">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(event) => {
                                                            event.currentTarget.onerror = null;
                                                            event.currentTarget.src =
                                                                "https://placehold.co/400x400/EEF0E8/101411?text=Product";
                                                        }}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="max-w-[260px] truncate text-[12px] font-bold text-[#202420]">
                                                            {product.name}
                                                        </p>

                                                        {product.featured && (
                                                            <span className="rounded-full bg-[#EFF5D7] px-2 py-1 text-[8px] font-bold text-[#60751E]">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-[9px] font-semibold text-[#858B85]">
                                                        {product.brand} · {product.sku}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-full bg-[#F0F2EC] px-3 py-2 text-[10px] font-bold text-[#4C534C]">
                                                {product.category}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="text-[13px] font-bold text-[#202420]">
                                                AED {Number(product.price).toLocaleString()}
                                            </p>

                                            {product.oldPrice && (
                                                <p className="mt-1 text-[9px] font-semibold text-[#969C96] line-through">
                                                    AED {Number(product.oldPrice).toLocaleString()}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-6 py-5">
                                            <StockBadge stock={product.stock} />
                                        </td>

                                        <td className="px-6 py-5">
                                            <StatusBadge status={product.status} />
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditProduct(product)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F1EC] text-[#424942] transition hover:bg-[#D8FF65]"
                                                    aria-label="Edit product"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F1EC] text-[#626862] transition hover:bg-red-50 hover:text-red-500"
                                                    aria-label="Delete product"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE / TABLET */}

                    <div className="grid gap-4 bg-[#F1F0EA] p-4 sm:p-5 md:grid-cols-2 lg:hidden">
                        {filteredProducts.map((product) => (
                            <article
                                key={product.id}
                                className="overflow-hidden rounded-[20px] border border-black/[0.07] bg-white shadow-sm"
                            >
                                <div className="relative h-[190px] bg-[#EEF1E8]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null;
                                            event.currentTarget.src =
                                                "https://placehold.co/600x400/EEF0E8/101411?text=Product";
                                        }}
                                    />

                                    <div className="absolute left-3 top-3">
                                        <StatusBadge status={product.status} />
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#707770]">
                                        {product.brand} · {product.sku}
                                    </p>

                                    <h3 className="mt-2 text-[17px] font-bold leading-5 text-[#202420]">
                                        {product.name}
                                    </h3>

                                    <p className="mt-2 text-[11px] text-[#666D66]">
                                        {product.category}
                                    </p>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <InfoBox
                                            label="Price"
                                            value={`AED ${Number(product.price).toLocaleString()}`}
                                        />
                                        <InfoBox label="Stock" value={`${product.stock} Items`} />
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEditProduct(product)}
                                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#151814] text-[10px] font-bold text-white"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                            Edit Product
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteProduct(product.id)}
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="px-5 py-20 text-center">
                            <Package className="mx-auto h-9 w-9 text-[#A2A7A2]" />
                            <h3 className="mt-4 text-[18px] font-bold text-[#202420]">
                                No products found
                            </h3>
                            <p className="mt-2 text-[12px] text-[#747A74]">
                                Try changing the search or filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================
          ADD / EDIT PRODUCT PANEL
      ====================================================== */}

            {formOpen && (
                <div className="fixed inset-0 z-[300] overflow-y-auto bg-[#07100D]/70 p-2 backdrop-blur-sm sm:p-4 lg:p-6">
                    <button
                        type="button"
                        aria-label="Close product form"
                        onClick={closeForm}
                        className="absolute inset-0"
                    />

                    <div className="relative mx-auto flex min-h-full w-full max-w-[1250px] items-start justify-center py-2 sm:py-4 lg:items-center">
                        <div className="relative w-full overflow-hidden rounded-[22px] bg-[#EEEDE7] shadow-[0_35px_100px_rgba(0,0,0,.28)] sm:rounded-[28px]">
                            <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] bg-white p-5 sm:p-6 lg:p-7">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <PackagePlus className="h-4 w-4 text-[#647140]" />
                                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#777E77]">
                                            Product Management
                                        </p>
                                    </div>

                                    <h2 className="mt-3 text-[28px] font-bold tracking-[-0.04em] text-[#202420] sm:text-[34px]">
                                        {editingProduct ? "Edit Product" : "Add Product"}
                                    </h2>

                                    <p className="mt-2 text-[11px] leading-5 text-[#747A74]">
                                        {editingProduct
                                            ? "Update product information, pricing, stock and catalogue details."
                                            : "Add a new product to your catalogue with pricing, stock, brand and category details."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0F1EC] text-[#202420] transition hover:bg-[#151814] hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {error && (
                                <div className="mx-4 mt-4 flex items-center justify-between gap-4 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 sm:mx-6">
                                    <p className="text-[11px] font-semibold text-red-600">
                                        {error}
                                    </p>
                                    <button type="button" onClick={() => setError("")}>
                                        <X className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            )}

                            {saved && (
                                <div className="mx-4 mt-4 flex items-center gap-3 rounded-[14px] border border-green-100 bg-green-50 px-4 py-3 sm:mx-6">
                                    <Check className="h-4 w-4 text-green-700" />
                                    <p className="text-[11px] font-bold text-green-700">
                                        Product saved successfully.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-7">
                                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                                    <div className="space-y-5">
                                        <FormSection
                                            title="Product Information"
                                            description="Basic information used throughout the product catalogue."
                                            icon={Package}
                                        >
                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div className="md:col-span-2">
                                                    <FormField label="Product Name" required>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={form.name}
                                                            onChange={updateForm}
                                                            placeholder="Example: Cordless Hammer Drill"
                                                            className={inputClass}
                                                        />
                                                    </FormField>
                                                </div>

                                                <FormField label="SKU" required>
                                                    <input
                                                        type="text"
                                                        name="sku"
                                                        value={form.sku}
                                                        onChange={updateForm}
                                                        placeholder="TR-PT-001"
                                                        className={inputClass}
                                                    />
                                                </FormField>

                                                <FormField label="Product Status">
                                                    <AdminDropdown
                                                        value={form.status}
                                                        options={productStatuses}
                                                        open={statusOpen}
                                                        setOpen={setStatusOpen}
                                                        onChange={(value) =>
                                                            setForm((prev) => ({ ...prev, status: value }))
                                                        }
                                                    />
                                                </FormField>

                                                <FormField label="Category" required>
                                                    <AdminDropdown
                                                        placeholder="Select category"
                                                        value={form.category}
                                                        options={categories}
                                                        open={categoryOpen}
                                                        setOpen={setCategoryOpen}
                                                        onChange={(value) =>
                                                            setForm((prev) => ({ ...prev, category: value }))
                                                        }
                                                    />
                                                </FormField>

                                                <FormField label="Brand" required>
                                                    <AdminDropdown
                                                        placeholder="Select brand"
                                                        value={form.brand}
                                                        options={brands}
                                                        open={brandOpen}
                                                        setOpen={setBrandOpen}
                                                        onChange={(value) =>
                                                            setForm((prev) => ({ ...prev, brand: value }))
                                                        }
                                                    />
                                                </FormField>
                                            </div>
                                        </FormSection>

                                        <FormSection
                                            title="Pricing & Stock"
                                            description="Configure selling price and product availability."
                                            icon={CircleDollarSign}
                                        >
                                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                                <FormField label="Selling Price" required>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#697069]">
                                                            AED
                                                        </span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            name="price"
                                                            value={form.price}
                                                            onChange={updateForm}
                                                            placeholder="0.00"
                                                            className={`${inputClass} pl-14`}
                                                        />
                                                    </div>
                                                </FormField>

                                                <FormField label="Previous Price">
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#697069]">
                                                            AED
                                                        </span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            name="oldPrice"
                                                            value={form.oldPrice}
                                                            onChange={updateForm}
                                                            placeholder="0.00"
                                                            className={`${inputClass} pl-14`}
                                                        />
                                                    </div>
                                                </FormField>

                                                <FormField label="Stock Quantity">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        name="stock"
                                                        value={form.stock}
                                                        onChange={updateForm}
                                                        placeholder="0"
                                                        className={inputClass}
                                                    />
                                                </FormField>
                                            </div>
                                        </FormSection>

                                        <FormSection
                                            title="Product Description"
                                            description="Add customer-facing information about the product."
                                            icon={Tag}
                                        >
                                            <FormField label="Short Description">
                                                <textarea
                                                    rows={3}
                                                    name="shortDescription"
                                                    value={form.shortDescription}
                                                    onChange={updateForm}
                                                    placeholder="Short overview shown on product cards..."
                                                    className={textareaClass}
                                                />
                                            </FormField>

                                            <div className="mt-5">
                                                <FormField label="Full Description">
                                                    <textarea
                                                        rows={6}
                                                        name="description"
                                                        value={form.description}
                                                        onChange={updateForm}
                                                        placeholder="Enter detailed product description..."
                                                        className={textareaClass}
                                                    />
                                                </FormField>
                                            </div>
                                        </FormSection>
                                    </div>

                                    <aside className="space-y-5 xl:sticky xl:top-6">
                                        <div className="overflow-hidden rounded-[20px] border border-[#DADCD5] bg-white">
                                            <div className="border-b border-black/[0.07] p-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#EEF1E7]">
                                                        <ImagePlus className="h-4 w-4" />
                                                    </span>
                                                    <div>
                                                        <h3 className="text-[12px] font-bold text-[#202420]">
                                                            Product Image
                                                        </h3>
                                                        <p className="mt-0.5 text-[10px] font-medium text-[#777E77]">
                                                            Upload catalogue image
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                {imagePreview ? (
                                                    <div className="relative overflow-hidden rounded-[16px] bg-[#EEF1E9]">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Product preview"
                                                            className="aspect-[4/3] w-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#151814]/90 text-white transition hover:bg-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="group flex aspect-[4/3] w-full flex-col items-center justify-center rounded-[16px] border border-dashed border-black/15 bg-[#F5F5F0] p-6 text-center transition hover:border-[#94BE26]"
                                                    >
                                                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:bg-[#D8FF65]">
                                                            <Upload className="h-5 w-5" />
                                                        </span>
                                                        <p className="mt-4 text-[12px] font-bold text-[#303630]">
                                                            Upload product image
                                                        </p>
                                                        <p className="mt-1.5 text-[10px] text-[#7A817A]">
                                                            PNG, JPG or WebP
                                                        </p>
                                                    </button>
                                                )}

                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={handleImage}
                                                    className="hidden"
                                                />

                                                {imagePreview && (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-black/[0.08] text-[10px] font-bold text-[#444A44]"
                                                    >
                                                        <Upload className="h-3.5 w-3.5" />
                                                        Change Image
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-[20px] border border-[#DADCD5] bg-white p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F0F2E8]">
                                                        <Sparkles className="h-4 w-4 text-[#56653B]" />
                                                    </span>
                                                    <div>
                                                        <p className="text-[12px] font-bold text-[#202420]">
                                                            Featured Product
                                                        </p>
                                                        <p className="mt-1 text-[10px] leading-5 text-[#747A74]">
                                                            Highlight this product in featured sections.
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            featured: !prev.featured,
                                                        }))
                                                    }
                                                    className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${form.featured ? "bg-[#151814]" : "bg-[#D9DDD6]"
                                                        }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 h-5 w-5 rounded-full transition-all duration-300 ${form.featured
                                                                ? "left-6 bg-[#D8FF65]"
                                                                : "left-1 bg-white"
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="rounded-[20px] bg-[#151814] p-5 text-white">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#D8FF65]">
                                                Product Preview
                                            </p>
                                            <h3 className="mt-3 text-[20px] font-semibold leading-6">
                                                {form.name || "Product Name"}
                                            </h3>
                                            <p className="mt-1 text-[10px] font-semibold text-white/60">
                                                {form.brand || "Brand"} · {form.category || "Category"}
                                            </p>
                                            <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-[0.12em] text-white/45">
                                                        Price
                                                    </p>
                                                    <p className="mt-1 text-[22px] font-bold">
                                                        <span className="mr-1 text-[10px] text-[#D8FF65]">
                                                            AED
                                                        </span>
                                                        {form.price
                                                            ? Number(form.price).toLocaleString()
                                                            : "0.00"}
                                                    </p>
                                                </div>
                                                <StockBadge stock={Number(form.stock || 0)} />
                                            </div>
                                        </div>
                                    </aside>
                                </div>

                                <div className="mt-6 flex flex-col gap-3 border-t border-black/[0.08] pt-6 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="h-12 rounded-full border border-black/[0.09] bg-white px-6 text-[11px] font-bold text-[#505750]"
                                    >
                                        Reset
                                    </button>

                                    <button
                                        type="submit"
                                        className="group flex h-12 min-w-[190px] items-center justify-between rounded-full bg-[#151814] pl-5 pr-1.5 text-[11px] font-bold text-white"
                                    >
                                        {editingProduct ? "Update Product" : "Save Product"}
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8FF65] text-[#151814]">
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({ title, value, description, icon: Icon, dark = false }) {
    return (
        <div
            className={`rounded-[22px] border p-5 shadow-[0_10px_35px_rgba(20,24,20,.04)] sm:p-6 ${dark
                    ? "border-[#151814] bg-[#151814] text-white"
                    : "border-[#DADCD5] bg-white text-[#202420]"
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p
                        className={`text-[10px] font-bold uppercase tracking-[0.15em] ${dark ? "text-white/55" : "text-[#777E77]"
                            }`}
                    >
                        {title}
                    </p>
                    <p className="mt-4 break-words text-[27px] font-bold tracking-[-0.04em] sm:text-[30px]">
                        {value}
                    </p>
                </div>

                <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${dark
                            ? "bg-[#D8FF65] text-[#151814]"
                            : "bg-[#EEF1E7] text-[#4F574F]"
                        }`}
                >
                    <Icon className="h-4 w-4" />
                </span>
            </div>

            <p
                className={`mt-4 text-[11px] font-medium ${dark ? "text-white/50" : "text-[#747A74]"
                    }`}
            >
                {description}
            </p>
        </div>
    );
}

function TableHeading({ children }) {
    return (
        <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.15em] text-[#777E77]">
            {children}
        </th>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Active: "bg-[#E7F5E9] text-[#31733A]",
        Draft: "bg-[#FFF2D9] text-[#8F630D]",
        Inactive: "bg-[#ECEEEC] text-[#626862]",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-bold ${styles[status] || "bg-[#ECEEEC] text-[#626862]"
                }`}
        >
            {status}
        </span>
    );
}

function StockBadge({ stock }) {
    const value = Number(stock || 0);

    if (value <= 0) {
        return (
            <span className="inline-flex rounded-full bg-[#FCE8E8] px-3 py-1.5 text-[9px] font-bold text-[#A83E3E]">
                Out of Stock
            </span>
        );
    }

    if (value <= 15) {
        return (
            <span className="inline-flex rounded-full bg-[#FFF1DA] px-3 py-1.5 text-[9px] font-bold text-[#95610C]">
                {value} Low Stock
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-[#E7F5E9] px-3 py-1.5 text-[9px] font-bold text-[#31733A]">
            {value} In Stock
        </span>
    );
}

function InfoBox({ label, value }) {
    return (
        <div className="rounded-[13px] border border-black/[0.06] bg-[#F5F5F0] p-3">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#858B85]">
                {label}
            </p>
            <p className="mt-1.5 text-[11px] font-bold leading-4 text-[#303630]">
                {value}
            </p>
        </div>
    );
}

function FilterSelect({ value, options, onChange }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`relative w-full sm:w-[220px] ${open ? "z-[80]" : "z-20"}`}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`
          flex
          h-11
          w-full
          items-center
          justify-between
          gap-3
          rounded-full
          border
          px-2
          pl-4
          text-left
          transition-all
          duration-200

          ${open
                        ? "border-[#151814] bg-[#151814] text-white shadow-[0_10px_30px_rgba(21,24,20,.14)]"
                        : "border-black/[0.08] bg-[#F0F1EC] text-[#4F564F] hover:border-black/[0.14] hover:bg-white"
                    }
        `}
            >
                <span className="flex min-w-0 items-center gap-2.5">
                    <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${open
                                ? "bg-[#D8FF65] text-[#151814]"
                                : "bg-white text-[#555C55]"
                            }`}
                    >
                        <Boxes className="h-3.5 w-3.5" />
                    </span>

                    <span className="truncate text-[10px] font-bold">
                        {value}
                    </span>
                </span>

                <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${open
                            ? "rotate-180 bg-white/10 text-white"
                            : "bg-white text-[#555C55]"
                        }`}
                >
                    <ChevronDown className="h-3.5 w-3.5" />
                </span>
            </button>

            {open && (
                <>
                    <button
                        type="button"
                        aria-label="Close category filter"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-[79] cursor-default"
                    />

                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] overflow-hidden rounded-[18px] border border-black/[0.08] bg-white p-2 shadow-[0_22px_65px_rgba(15,20,16,.16)]">
                        <div className="mb-2 flex items-center justify-between border-b border-black/[0.06] px-2 pb-2 pt-1">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#7A817A]">
                                    Filter Products
                                </p>
                                <p className="mt-0.5 text-[11px] font-bold text-[#202420]">
                                    Categories
                                </p>
                            </div>

                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F1EC]">
                                <Boxes className="h-3.5 w-3.5 text-[#535A53]" />
                            </span>
                        </div>

                        <div className="max-h-[300px] space-y-1 overflow-y-auto pr-1">
                            {options.map((option) => {
                                const selected = value === option;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            onChange(option);
                                            setOpen(false);
                                        }}
                                        className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-3
                      rounded-[12px]
                      px-3.5
                      py-3
                      text-left
                      transition

                      ${selected
                                                ? "bg-[#D8FF65] text-[#151814]"
                                                : "text-[#505750] hover:bg-[#F3F4EF] hover:text-[#151814]"
                                            }
                    `}
                                    >
                                        <span className="truncate text-[10px] font-bold">
                                            {option}
                                        </span>

                                        {selected ? (
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#151814] text-[#D8FF65]">
                                                <Check className="h-3 w-3" />
                                            </span>
                                        ) : (
                                            <span className="h-6 w-6 shrink-0 rounded-full border border-black/[0.07]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function FormSection({ title, description, icon: Icon, children }) {
    return (
        <section className="overflow-visible rounded-[20px] border border-[#DADCD5] bg-white">
            <div className="flex items-start gap-3 border-b border-black/[0.07] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#EEF1E7]">
                    <Icon className="h-4 w-4 text-[#505850]" />
                </span>
                <div>
                    <h3 className="text-[13px] font-bold text-[#202420]">{title}</h3>
                    <p className="mt-1 text-[10px] leading-5 text-[#747A74]">
                        {description}
                    </p>
                </div>
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

function FormField({ label, required = false, children }) {
    return (
        <div className="min-w-0">
            <label className="mb-2.5 block text-[10px] font-bold text-[#626962]">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function AdminDropdown({
    value,
    placeholder = "Select",
    options,
    open,
    setOpen,
    onChange,
}) {
    return (
        <div className={`relative min-w-0 ${open ? "z-[100]" : "z-10"}`}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex h-[54px] w-full min-w-0 items-center justify-between gap-3 rounded-[14px] border bg-[#F7F7F3] pl-4 pr-2 text-left transition-all ${open
                        ? "border-[#94BE26] bg-white ring-4 ring-[#D8FF65]/15"
                        : "border-black/[0.08] hover:border-black/15"
                    }`}
            >
                <span
                    className={`min-w-0 flex-1 truncate text-[12px] font-semibold ${value ? "text-[#252A25]" : "text-[#929792]"
                        }`}
                >
                    {value || placeholder}
                </span>

                <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${open ? "rotate-180 bg-[#D8FF65]" : "bg-white"
                        }`}
                >
                    <ChevronDown className="h-4 w-4" />
                </span>
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[500] overflow-hidden rounded-[16px] border border-black/[0.08] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,.14)]">
                    <div className="max-h-[220px] space-y-1 overflow-y-auto">
                        {options.map((option) => {
                            const selected = value === option;

                            return (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-[11px] px-3.5 py-3 text-left text-[11px] font-bold transition ${selected
                                            ? "bg-[#D8FF65] text-[#151814]"
                                            : "text-[#4E554E] hover:bg-[#F1F2ED]"
                                        }`}
                                >
                                    {option}
                                    {selected && <Check className="h-3.5 w-3.5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

const inputClass = `
  h-[54px]
  w-full
  min-w-0
  rounded-[14px]
  border
  border-black/[0.08]
  bg-[#F7F7F3]
  px-4
  text-[12px]
  font-semibold
  text-[#252A25]
  outline-none
  transition-all
  placeholder:font-medium
  placeholder:text-[#969B96]
  hover:border-black/15
  focus:border-[#94BE26]
  focus:bg-white
  focus:ring-4
  focus:ring-[#D8FF65]/15
`;

const textareaClass = `
  w-full
  min-w-0
  resize-y
  rounded-[14px]
  border
  border-black/[0.08]
  bg-[#F7F7F3]
  p-4
  text-[12px]
  font-medium
  leading-6
  text-[#252A25]
  outline-none
  transition-all
  placeholder:text-[#969B96]
  hover:border-black/15
  focus:border-[#94BE26]
  focus:bg-white
  focus:ring-4
  focus:ring-[#D8FF65]/15
`;
