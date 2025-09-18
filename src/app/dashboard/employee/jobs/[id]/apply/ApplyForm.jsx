"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyForm({ jobId }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        resume: null,
        coverLetter: "",
        experience: "",
        skills: "",
        confirm: false,
    });
    const [status, setStatus] = useState(null);
    const router = useRouter();

    function handleChange(e) {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : files ? files[0] : value,
        });
    }

    async function handleSubmit() {
        const body = new FormData();
        body.append("job_id", jobId);
        Object.entries(formData).forEach(([key, value]) => body.append(key, value));

        try {
            const res = await fetch(`/api/employee/jobs/${jobId}/apply`, {
                method: "POST",
                body,
            });
            const data = await res.json();
            if (res.ok) {
                setStatus("✅ Application submitted!");
                setTimeout(() => router.push("/dashboard/employee/jobs"), 2000);
            } else {
                setStatus(`❌ ${data.message}`);
            }
        } catch {
            setStatus("❌ Something went wrong");
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto mt-6">
            {step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-4">Step 1: Personal Info</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full border p-2 mb-3 rounded"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border p-2 mb-3 rounded"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="w-full border p-2 mb-3 rounded"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <textarea
                        name="address"
                        placeholder="Address"
                        className="w-full border p-2 mb-3 rounded"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <button
                        onClick={() => setStep(2)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Next →
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <h2 className="text-xl font-bold mb-4">Step 2: Professional Info</h2>
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        className="w-full mb-3"
                        onChange={handleChange}
                    />
                    <textarea
                        name="coverLetter"
                        placeholder="Cover Letter"
                        className="w-full border p-2 mb-3 rounded"
                        value={formData.coverLetter}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="experience"
                        placeholder="Experience (years)"
                        className="w-full border p-2 mb-3 rounded"
                        value={formData.experience}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="skills"
                        placeholder="Skills (comma separated)"
                        className="w-full border p-2 mb-3 rounded"
                        value={formData.skills}
                        onChange={handleChange}
                    />
                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(1)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            ← Back
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <h2 className="text-xl font-bold mb-4">Step 3: Confirmation</h2>
                    <p className="mb-2">✅ Please review your details before submit.</p>
                    <label className="flex items-center space-x-2 mb-3">
                        <input
                            type="checkbox"
                            name="confirm"
                            checked={formData.confirm}
                            onChange={handleChange}
                        />
                        <span>I confirm all details are correct</span>
                    </label>
                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(2)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            ← Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.confirm}
                            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </>
            )}

            {status && <p className="mt-4 text-center text-green-700">{status}</p>}
        </div>
    );
}
