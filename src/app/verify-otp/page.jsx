"use client"

import React, { Suspense } from "react";
import VerifyOtpPage from './Verifyotp'
const page = () => {
    return (
        <div>
            <Suspense fallback={<p>Loading...</p>}>
                <VerifyOtpPage />
            </Suspense>
        </div>
    )
}

export default page