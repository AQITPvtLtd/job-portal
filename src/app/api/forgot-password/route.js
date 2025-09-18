import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "@/lib/mailer";

function generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

export async function POST(req) {
    try {
        const { email } = await req.json();
        if (!email) {
            return Response.json({ ok: false, message: "Email is required" }, { status: 400 });
        }

        // user fetch
        const [users] = await db.execute("SELECT id, email FROM users WHERE email = ? LIMIT 1", [email]);
        if (users.length === 0) {
            return Response.json({ ok: false, message: "This email is not registered" }, { status: 404 });
        }

        const user = users[0];
        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);

        // 10 minute expiry
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await db.execute(
            "INSERT INTO password_reset_requests (user_id, otp_hash, expires_at, consumed) VALUES (?, ?, ?, 0)",
            [user.id, otpHash, expiresAt]
        );

        await sendOTPEmail(email, otp);

        return Response.json({ ok: true, message: "OTP has been sent to your email" });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
