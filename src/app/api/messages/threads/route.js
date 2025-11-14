import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return Response.json({ ok: false }, { status: 401 });

        const me = token.sub || token.id;

        // Get filter from query params (inbox, archived, spam)
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter') || 'inbox';

        // Build filter condition WITHOUT alias
        let filterCondition = '';
        if (filter === 'archived') {
            filterCondition = 'AND is_archived = 1';
        } else if (filter === 'spam') {
            filterCondition = 'AND is_spam = 1';
        } else {
            // inbox - not archived and not spam
            filterCondition = 'AND is_archived = 0 AND is_spam = 0';
        }

        // Get distinct counterpart user ids with filter (NO ALIAS)
        const [pairs] = await db.execute(
            `SELECT DISTINCT IF(sender_id = ?, receiver_id, sender_id) AS counterpart_id
             FROM messages
             WHERE (sender_id = ? OR receiver_id = ?) ${filterCondition}`,
            [me, me, me]
        );

        // Build threads with unique_id and job info
        const threads = await Promise.all(pairs.map(async (p) => {
            const otherId = p.counterpart_id;

            // Get last message with filter (NO ALIAS)
            const [lastRes] = await db.execute(
                `SELECT content, sender_id, receiver_id, created_at, job_id
                 FROM messages
                 WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
                 ${filterCondition}
                 ORDER BY created_at DESC
                 LIMIT 1`,
                [me, otherId, otherId, me]
            );
            const last = lastRes[0] || null;

            // Unread count (only for inbox)
            let unreadCount = 0;
            if (filter === 'inbox') {
                const [unreadRes] = await db.execute(
                    `SELECT COUNT(*) as count FROM messages 
                     WHERE sender_id = ? AND receiver_id = ? AND is_read = 0 AND is_archived = 0 AND is_spam = 0`,
                    [otherId, me]
                );
                unreadCount = unreadRes[0]?.count ?? 0;
            }

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

            if (!uniqueId) return null;

            // Get job info if job_id exists
            let jobTitle = null;
            let companyName = null;

            if (last?.job_id) {
                const [jobRes] = await db.execute(
                    `SELECT j.title, e.company_name 
                     FROM jobs j
                     LEFT JOIN employers e ON j.employer_id = e.id
                     WHERE j.id = ?`,
                    [last.job_id]
                );

                if (jobRes[0]) {
                    jobTitle = jobRes[0].title;
                    companyName = jobRes[0].company_name;
                }
            }

            return {
                unique_id: uniqueId,
                counterpart_id: otherId,
                name: user.name ?? user.email ?? `User ${otherId}`,
                role: user.role,
                job_title: jobTitle,
                company_name: companyName,
                last_message: last ? last.content : null,
                last_at: last ? last.created_at : null,
                unread: unreadCount,
                is_archived: filter === 'archived',
                is_spam: filter === 'spam'
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