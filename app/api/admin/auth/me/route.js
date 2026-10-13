import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
        return NextResponse.json(
            { authenticated: false, admin: null },
            { status: 401 }
        );
    }

    return NextResponse.json({
        authenticated: true,
        admin: {
            id: session.sub,
            email: session.email,
            name: session.name,
            role: session.role,
        },
    });
}
