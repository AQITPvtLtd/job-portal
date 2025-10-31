import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    try {
        // Check authentication
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${timestamp}_${originalName}`;

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'messages');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (err) {
            // Directory already exists
        }

        // Save file
        const filePath = join(uploadsDir, fileName);
        await writeFile(filePath, buffer);

        // Return file URL
        const fileUrl = `/uploads/messages/${fileName}`;

        return NextResponse.json({
            ok: true,
            fileUrl,
            fileName: file.name,
            fileType: file.type
        });

    } catch (error) {
        console.error("File upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}