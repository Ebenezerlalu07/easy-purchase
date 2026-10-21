import Link from "next/link";
import {
  ArrowUpRight,
  ArrowUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07100B] text-white">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 md:px-8 lg:px-0 lg:py-12">
        {/* TOP */}

        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Top Range Building Materials
            </p>

            <h2 className="mt-2 font-display text-[28px] font-medium leading-tight tracking-[-0.045em] sm:text-[34px]">
              Let&apos;s build{" "}
              <span className="text-[#D8FF65]">something better.</span>
            </h2>
          </div>


        </div>

        {/* INFO */}

        <div className="grid gap-3 border-b border-white/10 py-7 md:grid-cols-3">
          <InfoItem
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value="Maliha Road, Sharjah"
          />

          <InfoItem
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value="easypurchaseadmin@gmail.com"
            href="mailto:easypurchaseadmin@gmail.com"
          />

          <InfoItem
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value="+971 50 468 2745"
            href="tel:+971504682745"
            highlight
          />
        </div>

        {/* BOTTOM */}

        <div className="flex flex-col gap-4 pt-6 text-[10px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Top Range Building Materials. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className="hidden sm:inline">
              Quality · Reliability · Supply
            </span>

            <a
              href="#top"
              className="group inline-flex items-center gap-2 text-white/45 transition hover:text-white"
            >
              Back to top
              <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InfoItem({
  icon,
  label,
  value,
  href,
  highlight = false,
}) {
  const content = (
    <div
      className={`flex items-center gap-3 rounded-[16px] border px-4 py-4 transition ${highlight
        ? "border-[#D8FF65]/20 bg-[#D8FF65] text-[#101411]"
        : "border-white/10 bg-white/[0.025] text-white"
        }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${highlight
          ? "bg-[#07100B] text-white"
          : "bg-white/[0.06] text-[#D8FF65]"
          }`}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p
          className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${highlight ? "text-black/40" : "text-white/25"
            }`}
        >
          {label}
        </p>

        <p
          className={`mt-1 truncate text-[12px] font-semibold ${highlight ? "text-[#101411]" : "text-white/75"
            }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      className="block transition hover:-translate-y-0.5"
    >
      {content}
    </a>
  );
}
