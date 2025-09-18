"use client";
import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

const Stats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("/api/employer/stats")
            .then(res => res.json())
            .then(data => {
                console.log("API Response:", data);
                if (data.ok) setStats(data);
            });
    }, []);

    if (!stats) return <p className="p-8">Loading...</p>;

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Employer Dashboard</h1>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Total Jobs</h2>
                    <p className="text-2xl font-bold text-indigo-600">{stats.totalJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Active Jobs</h2>
                    <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Total Applicants</h2>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalApplicants}</p>
                </div>
            </div>

            {/* Grid for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4 text-indigo-700">Applicants by Job</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.applicantsByJob}>
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4 text-indigo-700">Job Types</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.jobTypes}
                                dataKey="count"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {stats.jobTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 text-indigo-700">Applicants Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.applicantsPerMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Stats;
