import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, password, confirmPassword, role } = body;

        // 1️⃣ Validate all required fields
        if (!name || !email || !phone || !password || !confirmPassword || !role) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // 2️⃣ Check if passwords match
        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        // 3️⃣ Check if user already exists
        const [existing] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // 4️⃣ Hash the password
        const hash = await bcrypt.hash(password, 10);

        // 5️⃣ Insert new user into 'users' table
        const [result] = await db.query(
            "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, hash, role]
        );

        const userId = result.insertId;

        // 6️⃣ Create a related record depending on role
        if (role === "employee") {
            await db.query("INSERT INTO employees (user_id) VALUES (?)", [userId]);
        } else if (role === "employer") {
            await db.query("INSERT INTO employers (user_id) VALUES (?)", [userId]);
        }

        // 7️⃣ Respond success
        return NextResponse.json(
            { message: "Account created successfully", userId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
