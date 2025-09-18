"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ThreadsPage() {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/messages/threads");
            const d = await res.json();
            if (d.ok) setThreads(d.threads || []);
        }
        load();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>

            <div className="space-y-3 max-w-3xl">
                {threads.length === 0 && <p className="text-gray-500">No conversations yet.</p>}
                {threads.map(t => (
                    <Link key={t.counterpart_id} href={`/dashboard/messages/${t.counterpart_id}`}>
                        <div className="p-4 bg-white rounded-lg shadow flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                            <div>
                                <div className="font-semibold">{t.name}</div>
                                <div className="text-sm text-gray-600">{t.last_message ?? "Say hello!"}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">{t.last_at ? new Date(t.last_at).toLocaleString() : ""}</div>
                                {t.unread > 0 && <div className="mt-1 text-xs bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">{t.unread}</div>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
