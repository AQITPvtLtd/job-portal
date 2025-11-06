"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    Building2,
    Briefcase,
    GraduationCap,
    FileText,
    Copy,
    Check
} from "lucide-react";

export default function JobDetailsPanel({ jobId, onBack }) {
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

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

    const copyJobLink = () => {
        const jobUrl = `${window.location.origin}/dashboard/employee/jobs/${jobId}`;
        navigator.clipboard.writeText(jobUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
        <div className="h-full flex flex-col bg-white">
            {/* Mobile Back Button - Sticky */}
            <div className="md:hidden p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                    <ArrowLeft size={20} />
                    <span>Back to jobs</span>
                </button>
            </div>

            {/* Sticky Header Section */}
            <div className="bg-white border-b border-gray-200 sticky top-0 md:top-0 z-10 shadow-sm">
                <div className="p-6 md:p-8">
                    {/* Job Title */}
                    <h1 className="text-2xl md:text-2xl font-bold text-gray-900">
                        {job.title}
                    </h1>

                    {/* Company Name */}
                    <div className="flex items-center gap-2 text-base text-gray-700">
                        <Building2 size={18} />
                        <span className="font-medium">{job.company_name || "Company Name"}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 text-base">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                    </div>

                    {/* Salary Range */}
                    <div className="text-lg font-semibold text-gray-900 mb-3">
                        ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()} a month
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push(`/dashboard/employee/jobs/${job.id}/apply`)}
                            className="flex-1 cursor-pointer bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Apply now
                        </button>
                        <button
                            onClick={copyJobLink}
                            className="p-3 dark:text-black border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            title="Copy job link"
                        >
                            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8">
                    {/* Job Details Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job details</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Briefcase size={20} className="text-gray-600 mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-900">Job type</p>
                                    <p className="text-gray-700 capitalize">{job.type}</p>
                                </div>
                            </div>
                            {job.experience_required && (
                                <div className="flex items-start gap-3">
                                    <FileText size={20} className="text-gray-600 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Experience required</p>
                                        <p className="text-gray-700">{job.experience_required}</p>
                                    </div>
                                </div>
                            )}
                            {job.education_level && (
                                <div className="flex items-start gap-3">
                                    <GraduationCap size={20} className="text-gray-600 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Education</p>
                                        <p className="text-gray-700">{job.education_level}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Location Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
                        <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={18} />
                            <span>{job.location}</span>
                        </div>
                    </section>

                    {/* Benefits Section (if available) */}
                    {job.benefits && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Benefits</h2>
                            <div className="text-gray-700 whitespace-pre-line">
                                {job.benefits}
                            </div>
                        </section>
                    )}

                    {/* Skills Section */}
                    {job.skills && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.split(',').map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Full Job Description */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Full job description</h2>
                        <div
                            className="text-gray-700 leading-relaxed prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}