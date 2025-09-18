"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        fetch("/api/employee/jobs")
            .then((res) => res.json())
            .then((data) => {
                setJobs(data.jobs || []);
                setFilteredJobs(data.jobs || []);
            });
    }, []);

    const handleFilter = () => {
        let results = jobs;

        if (search.trim() !== "") {
            results = results.filter((job) =>
                job.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (location.trim() !== "") {
            results = results.filter((job) =>
                job.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        setFilteredJobs(results);
    };

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-white to-indigo-50">
            <h1 className="text-2xl font-bold text-indigo-800 mb-6">Available Jobs</h1>

            {/* 🔍 Search Bar */}
            <div className="mb-8 flex items-center w-full max-w-3xl bg-white rounded-full shadow-md border overflow-hidden">
                {/* Job Title Input */}
                <div className="flex items-center flex-1 px-4 border-r">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Job title"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full py-2 outline-none"
                    />
                </div>

                {/* Location Input */}
                <div className="flex items-center flex-1 px-4">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="City, state"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full py-2 outline-none"
                    />
                </div>

                {/* Find Jobs Button */}
                <button
                    onClick={handleFilter}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-r-full"
                >
                    Find Jobs
                </button>
            </div>

            {/* Job Listings */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <Link key={job.id} href={`/dashboard/employee/jobs/${job.id}`}>
                            <div className="p-6 bg-white shadow rounded-xl hover:shadow-xl transition cursor-pointer">
                                <h2 className="text-lg font-semibold text-indigo-700">
                                    {job.title}
                                </h2>
                                <p className="text-gray-600 mt-1">{job.location}</p>
                                <span className="mt-2 inline-block px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
                                    {job.type}
                                </span>
                                <p className="mt-2 text-gray-700 font-medium">
                                    ₹{job.salary_min} - ₹{job.salary_max}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-600">No jobs found matching your filters.</p>
                )}
            </div>
        </div>
    );
}
