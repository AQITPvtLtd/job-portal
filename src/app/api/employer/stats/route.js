import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "employer") {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const employerId = token.sub;

        // ✅ Total Jobs
        const [totalJobs] = await db.execute(
            "SELECT COUNT(*) as count FROM jobs WHERE employer_id = ?",
            [employerId]
        );

        // ✅ Active Jobs
        const [activeJobs] = await db.execute(
            "SELECT COUNT(*) as count FROM jobs WHERE employer_id = ? AND status = 'published'",
            [employerId]
        );

        // ✅ Total Applicants
        const [totalApplicants] = await db.execute(
            `SELECT COUNT(*) as count 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE j.employer_id = ?`,
            [employerId]
        );

        // ✅ Applicants by Job
        const [applicantsByJob] = await db.execute(
            `SELECT j.title, COUNT(a.id) as count 
       FROM jobs j 
       LEFT JOIN applications a ON j.id = a.job_id 
       WHERE j.employer_id = ? 
       GROUP BY j.id`,
            [employerId]
        );

        // ✅ Job Type Distribution (Pie Chart)
        const [jobTypes] = await db.execute(
            `SELECT j.type, COUNT(*) as count 
       FROM jobs j
       WHERE j.employer_id = ?
       GROUP BY j.type`,
            [employerId]
        );

        // ✅ Applicants per Month (Line Chart)
        const [applicantsPerMonth] = await db.execute(
            `SELECT DATE_FORMAT(a.created_at, '%Y-%m') as month, COUNT(*) as count
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE j.employer_id = ?
       GROUP BY month
       ORDER BY month ASC`,
            [employerId]
        );

        return Response.json({
            ok: true,
            totalJobs: totalJobs[0].count,
            activeJobs: activeJobs[0].count,
            totalApplicants: totalApplicants[0].count,
            applicantsByJob,
            jobTypes,
            applicantsPerMonth,
        });
    } catch (err) {
        console.error("Employer Stats Error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
