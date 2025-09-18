import { db } from "@/lib/db";

export async function GET() {
    try {
        const [jobs] = await db.execute(
            "SELECT id, title, location, type, salary_min, salary_max, created_at FROM jobs WHERE status = 'published' ORDER BY created_at DESC"
        );
        return Response.json({ ok: true, jobs });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
