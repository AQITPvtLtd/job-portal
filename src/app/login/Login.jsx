"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
        });

        if (result?.error) {
            setError("Invalid email or password");
        } else {
            // Get session to check role
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();

            if (session?.user?.role === "employer") {
                router.push("/dashboard/employer");
            } else if (session?.user?.role === "employee") {
                router.push("/dashboard/employee");
            } else {
                router.push("/dashboard"); // fallback
            }
        }
    }

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded cursor-pointer"
                >
                    Login with Credentials
                </button>

                <button
                    type="button"
                    className="text-red-400 p-2 rounded cursor-pointer"
                    onClick={() => router.push("/forgot-password")}
                >
                    Forgotten password?
                </button>
            </form>

            <div className="flex items-center gap-2 my-3">
                <hr className="flex-grow border-gray-300" />
                <span className="text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-300" />
            </div>

            <button
                onClick={() =>
                    signIn("github", { callbackUrl: "/dashboard" })
                }
                className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded cursor-pointer"
            >
                Continue with GitHub
            </button>

            <button
                onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                }
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded cursor-pointer"
            >
                Continue with Google
            </button>
        </div>
    );
}
