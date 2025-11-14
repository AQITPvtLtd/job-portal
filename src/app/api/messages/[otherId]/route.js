import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const uniqueId = params.otherId;

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const myUserId = token.sub || token.id;

        // Find other user's user_id from uniqueId
        let [employeeRows] = await db.execute(
            `SELECT user_id FROM employees WHERE employee_id = ?`,
            [uniqueId]
        );

        let otherUserId = null;
        let otherUserRole = null;

        if (employeeRows.length > 0) {
            otherUserId = employeeRows[0].user_id;
            otherUserRole = 'employee';
        } else {
            let [employerRows] = await db.execute(
                `SELECT user_id FROM employers WHERE employer_id = ?`,
                [uniqueId]
            );

            if (employerRows.length > 0) {
                otherUserId = employerRows[0].user_id;
                otherUserRole = 'employer';
            }
        }

        if (!otherUserId) {
            return Response.json({ ok: false, message: "User not found" }, { status: 404 });
        }

        // Get user info
        const [userRows] = await db.execute(
            `SELECT id, name, email, role FROM users WHERE id = ?`,
            [otherUserId]
        );

        const userInfo = userRows[0] || null;

        // Get job info (latest job_id from messages)
        const [jobInfoRes] = await db.execute(
            `SELECT job_id FROM messages 
             WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
             AND job_id IS NOT NULL
             ORDER BY created_at DESC
             LIMIT 1`,
            [myUserId, otherUserId, otherUserId, myUserId]
        );

        let jobTitle = null;
        let companyName = null;

        if (jobInfoRes[0]?.job_id) {
            const [jobRes] = await db.execute(
                `SELECT j.title, e.company_name 
                 FROM jobs j
                 LEFT JOIN employers e ON j.employer_id = e.id
                 WHERE j.id = ?`,
                [jobInfoRes[0].job_id]
            );

            if (jobRes[0]) {
                jobTitle = jobRes[0].title;
                companyName = jobRes[0].company_name;
            }
        }

        // Fetch messages (exclude archived and spam from chat view)
        const [messages] = await db.execute(
            `SELECT id, sender_id, receiver_id, job_id, content, file_url, file_name, file_type, file_size, is_read, created_at
             FROM messages
             WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
             AND is_archived = 0 AND is_spam = 0
             ORDER BY created_at ASC`,
            [myUserId, otherUserId, otherUserId, myUserId]
        );

        return Response.json({
            ok: true,
            messages,
            userInfo: {
                ...userInfo,
                job_title: jobTitle,
                company_name: companyName
            }
        });
    } catch (err) {
        console.error("Fetch conversation error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}