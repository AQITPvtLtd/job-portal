import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");

        if (!file) {
            return Response.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/${fileName}`;

        return Response.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Error uploading file:", error);
        return Response.json({ error: "File upload failed" }, { status: 500 });
    }
}
