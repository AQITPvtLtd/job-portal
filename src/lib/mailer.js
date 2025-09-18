import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465, // 465 -> true
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOTPEmail(to, otp) {
    const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Password Reset Code</h2>
      <p>Your 6-digit OTP is:</p>
      <div style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</div>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `;
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: "Your password reset code",
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
        html,
    });
}
