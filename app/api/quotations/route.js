import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

import { nextQuotationId, readQuotations, writeQuotations } from "@/lib/quotations";

import nodemailer from "nodemailer";

import PDFDocument from "pdfkit";

import fs from "node:fs";

import path from "node:path";

export const runtime = "nodejs";

async function requireAdmin() {

  const token = (await cookies()).get(COOKIE_NAME)?.value;

  return verifySessionToken(token);

}

function clean(value) {

  return typeof value === "string" ? value.trim() : value ?? "";

}

export async function GET() {

  const session = await requireAdmin();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quotations = await readQuotations();

  return NextResponse.json({ quotations });

}

function createQuotationPdf(quotation) {

  return new Promise((resolve, reject) => {

    const templatePath = path.join(process.cwd(), "public", "Assets", "top-range-quotation-template.png");

    const doc = new PDFDocument({ size: "A4", margin: 0 });

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

    const money = (value) => Number(value || 0).toLocaleString("en-AE", {

      minimumFractionDigits: 2,

      maximumFractionDigits: 2,

    });

    const safe = (value, fallback = "") => String(value ?? "").trim() || fallback;

    const text = (value, x, y, width, opts = {}) => doc.text(String(value ?? ""), x, y, {

      width, lineBreak: false, ellipsis: true, ...opts,

    });

    // Preserve the supplied artwork (logo, header, footer and signature area).

    if (fs.existsSync(templatePath)) {

      doc.image(templatePath, 0, 0, { width: W, height: H });

    } else {

      doc.rect(0, 0, W, H).fill("#FFFFFF");

      doc.rect(36, 33, 523, 86).fill(MAROON);

      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(22).text("TOP RANGE", 132, 45);

      doc.fillColor(GOLD).fontSize(11).text("BUILDING MATERIALS", 132, 70);

      doc.fillColor("#FFFFFF").font("Helvetica").fontSize(8.5).text("Maliha Road, Sharjah | +971 50 468 2745", 132, 89);

    }

    // White out only dynamic template regions. Coordinates follow the supplied A4 template.

    doc.fillColor("#FFFFFF").rect(36, 165, 523, 18).fill();   // reference/date

    doc.fillColor(BEIGE).rect(36, 184, 523, 48).fill();       // customer/project panel

    doc.fillColor("#FFFFFF").rect(36, 232, 523, 31).fill();   // purpose line

    doc.fillColor("#FFFFFF").rect(36, 263, 523, 362).fill();  // table + totals

    doc.fillColor("#FFFFFF").rect(36, 625, 523, 119).fill();  // remove template notes and sign-off text; redraw below

    // Reference/date.

    doc.fillColor(MUTED).font("Helvetica").fontSize(8.5);

    text(`Ref. ${safe(quotation.id, "TRBM-[Quotation number]")}`, 37, 168, 300);

    text(`Date: ${safe(quotation.date, new Date().toLocaleDateString("en-GB"))}`, 425, 168, 133, { align: "right" });

    // Customer information panel.

    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(7.8);

    text("To:", 42, 190, 25);

    text("Attention:", 330, 190, 52);

    text("Project:", 42, 216, 40);

    text("Phone:", 330, 216, 38);

    doc.font("Helvetica").fontSize(7.8);

    text(safe(quotation.company || quotation.contactName, "-"), 69, 190, 245);

    text(safe(quotation.contactName, "-"), 384, 190, 166);

    text(safe(quotation.project, "Material supply"), 84, 216, 230);

    text(safe(quotation.phone, "-"), 370, 216, 180);

    doc.fillColor(DARK).font("Helvetica").fontSize(8.2);

 text(
  `Quotation for ${safe(quotation.description, "material supply / work description")}`,
  45,
  243,
  505,
  {
    align: "center",
    lineBreak: false,
    ellipsis: true,
    height: 12,
  }
);

    // Table columns align with the original template.

    const x = [41, 72, 248, 282, 316, 379, 446, 552];

    let y = 263;

    const headerH = 34;

    const rowH = 28;

    const categoryH = 22;

    const totalsH = [24, 24, 29];

    doc.fillColor(MAROON).rect(x[0], y, x[7] - x[0], headerH).fill();

    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(7);

    ["Item", "Description", "Unit", "Qty", "Rate\n(AED)", "Amount\n(AED)", "Remarks"].forEach((label, i) => {

      text(label, x[i] + 2, y + (label.includes("\n") ? 4 : 10), x[i + 1] - x[i] - 4, {

        align: "center", lineBreak: true, height: 18,

      });

    });

    doc.strokeColor(GRID).lineWidth(0.45);

    for (const xx of x) doc.moveTo(xx, y).lineTo(xx, y + headerH).stroke();

    y += headerH;

    const items = Array.isArray(quotation.productList) ? quotation.productList.slice(0, 8) : [];

    doc.fillColor(BEIGE).rect(x[0], y, x[7] - x[0], categoryH).fill();

    doc.strokeColor(GRID).rect(x[0], y, x[7] - x[0], categoryH).stroke();

    doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(7);

    text(quotation.category ? `[${safe(quotation.category)}]` : "", x[0] + 4, y + 6, x[7] - x[0] - 8);

    y += categoryH;

    const getRate = (item) => {

      const candidates = [item.price, item.rate, item.unitPrice, item.sellingPrice, item.salePrice, item.amountPerUnit];

      const found = candidates.find((v) => v !== undefined && v !== null && v !== "" && Number.isFinite(Number(v)));

      return Math.max(0, Number(found ?? 0));

    };

    const getQty = (item) => {

      const n = Number(item.quantity ?? item.qty ?? 1);

      return Number.isFinite(n) && n > 0 ? n : 1;

    };

    for (let i = 0; i < 8; i++) {

      const item = items[i];

      doc.fillColor("#FFFFFF").rect(x[0], y, x[7] - x[0], rowH).fill();

      doc.strokeColor(GRID).lineWidth(0.45).rect(x[0], y, x[7] - x[0], rowH).stroke();

      for (let c = 1; c < x.length - 1; c++) doc.moveTo(x[c], y).lineTo(x[c], y + rowH).stroke();

      doc.fillColor(DARK).font("Helvetica").fontSize(7);

      text(String(i + 1), x[0] + 2, y + 8, x[1] - x[0] - 4, { align: "center" });

      if (item) {

        const qty = getQty(item);

        const rate = getRate(item);

        const amount = qty * rate;

        const name = safe(item.name || item.title || item.description, "Material");

        const details = [item.sku ? `SKU: ${item.sku}` : "", item.brand ? `Brand: ${item.brand}` : ""].filter(Boolean).join(" | ");

        // Clip both description lines to the description cell; no text can spill into adjacent columns.

        doc.save();

        doc.rect(x[1] + 2, y + 1, x[2] - x[1] - 4, rowH - 2).clip();

        doc.fillColor(DARK).font("Helvetica").fontSize(6.6);

        doc.text(name, x[1] + 4, y + 3, {

          width: x[2] - x[1] - 8, height: 8, lineBreak: false, ellipsis: true,

        });

        if (details) {

          doc.fillColor(MUTED).fontSize(5.7);

          doc.text(details, x[1] + 4, y + 13, {

            width: x[2] - x[1] - 8, height: 7, lineBreak: false, ellipsis: true,

          });

        }

        doc.restore();

        doc.fillColor(DARK).font("Helvetica").fontSize(6.8);

        text(safe(item.unit, "Unit"), x[2] + 1, y + 8, x[3] - x[2] - 2, { align: "center" });

        text(String(qty), x[3] + 1, y + 8, x[4] - x[3] - 2, { align: "center" });

        text(money(rate), x[4] + 1, y + 8, x[5] - x[4] - 2, { align: "center" });

        text(money(amount), x[5] + 1, y + 8, x[6] - x[5] - 2, { align: "center" });

        text(safe(item.remarks), x[6] + 3, y + 8, x[7] - x[6] - 6);

      }

      y += rowH;

    }

    // Calculate totals from the same normalized unit price and quantity used in each row.

    const subtotal = items.reduce((sum, item) => sum + getRate(item) * getQty(item), 0);

    const vatRate = Math.max(0, Number(process.env.QUOTATION_VAT_RATE || quotation.vatRate || 0));

    const vat = subtotal * vatRate / 100;

    const totals = [

      ["Subtotal (AED)", subtotal, totalsH[0], BEIGE, DARK],

      [`VAT (${vatRate}%)`, vat, totalsH[1], BEIGE, DARK],

      ["Total amount (AED)", subtotal + vat, totalsH[2], MAROON, "#FFFFFF"],

    ];

    for (const [label, amount, h, bg, fg] of totals) {

      doc.fillColor(bg).rect(x[0], y, x[7] - x[0], h).fill();

      doc.strokeColor(GRID).lineWidth(0.45).rect(x[0], y, x[7] - x[0], h).stroke();

      doc.fillColor(fg).font("Helvetica-Bold").fontSize(7.5);

      text(label, x[0] + 6, y + 6, 300);

      text(money(amount), x[6] + 2, y + 6, x[7] - x[6] - 8, { align: "right" });

      y += h;

    }

    // Draw notes and sign-off in a fixed area; original placeholders in this region are masked.
    let notesY = 632;
    doc.fillColor(MAROON).font("Helvetica-Bold").fontSize(8.2);
    text("NOTES & TERMS", 42, notesY, 200);
    notesY += 14;

    const terms = [
      ["Payment:", process.env.QUOTATION_PAYMENT_TERMS || "To be confirmed"],
      ["Delivery:", process.env.QUOTATION_DELIVERY_TERMS || "To be confirmed"],
      ["Validity:", process.env.QUOTATION_VALIDITY || "3 days"],
      [
  "Additional notes:",
  "Prices are subject to market fluctuations and are valid for 3 days from the quotation date.",
],
    ];
    for (const [label, value] of terms) {
      doc.fillColor(DARK).font("Helvetica-Bold").fontSize(7);
      text(label, 42, notesY, 80);
      doc.font("Helvetica").fontSize(7);
      text(value, 122, notesY, 425);
      notesY += 10;
    }

    doc.fillColor(DARK).font("Helvetica").fontSize(8);
    text("With regards,", 42, 722, 180);
    doc.font("Helvetica-Bold").fontSize(8.5);
    text("For Top Range Building Materials", 42, 737, 250);
    doc.strokeColor("#B8B4AD").lineWidth(0.5).moveTo(397, 739).lineTo(552, 739).stroke();
    doc.fillColor(MUTED).font("Helvetica").fontSize(7);
    // text("Authorised signatory / company stamp", 397, 744, 155, { align: "center" });

    doc.end();

  });

}

function getMailer() {

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {

    throw new Error("Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");

  }

  return nodemailer.createTransport({

    host: SMTP_HOST,

    port: Number(SMTP_PORT),

    secure: Number(SMTP_PORT) === 465,

    auth: { user: SMTP_USER, pass: SMTP_PASS },

  });

}

export async function POST(request) {

  const body = await request.json().catch(() => null);

  if (!body || !clean(body.contactName) || !clean(body.email) || !clean(body.phone)) {

    return NextResponse.json({ error: "Contact name, customer email and phone are required." }, { status: 400 });

  }

  if (!Array.isArray(body.productList) || !body.productList.length) {

    return NextResponse.json({ error: "Add at least one product to request a quotation." }, { status: 400 });

  }

  const productList = body.productList.map((item) => ({

    id: clean(item.id),

    name: clean(item.name) || "Material",

    sku: clean(item.sku),

    category: clean(item.category),

    brand: clean(item.brand),

    unit: clean(item.unit) || "Unit",

    quantity: Math.max(1, Number(item.quantity ?? item.qty ?? 1)),

    price: Math.max(0, Number(item.price ?? item.rate ?? item.unitPrice ?? item.sellingPrice ?? item.salePrice ?? 0)),

    remarks: clean(item.remarks),

  }));

  const subtotal = productList.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const vatRate = Number(process.env.QUOTATION_VAT_RATE || 0);

  const vat = subtotal * vatRate / 100;

  const quotations = await readQuotations();

  const now = new Date();

  const quotation = {

    id: await nextQuotationId(),

    company: clean(body.company),

    contactName: clean(body.contactName),

    email: clean(body.email),

    phone: clean(body.phone),

    project: clean(body.project),

    date: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),

    products: productList.length,

    amount: `AED ${(subtotal + vat).toFixed(2)}`,

    subtotal: Number(subtotal.toFixed(2)),

    vatRate,

    vat: Number(vat.toFixed(2)),

    total: Number((subtotal + vat).toFixed(2)),

    status: "New",

    category: clean(body.category),

    brand: clean(body.brand),

    quantity: String(productList.reduce((sum, item) => sum + item.quantity, 0)),

    deliveryLocation: clean(body.deliveryLocation),

    productList,

    description: clean(body.description),

    refNumber: clean(body.refNumber),

    createdAt: now.toISOString(),

    updatedAt: now.toISOString(),

    estimateSent: false,

  };

  // Save the request before attempting email delivery, so a mail outage never loses the request.

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

      text: `A new quotation request has arrived.\nReference: ${quotation.id}\nCustomer: ${quotation.contactName}\nCompany: ${quotation.company}\nEmail: ${quotation.email}\nPhone: ${quotation.phone}\nItems: ${productList.length}\nEstimate total: AED ${quotation.total.toFixed(2)}\n\nThe automatically generated estimate sent to the customer is attached.`,

      attachments: [{ filename: `${quotation.id}-Top-Range-Estimate.pdf`, content: pdf, contentType: "application/pdf" }],

    });

    await mailer.sendMail({

      from: process.env.SMTP_FROM || process.env.SMTP_USER,

      to: quotation.email,

      subject: `Your Top Range quotation ${quotation.id}`,

      text: `Dear ${quotation.contactName},\n\nPlease find attached the automatically generated estimate for your product request.\nReference: ${quotation.id}\n\nFor any changes, reply to this email.\n\nTop Range Building Materials\nMaliha Road, Sharjah\n+971 50 468 2745`,

      attachments: [{ filename: `${quotation.id}-Top-Range-Estimate.pdf`, content: pdf, contentType: "application/pdf" }],

    });

    quotation.estimateSent = true;

    quotation.estimateSentAt = new Date().toISOString();

    const updated = [quotation, ...quotations.filter((item) => item.id !== quotation.id)];

    await writeQuotations(updated);

    return NextResponse.json({ quotation, message: "Quotation request saved and estimate emailed to the customer and admin." }, { status: 201 });

  } catch (error) {

    console.error("Quotation email delivery failed:", error);

    return NextResponse.json({

      quotation,

      warning: "The request was saved, but automatic email delivery failed. Check SMTP settings and server logs.",

    }, { status: 201 });

  }

}

export async function PATCH(request) {

  const session = await requireAdmin();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);

  if (!body?.id) return NextResponse.json({ error: "Quotation id is required." }, { status: 400 });

  const allowed = ["New", "Reviewing", "Quoted", "Approved", "Completed", "Rejected"];

  const quotations = await readQuotations();

  const index = quotations.findIndex((quote) => quote.id === body.id);

  if (index === -1) return NextResponse.json({ error: "Quotation not found." }, { status: 404 });

  const updated = { ...quotations[index], updatedAt: new Date().toISOString() };

  if (body.status) {

    if (!allowed.includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

    updated.status = body.status;

  }

  for (const key of ["amount", "category", "brand", "quantity", "deliveryLocation", "description"]) {

    if (body[key] !== undefined) updated[key] = clean(body[key]);

  }

  quotations[index] = updated;

  await writeQuotations(quotations);

  return NextResponse.json({ quotation: updated });

}
