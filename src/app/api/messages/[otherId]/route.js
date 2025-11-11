// import { db } from "@/lib/db";
// import { getToken } from "next-auth/jwt";

// export async function GET(req, context) {
//     try {
//         const params = await context.params;
//         const otherId = params.otherId;

//         const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//         if (!token) {
//             return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const me = token.sub || token.id;

//         const [rows] = await db.execute(
//             `SELECT id, sender_id, receiver_id, job_id, content, file_url, file_name, file_type, file_size, is_read, created_at
//      FROM messages
//      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
//      ORDER BY created_at ASC`,
//             [me, otherId, otherId, me]
//         );

//         return Response.json({ ok: true, messages: rows });
//     } catch (err) {
//         console.error("Fetch conversation error:", err);
//         return Response.json({ ok: false, message: "Server error" }, { status: 500 });
//     }
// }



import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const uniqueId = params.otherId; // employee_id or employer_id (UUID)

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const myUserId = token.sub || token.id;

        // Step 1: Find the other user's user_id from uniqueId
        // First check if it's an employee_id
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
            // Check if it's an employer_id
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

        // Step 2: Get user info
        const [userRows] = await db.execute(
            `SELECT id, name, email, role FROM users WHERE id = ?`,
            [otherUserId]
        );

        const userInfo = userRows[0] || null;

        // Step 3: Fetch messages between me and other user
        const [messages] = await db.execute(
            `SELECT id, sender_id, receiver_id, job_id, content, file_url, file_name, file_type, file_size, is_read, created_at
             FROM messages
             WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
             ORDER BY created_at ASC`,
            [myUserId, otherUserId, otherUserId, myUserId]
        );

        return Response.json({ ok: true, messages, userInfo });
    } catch (err) {
        console.error("Fetch conversation error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}