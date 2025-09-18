import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        const senderId = token.sub || token.id;

        const body = await req.json();
        // accept camelCase or snake_case from frontend
        const receiverId = body.receiverId ?? body.receiver_id;
        const jobId = body.jobId ?? body.job_id ?? null;
        const content = (body.content ?? body.body ?? "").trim();

        if (!receiverId || !content) {
            return Response.json({ ok: false, message: "receiverId and content are required" }, { status: 400 });
        }

        const [res] = await db.execute(
            `INSERT INTO messages (sender_id, receiver_id, job_id, content, created_at) VALUES (?, ?, ?, ?, NOW())`,
            [senderId, receiverId, jobId, content]
        );

        const messageId = res.insertId;

        // create notification for receiver (use your notifications table)
        await db.execute(
            `INSERT INTO notifications (user_id, type, title, body, payload, is_read, created_at)
       VALUES (?, 'message', ?, ?, ?, 0, NOW())`,
            [
                receiverId,
                "New message",
                `New message from ${token.name || "Someone"}`,
                JSON.stringify({ messageId, senderId, jobId })
            ]
        );

        return Response.json({ ok: true, messageId });
    } catch (err) {
        console.error("Send Message Error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
