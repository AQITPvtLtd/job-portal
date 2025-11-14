"use client";
import { useState, useRef, useEffect } from "react";

const EMOJI_CATEGORIES = {
    smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔"],
    gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶"],
    hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
    activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳"],
    objects: ["💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "💻", "⌨️", "🖥️", "🖨️"],
};

export default function EmojiPicker({ onSelect, onClose }) {
    const [activeCategory, setActiveCategory] = useState("smileys");
    const pickerRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={pickerRef}
            className="absolute bottom-16 right-0 w-80 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 animate-slide-up"
        >
            {/* Header */}
            <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-800">Select Emoji</h3>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 p-2 border-b border-gray-100 overflow-x-auto">
                {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeCategory === cat
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-3 grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                {EMOJI_CATEGORIES[activeCategory].map((emoji, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            onSelect(emoji);
                            onClose();
                        }}
                        className="text-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg p-2 transition-all transform hover:scale-125 active:scale-100"
                        title={emoji}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}