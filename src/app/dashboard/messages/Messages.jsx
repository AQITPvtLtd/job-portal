// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import ConversationsList from "./ConversationsList";
// import ChatWindow from "./ChatWindow";

// export function MessagesPageContent() {
//     const router = useRouter();
//     const [selectedUniqueId, setSelectedUniqueId] = useState(null);
//     const [filter, setFilter] = useState("inbox");

//     const handleSelectConversation = (uniqueId) => {
//         setSelectedUniqueId(uniqueId);
//         router.push(`/dashboard/messages?chat=${uniqueId}`, { shallow: true });
//     };

//     const handleBack = () => {
//         setSelectedUniqueId(null);
//         router.push('/dashboard/messages', { shallow: true });
//     };

//     const handleFilterChange = (newFilter) => {
//         setFilter(newFilter);
//         setSelectedUniqueId(null); // Close chat when changing filter
//     };

//     return (
//         <div className="flex h-screen bg-white overflow-hidden">
//             {/* Left Panel - Conversations List */}
//             <div className={`${
//                 selectedUniqueId ? 'hidden md:flex' : 'flex'
//             } w-full md:w-96 lg:w-[400px] border-r border-gray-200 flex-col`}>
//                 <ConversationsList 
//                     onSelectConversation={handleSelectConversation}
//                     selectedUniqueId={selectedUniqueId}
//                     filter={filter}
//                     onFilterChange={handleFilterChange}
//                 />
//             </div>

//             {/* Right Panel - Chat Window */}
//             <div className={`${
//                 selectedUniqueId ? 'flex' : 'hidden md:flex'
//             } flex-1 flex-col min-w-0`}>
//                 {selectedUniqueId ? (
//                     <ChatWindow
//                         uniqueId={selectedUniqueId}
//                         onBack={handleBack}
//                         onArchive={() => {
//                             // Refresh conversation list
//                             setSelectedUniqueId(null);
//                         }}
//                     />
//                 ) : (
//                     <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//                         <div className="text-center px-4">
//                             <div className="relative mb-6">
//                                 <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-xl">
//                                     <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                                     </svg>
//                                 </div>
//                                 <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
//                             </div>
//                             <h3 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                                 Select a conversation
//                             </h3>
//                             <p className="text-gray-600 text-sm max-w-sm mx-auto">
//                                 Choose from your {filter === 'inbox' ? 'messages' : filter} to start chatting
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";

export function MessagesPageContent() {
    const router = useRouter();
    const [selectedUniqueId, setSelectedUniqueId] = useState(null);
    const [filter, setFilter] = useState("inbox");
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Force refresh trigger

    const handleSelectConversation = (uniqueId) => {
        setSelectedUniqueId(uniqueId);
        router.push(`/dashboard/messages?chat=${uniqueId}`, { shallow: true });
    };

    const handleBack = () => {
        setSelectedUniqueId(null);
        router.push('/dashboard/messages', { shallow: true });
        // Refresh list when going back
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSelectedUniqueId(null);
    };

    const handleArchiveAction = () => {
        // Close chat and refresh list
        setSelectedUniqueId(null);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Left Panel - Conversations List */}
            <div className={`${selectedUniqueId ? 'hidden md:flex' : 'flex'
                } w-full md:w-96 lg:w-[400px] border-r border-gray-200 flex-col`}>
                <ConversationsList
                    onSelectConversation={handleSelectConversation}
                    selectedUniqueId={selectedUniqueId}
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    refreshTrigger={refreshTrigger} // Pass refresh trigger
                />
            </div>

            {/* Right Panel - Chat Window */}
            <div className={`${selectedUniqueId ? 'flex' : 'hidden md:flex'
                } flex-1 flex-col min-w-0`}>
                {selectedUniqueId ? (
                    <ChatWindow
                        uniqueId={selectedUniqueId}
                        onBack={handleBack}
                        onArchive={handleArchiveAction}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                        <div className="text-center px-4">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-xl">
                                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Select a conversation
                            </h3>
                            <p className="text-gray-600 text-sm max-w-sm mx-auto">
                                Choose from your {filter === 'inbox' ? 'messages' : filter} to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}