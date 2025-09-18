"use client";
import { useEffect, useState } from "react";

const Notifications = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/notifications")
            .then(r => r.json())
            .then(d => { if (d.ok) setNotes(d.notifications); })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-8">Loading...</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <ul className="space-y-3">
                {notes.map(n => (
                    <li key={n.id} className={`p-4 rounded-lg ${n.is_read ? 'bg-white' : 'bg-indigo-50'}`}>
                        <div className="flex justify-between">
                            <div>
                                <div className="font-semibold">{n.title}</div>
                                <div className="text-sm text-gray-600">{n.body}</div>
                                <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                            </div>
                            {!n.is_read && (
                                <button onClick={async () => {
                                    await fetch("/api/notifications/mark-read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [n.id] }) });
                                    setNotes(prev => prev.map(x => x.id === n.id ? { ...x, is_read: 1 } : x));
                                }} className="text-sm text-indigo-600">Mark read</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications