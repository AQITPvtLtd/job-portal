"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
        });

        if (result?.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();

            if (session?.user?.role === "employer") {
                router.push("/dashboard/employer");
            } else if (session?.user?.role === "employee") {
                router.push("/dashboard/employee/jobs");
            } else {
                router.push("/dashboard");
            }
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="max-w-md">
                        {/* Vector Illustration */}
                        <div className="mb-8">
                            <Image
                                src="/login/login.png"
                                alt="Login Illustration"
                                width={400}
                                height={400}
                                className="w-full h-auto drop-shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Text Content */}
                        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                        <p className="text-lg text-blue-100 mb-6">
                            Sign in to access your dashboard and manage your profile with ease.
                        </p>

                        {/* Features */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-blue-50">Secure and encrypted login</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-blue-50">Access from anywhere</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-blue-50">24/7 support available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Logo for Mobile */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <Lock className="text-white" size={32} />
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                            <p className="text-gray-500">Enter your credentials to continue</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full dark:text-black pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full dark:text-black pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => router.push("/forgot-password")}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl cursor-pointer text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Log In</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-gray-400 text-sm font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3">
                            {/* <button
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                className="w-full py-3.5 border-2 cursor-pointer border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M5.27,9.76C6.2,6.94,8.85,4.91,12,4.91c1.69,0,3.22.6,4.42,1.58L19.91,3C17.78,1.15,15.05,0,12,0,7.27,0,3.2,2.7,1.24,6.65L5.27,9.76z" />
                                    <path fill="#34A853" d="M16.04,18.01C14.95,18.72,13.57,19.09,12,19.09c-3.13,0-5.78-2.01-6.73-4.82L1.24,17.33C3.19,21.29,7.27,24,12,24c2.93,0,5.74-1.04,7.83-3L16.04,18.01z" />
                                    <path fill="#4A90E2" d="M19.83,21C22.03,18.95,23.45,15.9,23.45,12c0-.71-.09-1.47-.25-2.18H12v4.64h6.44c-.32,1.56-1.17,2.77-2.4,3.56L19.83,21z" />
                                    <path fill="#FBBC05" d="M5.28,14.27c-.24-.71-.37-1.47-.37-2.27s.13-1.56.37-2.27L1.24,6.65C.44,8.26,0,10.08,0,12s.44,3.73,1.24,5.33L5.28,14.27z" />
                                </svg>
                                <span className="font-semibold text-gray-700">Continue with Google</span>
                            </button> */}

                            {/* <button
                                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                                className="w-full py-3.5 cursor-pointer border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,0C5.37,0,0,5.37,0,12c0,5.31,3.44,9.8,8.21,11.39.6.11.82-.26.82-.57,0-.29-.01-1.23-.01-2.24-3.02.56-3.8-.74-4.04-1.41-.14-.35-.72-1.41-1.23-1.7-.42-.23-1.02-.78-.02-.8.95-.02,1.62.87,1.85,1.23,1.08,1.82,2.81,1.31,3.5.99.11-.78.42-1.31.77-1.61-2.67-.3-5.46-1.34-5.46-5.93,0-1.31.47-2.39,1.23-3.23-.12-.3-.54-1.53.12-3.18,0,0,1.01-.32,3.3,1.23.96-.27,1.98-.41,3-.41s2.04.14,3,.41c2.29-1.56,3.3-1.23,3.3-1.23.66,1.65.24,2.88.12,3.18.77.84,1.23,1.91,1.23,3.23,0,4.61-2.81,5.63-5.48,5.93.43.38.81,1.1.81,2.22,0,1.61-.01,2.9-.01,3.3,0,.32.23.69.82.57A12.02,12.02,0,0,0,24,12C24,5.37,18.63,0,12,0Z" />
                                </svg>
                                <span className="font-semibold text-gray-700">Continue with GitHub</span>
                            </button> */}
                        </div>

                        {/* Sign Up */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <button
                                    onClick={() => router.push("/signup")}
                                    className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                                >
                                    Sign up now
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}