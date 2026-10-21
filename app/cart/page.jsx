"use client";



import Link from "next/link";

import { useEffect, useMemo, useState } from "react";



import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";



import {

  ArrowLeft,

  ArrowRight,

  ArrowUpRight,

  Check,

  ChevronDown,

  ChevronRight,

  Minus,

  PackageCheck,

  Plus,

  ShoppingBag,

  Trash2,

  X,

} from "lucide-react";



const CART_STORAGE_KEY = "toprange_cart";
const CUSTOMERS_API = "/api/customers";
const QUOTATIONS_API = "/api/quotations";



export default function CartPage() {

  const [cart, setCart] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const [quoteOpen, setQuoteOpen] = useState(false);



  /* =========================================================

       LOAD CART

    ========================================================= */



  useEffect(() => {

    let cancelled = false;



    async function loadAndValidateCart() {

      let savedItems = [];

      try {

        const savedCart = localStorage.getItem(CART_STORAGE_KEY);

        const parsedCart = savedCart ? JSON.parse(savedCart) : [];

        savedItems = Array.isArray(parsedCart) ? parsedCart : [];

      } catch (error) {

        console.error("Unable to load cart:", error);

      }



      if (!savedItems.length) {

        if (!cancelled) {

          setCart([]);

          setLoaded(true);

        }

        return;

      }



      // Refresh cart item details from the live catalogue so old browser

      // data cannot override the current price, status, or stock quantity.

      try {

        const response = await fetch("/api/store/products", {

          method: "GET",

          cache: "no-store",

        });

        if (!response.ok) throw new Error("Could not validate cart products.");

        const payload = await response.json();

        const liveProducts = Array.isArray(payload.products)

          ? payload.products

          : [];

        const byId = new Map(

          liveProducts.map((product) => [

            String(product.id ?? product._id),

            product,

          ]),

        );

        const validated = savedItems.flatMap((item) => {

          const live = byId.get(String(item.id ?? item._id));

          if (!live || Number(live.stock || 0) <= 0) return [];

          return [

            {

              ...item,

              ...live,

              id: String(live.id ?? live._id),

              price: Number(live.price || 0),

              unit: String(live.unit || item.unit || "").trim(),

              stock: Number(live.stock || 0),

              quantity: Math.min(

                Math.max(1, Number(item.quantity || 1)),

                Number(live.stock || 0),

              ),

            },

          ];

        });

        if (!cancelled) {

          setCart(validated);

          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validated));

          window.dispatchEvent(new Event("toprange-cart-updated"));

        }

      } catch (error) {

        // Keep the saved cart usable during a temporary network outage;

        // quantity controls still use the last known stock value.

        console.error("Unable to validate cart against the catalogue:", error);

        if (!cancelled) setCart(savedItems);

      } finally {

        if (!cancelled) setLoaded(true);

      }

    }



    loadAndValidateCart();

    return () => {

      cancelled = true;

    };

  }, []);



  /* =========================================================

       SAVE CART

    ========================================================= */



  const saveCart = (updatedCart) => {

    setCart(updatedCart);



    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));



    /*

     * Updates navbar cart count immediately.

     */

    window.dispatchEvent(new Event("toprange-cart-updated"));

  };



  /* =========================================================

       INCREASE QUANTITY

    ========================================================= */



  const increaseQuantity = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id !== id) {

        return item;

      }



      return {

        ...item,

        quantity: Math.min(

          Number(item.stock || 0),

          Number(item.quantity || 1) + 1,

        ),

      };

    });



    saveCart(updatedCart);

  };



  /* =========================================================

       DECREASE QUANTITY

    ========================================================= */



  const decreaseQuantity = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id !== id) {

        return item;

      }



      return {

        ...item,

        quantity: Math.max(1, Number(item.quantity || 1) - 1),

      };

    });



    saveCart(updatedCart);

  };



  /* =========================================================

       REMOVE PRODUCT

    ========================================================= */



  const removeProduct = (id) => {

    const updatedCart = cart.filter((item) => item.id !== id);



    saveCart(updatedCart);

  };



  /* =========================================================

       CLEAR CART

    ========================================================= */



  const clearCart = () => {

    saveCart([]);

  };



  /* =========================================================

       TOTAL COUNT

    ========================================================= */



  const cartCount = useMemo(() => {

    return cart.reduce((total, item) => total + Number(item.quantity || 1), 0);

  }, [cart]);



  /* =========================================================

       TOTAL PRICE

    ========================================================= */



  const cartTotal = useMemo(() => {

    return cart.reduce((total, item) => {

      const price = Number(item.price || 0);

      const quantity = Number(item.quantity || 1);



      return total + price * quantity;

    }, 0);

  }, [cart]);



  /* =========================================================

       LOADING

    ========================================================= */



  if (!loaded) {

    return (

      <main

        className="

          min-h-screen

          bg-[#F4F5EF]

          pt-32

        "

      >

        <div

          className="

            mx-auto

            max-w-[1450px]

            px-5

            md:px-10

            lg:px-14

          "

        >

          <div className="animate-pulse">

            <div className="h-5 w-28 rounded-full bg-black/10" />



            <div className="mt-5 h-16 max-w-xl rounded-2xl bg-black/10" />



            <div

              className="

                mt-12

                grid

                gap-5

                xl:grid-cols-[minmax(0,1fr)_390px]

              "

            >

              <div className="h-[400px] rounded-[28px] bg-black/10" />



              <div className="h-[400px] rounded-[28px] bg-black/10" />

            </div>

          </div>

        </div>

      </main>

    );

  }



  if (quoteOpen) {
    return (
      <QuoteModal
        cart={cart}
        onClose={() => setQuoteOpen(false)}
      />
    );
  }

  return (

    <>

      <main

        className="

        min-h-screen

        overflow-x-hidden

        bg-[#F4F5EF]

        pb-20

        pt-28

        md:pt-32

      "

      >

        {/* =====================================================

          HERO / PAGE HEADER

      ====================================================== */}



        <section>

          <div

            className="

            mx-auto

            max-w-[1450px]

            px-5

            md:px-10

            lg:px-14

          "

          >

            {/* Breadcrumb */}



            <div

              className="

              flex

              items-center

              gap-2

              text-[11px]

              font-semibold

              uppercase

              tracking-[0.16em]

              text-black/35

            "

            >

              <Link

                href="/"

                className="

                transition

                hover:text-black

              "

              >

                Home

              </Link>



              <ChevronRight className="h-3 w-3" />



              <span className="text-black/65">Cart</span>

            </div>



            {/* Header */}



            <div

              className="

              mt-7

              flex

              flex-col

              gap-7

              border-b

              border-black/10

              pb-10

              lg:flex-row

              lg:items-end

              lg:justify-between

            "

            >

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

                  "

                  >

                    <ShoppingBag className="h-4 w-4" />

                  </span>



                  <span

                    className="

                    text-[11px]

                    font-semibold

                    uppercase

                    tracking-[0.18em]

                    text-black/40

                  "

                  >

                    Product Enquiry

                  </span>

                </div>



                <h1

                  className="

                  mt-5

                  font-display

                  text-[40px]

                  font-medium

                  leading-[0.95]

                  tracking-[-0.055em]

                  text-[#101411]

                  min-[380px]:text-[44px]

                  sm:text-[58px]

                  md:text-[70px]

                  lg:text-[78px]

                "

                >

                  Your product

                  <br />

                  <span className="text-black/30">selection.</span>

                </h1>

              </div>



              <div className="max-w-md">

                <p

                  className="

                  text-sm

                  leading-7

                  text-black/45

                "

                >

                  Review your selected products, adjust quantities and send your

                  requirements to our team for a quotation.

                </p>



                <div

                  className="

                  mt-4

                  flex

                  items-center

                  gap-2

                  text-sm

                  font-medium

                  text-black/60

                "

                >

                  <span className="h-2 w-2 rounded-full bg-[#94BE26]" />

                  {cartCount} {cartCount === 1 ? "product" : "products"}{" "}

                  selected

                </div>

              </div>

            </div>

          </div>

        </section>



        {/* =====================================================

          EMPTY CART

      ====================================================== */}



        {cart.length === 0 ? (

          <section

            className="

            mx-auto

            max-w-[1450px]

            px-5

            py-16

            md:px-10

            md:py-20

            lg:px-14

          "

          >

            <div

              className="

              relative

              overflow-hidden

              rounded-[32px]

              bg-[#101411]

              px-6

              py-16

              text-center

              text-white

              md:px-12

              md:py-24

            "

            >

              {/* Glow */}



              <div

                className="

                pointer-events-none

                absolute

                -right-28

                -top-32

                h-[420px]

                w-[420px]

                rounded-full

                bg-[#D8FF65]/10

                blur-[120px]

              "

              />



              <div

                className="

                pointer-events-none

                absolute

                -bottom-32

                -left-24

                h-[360px]

                w-[360px]

                rounded-full

                bg-[#C47A36]/10

                blur-[110px]

              "

              />



              <div className="relative z-10">

                <span

                  className="

                  mx-auto

                  flex

                  h-20

                  w-20

                  items-center

                  justify-center

                  rounded-full

                  border

                  border-white/10

                  bg-white/[0.06]

                "

                >

                  <ShoppingBag className="h-7 w-7 text-[#D8FF65]" />

                </span>



                <p

                  className="

                  mt-7

                  text-[10px]

                  font-semibold

                  uppercase

                  tracking-[0.2em]

                  text-white/35

                "

                >

                  Your Selection

                </p>



                <h2

                  className="

                  mx-auto

                  mt-4

                  max-w-2xl

                  text-[36px]

                  font-medium

                  leading-[1]

                  tracking-[-0.04em]

                  md:text-[52px]

                "

                >

                  Your cart is

                  <span className="text-[#D8FF65]"> empty.</span>

                </h2>



                <p

                  className="

                  mx-auto

                  mt-5

                  max-w-md

                  text-sm

                  leading-7

                  text-white/40

                "

                >

                  Browse our product catalogue and add the materials you need

                  for your project.

                </p>



                <Link

                  href="/"

                  className="

                  group

                  mt-8

                  inline-flex

                  items-center

                  gap-5

                  rounded-full

                  bg-[#D8FF65]

                  py-2

                  pl-6

                  pr-2

                  text-sm

                  font-semibold

                  text-[#101411]

                  transition

                  duration-300

                  hover:bg-white

                "

                >

                  Explore Products

                  <span

                    className="

                    flex

                    h-11

                    w-11

                    items-center

                    justify-center

                    rounded-full

                    bg-[#101411]

                    text-white

                  "

                  >

                    <ArrowUpRight

                      className="

                      h-4

                      w-4

                      transition-transform

                      duration-300

                      group-hover:rotate-45

                    "

                    />

                  </span>

                </Link>

              </div>

            </div>

          </section>

        ) : (

          /* =====================================================

                       CART CONTENT

                    ====================================================== */



          <section className="py-10 md:py-12">

            <div

              className="

              mx-auto

              grid

              w-full

              max-w-[1450px]

              gap-6

              px-4

              sm:px-5

              md:px-8

              lg:px-10

              xl:grid-cols-[minmax(0,1fr)_390px]

              xl:items-start

              xl:px-14

            "

            >

              {/* =================================================

                LEFT - PRODUCTS

            ================================================== */}



              <div>

                {/* Top actions */}



                <div

                  className="

                  mb-4

                  flex

                  items-center

                  justify-between

                  gap-4

                "

                >

                  <p

                    className="

                    text-sm

                    font-semibold

                    text-[#101411]

                  "

                  >

                    Selected Products

                  </p>



                  <button

                    type="button"

                    onClick={clearCart}

                    className="

                    group

                    flex

                    items-center

                    gap-2

                    text-xs

                    font-semibold

                    text-black/35

                    transition

                    hover:text-red-500

                  "

                  >

                    <Trash2 className="h-3.5 w-3.5" />

                    Clear Cart

                  </button>

                </div>



                {/* Products */}



                <div className="space-y-3">

                  {cart.map((item) => (

                    <CartProduct

                      key={item.id}

                      item={item}

                      increaseQuantity={increaseQuantity}

                      decreaseQuantity={decreaseQuantity}

                      removeProduct={removeProduct}

                    />

                  ))}

                </div>



                {/* Continue */}



                <Link

                  href="/"

                  className="

                  group

                  mt-6

                  inline-flex

                  items-center

                  gap-3

                  text-sm

                  font-semibold

                  text-[#101411]

                "

                >

                  <span

                    className="

                    flex

                    h-10

                    w-10

                    items-center

                    justify-center

                    rounded-full

                    border

                    border-black/10

                    bg-white

                    transition

                    group-hover:bg-[#101411]

                    group-hover:text-white

                  "

                  >

                    <ArrowLeft className="h-4 w-4" />

                  </span>

                  Continue Shopping

                </Link>

              </div>



              {/* =================================================

                RIGHT - SUMMARY

            ================================================== */}



              <aside

                className="

                w-full

                min-w-0

                xl:sticky

                xl:top-28

              "

              >

                <div

                  className="

                  relative

                  isolate

                  overflow-hidden

                  rounded-[30px]

                  border

                  border-white/10

                  bg-[#101411]

                  p-6

                  text-white

                  shadow-[0_30px_90px_rgba(0,0,0,.14)]

                  md:p-7

                "

                >

                  {/* Glows */}



                  <div

                    className="

                    pointer-events-none

                    absolute

                    -right-20

                    -top-20

                    h-56

                    w-56

                    rounded-full

                    bg-[#D8FF65]/10

                    blur-[80px]

                  "

                  />



                  <div

                    className="

                    pointer-events-none

                    absolute

                    -bottom-24

                    -left-20

                    h-52

                    w-52

                    rounded-full

                    bg-[#C47A36]/10

                    blur-[80px]

                  "

                  />



                  <div className="relative z-10">

                    {/* Header */}



                    <div className="flex items-start justify-between">

                      <div>

                        <p

                          className="

                          text-[10px]

                          font-semibold

                          uppercase

                          tracking-[0.19em]

                          text-white/35

                        "

                        >

                          Enquiry Summary

                        </p>



                        <h2

                          className="

                          mt-2

                          text-[26px]

                          font-medium

                          tracking-[-0.03em]

                        "

                        >

                          Your selection

                        </h2>

                      </div>



                      <span

                        className="

                        flex

                        h-11

                        w-11

                        items-center

                        justify-center

                        rounded-full

                        bg-[#D8FF65]

                        text-[#101411]

                      "

                      >

                        <ShoppingBag className="h-4 w-4" />

                      </span>

                    </div>



                    {/* Summary rows */}



                    <div

                      className="

                      mt-8

                      space-y-4

                      border-y

                      border-white/10

                      py-6

                    "

                    >

                      <div

                        className="

                        flex

                        items-center

                        justify-between

                        gap-5

                      "

                      >

                        <span className="text-sm text-white/40">Products</span>



                        <span className="text-sm font-semibold">

                          {cart.length}

                        </span>

                      </div>



                      <div

                        className="

                        flex

                        items-center

                        justify-between

                        gap-5

                      "

                      >

                        <span className="text-sm text-white/40">

                          Total Quantity

                        </span>



                        <span className="text-sm font-semibold">

                          {cartCount}

                        </span>

                      </div>

                    </div>



                    {/* Estimated Total */}



                    <div className="py-6">

                      <p

                        className="

                        text-[10px]

                        font-semibold

                        uppercase

                        tracking-[0.16em]

                        text-white/30

                      "

                      >

                        Estimated Total

                      </p>



                      <div

                        className="

                        mt-2

                        flex

                        items-end

                        gap-2

                      "

                      >

                        <span

                          className="

                          pb-1

                          text-sm

                          font-semibold

                          text-[#D8FF65]

                        "

                        >

                          AED

                        </span>



                        <span

                          className="

                          text-[38px]

                          font-semibold

                          leading-none

                          tracking-[-0.045em]

                        "

                        >

                          {cartTotal.toLocaleString(undefined, {

                            minimumFractionDigits: 2,

                            maximumFractionDigits: 2,

                          })}

                        </span>

                      </div>



                      <p

                        className="

                        mt-3

                        text-[11px]

                        leading-5

                        text-white/30

                      "

                      >

                        Final pricing, availability and delivery charges can be

                        confirmed by our sales team.

                      </p>

                    </div>



                    {/* Quote CTA */}



                    <button

                      type="button"

                      onClick={() => setQuoteOpen(true)}

                      className="

                      group

                      flex

                      h-[58px]

                      w-full

                      items-center

                      justify-between

                      rounded-full

                      bg-[#D8FF65]

                      pl-6

                      pr-2

                      text-sm

                      font-semibold

                      text-[#101411]

                      transition

                      duration-300

                      hover:bg-white

                    "

                    >

                      Request Quotation

                      <span

                        className="

                        flex

                        h-11

                        w-11

                        items-center

                        justify-center

                        rounded-full

                        bg-[#101411]

                        text-white

                      "

                      >

                        <ArrowRight

                          className="

                          h-4

                          w-4

                          transition-transform

                          duration-300

                          group-hover:translate-x-1

                        "

                        />

                      </span>

                    </button>



                    {/* Benefits */}



                    <div

                      className="

                      mt-6

                      space-y-3

                      border-t

                      border-white/10

                      pt-6

                    "

                    >

                      <SummaryFeature>

                        Product availability confirmation

                      </SummaryFeature>



                      <SummaryFeature>

                        Competitive project pricing

                      </SummaryFeature>



                      <SummaryFeature>

                        Material sourcing assistance

                      </SummaryFeature>

                    </div>

                  </div>

                </div>



                {/* Support card */}



                <div

                  className="

                  mt-3

                  rounded-[24px]

                  border

                  border-black/[0.07]

                  bg-white

                  p-5

                "

                >

                  <div className="flex items-center gap-4">

                    <span

                      className="

                      flex

                      h-11

                      w-11

                      shrink-0

                      items-center

                      justify-center

                      rounded-full

                      bg-[#EEF2E5]

                    "

                    >

                      <PackageCheck className="h-5 w-5" />

                    </span>



                    <div>

                      <p

                        className="

                        text-sm

                        font-semibold

                        text-[#101411]

                      "

                      >

                        Need assistance?

                      </p>



                      <p

                        className="

                        mt-1

                        text-xs

                        leading-5

                        text-black/40

                      "

                      >

                        Our team can help identify the right materials for your

                        project.

                      </p>

                    </div>

                  </div>

                </div>

              </aside>

            </div>

          </section>

        )}

      </main>


    </>

  );

}



/* =========================================================
   QUOTE MODAL
========================================================= */

function QuoteModal({ cart = [], onClose }) {
  const totalQuantity = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0,
  );

  const selectedProductNames = cart.map((item) => item.name).join(", ");

  const selectedCategories = [
    ...new Set(cart.map((item) => item.category).filter(Boolean)),
  ];

  const selectedBrands = [
    ...new Set(cart.map((item) => item.brand).filter(Boolean)),
  ];

  const autoCategory =
    selectedCategories.length === 1
      ? selectedCategories[0]
      : selectedCategories.length > 1
        ? "Multiple Categories"
        : "";

  const autoBrand =
    selectedBrands.length === 1
      ? selectedBrands[0]
      : selectedBrands.length > 1
        ? "Multiple Brands"
        : "";

  const autoDescription =
    cart.length > 0
      ? cart
        .map(
          (item, index) => `${index + 1}. ${item.name}
SKU: ${item.sku}
Brand: ${item.brand}
Category: ${item.category}
Unit: ${item.unit || "Not specified"}
Quantity: ${item.quantity}
Unit Price: AED ${item.price}`,
        )
        .join("\n\n")
      : "";

  /* =====================================================
     COMPANY / CUSTOMER FLOW
  ===================================================== */

  const [stage, setStage] = useState("company");
  const [customerMode, setCustomerMode] = useState("lookup");

  const [companyCodeInput, setCompanyCodeInput] = useState("");
  const [companyProfile, setCompanyProfile] = useState(null);

  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState("");
  const [companyMessage, setCompanyMessage] = useState("");

  const [newCompany, setNewCompany] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
  });

  const [emailContacts, setEmailContacts] = useState([
    {
      id: "purchase-manager",
      role: "Purchase Manager",
      email: "",
    },
    {
      id: "accountant",
      role: "Accountant",
      email: "",
    },
  ]);

  const [form, setForm] = useState({
    companyCode: "",
    customerId: "",
    company: "",
    contactName: "",
    email: "",
    phone: "",
    products: selectedProductNames,
    category: autoCategory,
    brand: autoBrand,
    size: "",
    quantity: totalQuantity > 0 ? String(totalQuantity) : "",
    refNumber: "",
    deliveryLocation: "",
    description: autoDescription,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const update = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSelect = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizeEmailContacts = (value) => {
    if (!Array.isArray(value)) return [];

    return value
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `saved-email-${index}`,
            role: index === 0 ? "Primary" : "Other",
            email: item,
          };
        }

        return {
          id: String(item.id || item._id || `saved-email-${index}`),
          role: String(item.role || item.type || item.title || "Other"),
          email: String(item.email || item.address || ""),
        };
      })
      .filter((item) => item.email);
  };

  const normalizeCompany = (payload) => {
    const source =
      payload?.customer ||
      payload?.company ||
      payload?.data ||
      payload ||
      {};

    const contacts = normalizeEmailContacts(
      source.emailContacts ||
      source.emails ||
      source.contacts?.emails ||
      [],
    );

    if (!contacts.length && source.email) {
      contacts.push({
        id: "saved-primary-email",
        role: "Primary",
        email: String(source.email),
      });
    }

    return {
      id: String(source.id || source._id || ""),
      companyCode: String(
        source.companyCode ||
        source.uniqueCode ||
        source.customerCode ||
        source.code ||
        "",
      ).trim(),
      companyName: String(
        source.companyName ||
        source.company ||
        source.name ||
        "",
      ).trim(),
      contactPerson: String(
        source.contactPerson ||
        source.contactName ||
        source.primaryContact ||
        "",
      ).trim(),
      phone: String(source.phone || source.mobile || ""),
      emailContacts: contacts,
      deliveryLocation: String(
        source.deliveryLocation ||
        source.defaultDeliveryLocation ||
        source.address ||
        "",
      ),
    };
  };

  const applyCompanyToQuotation = (company) => {
    const primaryEmail =
      company.emailContacts.find(
        (item) => item.role === "Purchase Manager" && item.email,
      )?.email ||
      company.emailContacts.find((item) => item.email)?.email ||
      "";

    setCompanyProfile(company);

    setForm((prev) => ({
      ...prev,
      companyCode: company.companyCode,
      customerId: company.id,
      company: company.companyName,
      contactName: company.contactPerson,
      email: primaryEmail,
      phone: company.phone,
      deliveryLocation:
        prev.deliveryLocation || company.deliveryLocation || "",
    }));

    setCompanyMessage("");
    setCompanyError("");
    setStage("quotation");
  };

  const lookupCompany = async () => {
    const code = companyCodeInput.trim().toUpperCase();

    if (!code) {
      setCompanyError("Please enter your Company Unique Code.");
      return;
    }

    setCompanyLoading(true);
    setCompanyError("");
    setCompanyMessage("");

    try {
      const demoCompany = {
        id: `demo-${code}`,
        companyCode: code,
        companyName: "Demo Company",
        contactPerson: "Demo Contact",
        phone: "+971500000000",
        emailContacts: [
          {
            id: "demo-purchase",
            role: "Purchase Manager",
            email: "purchase@demo-company.com",
          },
          {
            id: "demo-accounts",
            role: "Accountant",
            email: "accounts@demo-company.com",
          },
        ],
        deliveryLocation: "",
      };

      applyCompanyToQuotation(demoCompany);
    } finally {
      setCompanyLoading(false);
    }
  };

  const generateCompanyCode = (companyName) => {
    const cleanName = String(companyName || "Company")
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
      .slice(0, 24);

    const prefix = cleanName || "Company";
    const storageKey = `toprange_company_code_${prefix.toLowerCase()}`;

    let nextNumber = 1;

    try {
      const lastNumber = Number(localStorage.getItem(storageKey) || 0);
      nextNumber = lastNumber + 1;
      localStorage.setItem(storageKey, String(nextNumber));
    } catch (error) {
      console.warn("Unable to persist company code counter:", error);
    }

    return `${prefix}-UC-${String(nextNumber).padStart(2, "0")}`;
  };

  const createCompany = async () => {
    const companyName = newCompany.companyName.trim();
    const contactPerson = newCompany.contactPerson.trim();
    const phone = newCompany.phone;

    const cleanEmails = emailContacts
      .map((item) => ({
        role: String(item.role || "Other").trim(),
        email: String(item.email || "").trim().toLowerCase(),
      }))
      .filter((item) => item.email);

    if (!companyName) {
      setCompanyError("Please enter the company name.");
      return;
    }

    if (!contactPerson) {
      setCompanyError("Please enter the contact person.");
      return;
    }

    if (!phone) {
      setCompanyError("Please enter the company contact phone number.");
      return;
    }

    if (!cleanEmails.length) {
      setCompanyError("Please add at least one company email address.");
      return;
    }

    const invalidEmail = cleanEmails.find(
      (item) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email),
    );

    if (invalidEmail) {
      setCompanyError(
        `Please enter a valid email address for ${invalidEmail.role}.`,
      );
      return;
    }

    setCompanyLoading(true);
    setCompanyError("");
    setCompanyMessage("");

    try {
      const generatedCode = generateCompanyCode(companyName);

      const completedCompany = {
        id: `demo-${generatedCode}`,
        companyCode: generatedCode,
        companyName,
        contactPerson,
        phone,
        emailContacts: cleanEmails.map((item, index) => ({
          ...item,
          id: `new-email-${index}`,
        })),
        deliveryLocation: "",
      };

      setCompanyProfile(completedCompany);
      setCompanyCodeInput(completedCompany.companyCode);

      setCompanyMessage(
        `Company profile created. Your unique code is ${completedCompany.companyCode}.`,
      );

      const primaryEmail =
        completedCompany.emailContacts.find(
          (item) => item.role === "Purchase Manager" && item.email,
        )?.email ||
        completedCompany.emailContacts[0]?.email ||
        "";

      setForm((prev) => ({
        ...prev,
        companyCode: completedCompany.companyCode,
        customerId: completedCompany.id,
        company: completedCompany.companyName,
        contactName: completedCompany.contactPerson,
        phone: completedCompany.phone,
        email: primaryEmail,
      }));

      setStage("company-created");
    } finally {
      setCompanyLoading(false);
    }
  };

  const addEmailContact = () => {
    setEmailContacts((current) => [
      ...current,
      {
        id: `email-${Date.now()}`,
        role: "Other",
        email: "",
      },
    ]);
  };

  const updateEmailContact = (id, field, value) => {
    setEmailContacts((current) =>
      current.map((item) =>
        item.id === id
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    );
  };

  const removeEmailContact = (id) => {
    setEmailContacts((current) =>
      current.length <= 1
        ? current
        : current.filter((item) => item.id !== id),
    );
  };

  const resetCompanySelection = () => {
    setStage("company");
    setCustomerMode("lookup");
    setCompanyProfile(null);
    setCompanyCodeInput("");
    setCompanyMessage("");
    setCompanyError("");

    setForm((prev) => ({
      ...prev,
      companyCode: "",
      customerId: "",
      company: "",
      contactName: "",
      email: "",
      phone: "",
    }));
  };

  /* =====================================================
     QUOTATION SUBMIT
  ===================================================== */

  const submit = async (event) => {
    event.preventDefault();

    if (!form.companyCode) {
      setSubmitError(
        "Please verify or create the company profile before requesting a quotation.",
      );
      setStage("company");
      return;
    }

    setSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const response = await fetch(QUOTATIONS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          companyCode: form.companyCode,
          customerId: form.customerId,
          companyEmails: companyProfile?.emailContacts || [],
          productList: cart.map((item) => ({
            id: String(item.id ?? item._id ?? ""),
            name: item.name || "Material",
            sku: item.sku || "",
            category: item.category || "",
            brand: item.brand || "",
            unit: String(item.unit ?? item.unitName ?? "Unit"),
            quantity: Number(item.quantity || 1),
            price: Number(item.price || 0),
          })),
          amount: `AED ${cart
            .reduce(
              (sum, item) =>
                sum +
                Number(item.price || 0) *
                Number(item.quantity || 1),
              0,
            )
            .toFixed(2)}`,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.error ||
          "Could not submit quotation request.",
        );
      }

      if (payload.warning) {
        setSubmitError(
          `${payload.warning} Your request reference is ${payload.quotation?.id || "saved"
          }.`,
        );
        return;
      }

      setSubmitMessage(
        `Request ${payload.quotation?.id || ""
        } submitted. Your estimate has been emailed to you, and the admin has been notified.`,
      );

      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event("toprange-cart-updated"));
    } catch (error) {
      setSubmitError(
        error.message ||
        "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F5EF] pb-20 pt-28 md:pt-32">
      <section className="mx-auto w-full max-w-[1450px] px-4 sm:px-5 md:px-8 lg:px-10 xl:px-14">


        <div className="py-8 md:py-10">
          {/* HEADER */}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#727972]">
                B2B Quotation
              </p>

              <h2 className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#101411] sm:text-[38px] md:text-[44px]">
                Request a Quote
              </h2>

              <p className="mt-4 max-w-2xl text-[13px] leading-6 text-[#626963]">
                Verify your company first. Existing customers can use their
                Company Unique Code. New customers only need to register once.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close quotation request"
              onClick={onClose}
              className="relative z-30 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#101411] shadow-[0_8px_25px_rgba(0,0,0,.08)] transition hover:bg-[#101411] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#D8FF65]/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* SUCCESS */}

          {submitMessage ? (
            <div
              className="mt-8 rounded-[26px] border border-[#D8FF65]/60 bg-white p-7 text-center sm:p-10"
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411]">
                <Check className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-[26px] font-semibold tracking-[-0.035em] text-[#101411] sm:text-[30px]">
                Quotation Request Submitted
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-[14px] leading-7 text-[#626963]">
                Your request has been saved successfully and linked to{" "}
                <strong>{form.company}</strong>.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-[18px] bg-[#F4F5EF] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7A817A]">
                  Company Unique Code
                </p>

                <p className="mt-2 text-[19px] font-bold tracking-[0.03em] text-[#101411]">
                  {form.companyCode}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-7 rounded-full bg-[#101411] px-8 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#1B211D]"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* =====================================================
                    COMPANY
                ===================================================== */}

              {(stage === "company" ||
                stage === "company-created") && (
                  <div className="mt-8">
                    {stage === "company-created" ? (
                      <div className="overflow-hidden rounded-[26px] border border-black/[0.07] bg-white">
                        <div className="bg-[#101411] p-6 text-white sm:p-8">
                          <div className="flex items-start justify-between gap-5">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#D8FF65]">
                                Company Created
                              </p>

                              <h3 className="mt-3 text-[25px] font-semibold tracking-[-0.035em]">
                                {companyProfile?.companyName}
                              </h3>

                              <p className="mt-2 text-[13px] text-white/55">
                                Keep this code for all future quotation requests.
                              </p>
                            </div>

                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411]">
                              <Check className="h-4 w-4" />
                            </span>
                          </div>

                          <div className="mt-7 rounded-[20px] border border-white/10 bg-white/[0.06] p-5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                              Company Unique Code
                            </p>

                            <p className="mt-2 break-all text-[24px] font-bold tracking-[0.03em] text-[#D8FF65]">
                              {companyProfile?.companyCode}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 sm:p-7">
                          {companyMessage && (
                            <p className="rounded-[15px] bg-[#EFF5D7] px-4 py-3 text-[12px] font-semibold text-[#516519]">
                              {companyMessage}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() => setStage("quotation")}
                            className="group mt-5 flex h-[58px] w-full items-center justify-between rounded-full bg-[#101411] pl-6 pr-2 text-[14px] font-semibold text-white"
                          >
                            Continue to Quotation

                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411]">
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="w-full rounded-[28px] border border-black/[0.07] bg-white p-5 shadow-[0_14px_38px_rgba(20,24,20,.04)] sm:p-7 lg:p-8">
                          <div className="flex flex-col gap-5 border-b border-black/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.035em] text-[#101411]">
                                Identify your company
                              </h3>

                              <p className="mt-2 text-[12px] leading-6 text-[#697069]">
                                Choose one option and continue.
                              </p>
                            </div>

                            <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomerMode("lookup");
                                  setCompanyError("");
                                }}
                                className={`group flex w-full min-w-0 items-center justify-between gap-4 rounded-[18px] border p-3.5 text-left transition sm:min-w-[220px] sm:p-4 ${customerMode === "lookup"
                                  ? "border-[#101411] bg-[#101411] text-white shadow-[0_12px_28px_rgba(16,20,17,.14)]"
                                  : "border-black/[0.08] bg-[#F5F6F1] text-[#505750] hover:border-black/15 hover:bg-white"
                                  }`}
                              >
                                <span className="min-w-0">
                                  <span className="block text-[9px] font-bold uppercase tracking-[0.14em] opacity-60">
                                    Existing Company
                                  </span>
                                  <span className="mt-1 block text-[12px] font-bold leading-5">
                                    I have a company code
                                  </span>
                                </span>

                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${customerMode === "lookup"
                                    ? "bg-[#D8FF65] text-[#101411]"
                                    : "bg-white text-[#101411] group-hover:bg-[#101411] group-hover:text-white"
                                    }`}
                                >
                                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setCustomerMode("new");
                                  setCompanyError("");
                                }}
                                className={`group flex w-full min-w-0 items-center justify-between gap-4 rounded-[18px] border p-3.5 text-left transition sm:min-w-[220px] sm:p-4 ${customerMode === "new"
                                  ? "border-[#B9DC46] bg-[#D8FF65] text-[#101411] shadow-[0_12px_28px_rgba(148,190,38,.16)]"
                                  : "border-black/[0.08] bg-[#F5F6F1] text-[#505750] hover:border-black/15 hover:bg-white"
                                  }`}
                              >
                                <span className="min-w-0">
                                  <span className="block text-[9px] font-bold uppercase tracking-[0.14em] opacity-60">
                                    New Company
                                  </span>
                                  <span className="mt-1 block text-[12px] font-bold leading-5">
                                    Register my company
                                  </span>
                                </span>

                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${customerMode === "new"
                                    ? "bg-[#101411] text-white"
                                    : "bg-white text-[#101411] group-hover:bg-[#D8FF65]"
                                    }`}
                                >
                                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </button>
                            </div>
                          </div>

                          {customerMode === "lookup" ? (
                            <div className="py-6">
                              <div className="mx-auto max-w-[620px]">
                                <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">
                                  Company Unique Code
                                </label>

                                <input
                                  type="text"
                                  value={companyCodeInput}
                                  onChange={(event) => {
                                    setCompanyCodeInput(
                                      event.target.value.toUpperCase(),
                                    );
                                    setCompanyError("");
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault();
                                      lookupCompany();
                                    }
                                  }}
                                  placeholder="Enter your company code"
                                  className="h-[60px] w-full rounded-[18px] border border-black/[0.10] bg-[#F7F7F3] px-5 text-[15px] font-bold uppercase tracking-[0.04em] text-[#202521] outline-none placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-black/30 focus:border-[#94BE26] focus:bg-white focus:ring-4 focus:ring-[#D8FF65]/20"
                                />

                                <p className="mt-2 text-[10px] leading-5 text-[#808680]">
                                  For now, enter any company code to continue the demo flow.
                                </p>

                                <button
                                  type="button"
                                  disabled={companyLoading}
                                  onClick={lookupCompany}
                                  className="group mt-5 flex h-[58px] w-full items-center justify-between rounded-full bg-[#101411] pl-6 pr-2 text-[13px] font-semibold text-white disabled:opacity-60"
                                >
                                  {companyLoading
                                    ? "Checking Company..."
                                    : "Continue"}

                                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411]">
                                    <ArrowRight className="h-4 w-4" />
                                  </span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-6">
                              <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                  <QuoteField
                                    label="Company Name"
                                    name="companyName"
                                    value={newCompany.companyName}
                                    onChange={(event) =>
                                      setNewCompany((prev) => ({
                                        ...prev,
                                        companyName: event.target.value,
                                      }))
                                    }
                                    placeholder="Company name"
                                    required
                                  />
                                </div>

                                <QuoteField
                                  label="Contact Person"
                                  name="contactPerson"
                                  value={newCompany.contactPerson}
                                  onChange={(event) =>
                                    setNewCompany((prev) => ({
                                      ...prev,
                                      contactPerson: event.target.value,
                                    }))
                                  }
                                  placeholder="Full name"
                                  required
                                />

                                <div>
                                  <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">
                                    Phone <span className="text-red-500">*</span>
                                  </label>

                                  <div className="quote-phone-input flex min-h-[58px] items-center rounded-[16px] border border-black/[0.10] bg-white px-4 focus-within:border-[#101411]/30 focus-within:ring-4 focus-within:ring-[#D8FF65]/20">
                                    <PhoneInput
                                      international
                                      countryCallingCodeEditable={false}
                                      defaultCountry="AE"
                                      value={newCompany.phone}
                                      onChange={(value) =>
                                        setNewCompany((prev) => ({
                                          ...prev,
                                          phone: value || "",
                                        }))
                                      }
                                      placeholder="Enter phone number"
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 rounded-[20px] border border-black/[0.07] bg-[#F7F7F3] p-4 sm:p-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-[11px] font-bold text-[#202521]">
                                      Email Recipients
                                    </p>

                                    <p className="mt-1 text-[10px] leading-5 text-[#747A74]">
                                      Add only the people who should receive quotation-related emails.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={addEmailContact}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-[10px] font-bold text-[#303630] shadow-sm"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Email
                                  </button>
                                </div>

                                <div className="mt-4 space-y-3">
                                  {emailContacts.map((item) => (
                                    <CompanyEmailRow
                                      key={item.id}
                                      item={item}
                                      canRemove={emailContacts.length > 1}
                                      onChange={updateEmailContact}
                                      onRemove={removeEmailContact}
                                    />
                                  ))}
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={companyLoading}
                                onClick={createCompany}
                                className="group mt-6 flex h-[58px] w-full items-center justify-between rounded-full bg-[#101411] pl-6 pr-2 text-[13px] font-semibold text-white disabled:opacity-60"
                              >
                                {companyLoading
                                  ? "Creating Company..."
                                  : "Create Company Code"}

                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411]">
                                  <ArrowRight className="h-4 w-4" />
                                </span>
                              </button>
                            </div>
                          )}

                          {companyError && (
                            <p
                              className="mt-2 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[11px] font-semibold text-red-600"
                              role="alert"
                            >
                              {companyError}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              {/* =====================================================
                    QUOTATION
                ===================================================== */}

              {stage === "quotation" && (
                <form onSubmit={submit} className="mt-8 w-full">
                  {/* VERIFIED COMPANY */}

                  <div className="overflow-hidden rounded-[24px] bg-[#101411] text-white">
                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#D8FF65] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#101411]">
                            Verified Company
                          </span>

                          <span className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">
                            {form.companyCode}
                          </span>
                        </div>

                        <h3 className="mt-4 text-[24px] font-semibold tracking-[-0.035em]">
                          {form.company}
                        </h3>

                        <p className="mt-2 text-[12px] text-white/55">
                          {form.contactName}
                          {form.phone ? ` · ${form.phone}` : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={resetCompanySelection}
                        className="h-10 shrink-0 rounded-full border border-white/15 px-4 text-[10px] font-bold text-white/70 transition hover:bg-white hover:text-[#101411]"
                      >
                        Change Company
                      </button>
                    </div>

                    {companyProfile?.emailContacts?.length > 0 && (
                      <div className="border-t border-white/10 px-5 py-4 sm:px-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
                          Registered Email Recipients
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {companyProfile.emailContacts.map(
                            (item, index) => (
                              <span
                                key={`${item.email}-${index}`}
                                className="rounded-full bg-white/[0.07] px-3 py-2 text-[10px] text-white/75"
                              >
                                <strong className="text-white">
                                  {item.role}:
                                </strong>{" "}
                                {item.email}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SELECTED PRODUCTS */}

                  {cart.length > 0 && (
                    <div className="mt-5 rounded-[22px] border border-black/[0.07] bg-white p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#697069]">
                            Selected Products
                          </p>

                          <p className="mt-1 text-[13px] font-medium text-[#454B45]">
                            Automatically added from your cart
                          </p>
                        </div>

                        <span className="rounded-full bg-[#D8FF65] px-3 py-1.5 text-[11px] font-bold text-[#101411]">
                          {cart.length}
                        </span>
                      </div>

                      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex min-w-0 items-center gap-3 rounded-[16px] bg-[#F4F5EF] p-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-semibold text-[#101411]">
                                {item.name}
                              </p>

                              <p className="mt-1 text-[10px] font-medium text-[#656C66]">
                                {item.brand} · {item.sku}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#101411]">
                              {item.unit
                                ? `${item.unit}: ${item.quantity}`
                                : `Qty: ${item.quantity}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* QUOTATION DETAILS */}

                  <div className="mt-5 rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6">
                    <div className="mb-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777E77]">
                        Project Requirements
                      </p>

                      <h3 className="mt-2 text-[23px] font-semibold tracking-[-0.035em] text-[#101411]">
                        Quotation details
                      </h3>
                    </div>

                    <div className="grid min-w-0 gap-x-5 gap-y-5 lg:grid-cols-2 lg:gap-y-6">
                      <QuoteField
                        label="Company Name"
                        name="company"
                        value={form.company}
                        onChange={update}
                        placeholder="Company name"
                        required
                      />

                      <QuoteField
                        label="Contact Person"
                        name="contactName"
                        value={form.contactName}
                        onChange={update}
                        placeholder="Full name"
                        required
                      />

                      <QuoteField
                        label="Primary Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={update}
                        placeholder="name@company.com"
                        required
                      />

                      <div className="min-w-0">
                        <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">
                          Phone{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <div className="quote-phone-input flex min-h-[58px] items-center rounded-[18px] border border-black/[0.10] bg-white px-5 transition-all hover:border-black/20 focus-within:border-[#101411]/30 focus-within:ring-4 focus-within:ring-[#D8FF65]/20">
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="AE"
                            value={form.phone}
                            onChange={(value) =>
                              setForm((prev) => ({
                                ...prev,
                                phone: value || "",
                              }))
                            }
                            placeholder="Enter phone number"
                            required
                            className="w-full"
                          />
                        </div>
                      </div>

                      <QuoteField
                        label="Product"
                        name="products"
                        value={form.products}
                        onChange={update}
                        placeholder="Product name"
                      />

                      <div className="min-w-0">
                        <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">
                          Units / Quantity
                        </label>

                        <input
                          type="text"
                          readOnly
                          value={
                            cart.length > 0
                              ? cart
                                .map((item) =>
                                  item.unit
                                    ? `${item.unit}: ${item.quantity}`
                                    : `Qty: ${item.quantity}`,
                                )
                                .join(", ")
                              : ""
                          }
                          placeholder="Unit and quantity"
                          className="h-[58px] w-full min-w-0 rounded-[16px] border border-black/[0.10] bg-[#F7F7F3] px-4 text-[14px] font-medium text-[#202521] outline-none"
                        />
                      </div>

                      <PremiumQuoteDropdown
                        label="Category"
                        value={form.category}
                        placeholder="Select category"
                        options={[
                          "Power Tools",
                          "Hand Tools",
                          "Electrical",
                          "Plumbing",
                          "Hardware",
                          "Fasteners",
                          "Safety",
                          "Paint & Adhesives",
                          "Construction Materials",
                          "HVAC",
                          "Multiple Categories",
                        ]}
                        onChange={(value) =>
                          updateSelect("category", value)
                        }
                      />

                      <PremiumQuoteDropdown
                        label="Preferred Brand"
                        value={form.brand}
                        placeholder="Select preferred brand"
                        options={[
                          "DeWalt",
                          "Bosch",
                          "Stanley",
                          "3M",
                          "Sika",
                          "Fischer",
                          "Hepworth",
                          "Mueller",
                          "Dormakaba",
                          "Fluke",
                          "No Preference",
                          "Multiple Brands",
                        ]}
                        onChange={(value) =>
                          updateSelect("brand", value)
                        }
                      />

                      <div className="lg:col-span-2">
                        <QuoteField
                          label="Delivery Location"
                          name="deliveryLocation"
                          value={form.deliveryLocation}
                          onChange={update}
                          placeholder="Dubai, Ajman, Sharjah, Abu Dhabi..."
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6">
                      <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">
                        Description / Requirement
                      </label>

                      <textarea
                        rows={7}
                        name="description"
                        value={form.description}
                        onChange={update}
                        placeholder="Product specifications and requirements..."
                        className="min-h-[150px] w-full min-w-0 resize-y rounded-[16px] border border-black/[0.10] bg-white p-4 text-[14px] leading-6 text-[#202521] outline-none placeholder:text-black/30 hover:border-black/20 focus:border-[#101411]/30 focus:ring-4 focus:ring-[#D8FF65]/20 sm:min-h-[170px] sm:p-5 sm:leading-7"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <p
                      className="mt-5 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[11px] font-semibold text-red-600"
                      role="alert"
                    >
                      {submitError}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={resetCompanySelection}
                      className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full border border-black/[0.10] bg-white px-6 text-[12px] font-bold text-[#303630]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Company
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex h-[58px] min-w-[230px] items-center justify-between rounded-full bg-[#101411] pl-7 pr-2 text-[14px] font-semibold text-white disabled:cursor-wait disabled:opacity-60"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Request Quotation"}

                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411]">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  title,
  description,
  active = false,
  complete = false,
}) {
  return (
    <div
      className={`rounded-[18px] border p-4 transition ${active
        ? "border-[#94BE26] bg-[#F5F8E9]"
        : complete
          ? "border-black/[0.07] bg-white"
          : "border-black/[0.07] bg-[#EEEFE9]"
        }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active
            ? "bg-[#D8FF65] text-[#101411]"
            : complete
              ? "bg-[#101411] text-[#D8FF65]"
              : "bg-white text-[#7A817A]"
            }`}
        >
          {complete ? <Check className="h-3.5 w-3.5" /> : number}
        </span>

        <div>
          <p className="text-[12px] font-bold text-[#202521]">
            {title}
          </p>

          <p className="mt-0.5 text-[9px] font-medium text-[#777E77]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPANY EMAIL ROW
========================================================= */

function CompanyEmailRow({
  item,
  canRemove,
  onChange,
  onRemove,
}) {
  const [roleOpen, setRoleOpen] = useState(false);

  const roles = [
    "Purchase Manager",
    "Accountant",
    "Receiver",
    "Project Manager",
    "General",
    "Other",
  ];

  return (
    <div className="grid gap-2.5 rounded-[16px] border border-black/[0.07] bg-white p-3 sm:grid-cols-[190px_minmax(0,1fr)_40px]">
      <div className={`relative ${roleOpen ? "z-[120]" : "z-20"}`}>
        <button
          type="button"
          onClick={() => setRoleOpen((prev) => !prev)}
          className={`flex h-11 w-full items-center justify-between gap-3 rounded-[12px] border px-3 text-left transition ${roleOpen
            ? "border-[#94BE26] bg-[#101411] text-white ring-4 ring-[#D8FF65]/15"
            : "border-black/[0.08] bg-[#F7F7F3] text-[#303630] hover:border-black/15"
            }`}
        >
          <span className="truncate text-[10px] font-bold">
            {item.role}
          </span>

          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${roleOpen
              ? "rotate-180 bg-[#D8FF65] text-[#101411]"
              : "bg-white text-[#5A615B]"
              }`}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </button>

        {roleOpen && (
          <>
            <button
              type="button"
              aria-label="Close email role menu"
              onClick={() => setRoleOpen(false)}
              className="fixed inset-0 z-[119] cursor-default"
            />

            <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[120] overflow-hidden rounded-[14px] border border-black/[0.08] bg-white p-2 shadow-[0_18px_45px_rgba(16,20,17,.14)]">
              <div className="max-h-[230px] space-y-1 overflow-y-auto">
                {roles.map((role) => {
                  const selected = item.role === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        onChange(item.id, "role", role);
                        setRoleOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[10px] font-bold transition ${selected
                        ? "bg-[#D8FF65] text-[#101411]"
                        : "text-[#505750] hover:bg-[#F3F4EF] hover:text-[#101411]"
                        }`}
                    >
                      <span>{role}</span>

                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#101411] text-[#D8FF65]">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <input
        type="email"
        value={item.email}
        onChange={(event) =>
          onChange(item.id, "email", event.target.value)
        }
        placeholder="name@company.com"
        className="h-11 w-full min-w-0 rounded-[12px] border border-black/[0.08] bg-[#F7F7F3] px-3 text-[12px] font-medium text-[#202521] outline-none placeholder:text-black/30 hover:border-black/15 focus:border-[#94BE26] focus:bg-white focus:ring-4 focus:ring-[#D8FF65]/15"
      />

      <button
        type="button"
        disabled={!canRemove}
        onClick={() => onRemove(item.id)}
        aria-label="Remove email"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F5EF] text-[#777E77] transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* =========================================================
   QUOTE FIELD
========================================================= */

function QuoteField({

  label,

  name,

  value,

  onChange,

  placeholder = "",

  type = "text",

  required = false,

}) {

  return (

    <div>

      <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">

        {label}



        {required && <span className="ml-1 text-red-500">*</span>}

      </label>



      <input

        required={required}

        type={type}

        name={name}

        value={value}

        onChange={onChange}

        placeholder={placeholder}

        className="h-[58px] w-full rounded-[16px] border border-black/[0.10] bg-white px-4 text-[14px] font-medium text-[#202521] outline-none transition-all placeholder:text-black/30 hover:border-black/20 focus:border-[#101411]/30 focus:ring-4 focus:ring-[#D8FF65]/20"

      />

    </div>

  );

}



/* =========================================================

   PREMIUM QUOTE DROPDOWN

========================================================= */



function PremiumQuoteDropdown({

  label,

  value,

  placeholder,

  options = [],

  onChange,

}) {

  const [open, setOpen] = useState(false);



  return (

    <div className="relative z-[60]">

      {/* Label */}



      <label className="mb-2.5 block text-[11px] font-semibold text-[#686F69]">

        {label}

      </label>



      {/* Button */}



      <button

        type="button"

        onClick={() => setOpen((prev) => !prev)}

        className={`

          group

          flex

          h-[58px]

          w-full

          items-center

          justify-between

          gap-4

          rounded-[16px]

          border

          bg-white

          pl-4

          pr-2.5

          text-left

          transition-all

          duration-300



          ${open

            ? "border-[#101411]/30 ring-4 ring-[#D8FF65]/20"

            : "border-black/[0.10] hover:border-black/20"

          }

        `}

      >

        <span

          className={`

            min-w-0

            flex-1

            truncate

            text-[14px]

            font-medium



            ${value ? "text-[#202521]" : "text-black/35"}

          `}

        >

          {value || placeholder}

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

            transition-all

            duration-300



            ${open

              ? "rotate-180 bg-[#D8FF65] text-[#101411]"

              : "bg-[#F1F3ED] text-[#535A54]"

            }

          `}

        >

          <ChevronDown className="h-4 w-4" />

        </span>

      </button>



      {/* Menu */}



      {open && (

        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[500] overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-2 shadow-[0_25px_70px_rgba(0,0,0,.16)]">

          <div className="border-b border-black/[0.06] px-3 pb-2 pt-1">

            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/40">

              Choose {label}

            </p>

          </div>



          <div className="mt-2 max-h-[190px] space-y-1 overflow-y-auto sm:max-h-[220px] lg:max-h-[250px]">

            {options.map((option) => {

              const selected = value === option;



              return (

                <button

                  type="button"

                  key={option}

                  onClick={() => {

                    onChange(option);



                    setOpen(false);

                  }}

                  className={`

                      flex

                      w-full

                      items-center

                      justify-between

                      gap-4

                      rounded-[13px]

                      px-3.5

                      py-3

                      text-left

                      transition-all

                      duration-200



                      ${selected

                      ? "bg-[#D8FF65] text-[#101411]"

                      : "text-[#454B46] hover:bg-[#F1F3ED]"

                    }

                    `}

                >

                  <span className="text-[13px] font-semibold">{option}</span>



                  {selected && (

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#101411] text-white">

                      <Check className="h-3 w-3" />

                    </span>

                  )}

                </button>

              );

            })}

          </div>

        </div>

      )}

    </div>

  );

}



/* =========================================================

   CART PRODUCT

========================================================= */



function CartProduct({

  item,

  increaseQuantity,

  decreaseQuantity,

  removeProduct,

}) {

  const quantity = Number(item.quantity || 1);



  const price = Number(item.price || 0);



  const total = price * quantity;



  return (

    <article

      className="

        group

        relative

        overflow-hidden

        rounded-[26px]

        border

        border-black/[0.06]

        bg-white

        p-4

        transition-all

        duration-300

        hover:border-black/10

        hover:shadow-[0_18px_50px_rgba(16,20,17,.06)]

        sm:p-5

      "

    >

      <div

        className="

          flex

          min-w-0

          flex-col

          gap-5

        "

      >

        {/* =================================================

            PRODUCT INFO

        ================================================== */}



        <div

          className="

            min-w-0

            flex-1

            rounded-[20px]

            bg-[#F8F9F5]

            p-4

            sm:p-5

          "

        >

          <div

            className="

              flex

              items-start

              justify-between

              gap-5

            "

          >

            <div className="min-w-0">

              <p

                className="

                  text-[10px]

                  font-semibold

                  uppercase

                  tracking-[0.16em]

                  text-[#778073]

                "

              >

                {item.brand || "Top Range"}

              </p>



              <h3

                className="

                  mt-2

                  text-[19px]

                  font-semibold

                  leading-6

                  tracking-[-0.025em]

                  text-[#101411]

                  md:text-[21px]

                "

              >

                {item.name || "Product"}

              </h3>



              {item.sku && (

                <p

                  className="

                    mt-2

                    text-[11px]

                    text-black/30

                  "

                >

                  SKU: {item.sku}

                </p>

              )}

            </div>



            {/* Remove */}



            <button

              type="button"

              aria-label={`Remove ${item.name || "product"}`}

              onClick={() => removeProduct(item.id)}

              className="

                flex

                h-9

                w-9

                shrink-0

                items-center

                justify-center

                rounded-full

                bg-[#F4F5EF]

                text-black/35

                transition

                duration-300

                hover:bg-red-50

                hover:text-red-500

              "

            >

              <X className="h-4 w-4" />

            </button>

          </div>



          {/* Bottom */}



          <div

            className="

              mt-5

              flex

              flex-col

              gap-4

              border-t

              border-black/[0.06]

              pt-4

              sm:flex-row

              sm:items-end

              sm:justify-between

            "

          >

            {/* Quantity */}



            <div>

              <p

                className="

                  mb-2

                  text-[9px]

                  font-semibold

                  uppercase

                  tracking-[0.15em]

                  text-black/30

                "

              >

                Quantity

              </p>



              <div

                className="

                  inline-flex

                  items-center

                  rounded-full

                  border

                  border-black/[0.07]

                  bg-[#F4F5EF]

                  p-1

                "

              >

                <button

                  type="button"

                  aria-label="Decrease quantity"

                  onClick={() => decreaseQuantity(item.id)}

                  disabled={quantity <= 1}

                  className="

                    flex

                    h-9

                    w-9

                    items-center

                    justify-center

                    rounded-full

                    text-[#101411]

                    transition

                    hover:bg-white

                    disabled:cursor-not-allowed

                    disabled:opacity-25

                  "

                >

                  <Minus className="h-3.5 w-3.5" />

                </button>



                <span

                  className="

                    min-w-[42px]

                    text-center

                    text-sm

                    font-bold

                    tabular-nums

                  "

                >

                  {quantity}

                </span>



                <button

                  type="button"

                  aria-label="Increase quantity"

                  onClick={() => increaseQuantity(item.id)}

                  className="

                    flex

                    h-9

                    w-9

                    items-center

                    justify-center

                    rounded-full

                    bg-[#101411]

                    text-white

                    transition

                    hover:bg-[#D8FF65]

                    hover:text-[#101411]

                  "

                >

                  <Plus className="h-3.5 w-3.5" />

                </button>

              </div>

            </div>



            {/* Price */}



            <div className="sm:text-right">

              <p

                className="

                  text-[9px]

                  font-semibold

                  uppercase

                  tracking-[0.15em]

                  text-black/30

                "

              >

                Item Total

              </p>



              <p

                className="

                  mt-2

                  text-[21px]

                  font-bold

                  tracking-[-0.025em]

                  text-[#101411]

                "

              >

                <span

                  className="

                    mr-1

                    text-[11px]

                    font-semibold

                    text-black/40

                  "

                >

                  AED

                </span>



                {total.toLocaleString(undefined, {

                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,

                })}

              </p>



              {price > 0 && quantity > 1 && (

                <p className="mt-1 text-[10px] text-black/30">

                  AED{" "}

                  {price.toLocaleString(undefined, {

                    minimumFractionDigits: 2,

                    maximumFractionDigits: 2,

                  })}{" "}

                  each

                </p>

              )}

            </div>

          </div>

        </div>

      </div>

    </article>

  );

}



/* =========================================================

   SUMMARY FEATURE

========================================================= */



function SummaryFeature({ children }) {

  return (

    <div

      className="

        flex

        items-center

        gap-3

        text-xs

        text-white/45

      "

    >

      <span

        className="

          flex

          h-5

          w-5

          shrink-0

          items-center

          justify-center

          rounded-full

          bg-[#D8FF65]/10

          text-[#D8FF65]

        "

      >

        <Check className="h-3 w-3" />

      </span>



      {children}

    </div>

  );

}
