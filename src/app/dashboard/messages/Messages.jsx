// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Search } from "lucide-react";

// export default function ThreadsPage() {
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

//     return (
//         <div className="flex h-screen bg-white">
//             {/* Conversations Panel */}
//             <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
//                 {/* Header */}
//                 <div className="p-4 border-b border-gray-200">
//                     <h1 className="text-2xl font-semibold text-gray-900 mb-4">Messages</h1>

//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                         <input
//                             type="text"
//                             placeholder="Search conversations"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                         />
//                     </div>
//                 </div>

//                 {/* List */}
//                 <div className="flex-1 overflow-y-auto">
//                     {loading ? (
//                         <div className="flex justify-center items-center h-32">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         </div>
//                     ) : filteredThreads.length === 0 ? (
//                         <div className="p-8 text-center text-gray-500">
//                             <p>No conversations yet</p>
//                         </div>
//                     ) : (
//                         filteredThreads.map(t => (
//                             <Link key={t.counterpart_id} href={`/dashboard/messages/${t.counterpart_id}`}>
//                                 <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
//                                     <div className="flex gap-3">
//                                         {/* Avatar */}
//                                         <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
//                                             {t.name?.charAt(0).toUpperCase() || "U"}
//                                         </div>

//                                         {/* Content */}
//                                         <div className="flex-1 min-w-0">
//                                             <div className="flex justify-between items-start mb-1">
//                                                 <h3 className="font-semibold text-gray-900 text-sm truncate">
//                                                     {t.name || "Unknown User"}
//                                                 </h3>
//                                                 <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
//                                                     {t.last_at ? new Date(t.last_at).toLocaleTimeString([], {
//                                                         hour: '2-digit',
//                                                         minute: '2-digit'
//                                                     }) : ''}
//                                                 </span>
//                                             </div>

//                                             <p className={`text-sm truncate ${t.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
//                                                 }`}>
//                                                 {t.last_message || "Say hello!"}
//                                             </p>

//                                             {t.unread > 0 && (
//                                                 <span className="mt-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
//                                                     {t.unread}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Link>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Empty State (Desktop) */}
//             <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
//                 <div className="text-center">
//                     <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
//                         <Search size={32} className="text-gray-400" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
//                     <p className="text-gray-600 text-sm">Choose from your existing conversations</p>
//                 </div>
//             </div>
//         </div>
//     );
// }


// "use client";
// import { useState } from "react";
// import ConversationsList from "./ConversationsList";
// import ChatWindow from "./ChatWindow";

// export default function MessagesPage() {
//     const [selectedUserId, setSelectedUserId] = useState(null);
//     const [selectedUserInfo, setSelectedUserInfo] = useState(null);

//     const handleSelectConversation = (userId, userInfo) => {
//         setSelectedUserId(userId);
//         setSelectedUserInfo(userInfo);
//     };

//     return (
//         <div className="flex h-screen bg-white">
//             {/* LEFT PANEL - Conversations List */}
//             <div className={`${selectedUserId ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-gray-200 flex-col`}>
//                 <ConversationsList
//                     onSelectConversation={handleSelectConversation}
//                     selectedUserId={selectedUserId}
//                 />
//             </div>

//             {/* RIGHT PANEL - Chat Window */}
//             <div className={`${selectedUserId ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
//                 {selectedUserId ? (
//                     <ChatWindow
//                         userId={selectedUserId}
//                         userInfo={selectedUserInfo}
//                         onBack={() => setSelectedUserId(null)}
//                     />
//                 ) : (
//                     <div className="flex items-center justify-center h-full bg-gray-50">
//                         <div className="text-center">
//                             <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
//                                 <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
//                             <p className="text-gray-600 text-sm">Choose from your existing conversations to start messaging</p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


// "use client";
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import ConversationsList from "./ConversationsList";
// import ChatWindow from "./ChatWindow";

// export default function MessagesPage() {
//     const searchParams = useSearchParams();
//     const employeeIdFromUrl = searchParams.get('employee_Id'); // ✅ Changed
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//     const [selectedUserInfo, setSelectedUserInfo] = useState(null);

//     // ✅ Auto-select employee if employeeId in URL
//     useEffect(() => {
//         if (employeeIdFromUrl) {
//             setSelectedEmployeeId(employeeIdFromUrl);
//             // Fetch employee info by employee_id
//         }
//     }, [employeeIdFromUrl]);

//     const handleSelectConversation = (employeeId, userInfo) => {
//         setSelectedEmployeeId(employeeId);
//         setSelectedUserInfo(userInfo);
//     };

//     return (
//         <div className="flex h-screen bg-white">
//             <div className={`${selectedEmployeeId ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-gray-200 flex-col`}>
//                 <ConversationsList
//                     onSelectConversation={handleSelectConversation}
//                     selectedEmployeeId={selectedEmployeeId}
//                 />
//             </div>

//             <div className={`${selectedEmployeeId ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
//                 {selectedEmployeeId ? (
//                     <ChatWindow
//                         employeeId={selectedEmployeeId}
//                         userInfo={selectedUserInfo}
//                         onBack={() => setSelectedEmployeeId(null)}
//                     />
//                 ) : (
//                     <div className="flex items-center justify-center h-full bg-gray-50">
//                         <div className="text-center">
//                             <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
//                                 <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
//                             <p className="text-gray-600 text-sm">Choose from your existing conversations to start messaging</p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }



"use client";
import { useRouter } from "next/navigation";
import ConversationsList from "./ConversationsList";

export default function MessagesListPage() {
    const router = useRouter();

    const handleSelectConversation = (uniqueId) => {
        // Navigate to dynamic route with UUID
        router.push(`/dashboard/messages/${uniqueId}`);
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Conversations List */}
            <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
                <ConversationsList onSelectConversation={handleSelectConversation} />
            </div>

            {/* Empty State for Desktop */}
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600 text-sm">Choose from your existing conversations to start messaging</p>
                </div>
            </div>
        </div>
    );
}