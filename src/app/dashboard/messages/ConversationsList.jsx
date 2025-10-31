"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function ConversationsList({ onSelectConversation, selectedUserId }) {
    const [threads, setThreads] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadThreads();
        const interval = setInterval(loadThreads, 10000);
        return () => clearInterval(interval);
    }, []);

    async function loadThreads() {
        try {
            const res = await fetch("/api/messages/threads");
            const d = await res.json();
            if (d.ok) setThreads(d.threads || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredThreads = threads.filter(t =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const timeAgo = (date) => {
        if (!date) return "";
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Messages</h1>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search conversations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredThreads.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No conversations yet</p>
                    </div>
                ) : (
                    filteredThreads.map(t => (
                        <div
                            key={t.counterpart_id}
                            onClick={() => onSelectConversation(t.counterpart_id, {
                                name: t.name,
                                role: t.role || 'user'
                            })}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                                selectedUserId === t.counterpart_id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                            }`}
                        >
                            <div className="flex gap-3">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                                    {t.name?.charAt(0).toUpperCase() || "U"}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                                            {t.name || "Unknown User"}
                                        </h3>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                            {timeAgo(t.last_at)}
                                        </span>
                                    </div>

                                    <p className={`text-sm truncate ${
                                        t.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                                    }`}>
                                        {t.last_message || "Say hello!"}
                                    </p>

                                    {t.unread > 0 && (
                                        <span className="inline-block mt-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                            {t.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}