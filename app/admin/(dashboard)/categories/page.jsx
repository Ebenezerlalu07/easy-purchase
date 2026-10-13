"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Boxes,
    Check,
    ChevronRight,
    Edit3,
    FolderPlus,
    Package,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

/* =========================================================
   DEMO CATEGORY DATA
========================================================= */

const initialCategories = [];

const emptyForm = {
    name: "",
    slug: "",
    description: "",
    status: "Active",
};

/* =========================================================
   PAGE
========================================================= */

export default function CategoriesPage() {
    const [categories, setCategories] = useState(initialCategories);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        fetch("/api/categories", { cache: "no-store" })
            .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not load categories"); return data; })
            .then((data) => { if (active) setCategories(data.categories || []); })
            .catch((err) => { if (active) setError(err.message); });
        return () => { active = false; };
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form, setForm] = useState(emptyForm);

    /* =========================================================
       SEARCH
    ========================================================= */

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return categories;

        return categories.filter((category) =>
            [
                category.name,
                category.slug,
                category.description,
                category.status,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query)
        );
    }, [categories, search]);

    const activeCount = categories.filter(
        (item) => item.status === "Active"
    ).length;

    const totalProducts = categories.reduce(
        (total, item) => total + Number(item.products || 0),
        0
    );

    /* =========================================================
       MODAL
    ========================================================= */

    const openAddModal = () => {
        setEditingCategory(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);

        setForm({
            name: category.name,
            slug: category.slug,
            description: category.description,
            status: category.status,
        });

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        setForm(emptyForm);
    };

    /* =========================================================
       FORM
    ========================================================= */

    const updateForm = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "name" && !editingCategory) {
            setForm((prev) => ({
                ...prev,
                name: value,
                slug: value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, ""),
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!form.name.trim()) { setError("Please enter a category name."); return; }
        try {
            const response = await fetch(editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories", {
                method: editingCategory ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save category");
            const saved = data.category;
            setCategories((current) => editingCategory ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
            closeModal();
        } catch (err) { setError(err.message); }
    };

    /* =========================================================
       DELETE
    ========================================================= */

    const deleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        setError("");
        try {
            const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not delete category");
            setCategories((current) => current.filter((category) => category.id !== id));
        } catch (err) { setError(err.message); }
    };

    return (
        <>
            <div className="w-full">
                {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
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
                            Categories
                        </h1>

                        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#686F68]">
                            Create and manage product categories used throughout your
                            catalogue.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="
              group
              inline-flex
              h-11
              items-center
              justify-between
              gap-5
              self-start
              rounded-full
              bg-[#151814]
              pl-5
              pr-1.5
              text-[11px]
              font-bold
              text-white
              transition
              hover:bg-[#292F2A]
              lg:self-auto
            "
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="h-3.5 w-3.5" />
                            Add Category
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D8FF65] text-[#151814]">
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </button>
                </div>

                {/* =====================================================
            STATS
        ====================================================== */}

                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Categories"
                        value={categories.length}
                        description="Categories in the product catalogue"
                        icon={Boxes}
                        dark
                    />

                    <StatCard
                        title="Active Categories"
                        value={activeCount}
                        description="Currently available categories"
                        icon={Check}
                    />

                    <StatCard
                        title="Products Assigned"
                        value={totalProducts}
                        description="Products across all categories"
                        icon={Package}
                    />
                </div>

                {/* =====================================================
            CATEGORY LIST
        ====================================================== */}

                <div className="mt-6 overflow-hidden rounded-[24px] border border-[#DADCD5] bg-white shadow-[0_12px_35px_rgba(20,24,20,0.04)]">
                    {/* Toolbar */}

                    <div className="border-b border-black/[0.07] p-4 sm:p-5 lg:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full lg:max-w-[440px]">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D837D]" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search categories..."
                                    className="
                    h-12
                    w-full
                    rounded-[14px]
                    border
                    border-black/[0.08]
                    bg-[#F5F5F0]
                    pl-11
                    pr-4
                    text-[12px]
                    font-medium
                    text-[#202420]
                    outline-none
                    transition
                    placeholder:text-[#929792]
                    focus:border-[#94BE26]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#D8FF65]/20
                  "
                                />
                            </div>

                            <p className="text-[11px] font-semibold text-[#747A74]">
                                {filteredCategories.length} categories
                            </p>
                        </div>
                    </div>

                    {/* =================================================
              DESKTOP TABLE
          ================================================== */}

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[920px] border-collapse">
                            <thead>
                                <tr className="border-b border-black/[0.07] bg-[#F5F5F0]">
                                    <TableHeading>Category</TableHeading>
                                    <TableHeading>Description</TableHeading>
                                    <TableHeading>Products</TableHeading>
                                    <TableHeading>Status</TableHeading>
                                    <TableHeading>Actions</TableHeading>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b border-black/[0.055] transition hover:bg-[#FAFAF7] last:border-b-0"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#EEF1E7]">
                                                    <Boxes className="h-4 w-4 text-[#4D554D]" />
                                                </span>

                                                <div>
                                                    <p className="text-[12px] font-bold text-[#202420]">
                                                        {category.name}
                                                    </p>

                                                    <p className="mt-1 text-[9px] font-semibold text-[#858B85]">
                                                        /{category.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="max-w-[340px] px-6 py-5">
                                            <p className="text-[11px] leading-5 text-[#606760]">
                                                {category.description}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F2EC] px-3 py-2">
                                                <Package className="h-3.5 w-3.5" />

                                                <span className="text-[10px] font-bold text-[#303630]">
                                                    {category.products}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <StatusBadge status={category.status} />
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(category)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F1EC] text-[#3F463F] transition hover:bg-[#D8FF65]"
                                                    aria-label="Edit category"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteCategory(category.id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F1EC] text-[#626862] transition hover:bg-red-50 hover:text-red-500"
                                                    aria-label="Delete category"
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

                    {/* =================================================
              MOBILE / TABLET
          ================================================== */}

                    <div className="grid gap-4 bg-[#F1F0EA] p-4 sm:p-5 md:grid-cols-2 lg:hidden">
                        {filteredCategories.map((category) => (
                            <article
                                key={category.id}
                                className="rounded-[20px] border border-black/[0.07] bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#EEF1E7]">
                                        <Boxes className="h-4 w-4" />
                                    </span>

                                    <StatusBadge status={category.status} />
                                </div>

                                <h3 className="mt-5 text-[17px] font-bold text-[#202420]">
                                    {category.name}
                                </h3>

                                <p className="mt-1 text-[10px] font-semibold text-[#858B85]">
                                    /{category.slug}
                                </p>

                                <p className="mt-4 text-[11px] leading-5 text-[#656C65]">
                                    {category.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between rounded-[14px] bg-[#F5F5F0] px-4 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#858B85]">
                                        Products
                                    </span>

                                    <span className="text-[13px] font-bold text-[#202420]">
                                        {category.products}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(category)}
                                        className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#151814] text-[10px] font-bold text-white"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteCategory(category.id)}
                                        className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#F0F1EC] text-[10px] font-bold text-[#555C55] transition hover:bg-red-50 hover:text-red-500"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="px-5 py-20 text-center">
                            <Boxes className="mx-auto h-9 w-9 text-[#A2A7A2]" />

                            <h3 className="mt-4 text-[18px] font-bold text-[#202420]">
                                No categories found
                            </h3>

                            <p className="mt-2 text-[12px] text-[#747A74]">
                                Try changing your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================
          ADD / EDIT CATEGORY MODAL
      ====================================================== */}

            {modalOpen && (
                <CategoryModal
                    form={form}
                    updateForm={updateForm}
                    editing={Boolean(editingCategory)}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    setForm={setForm}
                />
            )}
        </>
    );
}

/* =========================================================
   CATEGORY MODAL
========================================================= */

function CategoryModal({
    form,
    updateForm,
    editing,
    onSubmit,
    onClose,
    setForm,
}) {
    return (
        <div className="fixed inset-0 z-[300] overflow-y-auto bg-[#07100D]/65 p-3 backdrop-blur-sm sm:p-5">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0"
            />

            <div className="relative mx-auto flex min-h-full max-w-[620px] items-center justify-center py-4">
                <div className="relative w-full overflow-hidden rounded-[24px] bg-[#F2F2EC] shadow-[0_35px_100px_rgba(0,0,0,.25)] sm:rounded-[30px]">
                    {/* Header */}

                    <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] bg-white p-5 sm:p-7">
                        <div>
                            <div className="flex items-center gap-2">
                                <FolderPlus className="h-4 w-4 text-[#66714A]" />

                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#777E77]">
                                    Catalogue Management
                                </p>
                            </div>

                            <h2 className="mt-3 text-[27px] font-bold tracking-[-0.04em] text-[#202420] sm:text-[32px]">
                                {editing ? "Edit Category" : "Add Category"}
                            </h2>

                            <p className="mt-2 text-[11px] leading-5 text-[#747A74]">
                                {editing
                                    ? "Update the selected category information."
                                    : "Create a new category for your product catalogue."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0F1EC] transition hover:bg-[#151814] hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Form */}

                    <form onSubmit={onSubmit} className="p-5 sm:p-7">
                        <FormField
                            label="Category Name"
                            required
                        >
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={updateForm}
                                placeholder="Example: Power Tools"
                                className={inputClass}
                                required
                            />
                        </FormField>

                        <div className="mt-5">
                            <FormField label="Slug">
                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={updateForm}
                                    placeholder="power-tools"
                                    className={inputClass}
                                />
                            </FormField>
                        </div>

                        <div className="mt-5">
                            <FormField label="Description">
                                <textarea
                                    rows={5}
                                    name="description"
                                    value={form.description}
                                    onChange={updateForm}
                                    placeholder="Describe this category..."
                                    className={textareaClass}
                                />
                            </FormField>
                        </div>

                        {/* Status */}

                        <div className="mt-5">
                            <FormField label="Status">
                                <div className="grid grid-cols-2 gap-2">
                                    {["Active", "Inactive"].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    status,
                                                }))
                                            }
                                            className={`
                        flex
                        h-12
                        items-center
                        justify-between
                        rounded-[14px]
                        border
                        px-4
                        text-[11px]
                        font-bold
                        transition

                        ${form.status === status
                                                    ? "border-[#151814] bg-[#151814] text-white"
                                                    : "border-black/[0.08] bg-white text-[#555C55]"
                                                }
                      `}
                                        >
                                            {status}

                                            {form.status === status && (
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D8FF65] text-[#151814]">
                                                    <Check className="h-3 w-3" />
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </FormField>
                        </div>

                        {/* Footer */}

                        <div className="mt-7 flex flex-col gap-3 border-t border-black/[0.07] pt-6 sm:flex-row">
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-12 flex-1 rounded-full border border-black/[0.09] bg-white text-[11px] font-bold text-[#505750]"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="group flex h-12 flex-1 items-center justify-between rounded-full bg-[#151814] pl-5 pr-1.5 text-[11px] font-bold text-white"
                            >
                                {editing ? "Update Category" : "Create Category"}

                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8FF65] text-[#151814]">
                                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    dark = false,
}) {
    return (
        <div
            className={`
        rounded-[22px]
        border
        p-5
        shadow-[0_10px_35px_rgba(20,24,20,.04)]
        sm:p-6

        ${dark
                    ? "border-[#151814] bg-[#151814] text-white"
                    : "border-[#DADCD5] bg-white text-[#202420]"
                }
      `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p
                        className={`text-[10px] font-bold uppercase tracking-[0.15em] ${dark ? "text-white/55" : "text-[#777E77]"
                            }`}
                    >
                        {title}
                    </p>

                    <p className="mt-4 text-[32px] font-bold tracking-[-0.04em]">
                        {value}
                    </p>
                </div>

                <span
                    className={`flex h-11 w-11 items-center justify-center rounded-[13px] ${dark
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

/* =========================================================
   TABLE HEADING
========================================================= */

function TableHeading({ children }) {
    return (
        <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.15em] text-[#777E77]">
            {children}
        </th>
    );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({ status }) {
    return (
        <span
            className={`
        inline-flex
        rounded-full
        px-3
        py-1.5
        text-[9px]
        font-bold

        ${status === "Active"
                    ? "bg-[#E7F5E9] text-[#31733A]"
                    : "bg-[#ECEEEC] text-[#626862]"
                }
      `}
        >
            {status}
        </span>
    );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <div className="min-w-0">
            <label className="mb-2.5 block text-[10px] font-bold text-[#626962]">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            {children}
        </div>
    );
}

/* =========================================================
   FORM STYLES
========================================================= */

const inputClass = `
  h-[54px]
  w-full
  min-w-0
  rounded-[14px]
  border
  border-black/[0.08]
  bg-white
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
  bg-white
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
  focus:ring-4
  focus:ring-[#D8FF65]/15
`;