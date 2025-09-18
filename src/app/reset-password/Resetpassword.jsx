"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const token = sp.get("token") || "";
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        if (password !== confirm) {
            setMsg("Passwords do not match");
            return;
        }
        setBusy(true);
        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        setBusy(false);
        if (data.ok) {
            router.push("/login");
        } else {
            setMsg(data.message || "Something went wrong");
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Set New Password</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    type="password"
                    required
                    className="w-full border p-3 rounded"
                    placeholder="New password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    required
                    className="w-full border p-3 rounded"
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
                <button disabled={busy} className="w-full bg-black text-white p-3 rounded cursor-pointer">
                    {busy ? "Updating..." : "Update Password"}
                </button>
                {msg && <p className="text-red-600">{msg}</p>}
            </form>
        </div>
    );
}
