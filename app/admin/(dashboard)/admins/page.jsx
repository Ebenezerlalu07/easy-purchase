"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Check,
    ChevronDown,
    ChevronRight,
    Edit3,
    KeyRound,
    Mail,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserRoundCog,
    Users,
    X,
} from "lucide-react";

/* =========================================================
   DEMO ADMIN DATA
========================================================= */

const initialAdmins = [];

const roles = [
    "Super Administrator",
    "Administrator",
    "Sales Manager",
    "Catalogue Manager",
];

const statusFilters = ["All", "Active", "Inactive"];

const emptyForm = {
    name: "",
    email: "",
    role: "Administrator",
    status: "Active",
    password: "",
};

/* =========================================================
   PAGE
========================================================= */

export default function AdminUsersPage() {
    const [admins, setAdmins] = useState(initialAdmins);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadAdmins = async () => {
        setError("");
        try {
            const response = await fetch("/api/admin-users", { cache: "no-store" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not load admin users");
            setAdmins(data.admins || []);
        } catch (err) {
            setError(err.message || "Could not load admin users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAdmins(); }, []);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    const [form, setForm] = useState(emptyForm);

    /* =========================================================
       FILTER
    ========================================================= */

    const filteredAdmins = useMemo(() => {
        const query = search.trim().toLowerCase();

        return admins.filter((admin) => {
            const matchesSearch =
                !query ||
                [
                    admin.name,
                    admin.email,
                    admin.role,
                    admin.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                status === "All" || admin.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [admins, search, status]);

    const activeAdmins = admins.filter(
        (admin) => admin.status === "Active"
    ).length;

    const superAdmins = admins.filter(
        (admin) => admin.role === "Super Administrator"
    ).length;

    /* =========================================================
       OPEN ADD
    ========================================================= */

    const openAddModal = () => {
        setEditingAdmin(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    /* =========================================================
       OPEN EDIT
    ========================================================= */

    const openEditModal = (admin) => {
        setEditingAdmin(admin);

        setForm({
            name: admin.name,
            email: admin.email,
            role: admin.role,
            status: admin.status,
            password: "",
        });

        setModalOpen(true);
    };

    /* =========================================================
       CLOSE
    ========================================================= */

    const closeModal = () => {
        setModalOpen(false);
        setEditingAdmin(null);
        setForm(emptyForm);
    };

    /* =========================================================
       FORM UPDATE
    ========================================================= */

    const updateForm = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =========================================================
       SAVE
    ========================================================= */

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!form.name.trim() || !form.email.trim()) {
            setError("Please enter a name and email address.");
            return;
        }
        if (!editingAdmin && !form.password) {
            setError("Please set a password for the new admin.");
            return;
        }
        try {
            const response = await fetch(editingAdmin ? `/api/admin-users/${editingAdmin.id}` : "/api/admin-users", {
                method: editingAdmin ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save admin user");
            await loadAdmins();
            closeModal();
        } catch (err) {
            setError(err.message || "Could not save admin user");
        }
    };

    /* =========================================================
       DELETE
    ========================================================= */

    const deleteAdmin = async (id) => {
        if (!window.confirm("Delete this admin user?")) return;
        setError("");
        try {
            const response = await fetch(`/api/admin-users/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not delete admin user");
            await loadAdmins();
        } catch (err) {
            setError(err.message || "Could not delete admin user");
        }
    };

    const toggleAdminStatus = async (id) => {
        const target = admins.find((item) => item.id === id);
        if (!target) return;
        setError("");
        try {
            const response = await fetch(`/api/admin-users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: target.status === "Active" ? "Inactive" : "Active" }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not update admin status");
            await loadAdmins();
        } catch (err) {
            setError(err.message || "Could not update admin status");
        }
    };

    return (
        <>
            <div className="w-full">
                {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
                {loading && <p className="mb-4 text-sm text-[#686F68]">Loading admin users...</p>}

                {/* =====================================================
            HEADER
        ====================================================== */}

                <div className="flex flex-col gap-6 border-b border-black/[0.08] pb-7 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#94BE26]" />

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6D746D]">
                                Administration
                            </p>
                        </div>

                        <h1 className="mt-3 text-[36px] font-semibold leading-none tracking-[-0.045em] text-[#151814] sm:text-[42px] lg:text-[48px]">
                            Admin Users
                        </h1>

                        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#686F68]">
                            Manage administrators, assign access roles and control
                            account status across the management portal.
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
                            Add Admin
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
                        title="Admin Users"
                        value={admins.length}
                        description="Total administrator accounts"
                        icon={Users}
                        dark
                    />

                    <StatCard
                        title="Active Admins"
                        value={activeAdmins}
                        description="Administrators with active access"
                        icon={ShieldCheck}
                    />

                    <StatCard
                        title="Super Administrators"
                        value={superAdmins}
                        description="Users with complete system access"
                        icon={KeyRound}
                    />
                </div>

                {/* =====================================================
            ADMIN USERS
        ====================================================== */}

                <div className="mt-6 overflow-hidden rounded-[24px] border border-[#DADCD5] bg-white shadow-[0_12px_35px_rgba(20,24,20,0.04)]">

                    {/* Toolbar */}

                    <div className="border-b border-black/[0.07] p-4 sm:p-5 lg:p-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                            {/* Search */}

                            <div className="relative w-full xl:max-w-[440px]">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D837D]" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search admin name, email or role..."
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

                            {/* Filter */}

                            <div className="overflow-x-auto">
                                <div className="flex min-w-max gap-2">
                                    {statusFilters.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setStatus(item)}
                                            className={`
                        rounded-full
                        px-4
                        py-2.5
                        text-[10px]
                        font-bold
                        transition

                        ${status === item
                                                    ? "bg-[#151814] text-white"
                                                    : "bg-[#F0F1EC] text-[#626862] hover:bg-[#D8FF65] hover:text-[#151814]"
                                                }
                      `}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="mt-4 border-t border-black/[0.05] pt-4">
                            <p className="text-[11px] font-medium text-[#737973]">
                                Showing{" "}
                                <span className="font-bold text-[#202420]">
                                    {filteredAdmins.length}
                                </span>{" "}
                                administrator accounts
                            </p>
                        </div>
                    </div>

                    {/* =================================================
              DESKTOP TABLE
          ================================================== */}

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[1040px] border-collapse">

                            <thead>
                                <tr className="border-b border-black/[0.07] bg-[#F5F5F0]">
                                    <TableHeading>Administrator</TableHeading>
                                    <TableHeading>Role</TableHeading>
                                    <TableHeading>Last Login</TableHeading>
                                    <TableHeading>Created</TableHeading>
                                    <TableHeading>Status</TableHeading>
                                    <TableHeading>Actions</TableHeading>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAdmins.map((admin) => (
                                    <tr
                                        key={admin.id}
                                        className="border-b border-black/[0.055] transition hover:bg-[#FAFAF7] last:border-b-0"
                                    >

                                        {/* Admin */}

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3.5">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#151814] text-[10px] font-bold text-[#D8FF65]">
                                                    {admin.initials}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-bold text-[#202420]">
                                                        {admin.name}
                                                    </p>

                                                    <a
                                                        href={`mailto:${admin.email}`}
                                                        className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#6E756E] transition hover:text-[#5E791B]"
                                                    >
                                                        <Mail className="h-3 w-3" />
                                                        {admin.email}
                                                    </a>
                                                </div>

                                            </div>
                                        </td>

                                        {/* Role */}

                                        <td className="px-6 py-5">
                                            <RoleBadge role={admin.role} />
                                        </td>

                                        {/* Last Login */}

                                        <td className="px-6 py-5">
                                            <p className="text-[11px] font-semibold text-[#4F564F]">
                                                {admin.lastLogin}
                                            </p>
                                        </td>

                                        {/* Created */}

                                        <td className="px-6 py-5">
                                            <p className="text-[11px] font-semibold text-[#656C65]">
                                                {admin.created}
                                            </p>
                                        </td>

                                        {/* Status */}

                                        <td className="px-6 py-5">
                                            <StatusBadge status={admin.status} />
                                        </td>

                                        {/* Actions */}

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(admin)}
                                                    aria-label="Edit administrator"
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F1EC] text-[#424942] transition hover:bg-[#D8FF65]"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleAdminStatus(admin.id)
                                                    }
                                                    aria-label="Change administrator status"
                                                    className={`
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            transition

                            ${admin.status === "Active"
                                                            ? "bg-[#EEF1E7] text-[#52701A] hover:bg-[#FFF1DA] hover:text-[#95610C]"
                                                            : "bg-[#F0F1EC] text-[#666D66] hover:bg-[#E7F5E9] hover:text-[#31733A]"
                                                        }
                          `}
                                                >
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                </button>

                                                {admin.role !== "Super Administrator" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteAdmin(admin.id)}
                                                        aria-label="Delete administrator"
                                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F1EC] text-[#626862] transition hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                )}

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
                        {filteredAdmins.map((admin) => (
                            <article
                                key={admin.id}
                                className="rounded-[20px] border border-black/[0.07] bg-white p-5 shadow-sm"
                            >

                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#151814] text-[11px] font-bold text-[#D8FF65]">
                                        {admin.initials}
                                    </div>

                                    <StatusBadge status={admin.status} />
                                </div>

                                <h3 className="mt-5 text-[17px] font-bold text-[#202420]">
                                    {admin.name}
                                </h3>

                                <a
                                    href={`mailto:${admin.email}`}
                                    className="mt-2 flex items-center gap-2 break-all text-[11px] font-semibold text-[#606760]"
                                >
                                    <Mail className="h-3.5 w-3.5 shrink-0" />
                                    {admin.email}
                                </a>

                                <div className="mt-5">
                                    <RoleBadge role={admin.role} />
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <InfoBox
                                        label="Last Login"
                                        value={admin.lastLogin}
                                    />

                                    <InfoBox
                                        label="Created"
                                        value={admin.created}
                                    />
                                </div>

                                <div className="mt-5 flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={() => openEditModal(admin)}
                                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#151814] text-[10px] font-bold text-white"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleAdminStatus(admin.id)
                                        }
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF1E7] text-[#4E574E]"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                    </button>

                                    {admin.role !== "Super Administrator" && (
                                        <button
                                            type="button"
                                            onClick={() => deleteAdmin(admin.id)}
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}

                                </div>

                            </article>
                        ))}
                    </div>

                    {/* Empty */}

                    {filteredAdmins.length === 0 && (
                        <div className="px-5 py-20 text-center">
                            <UserRoundCog className="mx-auto h-9 w-9 text-[#A2A7A2]" />

                            <h3 className="mt-4 text-[18px] font-bold text-[#202420]">
                                No administrators found
                            </h3>

                            <p className="mt-2 text-[12px] text-[#747A74]">
                                Try changing your search or account filter.
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* =====================================================
          ADD / EDIT ADMIN
      ====================================================== */}

            {modalOpen && (
                <AdminModal
                    form={form}
                    setForm={setForm}
                    updateForm={updateForm}
                    editing={Boolean(editingAdmin)}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            )}
        </>
    );
}

/* =========================================================
   MODAL
========================================================= */

function AdminModal({
    form,
    setForm,
    updateForm,
    editing,
    onSubmit,
    onClose,
}) {
    const [roleOpen, setRoleOpen] = useState(false);

    return (
        <div className="fixed inset-0 z-[300] overflow-y-auto bg-[#07100D]/65 p-3 backdrop-blur-sm sm:p-5">

            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute inset-0"
            />

            <div className="relative mx-auto flex min-h-full max-w-[680px] items-center justify-center py-4">

                <div className="relative w-full overflow-visible rounded-[24px] bg-[#F2F2EC] shadow-[0_35px_100px_rgba(0,0,0,.25)] sm:rounded-[30px]">

                    {/* Header */}

                    <div className="flex items-start justify-between gap-4 rounded-t-[24px] border-b border-black/[0.08] bg-white p-5 sm:rounded-t-[30px] sm:p-7">

                        <div>
                            <div className="flex items-center gap-2">
                                <UserRoundCog className="h-4 w-4 text-[#66714A]" />

                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#777E77]">
                                    Administrator Access
                                </p>
                            </div>

                            <h2 className="mt-3 text-[27px] font-bold tracking-[-0.04em] text-[#202420] sm:text-[32px]">
                                {editing
                                    ? "Edit Administrator"
                                    : "Add Administrator"}
                            </h2>

                            <p className="mt-2 max-w-lg text-[11px] leading-5 text-[#747A74]">
                                {editing
                                    ? "Update administrator information, access role and account status."
                                    : "Create an administrator account and assign an appropriate access role."}
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

                    <form
                        onSubmit={onSubmit}
                        className="p-5 sm:p-7"
                    >

                        <div className="grid gap-5 sm:grid-cols-2">

                            {/* Name */}

                            <FormField
                                label="Full Name"
                                required
                            >
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={updateForm}
                                    placeholder="Administrator name"
                                    className={inputClass}
                                    required
                                />
                            </FormField>

                            {/* Email */}

                            <FormField
                                label="Email Address"
                                required
                            >
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={updateForm}
                                    placeholder="admin@company.com"
                                    className={inputClass}
                                    required
                                />
                            </FormField>

                            {/* Role */}

                            <FormField
                                label="Access Role"
                                required
                            >
                                <div
                                    className={`relative ${roleOpen ? "z-[100]" : "z-10"
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRoleOpen((prev) => !prev)
                                        }
                                        className={`
                      flex
                      h-[54px]
                      w-full
                      items-center
                      justify-between
                      gap-3
                      rounded-[14px]
                      border
                      bg-white
                      pl-4
                      pr-2
                      text-left
                      transition

                      ${roleOpen
                                                ? "border-[#94BE26] ring-4 ring-[#D8FF65]/15"
                                                : "border-black/[0.08]"
                                            }
                    `}
                                    >
                                        <span className="truncate text-[12px] font-semibold text-[#252A25]">
                                            {form.role}
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
                        bg-[#F1F2ED]
                        transition

                        ${roleOpen
                                                    ? "rotate-180 bg-[#D8FF65]"
                                                    : ""
                                                }
                      `}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </span>
                                    </button>

                                    {roleOpen && (
                                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[500] overflow-hidden rounded-[16px] border border-black/[0.08] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,.16)]">

                                            {roles.map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => {
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            role,
                                                        }));

                                                        setRoleOpen(false);
                                                    }}
                                                    className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-[11px]
                            px-3.5
                            py-3
                            text-left
                            text-[11px]
                            font-bold
                            transition

                            ${form.role === role
                                                            ? "bg-[#D8FF65] text-[#151814]"
                                                            : "text-[#505750] hover:bg-[#F1F2ED]"
                                                        }
                          `}
                                                >
                                                    {role}

                                                    {form.role === role && (
                                                        <Check className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            ))}

                                        </div>
                                    )}
                                </div>
                            </FormField>

                            {/* Password */}

                            <FormField
                                label={
                                    editing
                                        ? "New Password"
                                        : "Temporary Password"
                                }
                            >
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={updateForm}
                                    placeholder={
                                        editing
                                            ? "Leave blank to keep current"
                                            : "Enter temporary password"
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                        </div>

                        {/* Status */}

                        <div className="mt-6">
                            <FormField label="Account Status">

                                <div className="grid grid-cols-2 gap-2">

                                    {["Active", "Inactive"].map(
                                        (accountStatus) => (
                                            <button
                                                key={accountStatus}
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        status: accountStatus,
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

                          ${form.status === accountStatus
                                                        ? "border-[#151814] bg-[#151814] text-white"
                                                        : "border-black/[0.08] bg-white text-[#555C55]"
                                                    }
                        `}
                                            >
                                                {accountStatus}

                                                {form.status === accountStatus && (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D8FF65] text-[#151814]">
                                                        <Check className="h-3 w-3" />
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    )}

                                </div>
                            </FormField>
                        </div>

                        {/* Permission info */}

                        <div className="mt-6 rounded-[17px] border border-black/[0.06] bg-white p-4">

                            <div className="flex gap-3">

                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF1E7]">
                                    <ShieldCheck className="h-4 w-4 text-[#556046]" />
                                </span>

                                <div>
                                    <p className="text-[11px] font-bold text-[#303630]">
                                        Role permissions
                                    </p>

                                    <p className="mt-1 text-[10px] leading-5 text-[#747A74]">
                                        Access permissions can be connected to your authentication
                                        and backend role system when the admin portal goes live.
                                    </p>
                                </div>

                            </div>

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
                                {editing
                                    ? "Update Administrator"
                                    : "Create Administrator"}

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
                        className={`text-[10px] font-bold uppercase tracking-[0.15em] ${dark
                                ? "text-white/55"
                                : "text-[#777E77]"
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
                className={`mt-4 text-[11px] font-medium ${dark
                        ? "text-white/50"
                        : "text-[#747A74]"
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
   ROLE
========================================================= */

function RoleBadge({ role }) {
    const styles = {
        "Super Administrator":
            "bg-[#151814] text-[#D8FF65]",

        Administrator:
            "bg-[#E9F2FF] text-[#275E9D]",

        "Sales Manager":
            "bg-[#FFF2D9] text-[#8F630D]",

        "Catalogue Manager":
            "bg-[#F0EAFE] text-[#6945A4]",
    };

    return (
        <span
            className={`
        inline-flex
        rounded-full
        px-3
        py-1.5
        text-[9px]
        font-bold
        ${styles[role] ||
                "bg-[#ECEEEC] text-[#626862]"
                }
      `}
        >
            {role}
        </span>
    );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ label, value }) {
    return (
        <div className="rounded-[13px] border border-black/[0.06] bg-[#F5F5F0] p-3">

            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#858B85]">
                {label}
            </p>

            <p className="mt-1.5 text-[10px] font-semibold leading-4 text-[#353B35]">
                {value}
            </p>

        </div>
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
   INITIALS
========================================================= */

function generateInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/* =========================================================
   INPUT STYLE
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