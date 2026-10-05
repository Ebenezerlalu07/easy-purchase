"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
    Boxes,
    BriefcaseBusiness,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    PackagePlus,
    PackageSearch,
    Settings,
    Tags,
    UserRoundCog,
    Users,
    X,
} from "lucide-react";

/* =========================================================
   ADMIN NAVIGATION
========================================================= */

const navigation = [
    {
        title: "MAIN",
        links: [
            {
                name: "Quotations",
                href: "/admin/quotes",
                icon: BriefcaseBusiness,
            },

        ],
    },

    {
        title: "CATALOGUE",
        links: [
            {
                name: "Products",
                href: "/admin/products/new",
                icon: PackageSearch,
            },
            {
                name: "Categories",
                href: "/admin/categories",
                icon: Boxes,
            },
            {
                name: "Brands",
                href: "/admin/brands",
                icon: Tags,
            },
        ],
    },

    {
        title: "ADMINISTRATION",
        links: [
            {
                name: "Admin Users",
                href: "/admin/admins",
                icon: UserRoundCog,
            },
            {
                name: "Settings",
                href: "/admin/settings",
                icon: Settings,
            },
        ],
    },
];

/* =========================================================
   ADMIN LAYOUT
========================================================= */

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);

    /* =====================================================
       TEMP LOGGED USER
       Replace later with Firebase/API authenticated user
    ====================================================== */

    const loggedAdmin = {
        name: "Global Admin",
        role: "Super Administrator",
        initials: "GA",
    };

    return (
        <div className="min-h-screen bg-[#F5F6F1] text-[#111512]">

            {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

            <aside
                className="
          fixed
          inset-y-0
          left-0
          z-50
          hidden
          w-[250px]
          bg-[#111512]
          lg:block
        "
            >
                <Sidebar
                    pathname={pathname}
                />
            </aside>

            {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

            {mobileOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">

                    {/* Overlay */}

                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMobileOpen(false)}
                        className="
              absolute
              inset-0
              bg-black/55
              backdrop-blur-sm
            "
                    />

                    {/* Drawer */}

                    <aside
                        className="
              relative
              z-10
              h-full
              w-[270px]
              bg-[#111512]
              shadow-[30px_0_80px_rgba(0,0,0,.25)]
            "
                    >
                        <Sidebar
                            pathname={pathname}
                            mobile
                            onClose={() => setMobileOpen(false)}
                        />
                    </aside>
                </div>
            )}

            {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

            <div className="min-h-screen lg:pl-[250px]">

                {/* ===================================================
            SIMPLE TOP BAR
        ==================================================== */}

                <header
                    className="
            sticky
            top-0
            z-40
            border-b
            border-black/[0.06]
            bg-[#F5F6F1]/95
            backdrop-blur-xl
          "
                >
                    <div
                        className="
              flex
              h-[72px]
              items-center
              justify-between
              px-4
              sm:px-6
              lg:px-8
            "
                    >

                        {/* =================================================
                MOBILE MENU
            ================================================== */}

                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#111512]
                text-white
                transition
                hover:bg-black
                lg:hidden
              "
                        >
                            <Menu className="h-4 w-4" />
                        </button>

                        {/* Desktop spacer */}

                        <div className="hidden lg:block" />

                        {/* =================================================
                LOGGED ADMIN
            ================================================== */}

                        <div
                            className="
                flex
                items-center
                gap-3
              "
                        >
                            {/* User text */}

                            <div className="hidden text-right sm:block">

                                <p
                                    className="
                    text-[11px]
                    font-bold
                    leading-none
                    text-[#111512]
                  "
                                >
                                    {loggedAdmin.name}
                                </p>

                                <p
                                    className="
                    mt-1.5
                    text-[8px]
                    font-medium
                    leading-none
                    text-black/40
                  "
                                >
                                    {loggedAdmin.role}
                                </p>

                            </div>

                            {/* Avatar */}

                            <div
                                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#111512]
                  text-[10px]
                  font-bold
                  text-white
                "
                            >
                                {loggedAdmin.initials}
                            </div>

                        </div>
                    </div>
                </header>

                {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

                <main
                    className="
            min-h-[calc(100vh-72px)]
            px-4
            py-6
            sm:px-6
            lg:px-8
            lg:py-8
          "
                >
                    <div
                        className="
              mx-auto
              w-full
              max-w-[1500px]
            "
                    >
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
    pathname,
    mobile = false,
    onClose,
}) {
    const router = useRouter();

    /* =====================================================
       LOGOUT
    ====================================================== */

    const handleLogout = () => {
        /*
          UI only now.
    
          Later:
          - Firebase signOut()
          - clear token/session
          - then redirect
        */

        router.push("/admin/login");
    };

    return (
        <div className="flex h-full flex-col">

            {/* =====================================================
          LOGO / BRAND
      ====================================================== */}

            <div
                className="
    flex
    h-[82px]
    shrink-0
    items-center
    justify-between
    border-b
    border-white/[0.08]
    px-5
  "
            >
                <Link
                    href="/admin/dashboard"
                    onClick={onClose}
                    className="
      flex
      items-center
    "
                >
                    <img
                        src="/Assets/Logo.png"
                        alt="Easy Purchase"
                        className="
        h-11
        w-auto
        object-contain
      "
                    />
                </Link>

                {mobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-white/[0.07]
        text-white
        transition
        hover:bg-white/[0.12]
      "
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* =====================================================
          ADD PRODUCT
      ====================================================== */}

            <div className="shrink-0 px-4 pb-3 pt-5">

                <Link
                    href="/admin/products/new"
                    onClick={onClose}
                    className="
            group
            flex
            h-[48px]
            w-full
            items-center
            justify-between
            rounded-[14px]
            bg-[#D8FF65]
            px-3
            text-[#111512]
            transition-all
            hover:bg-[#E4FF94]
          "
                >

                    <span
                        className="
              flex
              items-center
              gap-3
            "
                    >

                        <span
                            className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-[9px]
                bg-[#111512]
                text-white
              "
                        >
                            <PackagePlus className="h-3.5 w-3.5" />
                        </span>

                        <span
                            className="
                text-[10px]
                font-bold
              "
                        >
                            Add Product
                        </span>

                    </span>

                    <ChevronRight
                        className="
              h-3.5
              w-3.5
              transition-transform
              group-hover:translate-x-0.5
            "
                    />

                </Link>

            </div>

            {/* =====================================================
          NAVIGATION
          NO SCROLLBAR
      ====================================================== */}

            <nav
                className="
          flex-1
          overflow-hidden
          px-3
          py-3
        "
            >
                <div className="space-y-6">

                    {navigation.map((group) => (
                        <div key={group.title}>

                            {/* Group Heading */}

                            <p
                                className="
                  mb-2
                  px-3
                  text-[7px]
                  font-bold
                  tracking-[0.18em]
                  text-white/35
                "
                            >
                                {group.title}
                            </p>

                            {/* Navigation Links */}

                            <div className="space-y-1">

                                {group.links.map((item) => {
                                    const Icon = item.icon;

                                    const active =
                                        pathname === item.href ||
                                        pathname.startsWith(
                                            `${item.href}/`
                                        );

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                        group
                        flex
                        h-[44px]
                        items-center
                        gap-3
                        rounded-[12px]
                        px-3
                        transition-all
                        duration-200

                        ${active
                                                    ? `
                              bg-white/[0.10]
                              text-white
                            `
                                                    : `
                              text-white/65
                              hover:bg-white/[0.05]
                              hover:text-white
                            `
                                                }
                      `}
                                        >

                                            {/* Icon */}

                                            <span
                                                className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-[9px]

                          ${active
                                                        ? `
                                bg-[#D8FF65]
                                text-[#111512]
                              `
                                                        : `
                                bg-white/[0.05]
                                text-white/60
                              `
                                                    }
                        `}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                            </span>

                                            {/* Label */}

                                            <span
                                                className="
                          min-w-0
                          flex-1
                          truncate
                          text-[10px]
                          font-semibold
                        "
                                            >
                                                {item.name}
                                            </span>

                                            {/* Active Arrow */}

                                            {active && (
                                                <ChevronRight
                                                    className="
                            h-3
                            w-3
                            shrink-0
                            text-white/40
                          "
                                                />
                                            )}

                                        </Link>
                                    );
                                })}

                            </div>

                        </div>
                    ))}

                </div>
            </nav>

            {/* =====================================================
          LOGOUT
      ====================================================== */}

            <div
                className="
          shrink-0
          border-t
          border-white/[0.08]
          p-4
        "
            >

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
            group
            flex
            h-[46px]
            w-full
            items-center
            justify-between
            rounded-[13px]
            bg-white/[0.05]
            px-3
            text-white/65
            transition-all
            duration-200
            hover:bg-red-500/10
            hover:text-red-300
          "
                >

                    <span
                        className="
              flex
              items-center
              gap-3
            "
                    >

                        <span
                            className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-[9px]
                bg-white/[0.06]
                transition
                group-hover:bg-red-500/10
              "
                        >
                            <LogOut className="h-3.5 w-3.5" />
                        </span>

                        <span
                            className="
                text-[10px]
                font-semibold
              "
                        >
                            Logout
                        </span>

                    </span>

                    <ChevronRight
                        className="
              h-3
              w-3
              opacity-40
              transition-transform
              group-hover:translate-x-0.5
            "
                    />

                </button>

            </div>

        </div>
    );
}