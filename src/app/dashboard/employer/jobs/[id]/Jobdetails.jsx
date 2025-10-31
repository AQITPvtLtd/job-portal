"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    Briefcase,
    MapPin,
    ClipboardList,
    User,
    Mail,
    FileText,
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import BackButton from "@/components/backbutton/BackButton";
export default function JobDetails() {
    const { id: jobId } = useParams();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [msg, setMsg] = useState("");
    const router = useRouter();

    async function load() {
        try {
            const res = await fetch(`/api/employer/jobs/${jobId}`);
            const data = await res.json();
            if (!data.ok) {
                setMsg(data.message || "Error loading job");
                return;
            }
            setJob(data.job);
            setApplicants(data.applicants || []);
        } catch (err) {
            setMsg("Something went wrong!");
        }
    }

    useEffect(() => {
        load();
    }, [jobId]);

    async function updateStatus(appId, status) {
        const res = await fetch(`/api/employer/applications/${appId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        const d = await res.json();
        if (d.ok) load();
        else setMsg(d.message || "Error updating status");
    }

    if (!job) return <div className="p-8 text-gray-500">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                {/* Job Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                            {job.title}
                        </h2>
                        <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" /> {job.location} •{" "}
                            {job.type}
                        </p>
                    </div>

                    <div>
                        <span
                            className={`px-4 py-1 text-sm font-semibold rounded-full ${new Date(job.expires_at) > new Date()
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {new Date(job.expires_at) > new Date() ? "Active" : "Expired"}
                        </span>
                    </div>
                </div>

                {/* Job Description */}
                <div className="bg-gray-50 border rounded-lg p-4 mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <ClipboardList className="w-5 h-5 text-indigo-500" /> Job Description
                    </h3>
                    <div
                        className="text-gray-700 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto pr-2"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                </div>


                {/* Applicants Section */}
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                        <User className="w-6 h-6 text-indigo-600" /> Applicants (
                        {applicants.length})
                    </h3>
                </div>

                {msg && <p className="text-red-500 mb-3">{msg}</p>}

                {applicants.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {applicants.map((a) => (
                            <div
                                key={a.id}
                                className="border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all"
                            >
                                {/* Applicant Info */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            {a.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <Mail className="w-4 h-4 text-gray-400" /> {a.email}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${a.status === "reviewing"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : a.status === "interview"
                                                ? "bg-blue-100 text-blue-700"
                                                : a.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {a.status || "Pending"}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => updateStatus(a.id, "reviewing")}
                                        className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-200 transition"
                                    >
                                        <Clock className="w-4 h-4" /> Review
                                    </button>

                                    <button
                                        onClick={() => updateStatus(a.id, "interview")}
                                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Interview
                                    </button>

                                    <button
                                        onClick={() => updateStatus(a.id, "rejected")}
                                        className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>

                                    <Link
                                        href={`/dashboard/messages`}
                                        className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                    >
                                        <MessageSquare className="w-4 h-4" /> Message
                                    </Link>

                                    {/* Resume */}
                                    {a.resume_url && a.resume_url.startsWith("/") ? (
                                        <Link
                                            href={a.resume_url}
                                            target="_blank"
                                            className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
                                        >
                                            <FileText className="w-4 h-4" /> Resume
                                        </Link>
                                    ) : a.resume_url ? (
                                        <Link
                                            href={a.resume_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
                                        >
                                            <FileText className="w-4 h-4" /> Resume
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <User className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg">
                            No applicants have applied for this job yet.
                        </p>
                    </div>
                )}
            </div>
            <div className="mt-5 lg:ml-24">
                <BackButton />
            </div>
        </div>
    );
}
