"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ChatPage() {
    const params = useParams();
    const otherId = params.userId;
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const listRef = useRef(null);

    // Poll messages every 3s
    useEffect(() => {
        if (!otherId) return;

        let isMounted = true;

        async function fetchMessages() {
            const res = await fetch(`/api/messages/${otherId}`);
            const d = await res.json();
            if (d.ok && isMounted) setMessages(d.messages || []);
        }

        fetchMessages(); // first fetch
        const iv = setInterval(fetchMessages, 3000);

        return () => {
            isMounted = false;
            clearInterval(iv);
        };
    }, [otherId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!listRef.current) return;

        const el = listRef.current;
        const isAtBottom =
            el.scrollHeight - el.scrollTop === el.clientHeight; // already at bottom

        if (isAtBottom) {
            // scroll to bottom only if already at bottom
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);


    // Mark messages as read only when this user opens the chat
    useEffect(() => {
        if (!otherId) return;
        async function markRead() {
            await fetch("/api/messages/mark-read", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: Number(otherId) }),
            }).catch(() => { });
        }
        markRead();
    }, [otherId]); // only runs when user opens this chat

    async function onSend(e) {
        e.preventDefault();
        if (!text.trim()) return;

        await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ receiverId: Number(otherId), content: text }),
        });

        setText("");
        // Fetch messages immediately after sending
        const res = await fetch(`/api/messages/${otherId}`);
        const d = await res.json();
        if (d.ok) setMessages(d.messages || []);
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg flex flex-col h-[70vh]">
                {/* Chat messages */}
                <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
                    {messages.map((m) => {
                        const isMine = m.sender_id === currentUserId;
                        return (
                            <div
                                key={m.id}
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] p-3 rounded-lg ${isMine
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                                        }`}
                                >
                                    <div>{m.content}</div>
                                    <div className="text-xs mt-1 flex justify-between items-center">
                                        <span
                                            className={`${isMine ? "text-indigo-200" : "text-gray-500"}`}
                                        >
                                            {new Date(m.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        {isMine && (
                                            <span className="ml-2 text-[11px]">
                                                {m.is_read ? "Seen" : "Sent"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input box */}
                <form onSubmit={onSend} className="p-4 border-t flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
