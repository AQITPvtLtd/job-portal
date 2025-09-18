// src/app/api/jobs/[id]/apply/route.js
import { db } from "@/lib/db";

export async function POST(req, { params }) {
    try {
        const jobId = params.id;
        const { name, email, cover_letter, resume_url, applicant_id } = await req.json();
        if (!name || !email) return Response.json({ ok: false, message: "Name and email required" }, { status: 400 });

        // You can also check job exists
        const [jobs] = await db.execute("SELECT id FROM jobs WHERE id = ? LIMIT 1", [jobId]);
        if (jobs.length === 0) return Response.json({ ok: false, message: "Job not found" }, { status: 404 });

        const [res] = await db.execute(
            `INSERT INTO applications (job_id, applicant_id, name, email, cover_letter, resume_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [jobId, applicant_id || null, name, email, cover_letter || null, resume_url || null]
        );

        return Response.json({ ok: true, applicationId: res.insertId });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
