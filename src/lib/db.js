import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
    host: "localhost",   // e.g. localhost
    user: "root",
    password: "",
    database: "jobplatform",
});
