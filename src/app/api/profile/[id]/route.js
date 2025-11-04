// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// // GET profile by user_id
// export async function GET(req, context) {
//     try {
//         const { id } = await context.params; // ✅ await params
//         const userId = id;

//         if (!userId) {
//             return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//         }

//         // Get user role
//         const [userRows] = await db.query("SELECT role FROM users WHERE id = ?", [userId]);
//         if (userRows.length === 0) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         const role = userRows[0].role;
//         const table = role === "employer" ? "employers" : "employees";

//         const [rows] = await db.query(`SELECT * FROM ${table} WHERE user_id = ?`, [userId]);
//         if (rows.length === 0) {
//             return NextResponse.json({ error: "Profile not found" }, { status: 404 });
//         }

//         return NextResponse.json(rows[0]);
//     } catch (error) {
//         console.error("Error fetching profile:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// // PUT (update profile)
// export async function PUT(req, context) {
//     try {
//         const { id } = await context.params; // ✅ await params
//         const user_id = id;

//         const body = await req.json();
//         const {
//             full_name,
//             email,
//             phone,
//             location,
//             bio,
//             profile_image,
//             resume_url,      // ✅ Added
//             experience,      // ✅ Added
//             skills,          // ✅ Added
//             education        // ✅ Added
//         } = body;

//         if (!user_id) {
//             return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//         }

//         // Get role
//         const [userRows] = await db.query("SELECT role FROM users WHERE id = ?", [user_id]);
//         if (userRows.length === 0) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         const role = userRows[0].role;
//         const table = role === "employer" ? "employers" : "employees";

//         // Ensure record exists first
//         await db.query(`INSERT IGNORE INTO ${table} (user_id) VALUES (?)`, [user_id]);

//         // ✅ Update record with all fields
//         await db.query(
//             `UPDATE ${table}
//              SET full_name = ?, 
//                  email = ?, 
//                  phone = ?, 
//                  location = ?, 
//                  bio = ?, 
//                  profile_image = ?,
//                  resume_url = ?,
//                  experience = ?,
//                  skills = ?,
//                  education = ?
//              WHERE user_id = ?`,
//             [
//                 full_name,
//                 email,
//                 phone,
//                 location,
//                 bio,
//                 profile_image,
//                 resume_url,    // ✅ Added
//                 experience,    // ✅ Added
//                 skills,        // ✅ Added
//                 education,     // ✅ Added
//                 user_id
//             ]
//         );

//         return NextResponse.json({ message: "Profile updated successfully" });
//     } catch (error) {
//         console.error("Error updating profile:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET profile by user_id
export async function GET(req, context) {
    try {
        const { id } = await context.params;
        const userId = id;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Get user role
        const [userRows] = await db.query("SELECT role FROM users WHERE id = ?", [userId]);
        if (userRows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const role = userRows[0].role;
        const table = role === "employer" ? "employers" : "employees";

        const [rows] = await db.query(`SELECT * FROM ${table} WHERE user_id = ?`, [userId]);
        if (rows.length === 0) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0], {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT (update profile) - Updates both users table and employee/employer table
export async function PUT(req, context) {
    try {
        const { id } = await context.params;
        const user_id = id;

        const body = await req.json();

        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Get role
        const [userRows] = await db.query("SELECT role FROM users WHERE id = ?", [user_id]);
        if (userRows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const role = userRows[0].role;
        const table = role === "employer" ? "employers" : "employees";

        // Ensure record exists first
        await db.query(`INSERT IGNORE INTO ${table} (user_id) VALUES (?)`, [user_id]);

        // ✅ Update based on role
        if (role === "employer") {
            // Employer fields
            const {
                company_name,
                email,
                phone,
                website,
                address,
                about,
                logo,
                industry,
                team_size
            } = body;

            // ✅ 1️⃣ UPDATE USERS TABLE
            await db.query(
                `UPDATE users 
                 SET name = ?, email = ?, phone = ? 
                 WHERE id = ?`,
                [company_name, email, phone, user_id]
            );

            // ✅ 2️⃣ UPDATE EMPLOYERS TABLE
            await db.query(
                `UPDATE employers
                 SET company_name = ?, 
                     email = ?, 
                     phone = ?, 
                     website = ?, 
                     address = ?, 
                     about = ?,
                     logo = ?,
                     industry = ?,
                     team_size = ?
                 WHERE user_id = ?`,
                [
                    company_name,
                    email,
                    phone,
                    website,
                    address,
                    about,
                    logo,
                    industry,
                    team_size,
                    user_id
                ]
            );
        } else {
            // Employee fields
            const {
                full_name,
                email,
                phone,
                location,
                bio,
                profile_image,
                resume_url,
                experience,
                skills,
                education
            } = body;

            // ✅ 1️⃣ UPDATE USERS TABLE
            await db.query(
                `UPDATE users 
                 SET name = ?, email = ?, phone = ? 
                 WHERE id = ?`,
                [full_name, email, phone, user_id]
            );

            // ✅ 2️⃣ UPDATE EMPLOYEES TABLE
            await db.query(
                `UPDATE employees
                 SET full_name = ?, 
                     email = ?, 
                     phone = ?, 
                     location = ?, 
                     bio = ?, 
                     profile_image = ?,
                     resume_url = ?,
                     experience = ?,
                     skills = ?,
                     education = ?
                 WHERE user_id = ?`,
                [
                    full_name,
                    email,
                    phone,
                    location,
                    bio,
                    profile_image,
                    resume_url,
                    experience,
                    skills,
                    education,
                    user_id
                ]
            );
        }

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}