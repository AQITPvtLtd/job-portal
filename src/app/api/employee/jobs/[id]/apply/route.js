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
        const employeeId = token.sub;

        // ✅ FormData parse
        const formData = await req.formData();
        const jobId = formData.get("job_id");
        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const address = formData.get("address");
        const coverLetter = formData.get("coverLetter");
        const experience = formData.get("experience");
        const skills = formData.get("skills");

        // ✅ Resume save to public/uploads
        let resumePath = null;
        const resumeFile = formData.get("resume");
        if (resumeFile && resumeFile.name) {
            const bytes = await resumeFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads");

            // 🔥 Ensure uploads folder exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}-${resumeFile.name}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            resumePath = `/uploads/${fileName}`;
        }

        // ✅ Insert into DB
        await db.execute(
            `INSERT INTO applications 
             (job_id, employee_id, name, email, phone, address, cover_letter, experience, skills, resume, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                jobId,
                employeeId,
                name,
                email,
                phone,
                address,
                coverLetter,
                experience,
                skills,
                resumePath,
                "pending",
            ]
        );

        return Response.json({ ok: true, message: "Application submitted!" });
    } catch (err) {
        console.error("Application Error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
