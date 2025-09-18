// src/app/api/employer/jobs/route.js
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        const employerId = token.sub || token?.id;
        const [rows] = await db.execute("SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC", [employerId]);
        return Response.json({ ok: true, jobs: rows });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        const employerId = token.sub || token?.id;

        const body = await req.json();
        const { title, description, location, type, salary_min, salary_max, expires_at, status } = body;

        if (!title) return Response.json({ ok: false, message: "Title required" }, { status: 400 });

        const [result] = await db.execute(
            `INSERT INTO jobs (employer_id, title, description, location, type, salary_min, salary_max, expires_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [employerId, title, description || "", location || "", type || "full-time", salary_min || null, salary_max || null, expires_at || null, status || "published"]
        );

        return Response.json({ ok: true, jobId: result.insertId });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
