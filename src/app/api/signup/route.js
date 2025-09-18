import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/user";

export async function POST(req) {
    const { name, email, role, password } = await req.json();
    const existing = await findUserByEmail(email);

    if (existing) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    await createUser({ name, email, role, password });
    return NextResponse.json({ success: true });
}
