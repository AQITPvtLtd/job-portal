import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req) {
    try {
        const { email, otp } = await req.json();
        if (!email || !otp) {
            return Response.json({ ok: false, message: "Email and OTP are required" }, { status: 400 });
        }

        const [users] = await db.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
        if (users.length === 0) {
            return Response.json({ ok: false, message: "Invalid email" }, { status: 400 });
        }

        const userId = users[0].id;

        // latest OTP request
        const [rows] = await db.execute(
            `SELECT id, otp_hash, expires_at, consumed
             FROM password_reset_requests
             WHERE user_id = ? AND consumed = 0
             ORDER BY id DESC
             LIMIT 1`,
            [userId]
        );

        if (rows.length === 0) {
            return Response.json({ ok: false, message: "Code expired or not found" }, { status: 400 });
        }

        const pr = rows[0];

        if (new Date(pr.expires_at).getTime() < Date.now()) {
            return Response.json({ ok: false, message: "Code expired" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(String(otp), pr.otp_hash);
        if (!isMatch) {
            return Response.json({ ok: false, message: "Invalid code" }, { status: 400 });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        await db.execute(
            "UPDATE password_reset_requests SET reset_token = ? WHERE id = ?",
            [resetToken, pr.id]
        );

        return Response.json({ ok: true, token: resetToken });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
