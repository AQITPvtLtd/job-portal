"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    // Handle next step with field validation
    const nextStep = () => {
        setError(""); // reset error before checking

        if (step === 1) {
            if (!form.name || !form.email) {
                setError("Please fill in all fields before continuing.");
                return;
            }
        }

        if (step === 2) {
            if (!form.phone || !form.role) {
                setError("Please fill in all fields before continuing.");
                return;
            }
        }

        setStep(step + 1);
    };

    // Handle previous step
    const prevStep = () => {
        setError("");
        setStep(step - 1);
    };

    // Handle final submit
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Check all required fields
        if (!form.name || !form.email || !form.phone || !form.role || !form.password || !form.confirmPassword) {
            setError("Please fill in all fields before submitting.");
            return;
        }

        // Check password match
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            router.push("/login");
        } else {
            setError("Something went wrong. Try again!");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-100"
            >
                <h2 className="text-3xl font-bold text-center text-blue-700">
                    Create your Account
                </h2>

                {/* STEP 1: Name + Email */}
                {step === 1 && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full dark:text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full dark:text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm font-medium text-center">
                                {error}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={nextStep}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Continue
                        </button>
                    </>
                )}

                {/* STEP 2: Phone + Role */}
                {step === 2 && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full dark:text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Role
                            </label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full dark:text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            >
                                <option value="">Select your role</option>
                                <option value="employer">Employer</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm font-medium text-center">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="text-gray-500 hover:underline"
                            >
                                ← Back
                            </button>

                            <button
                                type="button"
                                onClick={nextStep}
                                className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* STEP 3: Password + Confirm Password */}
                {step === 3 && (
                    <>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full dark:text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    setForm({ ...form, confirmPassword: e.target.value })
                                }
                                className="w-full dark:text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm font-medium text-center">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="text-gray-500 hover:underline"
                            >
                                ← Back
                            </button>

                            <button
                                type="submit"
                                className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                Create Account
                            </button>
                        </div>
                    </>
                )}

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
}
