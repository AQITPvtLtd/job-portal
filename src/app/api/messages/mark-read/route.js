import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function PATCH(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return Response.json({ ok: false }, { status: 401 });
        const me = token.sub || token.id;
        const { senderId } = await req.json();
        if (!senderId) return Response.json({ ok: false, message: "senderId required" }, { status: 400 });

        await db.execute("UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?", [me, senderId]);
        return Response.json({ ok: true });
    } catch (err) {
        console.error("Mark read error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
