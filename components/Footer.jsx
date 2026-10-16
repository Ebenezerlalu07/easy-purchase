import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#07100D] text-white">
      <div className="mx-auto w-full max-w-[1450px] px-5 pb-8 pt-14 md:px-10 md:pb-10 md:pt-16 lg:px-14 lg:pt-20">
        {/* TOP */}
        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          {/* CTA */}
          <div className="rounded-[28px] border border-white/10 bg-[#101713] p-6 sm:p-8 lg:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Top Range Building Materials
            </p>

            <h2 className="mt-5 max-w-[760px] text-[30px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[38px] lg:text-[48px]">
              Reliable building materials for projects across the UAE.
            </h2>

            <p className="mt-5 max-w-[620px] text-[14px] leading-7 text-white/55">
              Send your material requirements and our team will help with
              product availability, pricing and quotation support.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-12 items-center gap-4 rounded-full bg-[#D8FF65] py-2 pl-5 pr-2 text-[13px] font-semibold text-[#101411]"
            >
              Request a Quote

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#101411] text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* CONTACT */}
          <div className="rounded-[28px] border border-[#D8FF65] bg-[#D8FF65] p-6 text-[#101411] sm:p-8 lg:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#101411]/55">
              Contact
            </p>

            <div className="mt-7 space-y-5">
              <a
                href="mailto:info@toprange.ae"
                className="flex min-w-0 items-center gap-3 text-[13px] font-semibold text-[#101411]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#101411] text-white">
                  <Mail className="h-4 w-4" />
                </span>

                <span className="min-w-0 break-all">
                  info@toprange.ae
                </span>
              </a>

              <a
                href="tel:+971000000000"
                className="flex items-center gap-3 text-[13px] font-semibold text-[#101411]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#101411] text-white">
                  <Phone className="h-4 w-4" />
                </span>

                +971 00 000 0000
              </a>

              <div className="flex items-center gap-3 text-[13px] font-semibold text-[#101411]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#101411] text-white">
                  <MapPin className="h-4 w-4" />
                </span>

                Ajman, UAE
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* NAVIGATION */}
          <div className="rounded-[28px] border border-white/10 bg-[#101713] p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Navigation
            </p>

            <nav className="mt-6 flex flex-col gap-4">
              <Link
                href="/products"
                className="w-fit text-[14px] text-white/65"
              >
                Products
              </Link>

              <Link
                href="/contact"
                className="w-fit text-[14px] text-white/65"
              >
                Contact
              </Link>

              <Link
                href="/cart"
                className="w-fit text-[14px] text-white/65"
              >
                Cart
              </Link>
            </nav>
          </div>

          {/* BUSINESS HOURS */}
          <div className="rounded-[28px] border border-white/10 bg-[#101713] p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Business Hours
            </p>

            <div className="mt-6 space-y-4 text-[13px] text-white/55">
              <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-4">
                <span>Monday – Saturday</span>
                <span className="text-right text-white/80">
                  8:00 AM – 7:00 PM
                </span>
              </div>

              <div className="flex items-start justify-between gap-5">
                <span>Sunday</span>
                <span className="text-right text-white/80">
                  Contact us
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-[11px] leading-5 text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Top Range Building Materials.
              All rights reserved.
            </p>

            <p>
              Building Materials · Tools · Hardware
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

