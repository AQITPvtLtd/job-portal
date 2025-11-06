"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { BsBell } from "react-icons/bs";
import NotificationsBell from "./NotificationsBell";

export default function Navbar() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        image: "/default-avatar.png",
        name: "User"
    });
    const dropdownRef = useRef(null);

    const userRole = session?.user?.role;
    const userName = profileData.name;


    const applicationRoute =
        userRole === "employee"
            ? "/dashboard/employee/applications"
            : userRole === "employer"
                ? "/dashboard/employer/jobs"
                : "#";


    const profileRoute =
        userRole === "employee"
            ? "/dashboard/employee/edit-profile"
            : userRole === "employer"
                ? "/dashboard/employer/edit-profile"
                : "#";

    // ✅ Fetch user's profile data (image + name) from database
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!session?.user?.id) return;

            try {
                const res = await fetch(`/api/profile/${session.user.id}`);
                const data = await res.json();

                if (res.ok && !data.error) {
                    setProfileData({
                        image: data.profile_image || data.logo || "/default-avatar.png",
                        name: data.full_name || data.company_name || session?.user?.name || session?.user?.email || "User"
                    });
                } else {
                    // Fallback to session data if profile not found
                    setProfileData({
                        image: "/default-avatar.png",
                        name: session?.user?.name || session?.user?.email || "User"
                    });
                }
            } catch (err) {
                console.error("Error fetching profile data:", err);
                // Fallback to session data on error
                setProfileData({
                    image: "/default-avatar.png",
                    name: session?.user?.name || session?.user?.email || "User"
                });
            }
        };

        fetchProfileData();

        // ✅ Listen for profile update events
        const handleProfileUpdate = () => {
            fetchProfileData();
        };

        window.addEventListener('profileUpdated', handleProfileUpdate);
        return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
    }, [session?.user?.id, session?.user?.name, session?.user?.email]);

    // close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // prevent scroll when menu is open (mobile)
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
    }, [menuOpen]);

    return (
        <nav className="bg-black text-white shadow-lg sticky top-0 z-50 border-b border-gray-800">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/logo/logowhite.png"
                            alt="Tek Booster Logo"
                            width={140}
                            height={40}
                            priority
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Right Section for large screens */}
                    <div className="hidden md:flex items-center gap-5">
                        {session ? (
                            <>
                                {/* Bell Icon */}
                                <Link
                                    href="/dashboard/messages"
                                    className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <NotificationsBell />
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen((prev) => !prev)}
                                        className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 border border-gray-800 hover:border-gray-700"
                                        aria-expanded={dropdownOpen}
                                    >
                                        <Image
                                            src={profileData.image}
                                            alt="Avatar"
                                            width={32}
                                            height={32}
                                            className="rounded-full border-2 border-gray-700 object-cover"
                                        />
                                        <span className="font-medium text-sm max-w-[120px] truncate">
                                            {userName}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-200 animate-fadeIn">
                                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {userName}
                                                </p>
                                                <p className="text-xs text-gray-500 capitalize mt-1">
                                                    {userRole || "User"}
                                                </p>
                                            </div>
                                            <Link
                                                href={profileRoute}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <User size={18} className="text-gray-600" />
                                                <span className="text-sm font-medium">Edit Profile</span>
                                            </Link>
                                            <Link
                                                href={applicationRoute}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <User size={18} className="text-gray-600" />
                                                <span className="text-sm font-medium">My Applications</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    signOut();
                                                    setDropdownOpen(false);
                                                }}
                                                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-red-600 border-t border-gray-200"
                                            >
                                                <LogOut size={18} />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-5 py-2 text-sm font-medium rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-900/30"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Hamburger for small screens */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-900 transition-colors"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-black border-t border-gray-800 fixed top-16 left-0 w-full z-50 transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                    }`}
            >
                <div className="px-4 py-4 space-y-3 overflow-y-auto max-h-[80vh]">
                    {session ? (
                        <>
                            {/* User Info */}
                            <div className="px-4 py-3 bg-gray-900 rounded-lg border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={profileData.image}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full border-2 border-gray-700 object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {userName}
                                        </p>
                                        <p className="text-xs text-gray-400 capitalize">
                                            {userRole || "User"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center gap-3 w-full px-4 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                                <BsBell size={20} className="text-gray-300" />
                                <span className="text-sm font-medium">Notifications</span>
                                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            <Link
                                href={profileRoute}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <User size={18} className="text-gray-300" />
                                <span className="text-sm font-medium">Edit Profile</span>
                            </Link>

                            <button
                                onClick={() => {
                                    signOut();
                                    setMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full text-left px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                href="/login"
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-3 text-center text-sm font-medium rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-3 text-center text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}