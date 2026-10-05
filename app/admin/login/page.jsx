"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const updateForm = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // UI ONLY
        // Connect backend authentication later.

        router.push("/admin/dashboard");
    };

    return (
        <main className="min-h-screen overflow-hidden bg-[#F4F5EF] text-[#101411]">
            <div className="grid min-h-screen lg:grid-cols-[1.08fr_.92fr]">

                {/* =====================================================
            LEFT IMAGE
        ====================================================== */}

                <section className="relative hidden min-h-screen overflow-hidden bg-[#07100D] lg:block">
                    <img
                        src="/Assets/final paiting.jpg"
                        alt="Easy Purchase Admin"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />

                    {/* Image overlays */}

                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,13,.06)_0%,rgba(7,16,13,.12)_55%,rgba(7,16,13,.72)_100%)]" />

                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,16,13,.50)_0%,transparent_52%,rgba(7,16,13,.06)_100%)]" />

                    <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,.25)]" />

                    {/* Bottom badge */}

                    <div
                        className="
              absolute
              bottom-10
              left-10
              z-20
              flex
              items-center
              gap-3
              rounded-full
              border
              border-white/15
              bg-black/20
              px-4
              py-3
              text-white
              backdrop-blur-2xl
            "
                    >
                        <span
                            className="
                h-2.5
                w-2.5
                rounded-full
                bg-[#D8FF65]
                shadow-[0_0_16px_#D8FF65]
              "
                        />

                        <span
                            className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white/65
              "
                        >
                            Administrator Portal
                        </span>
                    </div>
                </section>

                {/* =====================================================
            RIGHT LOGIN
        ====================================================== */}

                <section
                    className="
            relative
            flex
            min-h-screen
            items-center
            justify-center
            overflow-hidden
            px-5
            pb-12
            pt-28
            sm:px-8
            sm:pt-32
            md:px-12
            lg:px-12
            lg:py-16
            xl:px-16
          "
                >
                    {/* Background */}

                    <div className="absolute inset-0 bg-[#F4F5EF]" />

                    {/* Glow */}

                    <div
                        className="
              pointer-events-none
              absolute
              -right-48
              -top-48
              h-[580px]
              w-[580px]
              rounded-full
              bg-[#D8FF65]/20
              blur-[180px]
            "
                    />

                    <div
                        className="
              pointer-events-none
              absolute
              -bottom-52
              -left-48
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#E7B982]/15
              blur-[170px]
            "
                    />

                    {/* Dots */}

                    <div
                        className="
              pointer-events-none
              absolute
              right-10
              top-16
              h-[150px]
              w-[150px]
              opacity-[0.16]
              [background-image:radial-gradient(#101411_1px,transparent_1px)]
              [background-size:14px_14px]
            "
                    />

                    <div className="relative z-10 w-full max-w-[490px]">

                        {/* Back */}

                        <Link
                            href="/"
                            className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-black/[0.07]
                bg-white/80
                py-1.5
                pl-1.5
                pr-4
                text-[11px]
                font-semibold
                text-black/50
                shadow-[0_8px_25px_rgba(0,0,0,.03)]
                backdrop-blur-xl
                transition
                hover:text-black
              "
                        >
                            <span
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F0F2EC]
                  transition
                  group-hover:bg-[#101411]
                  group-hover:text-white
                "
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                            </span>

                            Back to website
                        </Link>

                        {/* =================================================
                LOGIN CARD
            ================================================== */}

                        <div
                            className="
                mt-8
                rounded-[34px]
                border
                border-white/80
                bg-white/65
                p-5
                shadow-[0_30px_100px_rgba(16,20,17,.07)]
                backdrop-blur-2xl
                sm:p-7
                md:p-8
              "
                        >
                            {/* Header */}

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
                      text-[#101411]
                    "
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                    </span>

                                    <span
                                        className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-black/35
                    "
                                    >
                                        Global Administration
                                    </span>
                                </div>

                                <h1
                                    className="
                    mt-6
                    text-[40px]
                    font-semibold
                    leading-[0.96]
                    tracking-[-0.055em]
                    sm:text-[46px]
                  "
                                >
                                    Welcome back,
                                    <br />

                                    <span className="text-black/30">
                                        administrator.
                                    </span>
                                </h1>

                                <p
                                    className="
                    mt-4
                    max-w-md
                    text-[12px]
                    leading-6
                    text-black/45
                  "
                                >
                                    Sign in to manage quotations, customers,
                                    products, inventory and global platform settings.
                                </p>
                            </div>

                            {/* =================================================
                  FORM
              ================================================== */}

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 space-y-5"
                            >
                                {/* Email */}

                                <div>
                                    <label
                                        className="
                      mb-2
                      block
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-black/40
                    "
                                    >
                                        Email Address
                                    </label>

                                    <div
                                        className="
                      grid
                      h-[60px]
                      grid-cols-[44px_minmax(0,1fr)]
                      items-center
                      rounded-[18px]
                      border
                      border-black/[0.08]
                      bg-white
                      px-2
                      shadow-[0_8px_24px_rgba(0,0,0,.02)]
                      transition-all
                      focus-within:border-black/20
                      focus-within:ring-4
                      focus-within:ring-[#D8FF65]/20
                    "
                                    >
                                        <span
                                            className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-[13px]
                        bg-[#F1F3ED]
                        text-black/40
                      "
                                        >
                                            <Mail className="h-4 w-4" />
                                        </span>

                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={updateForm}
                                            placeholder="Enter admin email"
                                            autoComplete="email"
                                            className="
                        h-full
                        min-w-0
                        w-full
                        bg-transparent
                        px-3
                        text-[13px]
                        font-medium
                        outline-none
                        placeholder:text-black/25
                      "
                                        />
                                    </div>
                                </div>

                                {/* Password */}

                                <div>
                                    <label
                                        className="
                      mb-2
                      block
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-black/40
                    "
                                    >
                                        Password
                                    </label>

                                    <div
                                        className="
                      grid
                      h-[60px]
                      grid-cols-[44px_minmax(0,1fr)_44px]
                      items-center
                      rounded-[18px]
                      border
                      border-black/[0.08]
                      bg-white
                      px-2
                      shadow-[0_8px_24px_rgba(0,0,0,.02)]
                      transition-all
                      focus-within:border-black/20
                      focus-within:ring-4
                      focus-within:ring-[#D8FF65]/20
                    "
                                    >
                                        <span
                                            className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-[13px]
                        bg-[#F1F3ED]
                        text-black/40
                      "
                                        >
                                            <LockKeyhole className="h-4 w-4" />
                                        </span>

                                        <input
                                            required
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={form.password}
                                            onChange={updateForm}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            className="
                        h-full
                        min-w-0
                        w-full
                        bg-transparent
                        px-3
                        text-[13px]
                        font-medium
                        outline-none
                        placeholder:text-black/25
                      "
                                        />

                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            onClick={() =>
                                                setShowPassword(
                                                    (current) => !current
                                                )
                                            }
                                            className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-[13px]
                        text-black/30
                        transition
                        hover:bg-[#F1F3ED]
                        hover:text-black
                      "
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot */}

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="
                      text-[10px]
                      font-bold
                      text-black/45
                      transition
                      hover:text-black
                    "
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Submit */}

                                <Link
                                    href="/admin/quotes"
                                    className="
    group
    flex
    h-[62px]
    w-full
    items-center
    justify-between
    rounded-full
    bg-[#101411]
    pl-7
    pr-2
    text-[12px]
    font-bold
    text-white
    shadow-[0_18px_45px_rgba(16,20,17,.18)]
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:bg-[#1A201C]
  "
                                >
                                    <span>
                                        Enter Dashboard
                                    </span>

                                    <span
                                        className="
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-full
      bg-[#D8FF65]
      text-[#101411]
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </Link>
                            </form>

                            {/* Security */}

                            <div
                                className="
                  mt-7
                  flex
                  items-center
                  justify-center
                  gap-2
                  border-t
                  border-black/[0.06]
                  pt-5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-black/25
                "
                            >
                                <ShieldCheck className="h-3.5 w-3.5" />

                                Secure administrator access
                            </div>
                        </div>

                        {/* UI message */}

                        <p
                            className="
                mt-5
                text-center
                text-[9px]
                leading-5
                text-black/30
              "
                        >
                            Authorized Easy Purchase administrators only.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}