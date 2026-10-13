"use client";



import { useState } from "react";



import {

    ArrowDown,

    ArrowUpRight,

    Building2,

    CheckCircle2,

    Mail,

    MapPin,

    MessageSquareText,

    Phone,

    Sparkles,

    User,

} from "lucide-react";



export default function ContactPage() {

    const [formData, setFormData] = useState({

        name: "",

        company: "",

        email: "",

        phone: "",

        requirement: "",

    });



    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);



    /* =========================================================

       HANDLE INPUT

    ========================================================= */



    const handleChange = (e) => {

        const { name, value } = e.target;



        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));



        setError("");

        setSuccess(false);

    };



    /* =========================================================

       FORM SUBMIT

    ========================================================= */



    const handleSubmit = (e) => {

        e.preventDefault();



        if (!formData.name.trim()) {

            setError("Please enter your name.");

            return;

        }



        if (!formData.email.trim()) {

            setError("Please enter your email address.");

            return;

        }



        if (!formData.requirement.trim()) {

            setError("Please enter your project requirement.");

            return;

        }



        const subject = encodeURIComponent(

            `Top Range Project Enquiry - ${formData.name}`

        );



        const body = encodeURIComponent(

            `Hello Top Range Building Materials,



I would like to submit a new enquiry.



Name: ${formData.name}

Company: ${formData.company || "Not provided"}

Email: ${formData.email}

Phone: ${formData.phone || "Not provided"}



Project / Product Requirement:

${formData.requirement}



Thank you.`

        );



        setSuccess(true);



        window.location.href = `mailto:easypurchaseadmin@gmail.com?subject=${subject}&body=${body}`;

    };



    /* =========================================================

       INPUT STYLE

    ========================================================= */



    const inputClass = `

    w-full

    border-0

    border-b

    border-black/10

    bg-transparent

    px-0

    pb-4

    pt-2

    text-[15px]

    text-[#101411]

    outline-none

    transition-all

    duration-300

    placeholder:text-black/25

    focus:border-[#101411]

  `;



    return (

        <main className="overflow-hidden bg-[#F4F5EF] text-[#101411]">



            {/* =========================================================

          HERO

      ========================================================= */}



            <section className="relative min-h-[88vh] overflow-hidden bg-[#07100D]">



                {/* Background */}



                <div

                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"

                    style={{

                        backgroundImage: "url('/Assets/Contact.jpg')",

                    }}

                />



                {/* Dark Overlay */}



                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,15,13,0.98)_0%,rgba(7,15,13,0.9)_42%,rgba(7,15,13,0.58)_72%,rgba(7,15,13,0.28)_100%)]" />



                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,15,13,0.98)_0%,transparent_65%)]" />



                {/* Glow */}



                <div className="absolute -right-[180px] top-[80px] h-[550px] w-[550px] rounded-full bg-[#D8FF65]/10 blur-[150px]" />



                <div className="absolute -left-[180px] bottom-0 h-[420px] w-[420px] rounded-full bg-[#C6772C]/10 blur-[140px]" />



                {/* =====================================================

            HERO CONTENT

        ====================================================== */}



                <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1450px] items-end px-5 pb-10 pt-36 md:px-10 md:pb-14 lg:px-14 lg:pb-16">



                    <div className="grid w-full gap-12 lg:grid-cols-[1fr_390px] lg:items-end">



                        {/* =================================================

                LEFT CONTENT

            ================================================== */}



                        <div>



                            <div className="flex items-center gap-3">



                                <span className="h-2 w-2 rounded-full bg-[#D8FF65] shadow-[0_0_18px_#D8FF65]" />



                                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">

                                    Contact Top Range

                                </span>



                            </div>



                            <h1 className="mt-5 max-w-[1050px] text-[50px] font-medium leading-[0.92] tracking-[-0.06em] text-white sm:text-[64px] md:text-[80px] lg:text-[94px] xl:text-[108px]">



                                Let&apos;s build



                                <br />



                                <span className="text-[#D8FF65]">

                                    better together.

                                </span>



                            </h1>



                            <div className="mt-8 flex flex-col gap-6 border-t border-white/15 pt-6 sm:flex-row sm:items-end sm:justify-between">



                                <p className="max-w-2xl text-[15px] leading-7 text-white/55 md:text-[17px]">



                                    Share your material requirement, product enquiry or project

                                    scope. Our team will help you source the right building

                                    materials for your project.



                                </p>



                                <a

                                    href="#contact-form"

                                    aria-label="Go to contact form"

                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411] transition-all duration-300 hover:scale-110 hover:bg-white"

                                >

                                    <ArrowDown className="h-4 w-4" />

                                </a>



                            </div>

                        </div>



                        {/* =================================================

                HERO GLASS CARD

            ================================================== */}



                        <div className="relative hidden overflow-hidden rounded-[30px] border border-white/15 bg-white/[0.06] p-7 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-[28px] lg:block">



                            <div className="absolute -right-16 -top-20 h-[200px] w-[200px] rounded-full bg-[#D8FF65]/15 blur-[80px]" />



                            <div className="relative z-10">



                                <div className="flex items-center justify-between">



                                    <div className="flex items-center gap-2">



                                        <Sparkles className="h-4 w-4 text-[#D8FF65]" />



                                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">

                                            Project Support

                                        </span>



                                    </div>



                                    <span className="h-2 w-2 rounded-full bg-[#D8FF65]" />



                                </div>



                                <h3 className="mt-12 text-[28px] font-medium leading-[1.1] tracking-[-0.035em]">

                                    Need materials for an upcoming project?

                                </h3>



                                <p className="mt-4 text-sm leading-7 text-white/50">



                                    Send us your product list, required quantities or project

                                    specifications and our team will assist with sourcing and

                                    quotation.



                                </p>



                                <a

                                    href="#contact-form"

                                    className="group mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-white/70"

                                >

                                    Start an enquiry



                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8FF65] text-black transition-transform duration-300 group-hover:rotate-45">

                                        <ArrowUpRight className="h-4 w-4" />

                                    </span>



                                </a>



                            </div>

                        </div>



                    </div>

                </div>

            </section>



            {/* =========================================================

          CONTACT FORM SECTION

      ========================================================= */}



            <section

                id="contact-form"

                className="scroll-mt-24 py-14 md:py-20 lg:py-24"

            >



                <div className="mx-auto max-w-[1450px] px-5 md:px-10 lg:px-14">



                    <div className="grid overflow-hidden rounded-[36px] bg-[#101411] shadow-[0_30px_100px_rgba(0,0,0,0.12)] lg:grid-cols-[0.82fr_1.18fr]">



                        {/* =================================================

                LEFT DETAILS

            ================================================== */}



                        <div className="relative overflow-hidden p-7 text-white sm:p-10 lg:p-12">



                            <div className="absolute -bottom-24 -left-28 h-[380px] w-[380px] rounded-full bg-[#D8FF65]/10 blur-[120px]" />



                            <div className="absolute -right-32 top-20 h-[260px] w-[260px] rounded-full bg-[#C6772C]/10 blur-[100px]" />



                            <div className="relative z-10">



                                <div className="flex items-center gap-3">



                                    <span className="h-2 w-2 rounded-full bg-[#D8FF65]" />



                                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">

                                        Start a Conversation

                                    </span>



                                </div>



                                <h2 className="mt-6 text-[42px] font-medium leading-[0.96] tracking-[-0.05em] md:text-[50px] lg:text-[58px]">



                                    Tell us what



                                    <br />



                                    <span className="text-[#D8FF65]">

                                        you need.

                                    </span>



                                </h2>



                                <p className="mt-6 max-w-md text-sm leading-7 text-white/45">



                                    From a single product enquiry to a complete project material

                                    requirement, share the details with us and our team will get

                                    in touch.



                                </p>



                                {/* =================================================

                    CONTACT INFORMATION

                ================================================== */}



                                <div className="mt-12 divide-y divide-white/10 border-y border-white/10">



                                    {/* Location */}



                                    <div className="flex items-center gap-4 py-5">



                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">

                                            <MapPin className="h-4 w-4 text-[#D8FF65]" />

                                        </div>



                                        <div>



                                            <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">

                                                Service Area

                                            </p>



                                            <p className="mt-1 text-sm text-white/70">

                                                United Arab Emirates

                                            </p>



                                        </div>

                                    </div>



                                    {/* Email */}



                                    <div className="flex items-center gap-4 py-5">



                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">

                                            <Mail className="h-4 w-4 text-[#D8FF65]" />

                                        </div>



                                        <div>



                                            <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">

                                                Email

                                            </p>



                                            <a

                                                href="mailto:easypurchaseadmin@gmail.com"

                                                className="mt-1 block text-sm text-white/70 transition hover:text-[#D8FF65]"

                                            >

                                                easypurchaseadmin@gmail.com

                                            </a>



                                        </div>

                                    </div>



                                    {/* Phone */}



                                    <div className="flex items-center gap-4 py-5">



                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">

                                            <Phone className="h-4 w-4 text-[#D8FF65]" />

                                        </div>



                                        <div>



                                            <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">

                                                Phone

                                            </p>



                                            <a

                                                href="tel:+971504682745"

                                                className="mt-1 block text-sm text-white/70 transition hover:text-[#D8FF65]"

                                            >

                                                +971 50 468 2745

                                            </a>



                                        </div>

                                    </div>



                                </div>

                            </div>

                        </div>



                        {/* =================================================

                FORM

            ================================================== */}



                        <div className="rounded-t-[32px] bg-white p-6 sm:p-9 lg:rounded-l-[36px] lg:rounded-tr-none lg:p-12">



                            {/* Heading */}



                            <div className="mb-10">



                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">

                                    Project Enquiry

                                </p>



                                <h3 className="mt-3 text-[32px] font-medium tracking-[-0.04em] md:text-[40px]">

                                    Send your requirement

                                </h3>



                                <p className="mt-3 max-w-xl text-sm leading-6 text-black/40">



                                    Complete the form below and share your material or project

                                    requirement with our team.



                                </p>



                            </div>



                            {/* =================================================

                  FORM

              ================================================== */}



                            <form

                                onSubmit={handleSubmit}

                                className="space-y-9"

                            >



                                <div className="grid gap-8 md:grid-cols-2">



                                    {/* Name */}



                                    <div>



                                        <label

                                            htmlFor="name"

                                            className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40"

                                        >

                                            <User className="h-3.5 w-3.5" />

                                            Your Name

                                        </label>



                                        <input

                                            id="name"

                                            type="text"

                                            name="name"

                                            value={formData.name}

                                            onChange={handleChange}

                                            placeholder="Enter your name"

                                            className={inputClass}

                                        />



                                    </div>



                                    {/* Company */}



                                    <div>



                                        <label

                                            htmlFor="company"

                                            className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40"

                                        >

                                            <Building2 className="h-3.5 w-3.5" />

                                            Company

                                        </label>



                                        <input

                                            id="company"

                                            type="text"

                                            name="company"

                                            value={formData.company}

                                            onChange={handleChange}

                                            placeholder="Company name"

                                            className={inputClass}

                                        />



                                    </div>



                                    {/* Email */}



                                    <div>



                                        <label

                                            htmlFor="email"

                                            className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40"

                                        >

                                            <Mail className="h-3.5 w-3.5" />

                                            Email Address

                                        </label>



                                        <input

                                            id="email"

                                            type="email"

                                            name="email"

                                            value={formData.email}

                                            onChange={handleChange}

                                            placeholder="name@company.com"

                                            className={inputClass}

                                        />



                                    </div>



                                    {/* Phone */}



                                    <div>



                                        <label

                                            htmlFor="phone"

                                            className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40"

                                        >

                                            <Phone className="h-3.5 w-3.5" />

                                            Phone Number

                                        </label>



                                        <input

                                            id="phone"

                                            type="tel"

                                            name="phone"

                                            value={formData.phone}

                                            onChange={handleChange}

                                            placeholder="+971"

                                            className={inputClass}

                                        />



                                    </div>



                                </div>



                                {/* Requirement */}



                                <div>



                                    <label

                                        htmlFor="requirement"

                                        className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40"

                                    >

                                        <MessageSquareText className="h-3.5 w-3.5" />

                                        Project Requirement

                                    </label>



                                    <textarea

                                        id="requirement"

                                        name="requirement"

                                        rows={5}

                                        value={formData.requirement}

                                        onChange={handleChange}

                                        placeholder="Tell us about the products, quantities or project requirements..."

                                        className={`${inputClass} resize-none`}

                                    />



                                </div>



                                {/* =================================================

                    ERROR

                ================================================== */}



                                {error && (

                                    <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">

                                        {error}

                                    </div>

                                )}



                                {/* =================================================

                    SUCCESS

                ================================================== */}



                                {success && (

                                    <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-700">



                                        <CheckCircle2 className="h-5 w-5" />



                                        Your email application is opening.



                                    </div>

                                )}



                                {/* =================================================

                    SUBMIT

                ================================================== */}



                                <div className="flex flex-col gap-5 border-t border-black/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">



                                    <p className="max-w-[350px] text-xs leading-5 text-black/35">



                                        Provide as much information as possible so our team can

                                        prepare the right response.



                                    </p>



                                    <button

                                        type="submit"

                                        className="group inline-flex items-center justify-between gap-10 rounded-full bg-[#101411] py-2 pl-7 pr-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#222923] active:scale-[0.98]"

                                    >

                                        Send Enquiry



                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8FF65] text-black transition-transform duration-300 group-hover:rotate-45">

                                            <ArrowUpRight className="h-4 w-4" />

                                        </span>



                                    </button>



                                </div>



                            </form>



                        </div>

                    </div>

                </div>

            </section>



            {/* =========================================================

          MAP

      ========================================================= */}



            <section className="pb-16 md:pb-20 lg:pb-24">



                <div className="mx-auto max-w-[1450px] px-5 md:px-10 lg:px-14">



                    <div className="relative min-h-[520px] overflow-hidden rounded-[34px] bg-[#101411]">



                        {/* Google Map */}



                        <iframe

                            title="Top Range Building Materials Location"

                            src="https://www.google.com/maps?q=United%20Arab%20Emirates&output=embed"

                            loading="lazy"

                            referrerPolicy="no-referrer-when-downgrade"

                            className="absolute inset-0 h-full w-full border-0"

                        />



                        {/* Bottom Overlay */}



                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-t from-[#07100D]/95 via-[#07100D]/45 to-transparent" />



                        {/* =================================================

                LOCATION CARD

            ================================================== */}



                        <div className="absolute bottom-5 left-5 right-5 rounded-[26px] border border-white/15 bg-[#07100D]/85 p-6 text-white shadow-2xl backdrop-blur-2xl sm:bottom-7 sm:left-7 sm:right-auto sm:w-[420px]">



                            <div className="flex items-start justify-between gap-4">



                                <div>



                                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">

                                        Find Us

                                    </p>



                                    <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">

                                        Top Range Building Materials

                                    </h3>



                                    <p className="mt-2 text-sm text-white/45">

                                        United Arab Emirates

                                    </p>



                                </div>



                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8FF65] text-black">

                                    <MapPin className="h-4 w-4" />

                                </span>



                            </div>



                            <a

                                href="https://maps.google.com"

                                target="_blank"

                                rel="noopener noreferrer"

                                className="group mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-white/65 transition-colors hover:text-white"

                            >

                                Open in Google Maps



                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />



                            </a>



                        </div>

                    </div>

                </div>

            </section>



            {/* =========================================================

          WHATSAPP FLOATING BUTTON

      ========================================================= */}



            <a

                href="https://wa.me/971504682745?text=Hi%20Top%20Range%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."

                target="_blank"

                rel="noopener noreferrer"

                aria-label="Contact Top Range on WhatsApp"

                className="

          group

          fixed

          bottom-5

          right-5

          z-[9999]

          flex

          h-14

          w-14

          items-center

          justify-center

          rounded-full

          bg-[#25D366]

          text-white

          shadow-[0_10px_30px_rgba(0,0,0,0.25)]

          transition-all

          duration-300

          hover:-translate-y-1

          hover:scale-105

          hover:shadow-[0_14px_35px_rgba(37,211,102,0.4)]

          sm:bottom-6

          sm:right-6

        "

            >





                {/* WhatsApp Icon */}



                <svg

                    xmlns="http://www.w3.org/2000/svg"

                    viewBox="0 0 32 32"

                    className="h-7 w-7 fill-current"

                    aria-hidden="true"

                >

                    <path d="M16.04 3C9.4 3 4 8.39 4 15.03c0 2.12.55 4.19 1.6 6.01L3.9 27.24l6.35-1.66a12 12 0 0 0 5.79 1.47h.01c6.63 0 12.03-5.4 12.03-12.03C28.08 8.39 22.68 3 16.04 3Zm0 21.99h-.01a9.96 9.96 0 0 1-5.08-1.39l-.36-.22-3.77.99 1.01-3.67-.24-.38a9.94 9.94 0 0 1-1.53-5.29c0-5.5 4.48-9.97 9.98-9.97S26 9.53 26 15.03c0 5.49-4.47 9.96-9.96 9.96Zm5.46-7.47c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />

                </svg>

            </a>



        </main>

    );

}