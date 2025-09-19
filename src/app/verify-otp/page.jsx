"use client";

import React, { Suspense } from "react";
import VerifyOtpPage from './Verifyotp'
const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <VerifyOtpPage />
        </Suspense>
    )
}

export default page