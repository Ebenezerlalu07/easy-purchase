
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || process.env.MONGODB_DATABASE;

const globalForMongo = globalThis;

if (!globalForMongo.__easyPurchaseMongo) {
  globalForMongo.__easyPurchaseMongo = {
    client: null,
    promise: null,
  };
}

const cached = globalForMongo.__easyPurchaseMongo;

async function getDb() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured in .env.local");
  }

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI);

    cached.promise = client.connect().then((connectedClient) => {
      cached.client = connectedClient;
      return connectedClient;
    });
  }

  const client = await cached.promise;
  return DB_NAME ? client.db(DB_NAME) : client.db();
}

const cleanString = (value) =>
  typeof value === "string" ? value.trim() : "";

// Treat capitalization and repeated spaces as equivalent.
function normalizeCompanyName(value) {
  return cleanString(value)
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeEmailContacts(value) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();

  return value
    .map((item) => ({
      role: cleanString(item?.role),
      email: cleanString(item?.email).toLowerCase(),
    }))
    .filter(({ role, email }) => {
      if (
        !role ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        seen.has(email)
      ) {
        return false;
      }

      seen.add(email);
      return true;
    });
}

function serializeCustomer(customer) {
  if (!customer) return null;

  return {
    ...customer,
    _id: String(customer._id),
    id: String(customer._id),
  };
}

async function findByCompanyCode(collection, code) {
  return collection.findOne({
    companyCode: cleanString(code).toUpperCase(),
  });
}

function createCompanyCode(companyName) {
  const prefix =
    cleanString(companyName)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 4) || "COMP";

  return `${prefix}-UC-${randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;
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

async function emailCompanyCode(customer) {
  const mailer = getMailer();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const results = await Promise.all(
    customer.emailContacts.map(async ({ email, role }) => {
      try {
        const info = await mailer.sendMail({
          from,
          to: email,
          subject: `Your ${customer.companyName} company code`,
          text: [
            `Hello ${customer.contactPerson},`,
            "",
            `Your company has been registered successfully with ${customer.companyName}.`,
            `Your unique company code is: ${customer.companyCode}`,
            "",
            "Use this code to look up your registered company on Easy Purchase.",
            "Please keep this code for your records.",
            "",
            "Easy Purchase",
          ].join("\n"),
        });

        const accepted = Array.isArray(info.accepted)
          ? info.accepted.map(String)
          : [];

        const sent = accepted.some(
          (address) => address.toLowerCase() === email.toLowerCase()
        );

        console.info("Company code email result:", {
          companyCode: customer.companyCode,
          email,
          role,
          sent,
          messageId: info.messageId,
        });

        return { email, role, sent };
      } catch (error) {
        console.error("Company code email failed:", {
          companyCode: customer.companyCode,
          email,
          error:
            error instanceof Error ? error.message : "Unknown error",
        });

        return {
          email,
          role,
          sent: false,
          error:
            error instanceof Error ? error.message : "Unknown error",
        };
      }
    })
  );

  return results;
}

/*
 * Prepare existing records before creating the unique index.
 *
 * If two existing records have the same normalized name, resolve
 * those duplicates manually before deploying this route.
 */
async function ensureCustomerIndexes(customers) {
  const migrationFlag = "__easyPurchaseCustomerIndexesReady";

  if (globalForMongo[migrationFlag]) return;

  const oldCustomers = await customers
    .find(
      { normalizedCompanyName: { $exists: false } },
      { projection: { _id: 1, companyName: 1 } }
    )
    .toArray();

  for (const customer of oldCustomers) {
    const normalized = normalizeCompanyName(customer.companyName);

    if (normalized) {
      await customers.updateOne(
        {
          _id: customer._id,
          normalizedCompanyName: { $exists: false },
        },
        {
          $set: { normalizedCompanyName: normalized },
        }
      );
    }
  }

  // Unique index: one normalized company name per registration.
  await customers.createIndex(
    { normalizedCompanyName: 1 },
    {
      unique: true,
      name: "unique_normalized_company_name",
      partialFilterExpression: {
        normalizedCompanyName: { $type: "string" },
      },
    }
  );

  // Unique index: no two companies can have the same code.
  await customers.createIndex(
    { companyCode: 1 },
    {
      unique: true,
      name: "unique_company_code",
      partialFilterExpression: {
        companyCode: { $type: "string" },
      },
    }
  );

  globalForMongo[migrationFlag] = true;
}

function registrationResponse(customer, alreadyRegistered = false) {
  return NextResponse.json({
    success: true,
    alreadyRegistered,
    message: alreadyRegistered
      ? "Company already registered. Existing company code retained."
      : "Company registered successfully.",
    customer: serializeCustomer(customer),
    emailDelivery: [],
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = cleanString(searchParams.get("code"));

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "A company code is required.",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const customers = db.collection("customers");

    const customer = await findByCompanyCode(customers, code);

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Company code not found. Please check the code and try again.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: serializeCustomer(customer),
    });
  } catch (error) {
    console.error("GET /api/customers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to look up the company right now.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = cleanString(body?.action).toLowerCase();

    const db = await getDb();
    const customers = db.collection("customers");

    if (action === "lookup") {
      const companyCode = cleanString(body?.companyCode).toUpperCase();

      if (!companyCode) {
        return NextResponse.json(
          {
            success: false,
            error: "Enter your company unique code.",
          },
          { status: 400 }
        );
      }

      const customer = await findByCompanyCode(
        customers,
        companyCode
      );

      if (!customer) {
        return NextResponse.json(
          {
            success: false,
            error: "Company code not found. Please check the code and try again.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        customer: serializeCustomer(customer),
      });
    }

    if (action !== "register") {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Use "register" or "lookup".',
        },
        { status: 400 }
      );
    }

    const companyName = cleanString(body?.companyName);
    const contactPerson = cleanString(body?.contactPerson);
    const phone = cleanString(body?.phone);
    const emailContacts = normalizeEmailContacts(body?.emailContacts);

    if (!companyName || !contactPerson || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Company name, contact person, and phone are required.",
        },
        { status: 400 }
      );
    }

    if (!emailContacts.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Add at least one valid company email address.",
        },
        { status: 400 }
      );
    }

    const normalizedCompanyName = normalizeCompanyName(companyName);

    if (!normalizedCompanyName) {
      return NextResponse.json(
        {
          success: false,
          error: "Enter a valid company name.",
        },
        { status: 400 }
      );
    }

    await ensureCustomerIndexes(customers);

    // Check for an existing company BEFORE generating a new code.
    const existingCustomer = await customers.findOne({
      normalizedCompanyName,
    });

    if (existingCustomer) {
      return registrationResponse(existingCustomer, true);
    }

    // Generate a code only for a new company.
    let companyCode;
    let codeIsUnique = false;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      companyCode = createCompanyCode(companyName);

      const existingCode = await customers.findOne({
        companyCode,
      });

      if (!existingCode) {
        codeIsUnique = true;
        break;
      }
    }

    if (!codeIsUnique) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not generate a unique company code. Please try again.",
        },
        { status: 500 }
      );
    }

    const now = new Date();

    const customer = {
      companyCode,
      companyName,
      normalizedCompanyName,
      contactPerson,
      phone,
      emailContacts,
      deliveryLocation: cleanString(body?.deliveryLocation),
      createdAt: now,
      updatedAt: now,
    };

    let savedCustomer;

    try {
      const result = await customers.insertOne(customer);

      savedCustomer = await customers.findOne({
        _id: result.insertedId,
      });
    } catch (error) {
      if (error?.code === 11000) {
        // Another request may have registered the same company first.
        const existing = await customers.findOne({
          normalizedCompanyName,
        });

        if (existing) {
          return registrationResponse(existing, true);
        }

        // A company-code collision can safely be retried by the client.
        return NextResponse.json(
          {
            success: false,
            error: "Registration conflict. Please try again.",
          },
          { status: 409 }
        );
      }

      throw error;
    }

    // The company is saved first. Email failures won't undo registration.
    let emailResults = [];

    try {
      emailResults = await emailCompanyCode(savedCustomer);
    } catch (emailSetupError) {
      console.error(
        "Company code email setup failed:",
        emailSetupError instanceof Error
          ? emailSetupError.message
          : "Unknown error"
      );

      emailResults = emailContacts.map(({ email, role }) => ({
        email,
        role,
        sent: false,
        error:
          emailSetupError instanceof Error
            ? emailSetupError.message
            : "Email configuration error",
      }));
    }

    const allEmailsSent =
      emailResults.length > 0 &&
      emailResults.every((result) => result.sent);

    return NextResponse.json(
      {
        success: true,
        alreadyRegistered: false,
        message: allEmailsSent
          ? "Company registered successfully. The unique code was emailed to all company contacts."
          : "Company registered successfully, but the code email could not be confirmed for every contact. Check SMTP settings and server logs.",
        customer: serializeCustomer(savedCustomer),
        emailDelivery: emailResults,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/customers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process the company request right now.",
      },
      { status: 500 }
    );
  }
}
