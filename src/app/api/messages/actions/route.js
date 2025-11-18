// import { db } from "@/lib/db";
// import { getToken } from "next-auth/jwt";

// export async function POST(req) {
//     try {
//         const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//         if (!token) {
//             return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const myUserId = token.sub || token.id;
//         const body = await req.json();
//         const { uniqueId, action } = body; // action: 'archive', 'spam', 'unarchive', 'unspam'

//         if (!uniqueId || !action) {
//             return Response.json({ ok: false, message: "uniqueId and action required" }, { status: 400 });
//         }

//         // Find other user's user_id from uniqueId
//         let [employeeRows] = await db.execute(
//             `SELECT user_id FROM employees WHERE employee_id = ?`,
//             [uniqueId]
//         );

//         let otherUserId = null;

//         if (employeeRows.length > 0) {
//             otherUserId = employeeRows[0].user_id;
//         } else {
//             let [employerRows] = await db.execute(
//                 `SELECT user_id FROM employers WHERE employer_id = ?`,
//                 [uniqueId]
//             );

//             if (employerRows.length > 0) {
//                 otherUserId = employerRows[0].user_id;
//             }
//         }

//         if (!otherUserId) {
//             return Response.json({ ok: false, message: "User not found" }, { status: 404 });
//         }

//         // Perform action on all messages between me and other user
//         let query = '';
//         let value = 0;

//         switch (action) {
//             case 'archive':
//                 query = `UPDATE messages SET is_archived = 1 
//                          WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`;
//                 value = 1;
//                 break;
//             case 'unarchive':
//                 query = `UPDATE messages SET is_archived = 0 
//                          WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`;
//                 value = 0;
//                 break;
//             case 'spam':
//                 query = `UPDATE messages SET is_spam = 1 
//                          WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`;
//                 value = 1;
//                 break;
//             case 'unspam':
//                 query = `UPDATE messages SET is_spam = 0 
//                          WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`;
//                 value = 0;
//                 break;
//             default:
//                 return Response.json({ ok: false, message: "Invalid action" }, { status: 400 });
//         }

//         await db.execute(query, [myUserId, otherUserId, otherUserId, myUserId]);

//         return Response.json({ ok: true, message: `Conversation ${action}d successfully` });
//     } catch (err) {
//         console.error("Message action error:", err);
//         return Response.json({ ok: false, message: "Server error" }, { status: 500 });
//     }
// }


import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
        }

        const myUserId = token.sub || token.id;
        const body = await req.json();
        const { uniqueId, action } = body; // action: 'archive', 'spam', 'inbox'

        if (!uniqueId || !action) {
            return Response.json({ ok: false, message: "uniqueId and action required" }, { status: 400 });
        }

        // Find other user's user_id from uniqueId
        let [employeeRows] = await db.execute(
            `SELECT user_id FROM employees WHERE employee_id = ?`,
            [uniqueId]
        );

        let otherUserId = null;

        if (employeeRows.length > 0) {
            otherUserId = employeeRows[0].user_id;
        } else {
            let [employerRows] = await db.execute(
                `SELECT user_id FROM employers WHERE employer_id = ?`,
                [uniqueId]
            );

            if (employerRows.length > 0) {
                otherUserId = employerRows[0].user_id;
            }
        }

        if (!otherUserId) {
            return Response.json({ ok: false, message: "User not found" }, { status: 404 });
        }

        // Perform action - Mutually exclusive states
        let message = '';

        switch (action) {
            case 'archive':
                // Set archived=1, spam=0
                await db.execute(
                    `UPDATE messages 
                     SET is_archived = 1, is_spam = 0 
                     WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`,
                    [myUserId, otherUserId, otherUserId, myUserId]
                );
                message = 'Conversation archived successfully';
                break;

            case 'spam':
                // Set spam=1, archived=0
                await db.execute(
                    `UPDATE messages 
                     SET is_spam = 1, is_archived = 0 
                     WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`,
                    [myUserId, otherUserId, otherUserId, myUserId]
                );
                message = 'Conversation marked as spam successfully';
                break;

            case 'inbox':
                // Move back to inbox: archived=0, spam=0
                await db.execute(
                    `UPDATE messages 
                     SET is_archived = 0, is_spam = 0 
                     WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`,
                    [myUserId, otherUserId, otherUserId, myUserId]
                );
                message = 'Conversation moved to inbox successfully';
                break;

            default:
                return Response.json({ ok: false, message: "Invalid action" }, { status: 400 });
        }

        return Response.json({ ok: true, message });
    } catch (err) {
        console.error("Message action error:", err);
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}