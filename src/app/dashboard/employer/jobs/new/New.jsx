"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Autosuggest from "react-autosuggest";
import { City } from "country-state-city";
import { Briefcase, MapPin, ArrowLeft, ArrowRight, Check, Building2, Users } from "lucide-react";
import dynamic from "next/dynamic";
import BackButton from "@/components/backbutton/BackButton";
// Load React Quill only on client side (for rich text editor)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const JOB_SUGGESTIONS = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Digital Marketer",
    "Graphic Designer",
    "UI/UX Designer",
    "Content Writer",
    "Sales Executive",
    "Customer Support",
    "HR Manager",
    "Web Developer",
    "AI Engineer",
    "Product Manager",
    "Data Analyst",
    "Marketing Executive",
    "Performance Marketing"
];

export default function NewJobStepForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const [form, setForm] = useState({
        company_name: "",
        title: "",
        location_type: "",           // ✅ NEW: on-site, remote, hybrid
        city: "",                     // ✅ NEW
        area: "",                     // ✅ NEW
        pincode: "",                  // ✅ NEW
        street_address: "",           // ✅ NEW
        location: "",                 // Keep for backward compatibility
        type: "Full-time",
        salary_min: "",
        salary_max: "",
        experience_required: "",
        education_level: "",
        skills: "",
        openings: "",
        description: "",
        expires_at: "",
    });
    useEffect(() => {
        // Fetch employer info on component mount
        async function fetchEmployerInfo() {
            const res = await fetch("/api/employer/info");
            const data = await res.json();
            if (data.ok && data.employer.company_name) {
                setForm(prev => ({
                    ...prev,
                    company_name: data.employer.company_name
                }));
            }
        }
        fetchEmployerInfo();
    }, []);
    // Autosuggest themes
    const theme = {
        container: "relative",
        input:
            "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none",
        suggestionsContainer:
            "absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden",
        suggestionsList: "divide-y divide-gray-100",
        suggestion:
            "p-3 cursor-pointer hover:bg-indigo-50 transition-colors duration-150 text-[15px]",
        suggestionHighlighted: "bg-indigo-100",
    };

    // Title suggestions
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const onTitleFetch = ({ value }) => {
        const input = value.trim().toLowerCase();
        setTitleSuggestions(
            JOB_SUGGESTIONS.filter((j) => j.toLowerCase().includes(input))
        );
    };
    const onTitleClear = () => setTitleSuggestions([]);
    const getTitleValue = (s) => s;
    const renderTitle = (s) => (
        <div className="flex items-center gap-2 text-gray-800">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>{s}</span>
        </div>
    );

    // Location suggestions
    const allCities = City.getCitiesOfCountry("IN") || [];
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const onLocationFetch = ({ value }) => {
        const input = value.trim().toLowerCase();
        setLocationSuggestions(
            allCities
                .filter((c) => c.name.toLowerCase().includes(input))
                .slice(0, 8)
        );
    };
    const onLocationClear = () => setLocationSuggestions([]);
    const getLocationValue = (s) => s.name;
    const renderLocation = (s) => (
        <div className="flex items-center gap-2 text-gray-800">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>{s.name}</span>
        </div>
    );

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        try {
            const res = await fetch("/api/employer/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.ok) router.push("/dashboard/employer/jobs");
            else setMsg(data.message || "Error creating job");
        } catch {
            setMsg("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    const next = () => setStep((s) => s + 1);
    const back = () => setStep((s) => s - 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-indigo-700">
                        🚀 Post a New Job
                    </h2>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div
                                key={s}
                                className={`w-3 h-3 rounded-full ${s <= step ? "bg-indigo-600" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Step 1: Company & Job Basics */}
                    {/* {step === 1 && (
                        <div className="space-y-5 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 text-indigo-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="e.g. TekBooster Pvt. Ltd."
                                        value={form.company_name}
                                        onChange={(e) =>
                                            setForm({ ...form, company_name: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Job Title *
                                </label>
                                <Autosuggest
                                    suggestions={titleSuggestions}
                                    onSuggestionsFetchRequested={onTitleFetch}
                                    onSuggestionsClearRequested={onTitleClear}
                                    getSuggestionValue={getTitleValue}
                                    renderSuggestion={renderTitle}
                                    inputProps={{
                                        placeholder: "e.g. Software Engineer",
                                        value: form.title,
                                        onChange: (_, { newValue }) =>
                                            setForm({ ...form, title: newValue }),
                                    }}
                                    theme={theme}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Location *
                                </label>
                                <Autosuggest
                                    suggestions={locationSuggestions}
                                    onSuggestionsFetchRequested={onLocationFetch}
                                    onSuggestionsClearRequested={onLocationClear}
                                    getSuggestionValue={getLocationValue}
                                    renderSuggestion={renderLocation}
                                    inputProps={{
                                        placeholder: "e.g. Bangalore, India",
                                        value: form.location,
                                        onChange: (_, { newValue }) =>
                                            setForm({ ...form, location: newValue }),
                                    }}
                                    theme={theme}
                                />
                            </div>

                            <div className="flex justify-between">
                                <BackButton />
                                <button
                                    type="button"
                                    onClick={next}
                                    className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )} */}



                    {/* Step 1: Company & Job Basics + Location */}
                    {step === 1 && (
                        <div className="space-y-5 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 text-indigo-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="e.g. TekBooster Pvt. Ltd."
                                        value={form.company_name}
                                        onChange={(e) =>
                                            setForm({ ...form, company_name: e.target.value })
                                        }
                                        className="w-full dark:text-black border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="dark:text-black">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Job Title *
                                </label>
                                <Autosuggest
                                    suggestions={titleSuggestions}
                                    onSuggestionsFetchRequested={onTitleFetch}
                                    onSuggestionsClearRequested={onTitleClear}
                                    getSuggestionValue={getTitleValue}
                                    renderSuggestion={renderTitle}
                                    inputProps={{
                                        placeholder: "e.g. Software Engineer",
                                        value: form.title,
                                        onChange: (_, { newValue }) =>
                                            setForm({ ...form, title: newValue }),
                                    }}
                                    theme={theme}

                                />
                            </div>

                            {/* ✅ NEW: Location Type Selector */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Job Location Type *
                                </label>
                                <select
                                    value={form.location_type}
                                    onChange={(e) => {
                                        const newType = e.target.value;
                                        setForm({
                                            ...form,
                                            location_type: newType,
                                            // Clear location fields if Remote
                                            ...(newType === 'remote' && {
                                                city: '',
                                                area: '',
                                                pincode: '',
                                                street_address: ''
                                            })
                                        });
                                    }}
                                    className="w-full dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                >
                                    <option value="">Select location type</option>
                                    <option value="on-site">On-site</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            {/* ✅ Conditional Location Fields (Hidden for Remote) */}
                            {form.location_type && form.location_type !== 'remote' && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                        📍 Job Location Details
                                    </h3>

                                    {/* City */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            City *
                                        </label>
                                        <Autosuggest
                                            suggestions={locationSuggestions}
                                            onSuggestionsFetchRequested={onLocationFetch}
                                            onSuggestionsClearRequested={onLocationClear}
                                            getSuggestionValue={getLocationValue}
                                            renderSuggestion={renderLocation}
                                            inputProps={{
                                                placeholder: "e.g. Bangalore",
                                                value: form.city,
                                                onChange: (_, { newValue }) =>
                                                    setForm({ ...form, city: newValue }),
                                            }}
                                            theme={{
                                                ...theme,
                                                input: "w-full dark:text-black border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
                                            }}
                                        />
                                    </div>

                                    {/* Area */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Area / Locality
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Koramangala"
                                            value={form.area}
                                            onChange={(e) =>
                                                setForm({ ...form, area: e.target.value })
                                            }
                                            className="w-full dark:text-black border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 560034"
                                            maxLength="6"
                                            value={form.pincode}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ''); // Only numbers
                                                setForm({ ...form, pincode: value });
                                            }}
                                            className="w-full dark:text-black border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>

                                    {/* Street Address */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Street Address (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 123, MG Road"
                                            value={form.street_address}
                                            onChange={(e) =>
                                                setForm({ ...form, street_address: e.target.value })
                                            }
                                            className="w-full dark:text-black border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ✅ Remote Location Message */}
                            {form.location_type === 'remote' && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-700 flex items-center gap-2">
                                        <span className="text-lg">🌍</span>
                                        This is a remote position - no physical location required
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <BackButton />
                                <button
                                    type="button"
                                    onClick={next}
                                    disabled={!form.location_type || (form.location_type !== 'remote' && !form.city)}
                                    className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Step 2: Job Type, Openings & Salary */}
                    {step === 2 && (
                        <div className="space-y-5 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Job Type *
                                </label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Temporary</option>
                                    <option>Internship</option>
                                    <option>Freelance</option>
                                    <option>Remote</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Number of Openings *
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 text-indigo-500 w-5 h-5" />
                                    <input
                                        type="number"
                                        placeholder="e.g. 3"
                                        value={form.openings}
                                        onChange={(e) =>
                                            setForm({ ...form, openings: e.target.value })
                                        }
                                        className="w-full dark:text-black border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    placeholder="Salary Min (₹)"
                                    value={form.salary_min}
                                    onChange={(e) =>
                                        setForm({ ...form, salary_min: e.target.value })
                                    }
                                    className="w-1/2 dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Salary Max (₹)"
                                    value={form.salary_max}
                                    onChange={(e) =>
                                        setForm({ ...form, salary_max: e.target.value })
                                    }
                                    className="w-1/2 dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={back}
                                    className="flex items-center gap-2 px-5 py-3 rounded-lg border text-gray-600 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Qualifications */}
                    {step === 3 && (
                        <div className="space-y-5 animate-fadeIn">
                            <input
                                placeholder="Experience Required (e.g. 2-4 years)"
                                value={form.experience_required}
                                onChange={(e) =>
                                    setForm({ ...form, experience_required: e.target.value })
                                }
                                className="w-full dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <input
                                placeholder="Education Level (e.g. Bachelor's Degree)"
                                value={form.education_level}
                                onChange={(e) =>
                                    setForm({ ...form, education_level: e.target.value })
                                }
                                className="w-full dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <input
                                placeholder="Required Skills (comma separated)"
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                className="w-full dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={back}
                                    className="flex items-center gap-2 px-5 py-3 rounded-lg border text-gray-600 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Description */}
                    {step === 4 && (
                        <div className="space-y-5 animate-fadeIn">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Job Description *
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={form.description}
                                onChange={(value) => setForm({ ...form, description: value })}
                                className="bg-white dark:text-black rounded-lg"
                                placeholder="Write detailed responsibilities, qualifications, and benefits..."
                            />

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={back}
                                    className="flex items-center gap-2 px-5 py-3 rounded-lg border text-gray-600 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Expiry Date + Submit */}
                    {step === 5 && (
                        <div className="space-y-5 animate-fadeIn">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Application Deadline
                            </label>
                            <input
                                type="date"
                                value={form.expires_at}
                                onChange={(e) =>
                                    setForm({ ...form, expires_at: e.target.value })
                                }
                                className="w-full dark:text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />

                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={back}
                                    className="flex items-center gap-2 px-5 py-3 rounded-lg border text-gray-600 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer font-semibold px-6 py-3 rounded-lg shadow-md transition flex items-center gap-2"
                                >
                                    {loading ? "Publishing..." : "Publish Job"}{" "}
                                    <Check className="w-4 h-4" />
                                </button>
                                {/* <div className="mt-2">
                                    <BackButton />
                                </div> */}
                            </div>

                            {msg && <p className="text-red-500 text-sm">{msg}</p>}
                        </div>

                    )}
                </form>
            </div>

        </div>
    );
}
