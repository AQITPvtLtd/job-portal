import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// 🟢 Get employer's basic info (for pre-filling forms)
export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token.id;

        // Fetch company_name from employers table
        const [rows] = await db.execute(
            `SELECT company_name, email, phone, website, address, industry, team_size 
             FROM employers 
             WHERE user_id = ?`,
            [employerId]
        );

        if (rows.length === 0) {
            // Fallback to users table
            const [userRows] = await db.execute(
                `SELECT name as company_name, email, phone FROM users WHERE id = ?`,
                [employerId]
            );
            return NextResponse.json({
                ok: true,
                employer: userRows.length > 0 ? userRows[0] : {}
            });
        }

        return NextResponse.json({ ok: true, employer: rows[0] });
    } catch (err) {
        console.error("GET /employer/info error:", err);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}