"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const New = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        type: "full-time",
        salary_min: "",
        salary_max: "",
        expires_at: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        setLoading(true);
        try {
            const res = await fetch("/api/employer/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.ok) {
                router.push("/dashboard/employer/jobs");
            } else {
                setMsg(data.message || "Error creating job");
            }
        } catch (err) {
            setMsg("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-indigo-700 mb-6">
                    🚀 Post a New Job
                </h2>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Job Title *
                        </label>
                        <input
                            required
                            placeholder="e.g. Software Engineer"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Job Description *
                        </label>
                        <textarea
                            placeholder="Describe the role, responsibilities, and requirements..."
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full border rounded-lg p-3 h-32 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Location *
                        </label>
                        <input
                            placeholder="e.g. Bangalore, India"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    {/* Job Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Job Type *
                        </label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>

                    {/* Salary Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Salary Range (per month)
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                placeholder="Min"
                                value={form.salary_min}
                                onChange={(e) =>
                                    setForm({ ...form, salary_min: e.target.value })
                                }
                                className="w-1/2 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={form.salary_max}
                                onChange={(e) =>
                                    setForm({ ...form, salary_max: e.target.value })
                                }
                                className="w-1/2 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Application Deadline *
                        </label>
                        <input
                            type="date"
                            value={form.expires_at}
                            onChange={(e) =>
                                setForm({ ...form, expires_at: e.target.value })
                            }
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-between items-center">
                        {msg && <p className="text-red-500 text-sm">{msg}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition cursor-pointer"
                        >
                            {loading ? "Creating..." : "Create Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default New;
