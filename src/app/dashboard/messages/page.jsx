"use client";

import React from 'react'
import { Suspense } from "react";
import MessagesListPage from './Messages';
export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
           <MessagesListPage />
        </Suspense>
    );
}