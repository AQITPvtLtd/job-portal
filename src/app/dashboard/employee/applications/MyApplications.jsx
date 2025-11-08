"use client";
import BackButton from "@/components/backbutton/BackButton";
import { useEffect, useState } from "react";
import { Briefcase, MapPin, Calendar } from "lucide-react";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    shortlisted: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
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

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600 text-lg animate-pulse">Loading applications...</p>
            </div>
        );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-gray-600">
                        Total Applications:{" "}
                        <span className="font-semibold text-indigo-600">{apps.length}</span>
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {["all", "pending", "shortlisted", "accepted", "rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setTab(status)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                                ${tab === status
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "bg-white text-gray-700 border hover:bg-gray-100"
                                }`}
                        >
                            {status === "all"
                                ? "All"
                                : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow">
                        No applications found.
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {filtered.map((app) => (
                            <li
                                key={app.id}
                                className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Briefcase size={18} className="text-indigo-500" />
                                            {app.title}
                                        </h2>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <MapPin size={14} /> {app.location || "Location not specified"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status]
                                                    }`}
                                            >
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />{" "}
                                                Applied on {new Date(app.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="text-indigo-600 text-sm font-medium hover:underline">
                                        View Details
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-10">
                    <BackButton />
                </div>
            </div>
        </div>
    );
}
