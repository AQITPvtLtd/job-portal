"use client";
import { useEffect, useState } from "react";

const statusColors = {
    pending: "text-yellow-600",
    accepted: "text-green-600",
    shortlisted: "text-blue-600",
    rejected: "text-red-600",
};

export default function ApplicationsPage() {
    const [apps, setApps] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("all");

    useEffect(() => {
        fetch("/api/employee/applications")
            .then((r) => r.json())
            .then((data) => {
                setApps(data.applications || []);
                setFiltered(data.applications || []);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (tab === "all") setFiltered(apps);
        else setFiltered(apps.filter((a) => a.status === tab));
    }, [tab, apps]);

    if (loading) return <p className="p-8">Loading...</p>;

    return (
        <div className="p-8 bg-gradient-to-br from-white to-indigo-50 min-h-screen">
            <h1 className="text-2xl font-bold text-indigo-800 mb-2">
                My Applications
            </h1>
            <p className="text-gray-600 mb-6">
                Total Applications: <span className="font-semibold">{apps.length}</span>
            </p>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                {["all", "pending", "shortlisted", "accepted", "rejected"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setTab(status)}
                        className={`px-3 py-1 rounded-full ${tab === status ? "bg-indigo-600 text-white" : "bg-gray-200"
                            } capitalize`}
                    >
                        {status === "all" ? "All" : status}
                    </button>
                ))}
            </div>

            {/* List */}
            <ul className="space-y-4">
                {filtered.length === 0 ? (
                    <p>No applications found.</p>
                ) : (
                    filtered.map((app) => (
                        <li
                            key={app.id}
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-start"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{app.title}</h2>
                                <p className="text-sm text-gray-600">{app.location}</p>
                                <p className={`text-sm font-medium ${statusColors[app.status]}`}>
                                    {app.status}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Applied on: {new Date(app.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            {/* Placeholder for future features */}
                            {/* <button className="text-blue-600 hover:underline">View Details</button> */}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
