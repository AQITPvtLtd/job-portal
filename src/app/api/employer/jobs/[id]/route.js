// src/app/api/employer/jobs/[id]/route.js
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

// /api/employer/jobs/[id]/route.js (UPDATE GET method)
export async function GET(req, context) {
    try {
        const { params } = context;
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token?.id;
        const jobId = params.id; // UUID

        // ✅ Get job by job_id
        const [jobs] = await db.execute(
            "SELECT * FROM jobs WHERE job_id = ? AND employer_id = ? LIMIT 1",
            [jobId, employerId]
        );

        if (jobs.length === 0) {
            return Response.json({ ok: false, message: "Not found or unauthorized" }, { status: 404 });
        }

        // ✅ Get applicants WITH employee details (including resume)

        const [apps] = await db.execute(
            `SELECT 
            a.*,
         e.resume_url,
         e.employee_id   -- ✅ Add this
          FROM applications a
         LEFT JOIN employees e ON a.employee_id = e.user_id
         WHERE a.job_id = ? 
         ORDER BY a.created_at DESC`,
            [jobs[0].id]
        );

        return Response.json({ ok: true, job: jobs[0], applicants: apps });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const { params } = context;
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token?.id;
        const jobId = params.id; // ✅ This is UUID (job_id)
        const body = await req.json();
        const { title, description, location, type, salary_min, salary_max, expires_at, status } = body;

        // ✅ Verify ownership using job_id
        const [rows] = await db.execute(
            "SELECT id FROM jobs WHERE job_id = ? AND employer_id = ? LIMIT 1",
            [jobId, employerId]
        );

        if (rows.length === 0) {
            return Response.json({ ok: false, message: "Not authorized" }, { status: 401 });
        }

        // ✅ Update using job_id
        await db.execute(
            `UPDATE jobs 
             SET title = ?, description = ?, location = ?, type = ?, salary_min = ?, salary_max = ?, expires_at = ?, status = ? 
             WHERE job_id = ?`,
            [
                title,
                description || "",
                location || "",
                type || "Full-time",
                salary_min || null,
                salary_max || null,
                expires_at || null,
                status || "Published",
                jobId, // ✅ Use job_id for WHERE clause
            ]
        );

        return Response.json({ ok: true, message: "Job updated" });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const { params } = context;
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token?.id;
        const jobId = params.id; // ✅ This is UUID (job_id)

        // ✅ Verify ownership using job_id
        const [rows] = await db.execute(
            "SELECT id FROM jobs WHERE job_id = ? AND employer_id = ? LIMIT 1",
            [jobId, employerId]
        );

        if (rows.length === 0) {
            return Response.json({ ok: false, message: "Not authorized" }, { status: 401 });
        }

        // ✅ Delete using job_id
        await db.execute("DELETE FROM jobs WHERE job_id = ?", [jobId]);

        return Response.json({ ok: true, message: "Job deleted" });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}