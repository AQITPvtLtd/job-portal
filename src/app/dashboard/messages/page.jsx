"use client";

import React from 'react'
import { Suspense } from "react";
import MessagesPage from './Messages'
const page = () => {
    return (
        <Suspense fallback={<div>Loading messages...</div>}>
            <MessagesPage />
        </Suspense>
    )
}

export default page