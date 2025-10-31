"use client";
import { useEffect, useState } from "react";
import { BsBell } from "react-icons/bs";

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
        <div className="relative">
            <BsBell size={22} className="text-gray-300" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                </span>
            )}
        </div>
    );
}