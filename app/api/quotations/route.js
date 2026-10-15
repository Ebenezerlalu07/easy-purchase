
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import {
  nextQuotationId,
  readQuotations,
  writeQuotations,
} from "@/lib/quotations";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

async function requireAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

function clean(value) {
  return typeof value === "string" ? value.trim() : value ?? "";
}

function toText(value, fallback = "") {
  if (value === undefined || value === null || typeof value === "object") {
    return fallback;
  }

  const result = String(value).trim();
  return result || fallback;
}

function firstValue(...values) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      !(typeof value === "string" && value.trim() === "")
  );
}

function toNumber(value, fallback = 0) {
  if (typeof value === "string") {
    value = value.replace(/,/g, "").trim();
  }

  if (value === "" || value === null || value === undefined) {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/**
 * Supports common product shapes:
 * { name, price, quantity }
 * { productName, unitPrice, qty }
 * { title, sellingPrice, count }
 * { product: { name, price, sku, brand } }
 */
function normalizeQuotationItem(item = {}) {
  const product =
    item.product && typeof item.product === "object"
      ? item.product
      : {};

  const name = firstValue(
    item.name,
    item.productName,
    item.product_name,
    item.title,
    item.label,
    product.name,
    product.productName,
    product.product_name,
    product.title
  );

  const rawQuantity = firstValue(
    item.quantity,
    item.qty,
    item.count,
    item.selectedQuantity,
    product.quantity
  );

  const rawPrice = firstValue(
    item.price,
    item.unitPrice,
    item.unit_price,
    item.rate,
    item.sellingPrice,
    item.salePrice,
    item.amountPerUnit,
    item.pricePerUnit,
    product.price,
    product.unitPrice,
    product.unit_price,
    product.sellingPrice,
    product.salePrice
  );

  const quantity = toNumber(rawQuantity, 1);
  const price = rawPrice === undefined ? null : toNumber(rawPrice, NaN);

  return {
    id: toText(firstValue(item.id, item._id, product.id, product._id)),
    name: toText(name),
    sku: toText(
      firstValue(item.sku, item.productSku, item.product_sku, product.sku)
    ),
    category: toText(firstValue(item.category, product.category)),
    brand: toText(firstValue(item.brand, product.brand)),
    unit: toText(
      firstValue(item.unit, item.unitName, item.unit_name, product.unit),
      "Unit"
    ),
    quantity:
      Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    price:
      price !== null && Number.isFinite(price) && price >= 0
        ? price
        : null,
    remarks: toText(firstValue(item.remarks, item.notes)),
  };
}

function getQuotationItems(quotation) {
  const source = [
    quotation.productList,
    quotation.items,
  ].find(Array.isArray);

  return (source || []).map((item) => {
    const normalized = normalizeQuotationItem(item);

    return {
      ...normalized,
      name: normalized.name || "Unnamed product",
      price: normalized.price ?? 0,
    };
  });
}

function getMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS."
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/* -------------------------------------------------------------------------- */
/* GET quotations                                                             */
/* -------------------------------------------------------------------------- */

export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const quotations = await readQuotations();
  return NextResponse.json({ quotations });
}

/* -------------------------------------------------------------------------- */
/* PDF generation                                                             */
/* -------------------------------------------------------------------------- */

function createQuotationPdf(quotation) {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(
      process.cwd(),
      "public",
      "Assets",
      "top-range-quotation-template.png"
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = 595.28;
    const H = 841.89;

    const MAROON = "#54151B";
    const GOLD = "#D7B65D";
    const BEIGE = "#F3F0E8";
    const GRID = "#B8B4AD";
    const DARK = "#333333";
    const MUTED = "#777777";

    const money = (value) =>
      toNumber(value, 0).toLocaleString("en-AE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const safe = (value, fallback = "") =>
      toText(value, fallback);

    const text = (value, x, y, width, opts = {}) => {
      doc.text(String(value ?? ""), x, y, {
        width,
        lineBreak: false,
        ellipsis: true,
        ...opts,
      });
    };

    /* Background template */

    if (fs.existsSync(templatePath)) {
      doc.image(templatePath, 0, 0, {
        width: W,
        height: H,
      });
    } else {
      doc.rect(0, 0, W, H).fill("#FFFFFF");

      doc.rect(36, 33, 523, 86).fill(MAROON);

      doc.fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("TOP RANGE", 132, 45);

      doc.fillColor(GOLD)
        .fontSize(11)
        .text("BUILDING MATERIALS", 132, 70);

      doc.fillColor("#FFFFFF")
        .font("Helvetica")
        .fontSize(8.5)
        .text(
          "Maliha Road, Sharjah | +971 50 468 2745",
          132,
          89
        );
    }

    /* Clear dynamic template regions */

    doc.fillColor("#FFFFFF").rect(36, 165, 523, 18).fill();
    doc.fillColor(BEIGE).rect(36, 184, 523, 48).fill();
    doc.fillColor("#FFFFFF").rect(36, 232, 523, 31).fill();
    doc.fillColor("#FFFFFF").rect(36, 263, 523, 362).fill();
    doc.fillColor("#FFFFFF").rect(36, 625, 523, 119).fill();

    /* Reference and date */

    doc.fillColor(MUTED)
      .font("Helvetica")
      .fontSize(8.5);

    text(
      `Ref. ${safe(quotation.id, "TRBM-[Quotation number]")}`,
      37,
      168,
      300
    );

    text(
      `Date: ${safe(
        quotation.date,
        new Date().toLocaleDateString("en-GB")
      )}`,
      425,
      168,
      133,
      { align: "right" }
    );

    /* Customer details */


    doc.fillColor(DARK)
      .font("Helvetica-Bold")
      .fontSize(7.8);

    text("Company Name:", 42, 190, 80);
    text("Customer Name:", 330, 190, 88);
    text("Project:", 42, 216, 40);
    text("Phone:", 330, 216, 38);

    doc.font("Helvetica").fontSize(7.8);

    text(
      safe(quotation.company || quotation.contactName, "-"),
      126,
      190,
      185
    );

    text(
      safe(quotation.contactName, "-"),
      421,
      190,
      132
    );

    text(
      safe(quotation.project, "Material supply"),
      84,
      216,
      220
    );

    text(
      safe(quotation.phone, "-"),
      370,
      216,
      180
    );


    doc.fillColor(DARK)
      .font("Helvetica")
      .fontSize(8.2);

    // text(
    //   `Quotation for ${safe(
    //     quotation.description,
    //     "material supply / work description"
    //   )}`,
    //   45,
    //   243,
    //   505,
    //   { align: "center" }
    // );

    /* Product table */

    const x = [41, 72, 248, 282, 316, 379, 446, 552];

    let y = 263;

    const headerH = 34;
    const rowH = 28;
    const categoryH = 22;

    const totalsH = [24, 24, 29];

    doc.fillColor(MAROON)
      .rect(x[0], y, x[7] - x[0], headerH)
      .fill();

    doc.fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(7);

    [
      "Item",
      "Description",
      "Unit",
      "Qty",
      "Rate\n(AED)",
      "Amount\n(AED)",
      "Remarks",
    ].forEach((label, i) => {
      text(
        label,
        x[i] + 2,
        y + (label.includes("\n") ? 4 : 10),
        x[i + 1] - x[i] - 4,
        {
          align: "center",
          lineBreak: true,
          height: 18,
        }
      );
    });

    doc.strokeColor(GRID).lineWidth(0.45);

    for (const xx of x) {
      doc.moveTo(xx, y).lineTo(xx, y + headerH).stroke();
    }

    y += headerH;

    const items = getQuotationItems(quotation);

    doc.fillColor(BEIGE)
      .rect(x[0], y, x[7] - x[0], categoryH)
      .fill();

    doc.strokeColor(GRID)
      .rect(x[0], y, x[7] - x[0], categoryH)
      .stroke();

    doc.fillColor(MUTED)
      .font("Helvetica-Bold")
      .fontSize(7);

    text(
      quotation.category ? `[${safe(quotation.category)}]` : "",
      x[0] + 4,
      y + 6,
      x[7] - x[0] - 8
    );

    y += categoryH;

    /*
     * Keep the existing one-page template layout.
     * This template has room for eight product rows.
     * Reject larger lists in POST rather than silently omitting products.
     */

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      doc.fillColor("#FFFFFF")
        .rect(x[0], y, x[7] - x[0], rowH)
        .fill();

      doc.strokeColor(GRID)
        .lineWidth(0.45)
        .rect(x[0], y, x[7] - x[0], rowH)
        .stroke();

      for (let c = 1; c < x.length - 1; c++) {
        doc.moveTo(x[c], y).lineTo(x[c], y + rowH).stroke();
      }

      doc.fillColor(DARK)
        .font("Helvetica")
        .fontSize(7);

      text(
        String(i + 1),
        x[0] + 2,
        y + 8,
        x[1] - x[0] - 4,
        { align: "center" }
      );

      const qty = toNumber(item.quantity, 1);
      const rate = toNumber(item.price, 0);
      const amount = Number((qty * rate).toFixed(2));

      const name = safe(item.name, "Unnamed product");

      const details = [
        item.sku ? `SKU: ${item.sku}` : "",
        item.brand ? `Brand: ${item.brand}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      /* Clip product details to the description column */

      doc.save();

      doc.rect(
        x[1] + 2,
        y + 1,
        x[2] - x[1] - 4,
        rowH - 2
      ).clip();

      doc.fillColor(DARK)
        .font("Helvetica")
        .fontSize(6.6);

      doc.text(name, x[1] + 4, y + 3, {
        width: x[2] - x[1] - 8,
        height: 8,
        lineBreak: false,
        ellipsis: true,
      });

      if (details) {
        doc.fillColor(MUTED).fontSize(5.7);

        doc.text(details, x[1] + 4, y + 13, {
          width: x[2] - x[1] - 8,
          height: 7,
          lineBreak: false,
          ellipsis: true,
        });
      }

      doc.restore();

      doc.fillColor(DARK)
        .font("Helvetica")
        .fontSize(6.8);

      text(
        safe(item.unit, "Unit"),
        x[2] + 1,
        y + 8,
        x[3] - x[2] - 2,
        { align: "center" }
      );

      text(
        String(qty),
        x[3] + 1,
        y + 8,
        x[4] - x[3] - 2,
        { align: "center" }
      );

      text(
        money(rate),
        x[4] + 1,
        y + 8,
        x[5] - x[4] - 2,
        { align: "center" }
      );

      text(
        money(amount),
        x[5] + 1,
        y + 8,
        x[6] - x[5] - 2,
        { align: "center" }
      );

      text(
        safe(item.remarks),
        x[6] + 3,
        y + 8,
        x[7] - x[6] - 6
      );

      y += rowH;
    }

    /* Totals */

    const subtotal = Number(
      items
        .reduce(
          (sum, item) =>
            sum +
            toNumber(item.price, 0) *
            toNumber(item.quantity, 1),
          0
        )
        .toFixed(2)
    );

    const vatRate = Math.max(
      0,
      toNumber(
        quotation.vatRate ?? process.env.QUOTATION_VAT_RATE,
        0
      )
    );

    const vat = Number((subtotal * vatRate / 100).toFixed(2));
    const total = Number((subtotal + vat).toFixed(2));

    const totals = [
      ["Subtotal (AED)", subtotal, totalsH[0], BEIGE, DARK],
      [`VAT (${vatRate}%)`, vat, totalsH[1], BEIGE, DARK],
      ["Total amount (AED)", total, totalsH[2], MAROON, "#FFFFFF"],
    ];

    for (const [label, amount, h, bg, fg] of totals) {
      doc.fillColor(bg)
        .rect(x[0], y, x[7] - x[0], h)
        .fill();

      doc.strokeColor(GRID)
        .lineWidth(0.45)
        .rect(x[0], y, x[7] - x[0], h)
        .stroke();

      doc.fillColor(fg)
        .font("Helvetica-Bold")
        .fontSize(7.5);

      text(label, x[0] + 6, y + 6, 300);

      text(
        money(amount),
        x[6] + 2,
        y + 6,
        x[7] - x[6] - 8,
        { align: "right" }
      );

      y += h;
    }

    /* Notes and terms */

    let notesY = 632;

    doc.fillColor(MAROON)
      .font("Helvetica-Bold")
      .fontSize(8.2);

    text("NOTES & TERMS", 42, notesY, 200);

    notesY += 14;

    const terms = [
      [
        "Payment:",
        process.env.QUOTATION_PAYMENT_TERMS || "To be confirmed",
      ],
      [
        "Delivery:",
        process.env.QUOTATION_DELIVERY_TERMS || "To be confirmed",
      ],
      [
        "Validity:",
        process.env.QUOTATION_VALIDITY || "3 days",
      ],
      [
        "Additional notes:",
        "Prices are subject to market fluctuations and are valid for 3 days from the quotation date.",
      ],
    ];

    for (const [label, value] of terms) {
      doc.fillColor(DARK)
        .font("Helvetica-Bold")
        .fontSize(7);

      text(label, 42, notesY, 80);

      doc.font("Helvetica").fontSize(7);

      text(value, 122, notesY, 425);

      notesY += 10;
    }

    doc.fillColor(DARK)
      .font("Helvetica")
      .fontSize(8);

    text("With regards,", 42, 722, 180);

    doc.font("Helvetica-Bold").fontSize(8.5);

    text("For Top Range Building Materials", 42, 737, 250);

    // doc.strokeColor("#B8B4AD")
    //   .lineWidth(0.5)
    //   .moveTo(397, 739)
    //   .lineTo(552, 739)
    //   .stroke();

    // doc.fillColor(MUTED)
    //   .font("Helvetica")
    //   .fontSize(7);

    doc.end();
  });
}

/* -------------------------------------------------------------------------- */
/* POST: Create quotation and send emails                                     */
/* -------------------------------------------------------------------------- */

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    !clean(body.contactName) ||
    !clean(body.email) ||
    !clean(body.phone)
  ) {
    return NextResponse.json(
      {
        error:
          "Contact name, customer email and phone are required.",
      },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.productList) || !body.productList.length) {
    return NextResponse.json(
      {
        error: "Add at least one product to request a quotation.",
      },
      { status: 400 }
    );
  }

  /*
   * The existing one-page PDF template accommodates eight product rows.
   * Prevent incomplete PDFs instead of silently dropping extra products.
   */
  if (body.productList.length > 8) {
    return NextResponse.json(
      {
        error:
          "This quotation template supports up to 8 products. Please reduce the product list or update the PDF to support multiple pages.",
      },
      { status: 400 }
    );
  }

  const productList = body.productList.map((item) =>
    normalizeQuotationItem(item)
  );

  const invalidProduct = productList.find(
    (item) =>
      !item.name ||
      item.price === null ||
      !Number.isFinite(item.price) ||
      item.price < 0
  );

  if (invalidProduct) {
    return NextResponse.json(
      {
        error:
          "A product is missing its name or valid unit price. Refresh the product list and try again.",
      },
      { status: 400 }
    );
  }

  const invalidQuantity = productList.find(
    (item) =>
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0
  );

  if (invalidQuantity) {
    return NextResponse.json(
      {
        error: "Every product must have a valid quantity greater than zero.",
      },
      { status: 400 }
    );
  }

  const subtotal = Number(
    productList
      .reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      )
      .toFixed(2)
  );

  const vatRate = Math.max(
    0,
    toNumber(process.env.QUOTATION_VAT_RATE, 0)
  );

  const vat = Number((subtotal * vatRate / 100).toFixed(2));
  const total = Number((subtotal + vat).toFixed(2));

  const quotations = await readQuotations();
  const now = new Date();

  const quotation = {
    id: await nextQuotationId(),

    company: clean(body.company),
    contactName: clean(body.contactName),
    email: clean(body.email),
    phone: clean(body.phone),
    project: clean(body.project),

    date: now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    products: productList.length,
    amount: `AED ${total.toFixed(2)}`,
    subtotal,
    vatRate,
    vat,
    total,

    status: "New",

    category: clean(body.category),
    brand: clean(body.brand),

    quantity: String(
      productList.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
    ),

    deliveryLocation: clean(body.deliveryLocation),

    productList: productList.map(({ ...item }) => item),

    description: clean(body.description),
    refNumber: clean(body.refNumber),

    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),

    estimateSent: false,
  };

  /*
   * Save before attempting email delivery so a mail outage
   * never loses the quotation request.
   */

  quotations.unshift(quotation);
  await writeQuotations(quotations);

  try {
    const mailer = getMailer();
    const pdf = await createQuotationPdf(quotation);

    const adminEmail = process.env.QUOTATION_ADMIN_EMAIL || "aswinptoffical@gmail.com";

    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      replyTo: quotation.email,
      subject: `New quotation request ${quotation.id} — ${quotation.contactName}`,

      text: [
        "A new quotation request has arrived.",
        `Reference: ${quotation.id}`,
        `Customer: ${quotation.contactName}`,
        `Company: ${quotation.company}`,
        `Email: ${quotation.email}`,
        `Phone: ${quotation.phone}`,
        `Items: ${productList.length}`,
        `Estimate total: AED ${quotation.total.toFixed(2)}`,
        "",
        "The automatically generated estimate is attached.",
      ].join("\n"),

      attachments: [
        {
          filename: `${quotation.id}-Top-Range-Estimate.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });

    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: quotation.email,

      subject: `Your Top Range quotation ${quotation.id}`,

      text: [
        `Dear ${quotation.contactName},`,
        "",
        "Please find attached the automatically generated estimate for your product request.",
        `Reference: ${quotation.id}`,
        "",
        "For any changes, reply to this email.",
        "",
        "Top Range Building Materials",
        "Maliha Road, Sharjah",
        "+971 50 468 2745",
      ].join("\n"),

      attachments: [
        {
          filename: `${quotation.id}-Top-Range-Estimate.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });

    quotation.estimateSent = true;
    quotation.estimateSentAt = new Date().toISOString();
    quotation.updatedAt = new Date().toISOString();

    const updated = [
      quotation,
      ...quotations.filter((item) => item.id !== quotation.id),
    ];

    await writeQuotations(updated);

    return NextResponse.json(
      {
        quotation,
        message:
          "Quotation request saved and estimate emailed to the customer and admin.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Quotation email delivery failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        quotation,
        warning:
          "The request was saved, but automatic email delivery failed. Check SMTP settings and server logs.",
      },
      { status: 201 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* PATCH: Update quotation                                                    */
/* -------------------------------------------------------------------------- */

export async function PATCH(request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body?.id) {
    return NextResponse.json(
      { error: "Quotation id is required." },
      { status: 400 }
    );
  }

  const allowed = [
    "New",
    "Reviewing",
    "Quoted",
    "Approved",
    "Completed",
    "Rejected",
  ];

  const quotations = await readQuotations();

  const index = quotations.findIndex(
    (quote) => quote.id === body.id
  );

  if (index === -1) {
    return NextResponse.json(
      { error: "Quotation not found." },
      { status: 404 }
    );
  }

  const updated = {
    ...quotations[index],
    updatedAt: new Date().toISOString(),
  };

  if (body.status) {
    if (!allowed.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    updated.status = body.status;
  }

  for (const key of [
    "amount",
    "category",
    "brand",
    "quantity",
    "deliveryLocation",
    "description",
  ]) {
    if (body[key] !== undefined) {
      updated[key] = clean(body[key]);
    }
  }

  quotations[index] = updated;
  await writeQuotations(quotations);

  return NextResponse.json({ quotation: updated });
}
