"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Job Portal 🚀</h1>

      <p className="mb-6 text-gray-700">
        {session
          ? `Hello, ${session.user?.name || "User"} 👋 You are logged in.`
          : "Please signup or login to continue."}
      </p>

      <div className="flex gap-4">
        {!session ? (
          <>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Signup
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Login
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
