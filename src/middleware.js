import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl;

    // ✅ agar token hi nahi hai -> login page bhej do
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ role based restriction
    if (url.pathname.startsWith("/dashboard/employer") && token.role !== "employer") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (url.pathname.startsWith("/dashboard/employee") && token.role !== "employee") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"], // ✅ sirf dashboard ke routes me chalega
};
