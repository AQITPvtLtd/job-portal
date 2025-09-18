"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json" },
        });
        if (res.ok) router.push("/login");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
            >
                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Create an Account
                </h2>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        placeholder="Enter your email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>
                {/* Role Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Role
                    </label>
                    <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="employer">Employer</option>
                        <option value="employee">Employee</option>
                    </select>

                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        placeholder="Enter your password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                    Sign Up
                </button>

                {/* Already have account */}
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login here
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
