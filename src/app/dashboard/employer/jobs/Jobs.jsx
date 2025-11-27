"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Briefcase,
    MapPin,
    Users,
    Eye,
    CalendarDays,
    Pencil,
    PlusCircle,
} from "lucide-react";
import BackButton from "@/components/backbutton/BackButton";

export default function JobsList() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch("/api/employer/jobs")
            .then((r) => r.json())
            .then((d) => {
                if (d.ok) setJobs(d.jobs);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
                    <div>
                        <h2 className="text-3xl font-bold text-indigo-700">
                            💼 My Job Listings
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage all jobs you’ve posted and track applicants easily.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/employer/jobs/new"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Post New Job
                    </Link>
                </div>

                {/* Job List */}
                {jobs.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="relative border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white/70 backdrop-blur-sm"
                            >
                                {/* Title and Status */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-indigo-600" />
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {job.location} • {job.type}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${new Date(job.expires_at) > new Date()
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {new Date(job.expires_at) > new Date()
                                            ? "Active"
                                            : "Expired"}
                                    </span>
                                </div>

                                {/* Job Info */}
                                <div className="flex items-center justify-between text-sm text-gray-600 mt-4 border-t pt-3">
                                    {/* <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-indigo-500" />
                                        <span>{job.applicants_count || 0} applicants</span>
                                    </div> */}
                                    <div className="flex items-center gap-2">
                                       <Link href={`/dashboard/employer/jobs/${job.job_id}`} className="text-indigo-600 font-medium hover:underline">View Applicants</Link>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-gray-400" />
                                        <span>
                                            {new Date(job.created_at).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    {/* <div className="flex justify-between items-center mt-5">
                                        <Link href={`/dashboard/employer/jobs/${job.job_id}`} className="text-indigo-600 font-medium hover:underline">View Applicants</Link>
                                    </div> */}
                                </div>


                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Briefcase className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg">You haven’t posted any jobs yet.</p>
                        <Link
                            href="/dashboard/employer/jobs/new"
                            className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                        >
                            Post Your First Job
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-5 lg:ml-24">
                <BackButton />
            </div>
        </div>
    );
}
