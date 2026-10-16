"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  ArrowUp,
  MessageCircle,
} from "lucide-react";

const fallback = {
  companyName: "Top Range Building Materials",
  email: "",
  phone: "",
  whatsapp: "",
  address: "Maliha Road, Sharjah",
  logoUrl: "",
  showWhatsApp: true,
};

function digitsOnly(value = "") {
  return String(value).replace(/\D/g, "");
}

export default function Footer() {
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPublicSettings() {
      try {
        // Use normal browser caching rules instead of forcing a no-store request.
        const response = await fetch("/api/settings?public=1", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load public settings");
        }

        const data = await response.json();
        if (data?.settings && typeof data.settings === "object") {
          setSettings((current) => ({ ...current, ...data.settings }));
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          // Keep the fallback content visible if settings cannot be loaded.
          console.error("Unable to load footer settings:", error);
        }
      }
    }

    loadPublicSettings();
    return () => controller.abort();
  }, []);

  const phoneDigits = digitsOnly(settings.phone);
  const whatsappDigits = digitsOnly(settings.whatsapp);
  const email = settings.email || fallback.email;
  const phone = settings.phone || fallback.phone;
  const companyName = settings.companyName || fallback.companyName;
  const logoSrc = settings.logoUrl || "/Assets/Logo.png";
  const location = settings.address || fallback.address;

  return (
    <footer
      id="footer"
      className="relative isolate overflow-hidden bg-[#07100B] text-white"
    >
      {/* Smaller glow on mobile to reduce costly blur rendering on iOS. */}
      <div className="pointer-events-none absolute right-[-100px] top-0 h-[300px] w-[300px] rounded-full bg-[#D8FF65]/[0.04] blur-[40px] md:right-[-180px] md:h-[500px] md:w-[500px] md:blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pt-20 md:px-8 lg:px-0 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 sm:pb-14 md:pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16 lg:pb-20">
          <div className="min-w-0">
            <h2 className="font-display text-[46px] font-medium leading-[0.92] tracking-[-0.055em] text-white sm:text-[58px] md:text-[72px] lg:text-[82px] xl:text-[92px]">
              <span className="block text-white">Let&apos;s build</span>
              <span className="mt-1 block">
                <span className="relative inline-block text-[#D8FF65]">
                  something
                  <svg
                    className="absolute -bottom-3 left-[10%] h-[14px] w-[80%] sm:-bottom-4 sm:h-[16px] md:-bottom-5 md:h-[20px]"
                    viewBox="0 0 300 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 14C74 5 179 4 295 11"
                      stroke="#D8FF65"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-white"> better.</span>
              </span>
            </h2>
          </div>

          <div className="flex w-full justify-start pt-2 sm:w-auto lg:justify-end lg:pt-1">
            <Link
              href="/"
              className="group inline-flex w-full items-center justify-between gap-5 rounded-full bg-[#D8FF65] py-[7px] pl-6 pr-[7px] text-[14px] font-semibold text-[#101411] transition-colors duration-300 hover:bg-white sm:w-auto sm:pl-7"
            >
              Start a Quote
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#07100B] text-white sm:h-12 sm:w-12">
                <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </Link>
          </div>
        </div>

        <div className="grid gap-5 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_1.08fr_0.8fr] lg:py-20">
          <div className="flex min-h-[270px] flex-col rounded-[28px] border border-white/10 bg-white/[0.025] p-7 md:p-8">
            <Link href="/" className="inline-block w-fit">
              <img
                src={logoSrc}
                alt={companyName}
                loading="lazy"
                decoding="async"
                className="h-auto w-[145px] object-contain"
              />
            </Link>

            <p className="mt-10 max-w-[390px] text-[14px] leading-7 text-white/35">
              Quality building materials and reliable supply solutions for residential, commercial and industrial projects.
            </p>

            <div className="mt-auto flex items-end justify-between pt-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                  Based In
                </p>
                <p className="mt-3 text-[14px] font-medium text-white/55">
                  {location}
                </p>
              </div>
              <MapPin className="h-5 w-5 text-[#D8FF65]" aria-hidden="true" />
            </div>
          </div>

          <a
            href={email ? `mailto:${email}` : undefined}
            aria-disabled={!email}
            className={`group flex min-h-[270px] flex-col rounded-[28px] border border-white/10 bg-white/[0.025] p-7 transition-colors duration-300 hover:border-[#D8FF65]/25 hover:bg-white/[0.04] md:p-8 ${
              email ? "" : "cursor-default"
            }`}
          >
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Email
              </p>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition-colors duration-300 group-hover:border-[#D8FF65] group-hover:bg-[#D8FF65] group-hover:text-black">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-auto">
              <h3 className="break-all text-[22px] font-semibold tracking-[-0.035em] text-white/80 md:text-[24px]">
                {email || "Email us"}
              </h3>
              <p className="mt-4 text-[14px] text-white/25">
                Send your material requirement
              </p>
            </div>
          </a>

          <div className="flex min-h-[270px] flex-col rounded-[28px] bg-[#D8FF65] p-7 text-[#101411] transition-colors duration-300 hover:bg-[#E3FF8A] md:p-8">
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
                Call Us
              </p>
              <a
                href={phoneDigits ? `tel:${phoneDigits}` : undefined}
                aria-label="Call us"
                aria-disabled={!phoneDigits}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07100B] text-white transition-transform duration-300 hover:rotate-12"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-auto">
              <a
                href={phoneDigits ? `tel:${phoneDigits}` : undefined}
                aria-disabled={!phoneDigits}
                className="break-words text-[20px] font-semibold tracking-[-0.035em] md:text-[22px]"
              >
                {phone || "Contact our team"}
              </a>
              <p className="mt-3 text-[14px] text-black/40">
                Speak with our team
              </p>
              {settings.showWhatsApp !== false && whatsappDigits && (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold underline underline-offset-4"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp us
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-[11px] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <p className="hidden md:block">Quality · Reliability · Supply</p>
          <a
            href="#top"
            className="group flex items-center gap-2 transition-colors duration-300 hover:text-white"
          >
            Back to top
            <ArrowUp className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
