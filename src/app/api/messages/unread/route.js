import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return Response.json({ ok: false, count: 0 }, { status: 401 });
        const me = token.sub || token.id;
        const [rows] = await db.execute("SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0", [me]);
        return Response.json({ ok: true, count: rows[0].count });
    } catch (err) {
        console.error("Unread messages error:", err);
        return Response.json({ ok: false, count: 0 }, { status: 500 });
    }
}
