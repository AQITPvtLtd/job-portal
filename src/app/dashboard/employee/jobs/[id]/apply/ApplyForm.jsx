"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/backbutton/BackButton";
export default function ApplyForm({ jobId }) {
    const [step, setStep] = useState(1);
        const [isSubmitting, setIsSubmitting] = useState(false);
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
                setIsSubmitting(true);

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

    const totalSteps = 3;

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between mb-1 text-sm font-medium text-gray-600">
                    <span>Step {step} of {totalSteps}</span>
                    <span>{step === 1 ? "Personal Info" : step === 2 ? "Professional Info" : "Confirmation"}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                        className="h-2 rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Step Content */}
            {step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full border rounded-lg p-2"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full border rounded-lg p-2"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="w-full border rounded-lg p-2"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <textarea
                            name="address"
                            placeholder="Address"
                            className="w-full border rounded-lg p-2"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition cursor-pointer"
                    >
                        Next →
                    </button>
                    <div className="mt-2">
                        <BackButton />
                    </div>
                </>

            )}

            {step === 2 && (
                <>
                    <h2 className="text-xl font-bold mb-4">Professional Information</h2>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium">Upload Resume</label>
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            className="w-full"
                            onChange={handleChange}
                        />
                        {/* <textarea
                            name="coverLetter"
                            placeholder="Cover Letter"
                            className="w-full border rounded-lg p-2"
                            value={formData.coverLetter}
                            onChange={handleChange}
                        /> */}
                        <input
                            type="text"
                            name="experience"
                            placeholder="Experience (years)"
                            className="w-full border rounded-lg p-2"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="skills"
                            placeholder="Skills (comma separated)"
                            className="w-full border rounded-lg p-2"
                            value={formData.skills}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setStep(1)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            ← Back
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <h2 className="text-xl font-bold mb-4">Confirmation</h2>
                    <p className="mb-3">✅ Please review your details before submitting.</p>
                    <label className="flex items-center space-x-2 mb-4">
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
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            ← Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.confirm || isSubmitting}
                            className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-1">
                                    Submitting
                                    <span className="flex gap-1">
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                    </span>
                                </span>
                            ) : (
                                "Submit Application"
                            )}
                        </button>
                    </div>
                </>
            )}

            {status && <p className="mt-4 text-center text-green-700 font-medium">{status}</p>}
        </div>
    );
}
