import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function PATCH(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const myUserId = token.sub || token.id;
        const body = await req.json();
        const uniqueId = body.uniqueId;

        if (!uniqueId) {
            return Response.json({ ok: false, message: "uniqueId required" }, { status: 400 });
        }

        // Find sender's user_id from uniqueId
        let [employeeRows] = await db.execute(
            `SELECT user_id FROM employees WHERE employee_id = ?`,
            [uniqueId]
        );

        let senderUserId = null;

        if (employeeRows.length > 0) {
            senderUserId = employeeRows[0].user_id;
        } else {
            let [employerRows] = await db.execute(
                `SELECT user_id FROM employers WHERE employer_id = ?`,
                [uniqueId]
            );

            if (employerRows.length > 0) {
                senderUserId = employerRows[0].user_id;
            }
        }

        if (!senderUserId) {
            return Response.json({ ok: false, message: "Sender not found" }, { status: 404 });
        }

        // Mark all messages from sender to me as read
        await db.execute(
            `UPDATE messages 
             SET is_read = 1 
             WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`,
            [senderUserId, myUserId]
        );

        return Response.json({ ok: true });
    } catch (err) {
        console.error("Mark as read error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
