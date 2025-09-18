// src/app/api/employee/applications/route.js
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employee") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }
        const employeeId = token.sub || token.id;

        // parse FormData (we expect resume file + other fields)
        const formData = await req.formData();
        const jobId = formData.get("job_id");
        const name = formData.get("name") || null;
        const email = formData.get("email") || null;
        const phone = formData.get("phone") || null;
        const address = formData.get("address") || null;
        const coverLetter = formData.get("cover_letter") || formData.get("coverLetter") || null;
        const experience = formData.get("experience") || null;
        const skills = formData.get("skills") || null;

        if (!jobId) {
            return Response.json({ ok: false, message: "Job ID required" }, { status: 400 });
        }

        // save resume (if any)
        let resumePath = null;
        const resumeFile = formData.get("resume");
        if (resumeFile && resumeFile.name) {
            const bytes = await resumeFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${resumeFile.name.replace(/\s+/g, "_")}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            resumePath = `/uploads/${fileName}`;
        }

        // Insert into applications
        const [result] = await db.execute(
            `INSERT INTO applications 
        (job_id, employee_id, name, email, phone, address, cover_letter, experience, skills, resume, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
            [jobId, employeeId, name, email, phone, address, coverLetter, experience, skills, resumePath]
        );

        const applicationId = result.insertId;

        // find employer for this job
        const [jobRows] = await db.execute("SELECT employer_id, title FROM jobs WHERE id = ? LIMIT 1", [jobId]);
        if (jobRows.length > 0) {
            const employerId = jobRows[0].employer_id;
            const jobTitle = jobRows[0].title || "your job";

            // create notification for employer (using your notifications schema)
            await db.execute(
                `INSERT INTO notifications (user_id, type, title, body, payload, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, 0, NOW())`,
                [
                    employerId,
                    "application",
                    `New application for "${jobTitle}"`,
                    `${name || "Someone"} applied for "${jobTitle}"`,
                    JSON.stringify({ jobId: Number(jobId), applicationId, employeeId })
                ]
            );
        }

        return Response.json({ ok: true, applicationId });
    } catch (err) {
        console.error("Create application error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
