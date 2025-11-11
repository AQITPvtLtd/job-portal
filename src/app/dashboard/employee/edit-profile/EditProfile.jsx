"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, MapPin, FileText, Briefcase, Award, GraduationCap, Upload, Link } from "lucide-react";
import Swal from "sweetalert2";
import BackButton from "@/components/backbutton/BackButton";

export default function EditProfile() {
    const { data: session, status } = useSession();

    const [profile, setProfile] = useState({
        user_id: "",
        full_name: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        profile_image: "",
        resume_url: "",
        experience: "",
        skills: "",
        education: "",
    });
    const [file, setFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState("");

    // ✅ 1️⃣ Set user_id from session when available
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            setProfile((prev) => ({
                ...prev,
                user_id: session.user.id,
                email: session.user.email || "",
                full_name: session.user.name || "",
            }));
        }
    }, [status, session]);

    // ✅ 2️⃣ Fetch profile data after user_id is set
    useEffect(() => {
        if (!profile.user_id) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/profile/${profile.user_id}`);
                const data = await res.json();

                if (res.ok && !data.error) {
                    setProfile((prev) => ({
                        ...prev,
                        ...data,
                        // Ensure null values are converted to empty strings
                        bio: data.bio || "",
                        experience: data.experience || "",
                        skills: data.skills || "",
                        education: data.education || "",
                        phone: data.phone || "",
                        location: data.location || "",
                        resume_url: data.resume_url || "",
                    }));
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, [profile.user_id]);

    // ✅ 3️⃣ Validate and handle profile image upload
    const validateImage = (file) => {
        return new Promise((resolve, reject) => {
            // Check file size (max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                reject("Image size should be less than 2MB");
                return;
            }

            // Check file type
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                reject("Only JPG, PNG, and WebP images are allowed");
                return;
            }

            // Check image dimensions (optional)
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(objectUrl);

                // Check minimum dimensions
                if (img.width < 200 || img.height < 200) {
                    reject("Image should be at least 200x200 pixels");
                    return;
                }

                // Check maximum dimensions
                if (img.width > 2000 || img.height > 2000) {
                    reject("Image should not exceed 2000x2000 pixels");
                    return;
                }

                resolve(true);
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject("Invalid image file");
            };

            img.src = objectUrl;
        });
    };

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setImageError("");

        try {
            await validateImage(selectedFile);
            setFile(selectedFile);
            setImageError("");
        } catch (error) {
            setImageError(error);
            setFile(null);
            e.target.value = ""; // Reset file input
        }
    };

    const handleImageUpload = async () => {
        if (!file) return profile.profile_image;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/profile/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (data.success) return data.url;
        return profile.profile_image;
    };

    // ✅ 4️⃣ Handle resume upload
    const handleResumeUpload = async () => {
        if (!resumeFile) return profile.resume_url;

        const formData = new FormData();
        formData.append("file", resumeFile);

        const res = await fetch("/api/profile/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (data.success) return data.url;
        return profile.resume_url;
    };

    // ✅ 5️⃣ Update profile → PUT /api/profile/:id
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const uploadedImageUrl = await handleImageUpload();
        const uploadedResumeUrl = await handleResumeUpload();

        try {
            const res = await fetch(`/api/profile/${profile.user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: profile.full_name,
                    email: profile.email,
                    phone: profile.phone,
                    location: profile.location,
                    bio: profile.bio,
                    profile_image: uploadedImageUrl,
                    resume_url: uploadedResumeUrl,
                    experience: profile.experience,
                    skills: profile.skills,
                    education: profile.education,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ Refresh profile data after update
                const refreshRes = await fetch(`/api/profile/${profile.user_id}`);
                const refreshedData = await refreshRes.json();

                if (refreshRes.ok && !refreshedData.error) {
                    setProfile((prev) => ({
                        ...prev,
                        ...refreshedData,
                        bio: refreshedData.bio || "",
                        experience: refreshedData.experience || "",
                        skills: refreshedData.skills || "",
                        education: refreshedData.education || "",
                        phone: refreshedData.phone || "",
                        location: refreshedData.location || "",
                        resume_url: refreshedData.resume_url || "",
                    }));
                }

                // Trigger navbar refresh
                window.dispatchEvent(new Event('profileUpdated'));

                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Profile updated successfully!",
                    confirmButtonColor: "#2563eb",
                    confirmButtonText: "Great!",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: data.error || "Error updating profile",
                    confirmButtonColor: "#dc2626",
                    confirmButtonText: "Try Again",
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong. Please try again.",
                confirmButtonColor: "#dc2626",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ 6️⃣ Show proper loading states
    if (status === "loading") {
        return <p className="text-center mt-10 text-gray-600">Loading session...</p>;
    }

    if (!session) {
        return (
            <div className="max-w-2xl mx-auto p-6 mt-10">
                <p className="text-center text-red-600 text-lg">Please login to edit your profile.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <div className="mb-8 border-b pb-4 flex justify-between">
                <h2 className="text-3xl font-bold  text-gray-800">Edit Your Profile</h2>
                <BackButton />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Profile Picture</h3>
                    <div className="flex items-center space-x-6">
                        <img
                            src={profile.profile_image || "/default-avatar.png"}
                            alt="Profile"
                            className="w-24 text-black h-24 rounded-full object-cover border-4 border-blue-500"
                        />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="inline w-4 h-4 mr-2" />
                                Upload New Image
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="w-full text-black border border-gray-300 rounded p-2 text-sm"
                            />
                            {imageError && (
                                <p className="text-red-600 text-xs mt-1">⚠️ {imageError}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Max size: 2MB | Dimensions: 200x200 to 2000x2000 pixels | Formats: JPG, PNG, WebP
                            </p>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-black">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="inline w-4 h-4 mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="inline w-4 h-4 mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="inline w-4 h-4 mr-2" />
                                Phone
                            </label>
                            <input
                                type="text"
                                placeholder="+1 (555) 123-4567"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="inline w-4 h-4 mr-2" />
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="City, State, Country"
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Professional Summary</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="inline w-4 h-4 mr-2" />
                        Bio
                    </label>
                    <textarea
                        placeholder="Tell us about yourself, your career goals, and what makes you unique..."
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                    />
                </div>

                {/* Resume Upload */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Resume</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Upload className="inline w-4 h-4 mr-2" />
                        Upload Resume (PDF, DOC, DOCX)
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="w-full text-black border border-gray-300 rounded p-2 text-sm mb-2"
                    />
                    {profile.resume_url && (
                        <p className="text-sm text-gray-600">
                            Current resume:{" "}
                            <Link href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Resume
                            </Link>
                        </p>
                    )}
                </div>

                {/* Experience */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Work Experience</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="inline w-4 h-4 mr-2" />
                        Professional Experience
                    </label>
                    <textarea
                        placeholder="Describe your work experience, job titles, companies, and key achievements..."
                        value={profile.experience}
                        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="5"
                    />
                </div>

                {/* Skills */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Skills</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Award className="inline w-4 h-4 mr-2" />
                        Your Skills
                    </label>
                    <textarea
                        placeholder="List your key skills (e.g., JavaScript, React, Project Management, Communication)..."
                        value={profile.skills}
                        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                        className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                    />
                </div>

                {/* Education */}
                <div className="bg-gray-50 p-6 rounded-lg overflow-x-hidden">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Education</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="inline w-4 h-4 mr-2" />
                        Educational Background
                    </label>
                    <textarea
                        placeholder="List your degrees, certifications, schools, and graduation dates..."
                        value={profile.education}
                        onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                        className="w-full text-black border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving Changes..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}