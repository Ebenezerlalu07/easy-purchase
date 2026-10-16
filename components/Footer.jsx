import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#07100B]
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND AMBIENCE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#D8FF65]/[0.04]
          blur-[160px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative z-10
          mx-auto
          max-w-[1320px]
          px-5
          pt-20
          md:px-8
          lg:px-0
          lg:pt-24
        "
      >
        {/* =====================================================
            TOP CTA
        ====================================================== */}

        <div
          className="
    grid
    grid-cols-1
    gap-10
    border-b
    border-white/10
    pb-12
    sm:pb-14
    md:pb-16
    lg:grid-cols-[minmax(0,1fr)_auto]
    lg:items-start
    lg:gap-16
    lg:pb-20
  "
        >
          {/* Heading */}
          <div className="min-w-0">
            <h2
              className="
        font-display
        text-[46px]
        font-medium
        leading-[0.92]
        tracking-[-0.055em]
        text-white
        sm:text-[58px]
        md:text-[72px]
        lg:text-[82px]
        xl:text-[92px]
      "
            >
              <span className="block text-white">
                Let&apos;s build
              </span>

              <span className="mt-1 block">
                <span className="relative inline-block text-[#D8FF65]">
                  something

                  {/* Underline */}
                  <svg
                    className="
              absolute
              -bottom-3
              left-[10%]
              h-[14px]
              w-[80%]
              sm:-bottom-4
              sm:h-[16px]
              md:-bottom-5
              md:h-[20px]
            "
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

          {/* Quote Button */}
          <div
            className="
      flex
      w-full
      justify-start
      pt-2
      sm:w-auto
      lg:justify-end
      lg:pt-1
    "
          >
            <Link
              href="/products"
              className="
        group
        inline-flex
        w-full
        items-center
        justify-between
        gap-5
        rounded-full
        bg-[#D8FF65]
        py-[7px]
        pl-6
        pr-[7px]
        text-[14px]
        font-semibold
        text-[#101411]
        transition-all
        duration-300
        hover:bg-white
        sm:w-auto
        sm:pl-7
      "
            >
              Start a Quote

              <span
                className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#07100B]
          text-white
          sm:h-12
          sm:w-12
        "
              >
                <ArrowUpRight
                  className="
            h-[18px]
            w-[18px]
            transition-transform
            duration-300
            group-hover:rotate-45
          "
                />
              </span>
            </Link>
          </div>
        </div>

        {/* =====================================================
            CONTACT CARDS
        ====================================================== */}

        <div
          className="
            grid
            gap-5
            border-b
            border-white/10
            py-16
            md:grid-cols-2
            lg:grid-cols-[1.35fr_1.08fr_0.8fr]
            lg:py-20
          "
        >
          {/* =================================================
              COMPANY CARD
          ================================================== */}

          <div
            className="
              flex
              min-h-[270px]
              flex-col
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.025]
              p-7
              md:p-8
            "
          >
            {/* Logo */}

            <Link href="/" className="inline-block w-fit">
              <img
                src="/Assets/Logo.png"
                alt="Top Range Building Materials"
                className="
                  h-auto
                  w-[145px]
                  object-contain
                "
              />
            </Link>

            {/* Description */}

            <p
              className="
                mt-10
                max-w-[390px]
                text-[14px]
                leading-7
                text-white/35
              "
            >
              Quality building materials and reliable supply solutions for
              residential, commercial and industrial projects.
            </p>

            {/* Location */}

            <div
              className="
                mt-auto
                flex
                items-end
                justify-between
                pt-10
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white/25
                  "
                >
                  Based In
                </p>

                <p
                  className="
                    mt-3
                    text-[14px]
                    font-medium
                    text-white/55
                  "
                >
                  Maliha Road, Sharjah
                </p>
              </div>

              <MapPin
                className="
                  h-5
                  w-5
                  text-[#D8FF65]
                "
              />
            </div>
          </div>

          {/* =================================================
              EMAIL CARD
          ================================================== */}

          <a
            href="mailto:easypurchaseadmin@gmail.com"
            className="
              group
              flex
              min-h-[270px]
              flex-col
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.025]
              p-7
              transition-all
              duration-300
              hover:border-[#D8FF65]/25
              hover:bg-white/[0.04]
              md:p-8
            "
          >
            <div className="flex items-start justify-between">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/25
                "
              >
                Email
              </p>

              <span
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  text-white
                  transition
                  duration-300
                  group-hover:border-[#D8FF65]
                  group-hover:bg-[#D8FF65]
                  group-hover:text-black
                "
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-auto">
              <h3
                className="
                  break-all
                  text-[22px]
                  font-semibold
                  tracking-[-0.035em]
                  text-white/80
                  md:text-[24px]
                "
              >
                info@toprange.ae
              </h3>

              <p
                className="
                  mt-4
                  text-[14px]
                  text-white/25
                "
              >
                Send your material requirement
              </p>
            </div>
          </a>

          {/* =================================================
              PHONE CARD
          ================================================== */}

          <a
            href="tel:+971 504682745"
            className="
              group
              flex
              min-h-[270px]
              flex-col
              rounded-[28px]
              bg-[#D8FF65]
              p-7
              text-[#101411]
              transition
              duration-300
              hover:bg-[#E3FF8A]
              md:p-8
            "
          >
            <div className="flex items-start justify-between">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-black/35
                "
              >
                Call Us
              </p>

              <span
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#07100B]
                  text-white
                  transition-transform
                  duration-300
                  group-hover:rotate-12
                "
              >
                <Phone className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-auto">
              <h3
                className="
                  text-[20px]
                  font-semibold
                  tracking-[-0.035em]
                  md:text-[22px]
                "
              >
                +971 00 000 0000
              </h3>

              <p
                className="
                  mt-4
                  text-[14px]
                  text-black/40
                "
              >
                Speak with our team
              </p>
            </div>
          </a>
        </div>

        {/* =====================================================
            GIANT TEXT
        ====================================================== */}



        <div
          className="
            flex
            flex-col
            gap-4
            py-7
            text-[11px]
            text-white/25
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {new Date().getFullYear()} Top Range Building Materials. All
            rights reserved.
          </p>

          <p className="hidden md:block">
            Quality · Reliability · Supply
          </p>

          <a
            href="#top"
            className="
              group
              flex
              items-center
              gap-2
              transition-colors
              duration-300
              hover:text-white
            "
          >
            Back to top

            <ArrowUp
              className="
                h-3
                w-3
                transition-transform
                duration-300
                group-hover:-translate-y-1
              "
            />
          </a>
        </div>
      </div>
    </footer>
  );
}