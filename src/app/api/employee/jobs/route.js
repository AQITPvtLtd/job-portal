import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
    try {
        const [jobs] = await db.execute(`
      SELECT 
        id,
        title,
        company_name,
        location,
        type,
        salary_min,
        salary_max,
        experience_required	,
        skills,
        education_level,
        description,
        created_at
      FROM jobs 
      WHERE status = 'published' 
      ORDER BY created_at DESC
    `);
        return NextResponse.json({ ok: true, jobs });
    } catch (err) {
        console.error("GET /jobs error:", err);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}