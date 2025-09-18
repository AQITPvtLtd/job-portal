// src/app/dashboard/employer/jobs/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function JobsList() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch("/api/employer/jobs").then(r => r.json()).then(d => { if (d.ok) setJobs(d.jobs) });
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Jobs</h2>
                <Link href="/dashboard/employer/jobs/new" className="bg-green-600 text-white px-3 py-1 rounded">Post Job</Link>
            </div>

            <ul className="space-y-4">
                {jobs.map(job => (
                    <li key={job.id} className="border p-4 rounded">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                        <div className="mt-2">
                            <Link href={`/dashboard/employer/jobs/${job.id}`} className="text-blue-600">View applicants</Link>
                        </div>
                    </li>
                ))}
                {jobs.length === 0 && <p className="text-gray-500">No jobs yet.</p>}
            </ul>
        </div>
    );
}
