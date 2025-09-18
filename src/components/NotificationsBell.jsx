"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationsBell() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        async function f() {
            const res = await fetch("/api/messages/unread");
            const d = await res.json();
            if (d.ok) setCount(d.count || 0);
        }
        f();
        const iv = setInterval(f, 10000);
        return () => clearInterval(iv);
    }, []);
    return (
        <Link href="/dashboard/messages" className="relative px-2">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M7 8h10M7 12h8m-8 4h6" /></svg>
            {count > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
        </Link>
    );
}
