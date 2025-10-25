"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/backbutton/BackButton";

export default function JobDetails() {
    const { id } = useParams();
    const router = useRouter();

    const [job, setJob] = useState(null);
    const [jobs, setJobs] = useState([]); // ✅ All jobs list
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch selected job
    useEffect(() => {
        if (!id) return;
        async function fetchJob() {
            try {
                const res = await fetch(`/api/employee/jobs/${id}`);
                const data = await res.json();
                if (res.ok && data.job) {
                    setJob(data.job);
                } else {
                    setError(data.message || "Job not found");
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [id]);

    // ✅ Fetch all jobs for sidebar
    useEffect(() => {
        fetch("/api/employee/jobs")
            .then((res) => res.json())
            .then((data) => setJobs(data.jobs || []));
    }, []);

    if (loading) return <p className="p-8">Loading...</p>;
    if (error) return <p className="p-8 text-red-600">{error}</p>;

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-white to-indigo-50">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* ✅ Job Details (75%) */}
                <div className="lg:col-span-3 bg-white p-6 shadow-md rounded-xl space-y-2">
                    <h1 className="text-2xl font-bold text-indigo-800">{job.title}</h1>
                    <p className="text-gray-600 max-h-64 overflow-y-auto pr-2"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                    ></p>
                    <p><b>Company Name:</b> {job.company_name}</p>
                    <p><b>Location:</b> {job.location}</p>
                    <p><b>Type:</b> {job.type}</p>
                    <p><b>Salary:</b> ₹{job.salary_min} - ₹{job.salary_max}</p>

                    {/* Apply Button */}
                    <button
                        onClick={() => router.push(`/dashboard/employee/jobs/${id}/apply`)}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                    >
                        Apply Now
                    </button>
                </div>

                {/* ✅ Jobs Sidebar (25%) */}
                <div className="lg:col-span-1 bg-white p-4 shadow-md rounded-xl h-fit max-h-[85vh] overflow-y-auto">
                    <h2 className="text-lg font-bold text-indigo-700 mb-4">Other Jobs</h2>
                    <div className="">
                        {jobs.map((j) => (
                            <Link key={j.id} href={`/dashboard/employee/jobs/${j.id}`} className="mb-3 block">
                                <div
                                    className={`p-4 rounded-lg border cursor-pointer transition
                                        ${j.id == id
                                            ? "bg-indigo-100 border-indigo-400"
                                            : "hover:bg-gray-100 border-gray-200"}`}
                                >
                                    <h3 className="font-semibold text-indigo-700">{j.title}</h3>
                                    <p className="text-sm text-gray-600">{j.location}</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        ₹{j.salary_min} - ₹{j.salary_max}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <BackButton />
            </div>
        </div>
    );
}
