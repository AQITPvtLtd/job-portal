"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back", as = "button" }) {
    const router = useRouter();
    const Element = as;

    return (
        <Element
            onClick={() => router.back()}
            className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition"
            role={as !== "button" ? "button" : undefined}
        >
            <ArrowLeft size={18} />
            {label}
        </Element>
    );
}
