"use client";

import { useMemo, useState } from "react";

import {
    ArrowUpRight,
    Building2,
    CalendarDays,
    ChevronRight,
    FileText,
    Mail,
    MapPin,
    Package,
    Phone,
    Search,
    UserRound,
    X,
} from "lucide-react";

/* =========================================================
   QUOTATION DATA
========================================================= */

const quotations = [
    {
        id: "QT-1048",
        company: "Al Noor Contracting LLC",
        contactName: "Ahmed Kareem",
        email: "ahmed@alnoorcontracting.ae",
        phone: "+971 50 245 7821",
        date: "24 Sep 2026",
        products: 6,
        amount: "AED 8,450",
        status: "New",
        category: "Power Tools",
        brand: "DeWalt",
        quantity: "12 Units",
        deliveryLocation: "Dubai, UAE",
        productList: [
            "Cordless Hammer Drill",
            "Cordless Impact Wrench",
            "Circular Saw",
        ],
        description:
            "Please provide your best quotation including delivery charges and expected delivery time.",
    },
    {
        id: "QT-1047",
        company: "Blue Arc Technical Services",
        contactName: "Joseph Mathew",
        email: "joseph@bluearc.ae",
        phone: "+971 55 642 3190",
        date: "23 Sep 2026",
        products: 3,
        amount: "AED 4,280",
        status: "Reviewing",
        category: "Electrical",
        brand: "Fluke",
        quantity: "8 Units",
        deliveryLocation: "Sharjah, UAE",
        productList: [
            "Digital Clamp Meter",
            "Electrical Accessories",
        ],
        description:
            "Quotation required for our upcoming maintenance project.",
    },
    {
        id: "QT-1046",
        company: "Prime Build Interiors",
        contactName: "Nadia Ali",
        email: "nadia@primebuild.ae",
        phone: "+971 52 781 4632",
        date: "23 Sep 2026",
        products: 8,
        amount: "AED 12,900",
        status: "Quoted",
        category: "Building Materials",
        brand: "Multiple Brands",
        quantity: "Bulk Order",
        deliveryLocation: "Abu Dhabi, UAE",
        productList: [
            "Steel Bars",
            "Hand Tools",
            "Power Tools",
            "Construction Accessories",
        ],
        description:
            "Bulk requirement for a commercial interior fit-out project.",
    },
    {
        id: "QT-1045",
        company: "Gulf Horizon Maintenance",
        contactName: "Saeed Rahman",
        email: "saeed@gulfhorizon.ae",
        phone: "+971 50 331 9204",
        date: "22 Sep 2026",
        products: 4,
        amount: "AED 6,750",
        status: "Approved",
        category: "Power Tools",
        brand: "Bosch",
        quantity: "10 Units",
        deliveryLocation: "Ajman, UAE",
        productList: [
            "Professional Angle Grinder",
            "Circular Saw",
            "Combination Pliers",
        ],
        description:
            "Approved quotation. Customer requested delivery within three working days.",
    },
    {
        id: "QT-1044",
        company: "Vertex Building Solutions",
        contactName: "Mohammed Ali",
        email: "mohammed@vertexbuild.ae",
        phone: "+971 56 410 8291",
        date: "21 Sep 2026",
        products: 5,
        amount: "AED 9,200",
        status: "Completed",
        category: "Construction Materials",
        brand: "Multiple Brands",
        quantity: "25 Units",
        deliveryLocation: "Dubai, UAE",
        productList: [
            "Steel Bars",
            "Power Tools",
            "Hand Tools",
        ],
        description:
            "Order completed and delivered successfully.",
    },
    {
        id: "QT-1043",
        company: "Royal Star Technical Works",
        contactName: "Faisal Khan",
        email: "faisal@royalstar.ae",
        phone: "+971 54 221 0673",
        date: "20 Sep 2026",
        products: 7,
        amount: "AED 11,480",
        status: "Reviewing",
        category: "Tools & Equipment",
        brand: "DeWalt",
        quantity: "18 Units",
        deliveryLocation: "Dubai, UAE",
        productList: [
            "Cordless Hammer Drill",
            "Chainsaw",
            "Impact Wrench",
        ],
        description:
            "Please include product warranty details in the quotation.",
    },
];

const statusFilters = [
    "All",
    "New",
    "Reviewing",
    "Quoted",
    "Approved",
    "Completed",
];

/* =========================================================
   PAGE
========================================================= */

export default function QuotationsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [selectedQuote, setSelectedQuote] = useState(null);

    const filteredQuotes = useMemo(() => {
        const term = search.trim().toLowerCase();

        return quotations.filter((quote) => {
            const matchesStatus =
                status === "All" || quote.status === status;

            const matchesSearch =
                !term ||
                quote.id.toLowerCase().includes(term) ||
                quote.company.toLowerCase().includes(term) ||
                quote.contactName.toLowerCase().includes(term) ||
                quote.email.toLowerCase().includes(term) ||
                quote.phone.toLowerCase().includes(term);

            return matchesStatus && matchesSearch;
        });
    }, [search, status]);

    return (
        <div className="pb-12">

            {/* =====================================================
          PAGE HEADER
      ====================================================== */}

            <section
                className="
          mb-7
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
            >
                <div>
                    <p
                        className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#6F756D]
            "
                    >
                        Sales Management
                    </p>

                    <h1
                        className="
              mt-2
              text-[36px]
              font-semibold
              leading-none
              tracking-[-0.05em]
              text-[#151814]
              sm:text-[42px]
            "
                    >
                        Quotations
                    </h1>

                    <p
                        className="
              mt-3
              max-w-[650px]
              text-[13px]
              font-medium
              leading-6
              text-[#656B63]
            "
                    >
                        View customer enquiries, contact information,
                        requested products and quotation status.
                    </p>
                </div>

                <div
                    className="
            flex
            w-fit
            items-center
            gap-3
            rounded-[16px]
            border
            border-[#D6D8D1]
            bg-white
            px-4
            py-3
            shadow-[0_6px_20px_rgba(0,0,0,.03)]
          "
                >
                    <span
                        className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-[11px]
              bg-[#111512]
              text-white
            "
                    >
                        <FileText className="h-4 w-4" />
                    </span>

                    <div>
                        <p
                            className="
                text-[9px]
                font-semibold
                text-[#71776F]
              "
                        >
                            Total Quotations
                        </p>

                        <p
                            className="
                mt-0.5
                text-[17px]
                font-bold
                text-[#151814]
              "
                        >
                            {quotations.length}
                        </p>
                    </div>
                </div>
            </section>

            {/* =====================================================
          QUOTATION CONTAINER
      ====================================================== */}

            <section
                className="
          overflow-hidden
          rounded-[26px]
          border
          border-[#D5D8D0]
          bg-white
          shadow-[0_10px_35px_rgba(17,21,18,.035)]
        "
            >

                {/* =================================================
            SEARCH + FILTER
        ================================================== */}

                <div
                    className="
            border-b
            border-[#E1E3DD]
            p-4
            sm:p-5
            lg:p-6
          "
                >
                    <div
                        className="
              flex
              flex-col
              gap-4
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
                    >

                        {/* Search */}

                        <div
                            className="
                flex
                h-[48px]
                w-full
                items-center
                gap-3
                rounded-[14px]
                border
                border-[#D6D9D1]
                bg-[#F7F8F4]
                px-4
                xl:max-w-[390px]
              "
                        >
                            <Search className="h-4 w-4 shrink-0 text-[#626861]" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search quotation or customer..."
                                className="
                  h-full
                  w-full
                  bg-transparent
                  text-[12px]
                  font-medium
                  text-[#151814]
                  outline-none
                  placeholder:text-[#878C85]
                "
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E9EBE5]
                  "
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        {/* Filter */}

                        <div
                            className="
                flex
                gap-2
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
                        >
                            {statusFilters.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setStatus(item)}
                                    className={`
                    shrink-0
                    rounded-full
                    px-4
                    py-2.5
                    text-[10px]
                    font-semibold
                    transition-all

                    ${status === item
                                            ? "bg-[#151814] text-white"
                                            : "border border-[#D9DCD4] bg-[#F7F8F4] text-[#5F655D] hover:border-[#151814] hover:text-[#151814]"
                                        }
                  `}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

                {/* =================================================
            DESKTOP TABLE
        ================================================== */}

                <div className="hidden overflow-x-auto lg:block">

                    <table className="w-full min-w-[1120px]">

                        <thead className="bg-[#F4F5F0]">
                            <tr
                                className="
                  text-left
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-[#5C625A]
                "
                            >
                                <th className="px-6 py-4">
                                    Quotation
                                </th>

                                <th className="px-6 py-4">
                                    Customer
                                </th>

                                <th className="px-6 py-4">
                                    Contact Details
                                </th>

                                <th className="px-6 py-4">
                                    Products
                                </th>

                                <th className="px-6 py-4">
                                    Amount
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>

                                <th className="px-6 py-4">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredQuotes.map((quote) => (
                                <tr
                                    key={quote.id}
                                    className="
                    border-t
                    border-[#E5E7E1]
                    transition
                    hover:bg-[#FAFAF7]
                  "
                                >

                                    {/* Quote */}

                                    <td className="px-6 py-5 align-top">
                                        <p
                                            className="
                        text-[12px]
                        font-bold
                        text-[#151814]
                      "
                                        >
                                            {quote.id}
                                        </p>

                                        <div
                                            className="
                        mt-2
                        flex
                        items-center
                        gap-1.5
                        text-[10px]
                        font-medium
                        text-[#6D736B]
                      "
                                        >
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {quote.date}
                                        </div>
                                    </td>

                                    {/* Customer */}

                                    <td className="px-6 py-5 align-top">
                                        <p
                                            className="
                        max-w-[210px]
                        text-[12px]
                        font-bold
                        leading-5
                        text-[#151814]
                      "
                                        >
                                            {quote.company}
                                        </p>

                                        <div
                                            className="
                        mt-2
                        flex
                        items-center
                        gap-1.5
                        text-[11px]
                        font-medium
                        text-[#646A62]
                      "
                                        >
                                            <UserRound className="h-3.5 w-3.5" />
                                            {quote.contactName}
                                        </div>
                                    </td>

                                    {/* CONTACT DETAILS - BIGGER */}

                                    <td className="px-6 py-5 align-top">

                                        <div className="space-y-2.5">

                                            <a
                                                href={`tel:${quote.phone}`}
                                                className="
                          flex
                          items-center
                          gap-2.5
                          text-[11px]
                          font-semibold
                          text-[#222720]
                          transition
                          hover:text-[#5E791B]
                        "
                                            >
                                                <span
                                                    className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-[8px]
                            bg-[#EFF1EB]
                          "
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                </span>

                                                {quote.phone}
                                            </a>

                                            <a
                                                href={`mailto:${quote.email}`}
                                                className="
                          flex
                          max-w-[250px]
                          items-center
                          gap-2.5
                          text-[11px]
                          font-semibold
                          text-[#444A42]
                          transition
                          hover:text-[#5E791B]
                        "
                                            >
                                                <span
                                                    className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-[8px]
                            bg-[#EFF1EB]
                          "
                                                >
                                                    <Mail className="h-3.5 w-3.5" />
                                                </span>

                                                <span className="break-all">
                                                    {quote.email}
                                                </span>
                                            </a>

                                        </div>
                                    </td>

                                    {/* Products */}

                                    <td className="px-6 py-5 align-top">
                                        <div
                                            className="
                        flex
                        w-fit
                        items-center
                        gap-2
                        rounded-[11px]
                        bg-[#F1F3ED]
                        px-3
                        py-2
                      "
                                        >
                                            <Package className="h-3.5 w-3.5" />

                                            <span
                                                className="
                          text-[11px]
                          font-bold
                        "
                                            >
                                                {quote.products}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Amount */}

                                    <td
                                        className="
                      px-6
                      py-5
                      align-top
                      text-[12px]
                      font-bold
                      text-[#151814]
                    "
                                    >
                                        {quote.amount}
                                    </td>

                                    {/* Status */}

                                    <td className="px-6 py-5 align-top">
                                        <StatusBadge value={quote.status} />
                                    </td>

                                    {/* Action */}

                                    <td className="px-6 py-5 align-top">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedQuote(quote)
                                            }
                                            className="
                        group
                        flex
                        items-center
                        gap-2
                        rounded-full
                        bg-[#151814]
                        px-4
                        py-2.5
                        text-[9px]
                        font-bold
                        text-white
                        transition
                        hover:bg-black
                      "
                                        >
                                            Details

                                            <ArrowUpRight
                                                className="
                          h-3.5
                          w-3.5
                          transition
                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5
                        "
                                            />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                {/* =================================================
            TABLET / MOBILE CARDS
        ================================================== */}

                <div
                    className="
            grid
            gap-4
            bg-[#F1F0EA]
            p-4
            sm:p-5
            md:grid-cols-2
            lg:hidden
          "
                >
                    {filteredQuotes.map((quote) => (
                        <article
                            key={quote.id}
                            className="
                rounded-[20px]
                border
                border-[#D6D9D1]
                bg-white
                p-4
                shadow-[0_6px_20px_rgba(17,21,18,.025)]
                sm:p-5
              "
                        >

                            {/* Top */}

                            <div
                                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
                            >
                                <div>
                                    <p
                                        className="
                      text-[13px]
                      font-bold
                      text-[#151814]
                    "
                                    >
                                        {quote.id}
                                    </p>

                                    <div
                                        className="
                      mt-1.5
                      flex
                      items-center
                      gap-1.5
                      text-[10px]
                      font-medium
                      text-[#70766E]
                    "
                                    >
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        {quote.date}
                                    </div>
                                </div>

                                <StatusBadge value={quote.status} />
                            </div>

                            {/* Company */}

                            <div
                                className="
                  mt-5
                  border-b
                  border-[#E7E8E3]
                  pb-4
                "
                            >
                                <p
                                    className="
                    text-[13px]
                    font-bold
                    leading-5
                    text-[#151814]
                  "
                                >
                                    {quote.company}
                                </p>

                                <div
                                    className="
                    mt-2
                    flex
                    items-center
                    gap-2
                    text-[11px]
                    font-medium
                    text-[#60665E]
                  "
                                >
                                    <UserRound className="h-4 w-4" />
                                    {quote.contactName}
                                </div>
                            </div>

                            {/* CONTACT DETAILS */}

                            <div
                                className="
                  mt-4
                  space-y-3
                  rounded-[15px]
                  bg-[#F7F8F4]
                  p-3.5
                "
                            >
                                <a
                                    href={`tel:${quote.phone}`}
                                    className="
                    flex
                    items-center
                    gap-3
                    text-[12px]
                    font-semibold
                    text-[#252A24]
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
                      bg-white
                    "
                                    >
                                        <Phone className="h-3.5 w-3.5" />
                                    </span>

                                    {quote.phone}
                                </a>

                                <a
                                    href={`mailto:${quote.email}`}
                                    className="
                    flex
                    items-start
                    gap-3
                    text-[11px]
                    font-semibold
                    leading-5
                    text-[#4A5048]
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
                      bg-white
                    "
                                    >
                                        <Mail className="h-3.5 w-3.5" />
                                    </span>

                                    <span className="min-w-0 break-all pt-1.5">
                                        {quote.email}
                                    </span>
                                </a>
                            </div>

                            {/* Information */}

                            <div
                                className="
                  mt-4
                  grid
                  grid-cols-2
                  gap-3
                "
                            >
                                <div
                                    className="
                    rounded-[13px]
                    bg-[#F7F8F4]
                    p-3
                  "
                                >
                                    <p
                                        className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.08em]
                      text-[#747A72]
                    "
                                    >
                                        Products
                                    </p>

                                    <p
                                        className="
                      mt-2
                      text-[13px]
                      font-bold
                      text-[#151814]
                    "
                                    >
                                        {quote.products}
                                    </p>
                                </div>

                                <div
                                    className="
                    rounded-[13px]
                    bg-[#F7F8F4]
                    p-3
                  "
                                >
                                    <p
                                        className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.08em]
                      text-[#747A72]
                    "
                                    >
                                        Quote Value
                                    </p>

                                    <p
                                        className="
                      mt-2
                      text-[13px]
                      font-bold
                      text-[#151814]
                    "
                                    >
                                        {quote.amount}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedQuote(quote)
                                }
                                className="
                  mt-4
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#151814]
                  text-[10px]
                  font-bold
                  text-white
                "
                            >
                                View Quotation Details

                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>

                        </article>
                    ))}
                </div>

                {/* =================================================
            EMPTY
        ================================================== */}

                {filteredQuotes.length === 0 && (
                    <div
                        className="
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
                    >
                        <span
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-[#F0F2EC]
              "
                        >
                            <FileText className="h-5 w-5" />
                        </span>

                        <h3
                            className="
                mt-4
                text-[16px]
                font-semibold
                text-[#151814]
              "
                        >
                            No quotations found
                        </h3>

                        <p
                            className="
                mt-2
                text-[11px]
                text-[#6D736B]
              "
                        >
                            Try changing the search term or quotation status.
                        </p>
                    </div>
                )}
            </section>

            {/* =====================================================
          DETAILS
      ====================================================== */}

            {selectedQuote && (
                <QuotationDetails
                    quote={selectedQuote}
                    onClose={() =>
                        setSelectedQuote(null)
                    }
                />
            )}
        </div>
    );
}

/* =========================================================
   QUOTATION DETAILS
========================================================= */

function QuotationDetails({
    quote,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[200]">

            {/* Overlay */}

            <button
                type="button"
                aria-label="Close quotation"
                onClick={onClose}
                className="
          absolute
          inset-0
          bg-black/45
          backdrop-blur-[2px]
        "
            />

            {/* Drawer */}

            <div
                className="
          absolute
          bottom-0
          right-0
          top-auto
          flex
          max-h-[92vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[26px]
          bg-[#EFEFE9]
          shadow-[-20px_0_70px_rgba(0,0,0,.18)]

          sm:bottom-auto
          sm:top-0
          sm:h-full
          sm:max-h-none
          sm:max-w-[620px]
          sm:rounded-none
        "
            >

                {/* =================================================
            HEADER
        ================================================== */}

                <div
                    className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-[#D8DAD3]
            bg-white
            p-5
            sm:p-6
          "
                >
                    <div>

                        <div
                            className="
                flex
                flex-wrap
                items-center
                gap-2
              "
                        >
                            <p
                                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#71776F]
                "
                            >
                                Quotation Details
                            </p>

                            <StatusBadge value={quote.status} />
                        </div>

                        <h2
                            className="
                mt-2
                text-[27px]
                font-semibold
                tracking-[-0.04em]
                text-[#151814]
              "
                        >
                            {quote.id}
                        </h2>

                        <p
                            className="
                mt-1
                text-[11px]
                font-medium
                text-[#686E66]
              "
                        >
                            Submitted {quote.date}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F0F2EC]
              text-[#151814]
              transition
              hover:bg-[#151814]
              hover:text-white
            "
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* =================================================
            CONTENT
        ================================================== */}

                <div
                    className="
            flex-1
            overflow-y-auto
            p-4
            sm:p-5
          "
                >

                    {/* CUSTOMER */}

                    <DetailSection title="Customer Information">

                        <div
                            className="
                rounded-[16px]
                bg-[#F7F8F4]
                p-4
              "
                        >
                            <div className="flex gap-3">

                                <span
                                    className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-[11px]
                    bg-[#151814]
                    text-white
                  "
                                >
                                    <Building2 className="h-4 w-4" />
                                </span>

                                <div>
                                    <p
                                        className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.08em]
                      text-[#747A72]
                    "
                                    >
                                        Company
                                    </p>

                                    <p
                                        className="
                      mt-1.5
                      text-[13px]
                      font-bold
                      leading-5
                      text-[#151814]
                    "
                                    >
                                        {quote.company}
                                    </p>

                                    <p
                                        className="
                      mt-1
                      text-[11px]
                      font-medium
                      text-[#60665E]
                    "
                                    >
                                        {quote.contactName}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Larger Contact Details */}

                        <div
                            className="
                mt-3
                grid
                gap-3
                sm:grid-cols-2
              "
                        >

                            <a
                                href={`tel:${quote.phone}`}
                                className="
                  rounded-[16px]
                  border
                  border-[#DDE0D8]
                  bg-white
                  p-4
                  transition
                  hover:border-[#AEB4AA]
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-2
                    text-[#626860]
                  "
                                >
                                    <Phone className="h-4 w-4" />

                                    <span
                                        className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.08em]
                    "
                                    >
                                        Phone
                                    </span>
                                </div>

                                <p
                                    className="
                    mt-3
                    text-[13px]
                    font-bold
                    text-[#151814]
                  "
                                >
                                    {quote.phone}
                                </p>
                            </a>

                            <a
                                href={`mailto:${quote.email}`}
                                className="
                  rounded-[16px]
                  border
                  border-[#DDE0D8]
                  bg-white
                  p-4
                  transition
                  hover:border-[#AEB4AA]
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-2
                    text-[#626860]
                  "
                                >
                                    <Mail className="h-4 w-4" />

                                    <span
                                        className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.08em]
                    "
                                    >
                                        Email
                                    </span>
                                </div>

                                <p
                                    className="
                    mt-3
                    break-all
                    text-[12px]
                    font-bold
                    leading-5
                    text-[#151814]
                  "
                                >
                                    {quote.email}
                                </p>
                            </a>

                        </div>

                    </DetailSection>

                    {/* QUOTE INFORMATION */}

                    <DetailSection title="Quotation Information">

                        <div
                            className="
                grid
                gap-3
                grid-cols-2
              "
                        >
                            <SmallDetail
                                label="Category"
                                value={quote.category}
                            />

                            <SmallDetail
                                label="Brand"
                                value={quote.brand}
                            />

                            <SmallDetail
                                label="Quantity"
                                value={quote.quantity}
                            />

                            <SmallDetail
                                label="Quote Value"
                                value={quote.amount}
                                highlight
                            />
                        </div>

                    </DetailSection>

                    {/* PRODUCTS */}

                    <DetailSection title="Requested Products">

                        <div className="space-y-2">

                            {quote.productList.map(
                                (product, index) => (
                                    <div
                                        key={`${quote.id}-${product}`}
                                        className="
                      flex
                      items-center
                      gap-3
                      rounded-[14px]
                      border
                      border-[#E0E2DB]
                      bg-[#F8F8F4]
                      p-3
                    "
                                    >
                                        <span
                                            className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-[10px]
                        bg-[#151814]
                        text-[10px]
                        font-bold
                        text-white
                      "
                                        >
                                            {index + 1}
                                        </span>

                                        <p
                                            className="
                        text-[11px]
                        font-semibold
                        text-[#151814]
                      "
                                        >
                                            {product}
                                        </p>
                                    </div>
                                )
                            )}

                        </div>
                    </DetailSection>

                    {/* DELIVERY */}

                    <DetailSection title="Delivery Information">

                        <div
                            className="
                flex
                items-center
                gap-3
                rounded-[15px]
                bg-[#F7F8F4]
                p-4
              "
                        >
                            <span
                                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[11px]
                  bg-white
                "
                            >
                                <MapPin className="h-4 w-4" />
                            </span>

                            <div>
                                <p
                                    className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-[#747A72]
                  "
                                >
                                    Location
                                </p>

                                <p
                                    className="
                    mt-1.5
                    text-[12px]
                    font-bold
                    text-[#151814]
                  "
                                >
                                    {quote.deliveryLocation}
                                </p>
                            </div>
                        </div>

                    </DetailSection>

                    {/* NOTES */}

                    <DetailSection title="Customer Notes">

                        <p
                            className="
                text-[11px]
                font-medium
                leading-6
                text-[#4E544C]
              "
                        >
                            {quote.description}
                        </p>

                    </DetailSection>

                </div>

                {/* =================================================
            FOOTER
        ================================================== */}

                <div
                    className="
            shrink-0
            border-t
            border-[#D8DAD3]
            bg-white
            p-4
            sm:p-5
          "
                >
                    <div
                        className="
              flex
              flex-col
              gap-2
              sm:flex-row
            "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                h-11
                flex-1
                rounded-full
                border
                border-[#D6D9D1]
                bg-[#F7F8F4]
                text-[10px]
                font-bold
                text-[#454B43]
              "
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            className="
                flex
                h-11
                flex-[1.4]
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#151814]
                text-[10px]
                font-bold
                text-white
              "
                        >
                            Update Quotation

                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}

/* =========================================================
   SECTION
========================================================= */

function DetailSection({
    title,
    children,
}) {
    return (
        <section
            className="
        mb-4
        rounded-[20px]
        border
        border-[#D7DAD2]
        bg-white
        p-4
        sm:p-5
      "
        >
            <h3
                className="
          mb-4
          text-[10px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-[#626860]
        "
            >
                {title}
            </h3>

            {children}
        </section>
    );
}

/* =========================================================
   SMALL DETAIL
========================================================= */

function SmallDetail({
    label,
    value,
    highlight = false,
}) {
    return (
        <div
            className={`
        rounded-[14px]
        p-3.5

        ${highlight
                    ? "bg-[#151814] text-white"
                    : "bg-[#F5F6F1] text-[#151814]"
                }
      `}
        >
            <p
                className={`
          text-[8px]
          font-bold
          uppercase
          tracking-[0.08em]

          ${highlight
                        ? "text-white/55"
                        : "text-[#747A72]"
                    }
        `}
            >
                {label}
            </p>

            <p
                className="
          mt-2
          text-[11px]
          font-bold
          leading-5
        "
            >
                {value}
            </p>
        </div>
    );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({ value }) {
    const styles = {
        New:
            "bg-[#E9F2FF] text-[#235CA8]",
        Reviewing:
            "bg-[#FFF4D9] text-[#93620E]",
        Quoted:
            "bg-[#F1EAFE] text-[#6741A5]",
        Approved:
            "bg-[#E8F7E9] text-[#31783A]",
        Completed:
            "bg-[#ECEEEC] text-[#515751]",
        Rejected:
            "bg-[#FDE9E9] text-[#A63A3A]",
    };

    return (
        <span
            className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1.5
        text-[9px]
        font-bold

        ${styles[value] ||
                "bg-[#ECEEEC] text-[#515751]"
                }
      `}
        >
            <span
                className="
          h-1.5
          w-1.5
          rounded-full
          bg-current
        "
            />

            {value}
        </span>
    );
}