"use client";
import Link from "next/link";

export default function EmployeeDashboard() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">
        🎉 Welcome Employee Dashboard
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/dashboard/employee/jobs">
          <div className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-indigo-700">
              🔍 Browse Jobs
            </h2>
            <p className="text-gray-600 mt-2">
              Explore all published jobs and apply easily.
            </p>
          </div>
        </Link>

        <Link href="/dashboard/employee/applications">
          <div className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold text-indigo-700">
              📄 My Applications
            </h2>
            <p className="text-gray-600 mt-2">
              Track jobs you’ve applied for.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
