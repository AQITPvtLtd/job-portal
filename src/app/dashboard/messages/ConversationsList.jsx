// "use client";
// import { useEffect, useState } from "react";
// import { Search } from "lucide-react";

// export default function ConversationsList({ onSelectConversation, selectedUserId }) {
//     const [threads, setThreads] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadThreads();
//         const interval = setInterval(loadThreads, 10000);
//         return () => clearInterval(interval);
//     }, []);

//     async function loadThreads() {
//         try {
//             const res = await fetch("/api/messages/threads");
//             const d = await res.json();
//             if (d.ok) setThreads(d.threads || []);
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const filteredThreads = threads.filter(t =>
//         t.name?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const timeAgo = (date) => {
//         if (!date) return "";
//         const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//         if (seconds < 60) return "Just now";
//         if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//         if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//         return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     };

//     return (
//         <>
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200">
//                 <h1 className="text-2xl font-semibold text-gray-900 mb-4">Messages</h1>
                
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                         type="text"
//                         placeholder="Search conversations"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full dark:text-black pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     />
//                 </div>
//             </div>

//             {/* List */}
//             <div className="flex-1 overflow-y-auto">
//                 {loading ? (
//                     <div className="flex justify-center items-center h-32">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                     </div>
//                 ) : filteredThreads.length === 0 ? (
//                     <div className="p-8 text-center text-gray-500">
//                         <p>No conversations yet</p>
//                     </div>
//                 ) : (
//                     filteredThreads.map(t => (
//                         <div
//                             key={t.counterpart_id}
//                             onClick={() => onSelectConversation(t.counterpart_id, {
//                                 name: t.name,
//                                 role: t.role || 'user'
//                             })}
//                             className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
//                                 selectedUserId === t.counterpart_id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
//                             }`}
//                         >
//                             <div className="flex gap-3">
//                                 {/* Avatar */}
//                                 <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
//                                     {t.name?.charAt(0).toUpperCase() || "U"}
//                                 </div>

//                                 {/* Content */}
//                                 <div className="flex-1 min-w-0">
//                                     <div className="flex justify-between items-start mb-1">
//                                         <h3 className="font-semibold text-gray-900 text-sm truncate">
//                                             {t.name || "Unknown User"}
//                                         </h3>
//                                         <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
//                                             {timeAgo(t.last_at)}
//                                         </span>
//                                     </div>

//                                     <p className={`text-sm truncate ${
//                                         t.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
//                                     }`}>
//                                         {t.last_message || "Say hello!"}
//                                     </p>

//                                     {t.unread > 0 && (
//                                         <span className="inline-block mt-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
//                                             {t.unread}
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </>
//     );
// }

// "use client";
// import { useEffect, useState } from "react";
// import { Search, MessageSquare } from "lucide-react";

// export default function ConversationsList({ onSelectConversation, selectedUniqueId }) {
//     const [threads, setThreads] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadThreads();
//         const interval = setInterval(loadThreads, 10000);
//         return () => clearInterval(interval);
//     }, []);

//     async function loadThreads() {
//         try {
//             const res = await fetch("/api/messages/threads");
//             const d = await res.json();
//             if (d.ok) setThreads(d.threads || []);
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const filteredThreads = threads.filter(t =>
//         t.name?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const timeAgo = (date) => {
//         if (!date) return "";
//         const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//         if (seconds < 60) return "Just now";
//         if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//         if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//         return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     };

//     return (
//         <div className="flex flex-col h-full bg-white">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200 flex-shrink-0">
//                 <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                     <MessageSquare className="w-6 h-6 text-blue-600" />
//                     Messages
//                 </h1>
                
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                         type="text"
//                         placeholder="Search conversations..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full dark:text-black pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
//                     />
//                 </div>
//             </div>

//             {/* Conversations List */}
//             <div className="flex-1 overflow-y-auto">
//                 {loading ? (
//                     <div className="flex flex-col justify-center items-center h-full py-20">
//                         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
//                         <p className="text-gray-500 text-sm">Loading conversations...</p>
//                     </div>
//                 ) : filteredThreads.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-full py-20 px-4 text-center">
//                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                             <MessageSquare className="w-8 h-8 text-gray-400" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                             No conversations yet
//                         </h3>
//                         <p className="text-gray-500 text-sm max-w-xs">
//                             {searchQuery ? "No results found. Try a different search term." : "Start a conversation by applying to jobs or messaging candidates."}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="divide-y divide-gray-100">
//                         {filteredThreads.map(t => (
//                             <div
//                                 key={t.unique_id}
//                                 onClick={() => onSelectConversation(t.unique_id)}
//                                 className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
//                                     selectedUniqueId === t.unique_id 
//                                         ? 'bg-blue-50 border-r-4 border-r-blue-600' 
//                                         : 'border-r-4 border-r-transparent'
//                                 }`}
//                             >
//                                 <div className="flex gap-3">
//                                     {/* Avatar */}
//                                     <div className="relative flex-shrink-0">
//                                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
//                                             {t.name?.charAt(0).toUpperCase() || "U"}
//                                         </div>
//                                         {t.unread > 0 && (
//                                             <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
//                                                 {t.unread > 9 ? '9+' : t.unread}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Content */}
//                                     <div className="flex-1 min-w-0">
//                                         <div className="flex justify-between items-start mb-1">
//                                             <h3 className={`font-semibold text-sm truncate ${
//                                                 t.unread > 0 ? 'text-gray-900' : 'text-gray-800'
//                                             }`}>
//                                                 {t.name || "Unknown User"}
//                                             </h3>
//                                             <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
//                                                 {timeAgo(t.last_at)}
//                                             </span>
//                                         </div>

//                                         <p className={`text-sm truncate ${
//                                             t.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
//                                         }`}>
//                                             {t.last_message || "Start a conversation"}
//                                         </p>

//                                         {/* Role Badge */}
//                                         <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs rounded-full font-medium ${
//                                             t.role === 'employer' 
//                                                 ? 'bg-purple-100 text-purple-700' 
//                                                 : 'bg-green-100 text-green-700'
//                                         }`}>
//                                             {t.role === 'employer' ? '👔 Employer' : '👤 Job Seeker'}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


"use client";
import { useEffect, useState } from "react";
import { Search, MessageSquare, ChevronDown, Inbox, Archive, AlertOctagon } from "lucide-react";

export default function ConversationsList({ onSelectConversation, selectedUniqueId, filter, onFilterChange }) {
    const [threads, setThreads] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        loadThreads();
        const interval = setInterval(loadThreads, 10000);
        return () => clearInterval(interval);
    }, [filter]);

    async function loadThreads() {
        try {
            const res = await fetch(`/api/messages/threads?filter=${filter}`);
            const d = await res.json();
            if (d.ok) setThreads(d.threads || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredThreads = threads.filter(t =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.job_title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const timeAgo = (date) => {
        if (!date) return "";
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const filterOptions = [
        { value: 'inbox', label: 'Inbox', icon: Inbox, color: 'text-blue-600' },
        { value: 'archived', label: 'Archived', icon: Archive, color: 'text-gray-600' },
        { value: 'spam', label: 'Spam', icon: AlertOctagon, color: 'text-red-600' }
    ];

    const currentFilter = filterOptions.find(f => f.value === filter);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0 space-y-3">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    Messages
                </h1>

                {/* Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all"
                    >
                        <div className="flex items-center gap-2">
                            {currentFilter && <currentFilter.icon size={18} className={currentFilter.color} />}
                            <span className="font-semibold text-gray-800">{currentFilter?.label}</span>
                        </div>
                        <ChevronDown size={18} className={`text-gray-600 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showFilterDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-slide-down">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onFilterChange(option.value);
                                        setShowFilterDropdown(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all ${
                                        filter === option.value ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-semibold' : ''
                                    }`}
                                >
                                    <option.icon size={18} className={option.color} />
                                    <span className="text-gray-800">{option.label}</span>
                                    {filter === option.value && (
                                        <span className="ml-auto text-blue-600 font-bold">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full dark:text-black pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-full py-20">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        </div>
                        <p className="text-gray-500 text-sm mt-4">Loading conversations...</p>
                    </div>
                ) : filteredThreads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 px-4 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            {currentFilter && <currentFilter.icon size={32} className="text-gray-400" />}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No {filter} messages
                        </h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                            {searchQuery 
                                ? "No results found. Try a different search term." 
                                : filter === 'inbox' 
                                    ? "Start a conversation by applying to jobs or messaging candidates."
                                    : `Your ${filter} folder is empty.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredThreads.map(t => (
                            <div
                                key={t.unique_id}
                                onClick={() => onSelectConversation(t.unique_id)}
                                className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all ${
                                    selectedUniqueId === t.unique_id 
                                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-r-4 border-r-blue-600' 
                                        : 'border-r-4 border-r-transparent'
                                }`}
                            >
                                <div className="flex gap-3">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                            {t.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        {t.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                                                {t.unread > 9 ? '9+' : t.unread}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold text-sm truncate ${
                                                    t.unread > 0 ? 'text-gray-900' : 'text-gray-800'
                                                }`}>
                                                    {t.name || "Unknown User"}
                                                </h3>
                                                {/* Job Title */}
                                                {t.job_title && (
                                                    <p className="text-xs text-blue-600 font-medium truncate">
                                                        {t.job_title}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2 font-medium">
                                                {timeAgo(t.last_at)}
                                            </span>
                                        </div>

                                        <p className={`text-sm truncate ${
                                            t.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                                        }`}>
                                            {t.last_message || "Start a conversation"}
                                        </p>

                                        {/* Company Name & Role */}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            {t.company_name && (
                                                <span className="text-xs text-gray-500 truncate">
                                                    at {t.company_name}
                                                </span>
                                            )}
                                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                                                t.role === 'employer' 
                                                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                                                    : 'bg-gradient-to-r from-green-100 to-teal-100 text-green-700'
                                            }`}>
                                                {t.role === 'employer' ? '👔 Employer' : '👤 Seeker'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}