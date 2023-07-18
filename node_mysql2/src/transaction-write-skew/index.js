import {addLogForQueryMethod, loadSampleData, txnLogHeader} from "../helper.js";
import * as path from "path";
import {createConnection} from "mysql2/promise";
import dotenv from "dotenv";

async function main() {
    // Load environment variables from .env file.
    dotenv.config();

    // Load sample data.
    const conn = await createConnection(process.env.DATABASE_URL);
    try {
        await loadSampleData(conn, path.join(process.cwd(), 'sql/doctors.init.sql'));
    } finally {
        // Close the connection.
        await conn.end();
    }

    // Run the demo.
    const conn1 = await createConnection(process.env.DATABASE_URL);
    const conn2 = await createConnection(process.env.DATABASE_URL);
    const conn3 = await createConnection(process.env.DATABASE_URL);
    try {
        // Create thread 1.
        addLogForQueryMethod(conn1, 1);
        const thread1 = askForLeave(conn1, 1, 'Alice', process.env.WITHOUT_FOR_UPDATE);

        // Create thread 2.

        addLogForQueryMethod(conn2, 2);
        const thread2 = askForLeave(conn2, 2, 'Bob', process.env.WITHOUT_FOR_UPDATE);

        // Run two threads concurrently to mock two doctors asking for leave.
        await Promise.all([thread1, thread2]);

        const onCallDoctors = await getOnCallDoctors(conn3);
        if (onCallDoctors.length >= 1) {
            console.log(`\nFinally, doctor ${onCallDoctors.map((r) => r.name).join(', ')} is on call.`);
        } else {
            console.warn(`\nFinally, no doctor is on call (it's not what we expected).`)
        }
    } finally {
        // Close the connections.
        await conn1.end();
        await conn2.end();
        await conn3.end();
    }
}

async function askForLeave(conn, threadId, dockerName, withoutForUpdate) {
    console.log(`${txnLogHeader(threadId)} Doctor ${dockerName} is asking for leave...`)
    await conn.query('BEGIN;');

    try {
        // Check if the book exists.
        const forUpdate = withoutForUpdate ? '' : 'FOR UPDATE';
        const [rows] = await conn.query(`SELECT COUNT(*) AS cnt FROM doctors WHERE on_call = ? ${forUpdate};`, [true]);
        const currentOnCall = rows[0].cnt;

        // Check if there is more than one doctor on call.
        if (currentOnCall < 2) {
            throw new Error('At least one doctor needs to be on call');
        } else {
            console.log(`${txnLogHeader(threadId)} There are ${currentOnCall} doctors on call.`);
        }

        // If two or more doctors are currently on call, the doctor can take leave.
        const updateOnCall = 'UPDATE doctors SET on_call = ? WHERE name = ?;';
        const [rsh] = await conn.query(updateOnCall, [false, dockerName]);
        if (rsh.affectedRows === 0) {
            throw new Error(`${txnLogHeader(threadId)} Failed to update on call status for doctor ${dockerName}`);
        } else {
            await conn.query('COMMIT;');
            console.log(`${txnLogHeader(threadId)} Doctor ${dockerName}'s leave has been approved.`);
        }
    } catch (err) {
        await conn.query('ROLLBACK;');
        console.error(`${txnLogHeader(threadId)} Something went wrong: ${err}`);
    }
}

async function getOnCallDoctors(conn) {
    const [rows] = await conn.query('SELECT name FROM doctors WHERE on_call = ?', [true]);
    return rows;
}

main().catch(err => {
    console.error('Error occurred:', err);
    process.exit(1);
});