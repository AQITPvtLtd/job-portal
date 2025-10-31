import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req, context) {
    try {
        // ✅ FIX: params ko bhi await karo
        const params = await context.params;
        const otherId = params.otherId;

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const me = token.sub || token.id;

        const [rows] = await db.execute(
            `SELECT id, sender_id, receiver_id, job_id, content, file_url, file_name, file_type, file_size, is_read, created_at
     FROM messages
     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
            [me, otherId, otherId, me]
        );

        return Response.json({ ok: true, messages: rows });
    } catch (err) {
        console.error("Fetch conversation error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}