// import { db } from "@/lib/db";
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// // 🟢 Fetch all jobs for the logged-in employer
// export async function GET(req) {
//     try {
//         const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//         if (!token || token.role !== "employer") {
//             return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const employerId = token.sub || token.id;

//         const [rows] = await db.execute(
//             `SELECT 
//           id,
//           title,
//           company_name,
//           location,
//           location_type,
//           city,
//           area,
//           pincode,
//           street_address,
//           type,
//           salary_min,
//           salary_max,
//           experience_required,
//           education_level,
//           skills,
//           description,
//           expires_at,
//           status,
//           created_at
//         FROM jobs 
//         WHERE employer_id = ?
//         ORDER BY created_at DESC`,
//             [employerId]
//         );

//         return NextResponse.json({ ok: true, jobs: rows });
//     } catch (err) {
//         console.error("GET /jobs error:", err);
//         return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
//     }
// }

// // 🟡 Create a new job
// export async function POST(req) {
//     try {
//         const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//         if (!token || token.role !== "employer") {
//             return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const employerId = token.sub || token.id;
//         const body = await req.json();

//         let {
//             title,
//             company_name,
//             location, // Keep for backward compatibility
//             location_type, // ✅ NEW
//             city, // ✅ NEW
//             area, // ✅ NEW
//             pincode, // ✅ NEW
//             street_address, // ✅ NEW
//             type,
//             salary_min,
//             salary_max,
//             experience_required,
//             education_level,
//             skills,
//             description,
//             expires_at,
//             status,
//         } = body;

//         // Basic validation
//         if (!title || !location_type) {
//             return NextResponse.json(
//                 { ok: false, message: "Job title and location type are required" },
//                 { status: 400 }
//             );
//         }

//         // ✅ Validate location fields for non-remote jobs
//         if (location_type !== 'remote' && !city) {
//             return NextResponse.json(
//                 { ok: false, message: "City is required for on-site and hybrid jobs" },
//                 { status: 400 }
//             );
//         }

//         // ✅ Build location string from new fields
//         if (location_type === 'remote') {
//             location = 'Remote';
//         } else {
//             // Combine city, area, pincode for location field
//             const locationParts = [city, area, pincode].filter(Boolean);
//             location = locationParts.join(', ') || city;
//         }

//         // ✅ Auto-fetch company_name from employers table if not provided
//         if (!company_name || company_name.trim() === "") {
//             const [employerRows] = await db.execute(
//                 `SELECT company_name FROM employers WHERE user_id = ?`,
//                 [employerId]
//             );

//             if (employerRows.length > 0 && employerRows[0].company_name) {
//                 company_name = employerRows[0].company_name;
//             } else {
//                 // Fallback: Fetch from users table
//                 const [userRows] = await db.execute(
//                     `SELECT name FROM users WHERE id = ?`,
//                     [employerId]
//                 );
//                 company_name = userRows.length > 0 ? userRows[0].name : "Unknown Company";
//             }
//         }

//         // ✅ Insert new job into database with new location fields
//         const [result] = await db.execute(
//             `INSERT INTO jobs (
//         employer_id,
//         title,
//         company_name,
//         location,
//         location_type,
//         city,
//         area,
//         pincode,
//         street_address,
//         type,
//         salary_min,
//         salary_max,
//         experience_required,
//         education_level,
//         skills,
//         description,
//         expires_at,
//         status,
//         created_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
//             [
//                 employerId,
//                 title,
//                 company_name,
//                 location, // Combined location string
//                 location_type || null, // ✅ NEW
//                 city || null, // ✅ NEW
//                 area || null, // ✅ NEW
//                 pincode || null, // ✅ NEW
//                 street_address || null, // ✅ NEW
//                 type || "full-time",
//                 salary_min || null,
//                 salary_max || null,
//                 experience_required || "",
//                 education_level || "",
//                 skills || "",
//                 description || "",
//                 expires_at || null,
//                 status || "published",
//             ]
//         );

//         return NextResponse.json({ ok: true, jobId: result.insertId, company_name });
//     } catch (err) {
//         console.error("POST /jobs error:", err);
//         return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
//     }
// }

import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'; // ✅ Import UUID

// 🟢 Fetch all jobs for the logged-in employer
export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token.id;

        const [rows] = await db.execute(
            `SELECT 
          id,
          job_id,
          title,
          company_name,
          location,
          location_type,
          city,
          area,
          pincode,
          street_address,
          type,
          salary_min,
          salary_max,
          experience_required,
          education_level,
          skills,
          description,
          expires_at,
          status,
          created_at
        FROM jobs 
        WHERE employer_id = ?
        ORDER BY created_at DESC`,
            [employerId]
        );

        return NextResponse.json({ ok: true, jobs: rows });
    } catch (err) {
        console.error("GET /jobs error:", err);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

// 🟡 Create a new job
export async function POST(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub || token.id;
        const body = await req.json();

        let {
            title,
            company_name,
            location,
            location_type,
            city,
            area,
            pincode,
            street_address,
            type,
            salary_min,
            salary_max,
            experience_required,
            education_level,
            skills,
            description,
            expires_at,
            status,
        } = body;

        // Basic validation
        if (!title || !location_type) {
            return NextResponse.json(
                { ok: false, message: "Job title and location type are required" },
                { status: 400 }
            );
        }

        // ✅ Validate location fields for non-remote jobs
        if (location_type !== 'remote' && !city) {
            return NextResponse.json(
                { ok: false, message: "City is required for on-site and hybrid jobs" },
                { status: 400 }
            );
        }

        // ✅ Build location string from new fields
        if (location_type === 'remote') {
            location = 'Remote';
        } else {
            const locationParts = [city, area, pincode].filter(Boolean);
            location = locationParts.join(', ') || city;
        }

        // ✅ Auto-fetch company_name from employers table if not provided
        if (!company_name || company_name.trim() === "") {
            const [employerRows] = await db.execute(
                `SELECT company_name FROM employers WHERE user_id = ?`,
                [employerId]
            );

            if (employerRows.length > 0 && employerRows[0].company_name) {
                company_name = employerRows[0].company_name;
            } else {
                const [userRows] = await db.execute(
                    `SELECT name FROM users WHERE id = ?`,
                    [employerId]
                );
                company_name = userRows.length > 0 ? userRows[0].name : "Unknown Company";
            }
        }

        // ✅ Generate unique UUID for job_id
        const jobId = uuidv4();

        // ✅ Insert new job into database with UUID
        const [result] = await db.execute(
            `INSERT INTO jobs (
        job_id,
        employer_id,
        title,
        company_name,
        location,
        location_type,
        city,
        area,
        pincode,
        street_address,
        type,
        salary_min,
        salary_max,
        experience_required,
        education_level,
        skills,
        description,
        expires_at,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                jobId, // ✅ UUID
                employerId,
                title,
                company_name,
                location,
                location_type || null,
                city || null,
                area || null,
                pincode || null,
                street_address || null,
                type || "full-time",
                salary_min || null,
                salary_max || null,
                experience_required || "",
                education_level || "",
                skills || "",
                description || "",
                expires_at || null,
                status || "published",
            ]
        );

        return NextResponse.json({
            ok: true,
            jobId: jobId, // ✅ Return UUID instead of insertId
            company_name
        });
    } catch (err) {
        console.error("POST /jobs error:", err);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}