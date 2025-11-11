// import { db } from "@/lib/db";
// import { getToken } from "next-auth/jwt";

// export async function GET(req) {
//     try {
//         const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//         if (!token) return Response.json({ ok: false }, { status: 401 });
//         const me = token.sub || token.id;

//         // 1) distinct counterpart ids
//         const [pairs] = await db.execute(
//             `SELECT DISTINCT IF(sender_id = ?, receiver_id, sender_id) AS counterpart_id
//        FROM messages
//        WHERE sender_id = ? OR receiver_id = ?`,
//             [me, me, me]
//         );

//         const threads = await Promise.all(pairs.map(async (p) => {
//             const other = p.counterpart_id;
//             // last message
//             const [lastRes] = await db.execute(
//                 `SELECT content, sender_id, receiver_id, created_at
//          FROM messages
//          WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
//          ORDER BY created_at DESC
//          LIMIT 1`, [me, other, other, me]
//             );
//             const last = lastRes[0] || null;

//             // unread count from that other to me
//             const [unreadRes] = await db.execute(
//                 `SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`,
//                 [other, me]
//             );

//             // counterpart name (from users table)
//             const [userRes] = await db.execute(`SELECT id, name, email FROM users WHERE id = ? LIMIT 1`, [other]);

//             return {
//                 counterpart_id: other,
//                 name: userRes[0]?.name ?? userRes[0]?.email ?? `User ${other}`,
//                 last_message: last ? last.content : null,
//                 last_at: last ? last.created_at : null,
//                 unread: unreadRes[0]?.count ?? 0
//             };
//         }));

//         // sort by last_at desc
//         threads.sort((a, b) => {
//             if (!a.last_at) return 1;
//             if (!b.last_at) return -1;
//             return new Date(b.last_at) - new Date(a.last_at);
//         });

//         return Response.json({ ok: true, threads });
//     } catch (err) {
//         console.error("Threads error:", err);
//         return Response.json({ ok: false, message: "Server error" }, { status: 500 });
//     }
// }


import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return Response.json({ ok: false }, { status: 401 });

        const me = token.sub || token.id;

        // Step 1: Get distinct counterpart user ids
        const [pairs] = await db.execute(
            `SELECT DISTINCT IF(sender_id = ?, receiver_id, sender_id) AS counterpart_id
             FROM messages
             WHERE sender_id = ? OR receiver_id = ?`,
            [me, me, me]
        );

        // Step 2: Build threads with unique_id (employee_id or employer_id)
        const threads = await Promise.all(pairs.map(async (p) => {
            const otherId = p.counterpart_id;

            // Get last message
            const [lastRes] = await db.execute(
                `SELECT content, sender_id, receiver_id, created_at
                 FROM messages
                 WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
                 ORDER BY created_at DESC
                 LIMIT 1`,
                [me, otherId, otherId, me]
            );
            const last = lastRes[0] || null;

            // Unread count
            const [unreadRes] = await db.execute(
                `SELECT COUNT(*) as count FROM messages 
                 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`,
                [otherId, me]
            );

            // Get user info
            const [userRes] = await db.execute(
                `SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1`,
                [otherId]
            );

            const user = userRes[0];
            if (!user) return null;

            // Get unique_id (employee_id or employer_id)
            let uniqueId = null;

            if (user.role === 'employee') {
                const [empRows] = await db.execute(
                    `SELECT employee_id FROM employees WHERE user_id = ?`,
                    [otherId]
                );
                uniqueId = empRows[0]?.employee_id || null;
            } else if (user.role === 'employer') {
                const [empRows] = await db.execute(
                    `SELECT employer_id FROM employers WHERE user_id = ?`,
                    [otherId]
                );
                uniqueId = empRows[0]?.employer_id || null;
            }

            if (!uniqueId) return null; // Skip if no unique_id found

            return {
                unique_id: uniqueId,
                counterpart_id: otherId,
                name: user.name ?? user.email ?? `User ${otherId}`,
                role: user.role,
                last_message: last ? last.content : null,
                last_at: last ? last.created_at : null,
                unread: unreadRes[0]?.count ?? 0
            };
        }));

        // Filter out null threads and sort by last_at
        const validThreads = threads.filter(t => t !== null);

        validThreads.sort((a, b) => {
            if (!a.last_at) return 1;
            if (!b.last_at) return -1;
            return new Date(b.last_at) - new Date(a.last_at);
        });

        return Response.json({ ok: true, threads: validThreads });
    } catch (err) {
        console.error("Threads error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}