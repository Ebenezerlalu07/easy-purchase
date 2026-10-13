import { NextResponse } from "next/server";
import { getSessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
    const response = NextResponse.json({ success: true });
    const cookie = getSessionCookieOptions();

    response.cookies.set({
        ...cookie,
        value: "",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}
