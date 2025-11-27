"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import About from "@/components/About";
import IndustriesSlider from "@/components/IndustriesSlider";
import Faq from "@/components/Faq";

export default function Home() {
  const { data: session } = useSession();

  const userRole = session?.user?.role;
  const dashboardLink =
    userRole === "employer"
      ? "/dashboard/employer"
      : userRole === "employee"
        ? "/dashboard/employee/jobs"
        : "/dashboard";

  return (
    <div className="min-h-screen">

      {/* ================= FULL SCREEN BANNER ================= */}
      <section className="relative w-full h-screen flex items-center">

        {/* BACKGROUND IMAGE */}
        <Image
          src="/banner/banner.png"
          alt="Banner Image"
          fill
          className="object-cover"
          priority
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* LEFT ALIGNED CONTENT */}
        <div className="relative z-10 px-6 md:px-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Roboto Slab', serif"}}>
            Grow Your Skills. Build Your Future in Tech & Marketing.
          </h1>

          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-xl">
            Find jobs that match your talent—from coding and web development to social media, branding, and digital strategy. <br /> Your next big opportunity starts here.
          </p>

          {/* BUTTONS – SAME LOGIC */}
          <div className="flex gap-4">
            {!session ? (
              <>
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                  Signup
                </Link>

                <Link
                  href="/login"
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                href={dashboardLink}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
      <About />
      <IndustriesSlider />
      <Faq />
    </div>
  );
}
