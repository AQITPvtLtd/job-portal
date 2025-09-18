// src/app/api/employer/jobs/[id]/route.js
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req, context) {
    try {
        const { params } = context; // ✅ safe way
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token?.id;
        const jobId = params.id;

        const [jobs] = await db.execute(
            "SELECT * FROM jobs WHERE id = ? AND employer_id = ? LIMIT 1",
            [jobId, employerId]
        );
        if (jobs.length === 0) {
            return Response.json({ ok: false, message: "Not found or unauthorized" }, { status: 404 });
        }

        const [apps] = await db.execute(
            "SELECT * FROM applications WHERE job_id = ? ORDER BY created_at DESC",
            [jobId]
        );

        return Response.json({ ok: true, job: jobs[0], applicants: apps });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const { params } = context; // ✅
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token?.id;
        const jobId = params.id;
        const body = await req.json();
        const { title, description, location, type, salary_min, salary_max, expires_at, status } = body;

        // ensure employer owns this job
        const [rows] = await db.execute(
            "SELECT id FROM jobs WHERE id = ? AND employer_id = ? LIMIT 1",
            [jobId, employerId]
        );
        if (rows.length === 0) {
            return Response.json({ ok: false, message: "Not authorized" }, { status: 401 });
        }

        await db.execute(
            `UPDATE jobs 
             SET title = ?, description = ?, location = ?, type = ?, salary_min = ?, salary_max = ?, expires_at = ?, status = ? 
             WHERE id = ?`,
            [
                title,
                description || "",
                location || "",
                type || "full-time",
                salary_min || null,
                salary_max || null,
                expires_at || null,
                status || "published",
                jobId,
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
        const { params } = context; // ✅
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token?.id;
        const jobId = params.id;

        const [rows] = await db.execute(
            "SELECT id FROM jobs WHERE id = ? AND employer_id = ? LIMIT 1",
            [jobId, employerId]
        );
        if (rows.length === 0) {
            return Response.json({ ok: false, message: "Not authorized" }, { status: 401 });
        }

        await db.execute("DELETE FROM jobs WHERE id = ?", [jobId]);
        return Response.json({ ok: true, message: "Job deleted" });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
