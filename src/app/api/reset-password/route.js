import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { token, password } = await req.json();
        if (!token || !password) {
            return Response.json({ ok: false, message: "Token and password are required" }, { status: 400 });
        }
        if (password.length < 6) {
            return Response.json({ ok: false, message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const [rows] = await db.execute(
            `SELECT id, user_id, expires_at, consumed
             FROM password_reset_requests
             WHERE reset_token = ?
             LIMIT 1`,
            [token]
        );

        if (rows.length === 0) {
            return Response.json({ ok: false, message: "Invalid or used token" }, { status: 400 });
        }

        const pr = rows[0];

        if (pr.consumed === 1 || new Date(pr.expires_at).getTime() < Date.now()) {
            return Response.json({ ok: false, message: "Token expired" }, { status: 400 });
        }

        // Hash new password
        const hash = await bcrypt.hash(password, 10);

        // Update user password
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [hash, pr.user_id]);

        // Mark token as used
        await db.execute(
            "UPDATE password_reset_requests SET consumed = 1 WHERE id = ?",
            [pr.id]
        );

        return Response.json({ ok: true, message: "Password updated. You can log in now." });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
