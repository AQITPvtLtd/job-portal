"use client";

import React, { useState } from "react";

// Job Portal FAQ Data
const faqs = [
    {
        question: "How do I apply for a job?",
        answer:
            "You can browse available job listings and click on the Apply button. Submit your details and upload your resume to complete the application.",
    },
    {
        question: "Is creating an account necessary?",
        answer:
            "Yes, creating an account helps you track applications, save jobs, and receive job alerts.",
    },
    {
        question: "Can I edit my profile later?",
        answer:
            "Absolutely. You can update your skills, experience, and resume anytime from your dashboard.",
    },
    {
        question: "How do companies contact me?",
        answer:
            "Recruiters can contact you directly through your registered email or phone number if your profile matches their requirement.",
    },
    {
        question: "Do you charge any fees from job seekers?",
        answer:
            "No. Our platform is completely free for candidates applying for jobs.",
    },
];

const ChevronDownIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 ${className}`}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(0); // 1st FAQ open by default

    const toggle = (index) => {
        setActiveIndex(index); // Always keep one open
    };

    return (
        <section className="max-w-4xl mx-auto py-10 pb-10 px-6">
            <div className="text-center mb-10">
                <h2
                    className="text-3xl md:text-4xl font-bold text-black"
                    style={{ fontFamily: "Roboto Slab, serif" }}
                >
                    Frequently Asked Questions
                </h2>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-black pb-4">
                        <button
                            className="w-full flex justify-between items-center cursor-pointer text-left text-lg font-semibold text-gray-800 focus:outline-none"
                            onClick={() => toggle(index)}
                        >
                            <span>{faq.question}</span>
                            <ChevronDownIcon
                                className={`transform transition-transform duration-300 ${activeIndex === index ? "rotate-180 text-blue-500" : ""
                                    }`}
                            />
                        </button>

                        {activeIndex === index && (
                            <p className="mt-3 text-base text-gray-800 leading-relaxed">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Faq;
