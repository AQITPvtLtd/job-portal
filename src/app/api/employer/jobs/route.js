import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// 🟢 Fetch all jobs for the logged-in employer
export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token.id;

        const [rows] = await db.execute(
            `SELECT 
          id,
          title,
          company_name,
          location,
          type,
          salary_min,
          salary_max,
          experience_required,
          education_level,
          skills,
          description,
          expires_at,
          status,
          created_at
        FROM jobs 
        WHERE employer_id = ?
        ORDER BY created_at DESC`,
            [employerId]
        );

        return NextResponse.json({ ok: true, jobs: rows });
    } catch (err) {
        console.error("GET /jobs error:", err);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

// 🟡 Create a new job
export async function POST(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token.id;
        const body = await req.json();

        const {
            title,
            company_name,
            location,
            type,
            salary_min,
            salary_max,
            experience_required,
            education_level,
            skills,
            description,
            expires_at,
            status,
        } = body;

        // Basic validation
        if (!title || !location) {
            return NextResponse.json(
                { ok: false, message: "Job title and location are required" },
                { status: 400 }
            );
        }

        // Insert new job into database
        const [result] = await db.execute(
            `INSERT INTO jobs (
        employer_id,
        title,
        company_name,
        location,
        type,
        salary_min,
        salary_max,
        experience_required,
        education_level,
        skills,
        description,
        expires_at,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                employerId,
                title,
                company_name || "",
                location,
                type || "Full-time",
                salary_min || null,
                salary_max || null,
                experience_required || "",
                education_level || "",
                skills || "",
                description || "",
                expires_at || null,
                status || "Published",
            ]
        );

        return NextResponse.json({ ok: true, jobId: result.insertId });
    } catch (err) {
        console.error("POST /jobs error:", err);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
