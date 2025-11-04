"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Building2, Clock } from "lucide-react";

export default function JobDetailsPanel({ jobId, onBack }) {
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jobId) return;
        fetchJobDetails();
    }, [jobId]);

    async function fetchJobDetails() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/employee/jobs/${jobId}`);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!job) return null;

    return (
        <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={onBack}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Building2 size={32} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        <p className="text-gray-600">{job.company_name || "Unknown Company"}</p>
                    </div>
                </div>

                {/* Job Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Briefcase size={16} />
                        {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                        <DollarSign size={16} />
                        ₹{job.salary_min} - ₹{job.salary_max}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={16} />
                        Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    {/* Job Description */}
                    <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                        <div
                            className="text-gray-700 prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </section>

                    {/* Additional Info */}
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600 mb-1">Job Type</p>
                                <p className="font-medium text-gray-900">{job.type}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 mb-1">Salary Range</p>
                                <p className="font-medium text-gray-900">₹{job.salary_min} - ₹{job.salary_max}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 mb-1">Location</p>
                                <p className="font-medium text-gray-900">{job.location}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 mb-1">Company</p>
                                <p className="font-medium text-gray-900">{job.company_name || "N/A"}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Apply Button (Sticky Footer) */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <button
                    onClick={() => router.push(`/dashboard/employee/jobs/${job.id}/apply`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                    Apply for this job
                </button>
            </div>
        </>
    );
}