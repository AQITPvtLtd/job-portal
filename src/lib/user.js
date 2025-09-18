import { db } from "./db";
import bcrypt from "bcrypt";

export async function createUser({ name, email, role, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)", [
        name,
        email,
        role,
        hashedPassword,
    ]);
}

export async function findUserByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
}
