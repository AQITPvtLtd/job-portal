import { db } from "@/lib/db";
export async function GET(req, context) {
    try {
        const { params } = await context;   // ✅ await added
        const jobId = params.id;

        const [rows] = await db.execute("SELECT * FROM jobs WHERE id = ?", [jobId]);

        if (rows.length === 0) {
            return Response.json({ ok: false, message: "Job not found" }, { status: 404 });
        }

        return Response.json({ ok: true, job: rows[0] });
    } catch (error) {
        console.error(error);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
