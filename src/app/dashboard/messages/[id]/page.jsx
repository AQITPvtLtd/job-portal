"use client";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatWindow from "../ChatWindow";
import { ArrowLeft } from "lucide-react";

function DynamicChatPage() {
    const params = useParams();
    const router = useRouter();
    const uniqueId = params.id; // employee_id or employer_id (UUID)

    return (
        <div className="flex h-screen bg-white">
            {/* Back Button for Mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-4">
                <button
                    onClick={() => router.push('/dashboard/messages')}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                    <ArrowLeft size={20} />
                    <span>Back to conversations</span>
                </button>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col md:mt-0 mt-16">
                <ChatWindow
                    uniqueId={uniqueId}
                    onBack={() => router.push('/dashboard/messages')}
                />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <DynamicChatPage />
        </Suspense>
    );
}