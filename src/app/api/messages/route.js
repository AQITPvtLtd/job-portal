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

        // ✅ NEW: File upload fields
        const fileUrl = body.fileUrl ?? body.file_url ?? null;
        const fileName = body.fileName ?? body.file_name ?? null;
        const fileType = body.fileType ?? body.file_type ?? null;

        // Allow message if either content or file exists
        if (!receiverId || (!content && !fileUrl)) {
            return Response.json({ ok: false, message: "receiverId and (content or file) are required" }, { status: 400 });
        }

        // ✅ UPDATED: Insert with file fields
        const [res] = await db.execute(
            `INSERT INTO messages (sender_id, receiver_id, job_id, content, file_url, file_name, file_type, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [senderId, receiverId, jobId, content, fileUrl, fileName, fileType]
        );

        const messageId = res.insertId;

        // ✅ UPDATED: Notification message
        const notificationBody = fileUrl
            ? `${token.name || "Someone"} sent you a file${content ? ': ' + content : ''}`
            : `New message from ${token.name || "Someone"}`;

        // create notification for receiver
        await db.execute(
            `INSERT INTO notifications (user_id, type, title, body, payload, is_read, created_at)
             VALUES (?, 'message', ?, ?, ?, 0, NOW())`,
            [
                receiverId,
                "New message",
                notificationBody,
                JSON.stringify({ messageId, senderId, jobId, fileUrl, fileName })
            ]
        );

        return Response.json({ ok: true, messageId });
    } catch (err) {
        console.error("Send Message Error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}