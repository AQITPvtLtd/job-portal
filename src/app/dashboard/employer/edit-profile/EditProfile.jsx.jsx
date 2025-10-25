"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Building2, Mail, Phone, Globe, MapPin, FileText, Briefcase, Users, Upload } from "lucide-react";
import Swal from "sweetalert2";

export default function EmployerEditProfile() {
    const { data: session, status } = useSession();

    const [profile, setProfile] = useState({
        user_id: "",
        company_name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        about: "",
        logo: "",
        industry: "",
        team_size: "",
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState("");

    // ✅ 1️⃣ Set user_id from session when available
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            setProfile((prev) => ({
                ...prev,
                user_id: session.user.id,
                email: session.user.email || "",
                company_name: session.user.name || "",
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
                        about: data.about || "",
                        phone: data.phone || "",
                        website: data.website || "",
                        address: data.address || "",
                        industry: data.industry || "",
                        team_size: data.team_size || "",
                        logo: data.logo || "",
                    }));
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, [profile.user_id]);

    // ✅ 3️⃣ Validate and handle logo upload
    const validateImage = (file) => {
        return new Promise((resolve, reject) => {
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                reject("Logo size should be less than 2MB");
                return;
            }

            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                reject("Only JPG, PNG, and WebP images are allowed");
                return;
            }

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                
                if (img.width < 200 || img.height < 200) {
                    reject("Logo should be at least 200x200 pixels");
                    return;
                }
                
                if (img.width > 2000 || img.height > 2000) {
                    reject("Logo should not exceed 2000x2000 pixels");
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
            e.target.value = "";
        }
    };

    const handleLogoUpload = async () => {
        if (!file) return profile.logo;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/profile/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (data.success) return data.url;
        return profile.logo;
    };

    // ✅ 4️⃣ Update profile → PUT /api/profile/:id
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const uploadedLogoUrl = await handleLogoUpload();

        try {
            const res = await fetch(`/api/profile/${profile.user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_name: profile.company_name,
                    email: profile.email,
                    phone: profile.phone,
                    website: profile.website,
                    address: profile.address,
                    about: profile.about,
                    logo: uploadedLogoUrl,
                    industry: profile.industry,
                    team_size: profile.team_size,
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
                        about: refreshedData.about || "",
                        phone: refreshedData.phone || "",
                        website: refreshedData.website || "",
                        address: refreshedData.address || "",
                        industry: refreshedData.industry || "",
                        team_size: refreshedData.team_size || "",
                        logo: refreshedData.logo || "",
                    }));
                }

                // Trigger navbar refresh
                window.dispatchEvent(new Event('profileUpdated'));

                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Company profile updated successfully!",
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

    // ✅ 5️⃣ Show proper loading states
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
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Edit Company Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Logo Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Company Logo</h3>
                    <div className="flex items-center space-x-6">
                        <img
                            src={profile.logo || "/default-company-logo.png"}
                            alt="Company Logo"
                            className="w-24 h-24 rounded-lg object-cover border-4 border-blue-500"
                        />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="inline w-4 h-4 mr-2" />
                                Upload New Logo
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="w-full border border-gray-300 rounded p-2 text-sm"
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

                {/* Company Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Building2 className="inline w-4 h-4 mr-2" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter company name"
                                value={profile.company_name}
                                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="inline w-4 h-4 mr-2" />
                                Company Email
                            </label>
                            <input
                                type="email"
                                placeholder="contact@company.com"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="inline w-4 h-4 mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="text"
                                placeholder="+1 (555) 123-4567"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Globe className="inline w-4 h-4 mr-2" />
                                Website
                            </label>
                            <input
                                type="text"
                                placeholder="https://www.company.com"
                                value={profile.website}
                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="inline w-4 h-4 mr-2" />
                                Company Address
                            </label>
                            <input
                                type="text"
                                placeholder="123 Business St, City, State, ZIP"
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Company Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Briefcase className="inline w-4 h-4 mr-2" />
                                Industry
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Technology, Healthcare, Finance"
                                value={profile.industry}
                                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="inline w-4 h-4 mr-2" />
                                Team Size
                            </label>
                            <select
                                value={profile.team_size}
                                onChange={(e) => setProfile({ ...profile, team_size: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select team size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="501-1000">501-1000 employees</option>
                                <option value="1000+">1000+ employees</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* About Company */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">About Company</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="inline w-4 h-4 mr-2" />
                        Company Description
                    </label>
                    <textarea
                        placeholder="Tell us about your company, mission, values, and what makes you unique..."
                        value={profile.about}
                        onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                        className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="5"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving Changes..." : "Save Company Profile"}
                </button>
            </form>
        </div>
    );
}