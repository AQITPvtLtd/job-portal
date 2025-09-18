"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import NotificationsBell from "./NotificationsBell";
export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white shadow-md">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold tracking-wide">
                MyApp
            </Link>

            <div className="flex items-center gap-6">
                {session && <NotificationsBell />} {/* ✅ Show only if logged in */}

                {session ? (
                    <>
                        {/* User Info */}
                        <span className="font-medium">
                            Hi, {session.user?.name || session.user?.email}
                        </span>

                        {/* Logout Button */}
                        <button
                            onClick={() => signOut()}
                            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                        >
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
