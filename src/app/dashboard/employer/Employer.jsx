"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Stats from "./stats/Stats";

const Employer = () => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/employer/jobs");
        const data = await res.json();
        if (res.ok) {
          setTotalJobs(data.jobs.length);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-white to-indigo-50">
      {/* <h1 className="text-3xl font-bold text-indigo-800 mb-6">Employer Dashboard</h1> */}
      <Stats />
      <div className="grid md:grid-cols-2 gap-6">
        {/* Post Job Card */}
        <Link href="/dashboard/employer/jobs/new">
          <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition cursor-pointer">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">Post a New Job</h2>
            <p className="text-gray-600">
              Create and publish a new job posting to find candidates.
            </p>
          </div>
        </Link>

        {/* Total Jobs Card */}
        <Link href="/dashboard/employer/jobs">
          <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition cursor-pointer">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">My Job Posts</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <p className="text-gray-600">
                You have posted <span className="font-bold">{totalJobs}</span> jobs.
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Employer;
