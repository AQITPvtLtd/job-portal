"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="dark:bg-white">
          {/* Wrap पूरा app inside SessionProvider */}
          <SessionProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
