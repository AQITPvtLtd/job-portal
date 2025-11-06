"use client";
import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Building, DollarSign } from "lucide-react";
import Autosuggest from "react-autosuggest";

export default function JobsList({ jobs, selectedJobId, onSelectJob, loading }) {
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [filteredJobs, setFilteredJobs] = useState(jobs);
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    // Update filtered jobs when jobs or filters change
    useEffect(() => {
        handleFilter();
    }, [search, location, jobs]);

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

    // Auto-suggestions for job titles
    const onTitleSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        if (!inputValue) return setTitleSuggestions([]);

        const titles = [
            ...new Set(
                jobs
                    .map((job) => job.title)
                    .filter((t) => t && t.toLowerCase().includes(inputValue))
            ),
        ];

        setTitleSuggestions(titles.map((title) => ({ name: title })));
    };

    const onTitleSuggestionsClearRequested = () => setTitleSuggestions([]);

    // Auto-suggestions for locations
    const onLocationSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        if (!inputValue) return setLocationSuggestions([]);

        const locs = [
            ...new Set(
                jobs
                    .map((job) => job.location)
                    .filter((l) => l && l.toLowerCase().includes(inputValue))
            ),
        ];

        setLocationSuggestions(locs.map((location) => ({ name: location })));
    };

    const onLocationSuggestionsClearRequested = () => setLocationSuggestions([]);

    const getSuggestionValue = (suggestion) => suggestion.name;

    const renderSuggestion = (suggestion) => (
        <div className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm">
            {suggestion.name}
        </div>
    );

    return (
        <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Available Jobs</h1>

                {/* Search Filters */}
                <div className="space-y-3">
                    {/* Job Title Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Autosuggest
                            suggestions={titleSuggestions}
                            onSuggestionsFetchRequested={onTitleSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onTitleSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: "Job title or keyword",
                                value: search,
                                onChange: (_, { newValue }) => setSearch(newValue),
                                className: "w-full dark:text-black pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm",
                            }}
                            theme={{
                                suggestionsContainer: "absolute bg-white shadow-lg z-50 w-full rounded-b-lg border border-gray-200 mt-1",
                            }}
                        />
                    </div>

                    {/* Location Search */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Autosuggest
                            suggestions={locationSuggestions}
                            onSuggestionsFetchRequested={onLocationSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onLocationSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: "City, state or remote",
                                value: location,
                                onChange: (_, { newValue }) => setLocation(newValue),
                                className: "w-full dark:text-black pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm",
                            }}
                            theme={{
                                suggestionsContainer: "absolute bg-white shadow-lg z-50 w-full rounded-b-lg border border-gray-200 mt-1",
                            }}
                        />
                    </div>
                </div>

                {/* Results count */}
                <p className="text-sm text-gray-600 mt-3">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
            </div>

            {/* Jobs List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No jobs found matching your search</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => onSelectJob(job.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedJobId === job.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Company Logo Placeholder */}
                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <Building size={24} className="text-gray-600" />
                                </div>

                                {/* Job Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                        {job.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2 truncate">
                                        {job.company_name || "Unknown Company"}
                                    </p>

                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={12} />
                                            {job.type}
                                        </span>
                                    </div>

                                    {/* Salary */}
                                    <div className="flex items-center gap-1 text-sm font-medium text-green-700">
                                        <DollarSign size={14} />
                                        ₹{job.salary_min} - ₹{job.salary_max}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}