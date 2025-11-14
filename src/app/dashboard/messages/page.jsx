"use client";

import React from 'react'
import { Suspense } from "react";
import { MessagesPageContent } from './Messages';
export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="text-center">
                    <div className="relative inline-block mb-4">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading messages...</p>
                </div>
            </div>
        }>
            <MessagesPageContent />
        </Suspense>
    );
}