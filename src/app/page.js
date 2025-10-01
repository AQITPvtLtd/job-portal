"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const userRole = session?.user?.role;
  const dashboardLink =
    userRole === "employer"
      ? "/dashboard/employer"
      : userRole === "employee"
        ? "/dashboard/employee"
        : "/dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
          🚀 Welcome to Job Portal
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl">
          Your trusted platform to connect talented employees with top
          employers. Find your dream job or hire the best talent today.
        </p>

        <div className="flex justify-center gap-4">
          {!session ? (
            <>
              <Link
                href="/signup"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Signup
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              href={dashboardLink}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-6 bg-white shadow-inner">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">About Us</h2>
          <p className="text-gray-600 text-lg">
            Job Portal is designed to make hiring and job searching effortless.
            We bridge the gap between employers and employees by providing a
            user-friendly, reliable, and secure platform.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-10">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                🔎 Verified Jobs
              </h3>
              <p className="text-gray-600">
                All jobs listed on our portal are verified for authenticity.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                🤝 Easy Hiring
              </h3>
              <p className="text-gray-600">
                Employers can post jobs easily and hire top talent quickly.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                📈 Career Growth
              </h3>
              <p className="text-gray-600">
                Employees can explore a wide range of opportunities for career
                advancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 bg-indigo-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-700 mb-3">
              🎯 Our Mission
            </h3>
            <p className="text-gray-600">
              To empower professionals and businesses by connecting them through
              a reliable and accessible job marketplace.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-700 mb-3">
              🌍 Our Vision
            </h3>
            <p className="text-gray-600">
              To become the most trusted global platform for career growth and
              hiring solutions.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="p-5 bg-white shadow rounded-lg">
              <h4 className="text-lg font-semibold text-indigo-600">
                1. Is it free to create an account?
              </h4>
              <p className="text-gray-600 mt-2">
                Yes, creating an account is completely free for both employers
                and employees.
              </p>
            </div>
            <div className="p-5 bg-white shadow rounded-lg">
              <h4 className="text-lg font-semibold text-indigo-600">
                2. How do I apply for a job?
              </h4>
              <p className="text-gray-600 mt-2">
                After logging in as an employee, browse jobs and click on apply.
              </p>
            </div>
            <div className="p-5 bg-white shadow rounded-lg">
              <h4 className="text-lg font-semibold text-indigo-600">
                3. Can employers post unlimited jobs?
              </h4>
              <p className="text-gray-600 mt-2">
                Employers can post jobs based on their subscription plan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
