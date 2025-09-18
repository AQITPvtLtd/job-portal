"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("error"); // new: "error" or "success"
    const router = useRouter();

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);
        setMsg("");

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            setBusy(false);

            if (data.ok) {
                setMsgType("success");
                setMsg(data.message);
                // ✅ 2s delay ke baad redirect, taaki user message dekh sake
                setTimeout(() => {
                    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
                }, 2000);
            } else {
                setMsgType("error");
                setMsg(data.message || "Something went wrong");
            }
        } catch (err) {
            setBusy(false);
            setMsgType("error");
            setMsg("Network error, please try again");
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    type="email"
                    required
                    className="w-full border p-3 rounded"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    disabled={busy}
                    className="w-full bg-black text-white p-3 rounded cursor-pointer disabled:opacity-50"
                >
                    {busy ? "Sending..." : "Send OTP"}
                </button>

                {msg && (
                    <p className={msgType === "error" ? "text-red-600" : "text-green-600"}>
                        {msg}
                    </p>
                )}
            </form>
        </div>
    );
}
