// src/app/api/employer/applications/[id]/route.js
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function PUT(req, { params }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });

        const appId = params.id;
        const { status } = await req.json();
        const allowed = ["applied", "reviewing", "interview", "rejected", "hired"];
        if (!allowed.includes(status)) return Response.json({ ok: false, message: "Invalid status" }, { status: 400 });

        // verify the employer owns the job for this application
        const [rows] = await db.execute(
            `SELECT a.id FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ? AND j.employer_id = ? LIMIT 1`,
            [appId, token.sub || token.id]
        );
        if (rows.length === 0) return Response.json({ ok: false, message: "Not authorized" }, { status: 401 });

        await db.execute("UPDATE applications SET status = ? WHERE id = ?", [status, appId]);

        // Optionally: fetch applicant email/name and send notification with lib/mailer.js

        return Response.json({ ok: true, message: "Status updated" });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
