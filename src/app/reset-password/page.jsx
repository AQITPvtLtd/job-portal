"use client";

import React, { Suspense } from "react";
import ResetPasswordPage from "./Resetpassword";

const Page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordPage />
        </Suspense>
    );
};

export default Page;
