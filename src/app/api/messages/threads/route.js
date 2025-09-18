import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) return Response.json({ ok: false }, { status: 401 });
        const me = token.sub || token.id;

        // 1) distinct counterpart ids
        const [pairs] = await db.execute(
            `SELECT DISTINCT IF(sender_id = ?, receiver_id, sender_id) AS counterpart_id
       FROM messages
       WHERE sender_id = ? OR receiver_id = ?`,
            [me, me, me]
        );

        const threads = await Promise.all(pairs.map(async (p) => {
            const other = p.counterpart_id;
            // last message
            const [lastRes] = await db.execute(
                `SELECT content, sender_id, receiver_id, created_at
         FROM messages
         WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at DESC
         LIMIT 1`, [me, other, other, me]
            );
            const last = lastRes[0] || null;

            // unread count from that other to me
            const [unreadRes] = await db.execute(
                `SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`,
                [other, me]
            );

            // counterpart name (from users table)
            const [userRes] = await db.execute(`SELECT id, name, email FROM users WHERE id = ? LIMIT 1`, [other]);

            return {
                counterpart_id: other,
                name: userRes[0]?.name ?? userRes[0]?.email ?? `User ${other}`,
                last_message: last ? last.content : null,
                last_at: last ? last.created_at : null,
                unread: unreadRes[0]?.count ?? 0
            };
        }));

        // sort by last_at desc
        threads.sort((a, b) => {
            if (!a.last_at) return 1;
            if (!b.last_at) return -1;
            return new Date(b.last_at) - new Date(a.last_at);
        });

        return Response.json({ ok: true, threads });
    } catch (err) {
        console.error("Threads error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
