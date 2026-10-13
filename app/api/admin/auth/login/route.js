import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth/admin";
import { createSessionToken, getSessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const body = await request.json();
        const admin = await authenticateAdmin(body.email, body.password);

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            success: true,
            admin,
        });

        const cookie = getSessionCookieOptions();
        response.cookies.set({
            ...cookie,
            value: await createSessionToken(admin),
        });

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { success: false, message: "Authentication service is not configured correctly." },
            { status: 500 }
        );
    }
}
