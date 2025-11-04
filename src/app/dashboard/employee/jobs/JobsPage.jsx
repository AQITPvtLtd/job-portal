// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Autosuggest from "react-autosuggest"; // ✅ add autosuggest
// import { Search, MapPin, Briefcase, Building } from "lucide-react";
// import BackButton from "@/components/backbutton/BackButton";

// export default function JobsPage() {
//     const [jobs, setJobs] = useState([]);
//     const [filteredJobs, setFilteredJobs] = useState([]);
//     const [search, setSearch] = useState("");
//     const [location, setLocation] = useState("");

//     const [titleSuggestions, setTitleSuggestions] = useState([]);
//     const [locationSuggestions, setLocationSuggestions] = useState([]);

//     // 🟢 Fetch all jobs initially
//     useEffect(() => {
//         fetch("/api/employee/jobs")
//             .then((res) => res.json())
//             .then((data) => {
//                 setJobs(data.jobs || []);
//                 setFilteredJobs(data.jobs || []);
//             });
//     }, []);

//     // 🔍 Filter jobs based on search + location
//     const handleFilter = () => {
//         let results = jobs;

//         if (search.trim() !== "") {
//             results = results.filter((job) =>
//                 job.title.toLowerCase().includes(search.toLowerCase())
//             );
//         }

//         if (location.trim() !== "") {
//             results = results.filter((job) =>
//                 job.location.toLowerCase().includes(location.toLowerCase())
//             );
//         }

//         setFilteredJobs(results);
//     };

//     // Auto filter when typing (optional)
//     useEffect(() => {
//         handleFilter();
//     }, [search, location]);

//     // 🧠 Generate auto-suggestions for job titles
//     const onTitleSuggestionsFetchRequested = ({ value }) => {
//         const inputValue = value.trim().toLowerCase();
//         if (!inputValue) return setTitleSuggestions([]);

//         const titles = [
//             ...new Set(
//                 jobs
//                     .map((job) => job.title)
//                     .filter((t) => t && t.toLowerCase().includes(inputValue))
//             ),
//         ];

//         setTitleSuggestions(titles.map((title) => ({ name: title })));
//     };

//     const onTitleSuggestionsClearRequested = () => {
//         setTitleSuggestions([]);
//     };

//     // 🧠 Generate auto-suggestions for locations
//     const onLocationSuggestionsFetchRequested = ({ value }) => {
//         const inputValue = value.trim().toLowerCase();
//         if (!inputValue) return setLocationSuggestions([]);

//         const locs = [
//             ...new Set(
//                 jobs
//                     .map((job) => job.location)
//                     .filter((l) => l && l.toLowerCase().includes(inputValue))
//             ),
//         ];

//         setLocationSuggestions(locs.map((location) => ({ name: location })));
//     };

//     const onLocationSuggestionsClearRequested = () => {
//         setLocationSuggestions([]);
//     };

//     const getSuggestionValue = (suggestion) => suggestion.name;

//     const renderSuggestion = (suggestion) => (
//         <div className="px-3 py-2 hover:bg-indigo-100 cursor-pointer">
//             {suggestion.name}
//         </div>
//     );

//     return (
//         <div className="p-8 min-h-screen bg-gradient-to-br from-white to-indigo-50">
//             <h1 className="text-2xl font-bold text-indigo-800 mb-6">
//                 🔎 Available Jobs
//             </h1>

//             {/* Search Bar */}
//             <div className="mb-8 flex flex-col md:flex-row items-center w-full max-w-4xl bg-white rounded-full shadow-md border overflow-hidden">
//                 {/* Job Title Search */}
//                 <div className="flex items-center flex-1 px-4 py-2 border-b md:border-b-0 md:border-r relative">
//                     <Search className="w-5 h-5 text-gray-400 mr-2" />
//                     <Autosuggest
//                         suggestions={titleSuggestions}
//                         onSuggestionsFetchRequested={onTitleSuggestionsFetchRequested}
//                         onSuggestionsClearRequested={onTitleSuggestionsClearRequested}
//                         getSuggestionValue={getSuggestionValue}
//                         renderSuggestion={renderSuggestion}
//                         inputProps={{
//                             placeholder: "Job title",
//                             value: search,
//                             onChange: (_, { newValue }) => setSearch(newValue),
//                             className: "w-full outline-none bg-transparent",
//                         }}
//                         theme={{
//                             suggestionsContainer: "absolute bg-white shadow-md z-50 w-full rounded-b-lg",
//                         }}
//                     />
//                 </div>

//                 {/* Location Search */}
//                 <div className="flex items-center flex-1 px-4 py-2 border-b md:border-b-0 md:border-r relative">
//                     <MapPin className="w-5 h-5 text-gray-400 mr-2" />
//                     <Autosuggest
//                         suggestions={locationSuggestions}
//                         onSuggestionsFetchRequested={onLocationSuggestionsFetchRequested}
//                         onSuggestionsClearRequested={onLocationSuggestionsClearRequested}
//                         getSuggestionValue={getSuggestionValue}
//                         renderSuggestion={renderSuggestion}
//                         inputProps={{
//                             placeholder: "City, state",
//                             value: location,
//                             onChange: (_, { newValue }) => setLocation(newValue),
//                             className: "w-full outline-none bg-transparent",
//                         }}
//                         theme={{
//                             suggestionsContainer: "absolute bg-white shadow-md z-50 w-full rounded-b-lg",
//                         }}
//                     />
//                 </div>

//                 <button
//                     onClick={handleFilter}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full transition mt-2 md:mt-0"
//                 >
//                     Find Jobs
//                 </button>
//             </div>

//             {/* Job Listings */}
//             <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredJobs.length > 0 ? (
//                     filteredJobs.map((job) => (
//                         <Link
//                             key={job.id}
//                             href={`/dashboard/employee/jobs/${job.id}`}
//                         >
//                             <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition cursor-pointer flex flex-col justify-between h-full">
//                                 {/* Job Title & Company */}
//                                 <div className="mb-4">
//                                     <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-1">
//                                         <Briefcase className="w-4 h-4" /> {job.title}
//                                     </h2>
//                                     <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
//                                         <Building className="w-4 h-4" />
//                                         {job.company_name || "Unknown Company"}
//                                     </p>
//                                 </div>

//                                 {/* Location */}
//                                 <p className="text-gray-600 flex items-center gap-1 mb-2">
//                                     <MapPin className="w-4 h-4" /> {job.location}
//                                 </p>

//                                 {/* Tags */}
//                                 <div className="flex flex-wrap gap-2 mt-auto">
//                                     <span className="inline-block px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
//                                         {job.type}
//                                     </span>
//                                     <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
//                                         ₹{job.salary_min} - ₹{job.salary_max}
//                                     </span>
//                                 </div>
//                             </div>
//                         </Link>
//                     ))
//                 ) : (
//                     <p className="text-gray-600 col-span-full">
//                         No jobs found matching your filters.
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }


"use client";
import { useState, useEffect } from "react";
import JobsList from "./JobsList";
import JobDetailsPanel from "./JobDetailsPanel";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch all jobs
    useEffect(() => {
        fetch("/api/employee/jobs")
            .then((res) => res.json())
            .then((data) => {
                setJobs(data.jobs || []);
                // Auto-select first job
                if (data.jobs?.length > 0) {
                    setSelectedJobId(data.jobs[0].id);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* LEFT PANEL - Jobs List */}
            <div className={`${selectedJobId ? 'hidden md:flex' : 'flex'} w-full md:w-2/5 border-r border-gray-200 flex-col bg-white`}>
                <JobsList
                    jobs={jobs}
                    selectedJobId={selectedJobId}
                    onSelectJob={setSelectedJobId}
                    loading={loading}
                />
            </div>

            {/* RIGHT PANEL - Job Details */}
            <div className={`${selectedJobId ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
                {selectedJobId ? (
                    <JobDetailsPanel
                        jobId={selectedJobId}
                        onBack={() => setSelectedJobId(null)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-white">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a job</h3>
                            <p className="text-gray-600 text-sm">Choose a job from the list to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}