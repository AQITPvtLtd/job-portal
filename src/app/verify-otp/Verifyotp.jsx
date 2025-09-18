"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyOtpPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const emailFromQS = sp.get("email") || "";
    const [email, setEmail] = useState(emailFromQS);
    const [otp, setOtp] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => setEmail(emailFromQS), [emailFromQS]);

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true); setMsg("");
        const res = await fetch("/api/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        setBusy(false);
        if (data.ok && data.token) {
            router.push(`/reset-password?token=${encodeURIComponent(data.token)}`);
        } else {
            setMsg(data.message || "Invalid code");
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    type="email"
                    required
                    className="w-full border p-3 rounded"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={6}
                    required
                    className="w-full border p-3 rounded tracking-widest text-center"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
                <button disabled={busy} className="w-full bg-black text-white p-3 rounded cursor-pointer">
                    {busy ? "Verifying..." : "Verify"}
                </button>
                {msg && <p className="text-red-600">{msg}</p>}
            </form>
        </div>
    );
}
