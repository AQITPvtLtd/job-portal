// src/app/dashboard/employer/jobs/[id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function JobDetails() {
    const params = useParams();
    const jobId = params.id;
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [msg, setMsg] = useState("");
    const router = useRouter();

    async function load() {
        const res = await fetch(`/api/employer/jobs/${jobId}`);
        const data = await res.json();
        if (!data.ok) {
            setMsg(data.message || "Error");
            return;
        }
        setJob(data.job);
        setApplicants(data.applicants || []);
    }

    useEffect(() => { load(); }, [jobId]);

    async function updateStatus(appId, status) {
        const res = await fetch(`/api/employer/applications/${appId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        const d = await res.json();
        if (d.ok) load();
        else setMsg(d.message || "Error");
    }

    if (!job) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
            <p className="mt-4">{job.description}</p>

            <h3 className="mt-6 text-xl font-semibold">Applicants</h3>
            {msg && <p className="text-red-500">{msg}</p>}
            <table className="w-full mt-3 border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.map(a => (
                        <tr key={a.id} className="border-t">
                            <td className="p-2">{a.name}</td>
                            <td className="p-2">{a.email}</td>
                            <td className="p-2">{a.status}</td>
                            <td className="p-2 space-x-2">
                                <button onClick={() => updateStatus(a.id, "reviewing")} className="px-2 py-1 bg-yellow-400 rounded">Review</button>
                                <button onClick={() => updateStatus(a.id, "interview")} className="px-2 py-1 bg-blue-500 text-white rounded">Interview</button>
                                <button onClick={() => updateStatus(a.id, "rejected")} className="px-2 py-1 bg-red-500 text-white rounded">Reject</button>
                                <button onClick={() => router.push(`/dashboard/messages/${a.employee_id}`)} className="px-2 py-1 bg-indigo-600 text-white rounded">
                                    Message
                                </button>
                                <a href={a.resume_url || "#"} target="_blank" rel="noreferrer" className="ml-2 text-sm text-blue-600">Resume</a>
                            </td>
                        </tr>
                    ))}
                    {applicants.length === 0 && <tr><td colSpan="4" className="p-4 text-gray-500">No applicants yet</td></tr>}
                </tbody>
            </table>
        </div>
    );
}
