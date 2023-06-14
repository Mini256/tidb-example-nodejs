import ConnectionConfig from "mysql/lib/ConnectionConfig.js";
import {loadEnvWithDatabaseURL} from "../env.js";
import {createPromisifyConn, txnLogHeader} from "../helper.js";
import * as path from "path";
import * as fs from "fs";

// Load environment variables from .env file.
const config = loadEnvWithDatabaseURL();

async function main() {
    // Load sample data.
    const conn = await createPromisifyConn(ConnectionConfig.parseUrl(config.DATABASE_URL));
    await conn.query('SET @@tidb_multi_statement_mode = ON;')
    const sql = fs.readFileSync(path.resolve(process.cwd(), './sql/doctors.init.sql'), 'utf8');
    await conn.query(sql);

    // Run two threads to mock two doctors asking for leave.
    const withoutForUpdate = !!process.env.WITHOUT_FOR_UPDATE;
    const thread1 = askForLevel(1, 'Alice', withoutForUpdate);
    const thread2 = askForLevel(2, 'Bob', withoutForUpdate);
    await Promise.all([thread1, thread2]);

    const onCallDoctors = await getOnCallDoctors(conn);
    if (onCallDoctors.length >= 1) {
        console.log(`\nFinally, doctor ${onCallDoctors.map((r) => r.name).join(', ')} is on call.`);
    } else {
        console.log(`\nFinally, no doctor is on call (it's not what we expected).`)
    }

    // Close the connection.
    await conn.end();
}

async function askForLevel(threadId, dockerName, withoutForUpdate) {
    const conn = await createPromisifyConn(ConnectionConfig.parseUrl(config.DATABASE_URL), threadId);

    console.log(`${txnLogHeader(threadId)} Doctor ${dockerName} is asking for leave...`)
    try {
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
            const [rs] = await conn.query(updateOnCall, [false, dockerName]);
            if (rs.affectedRows === 0) {
                throw new Error(`${txnLogHeader(threadId)} Failed to update on call status for doctor ${dockerName}`);
            } else {
                await conn.query('COMMIT;');
                console.log(`${txnLogHeader(threadId)} Doctor ${dockerName}'s leave has been approved.`);
            }
        } catch (err) {
            await conn.query('ROLLBACK;');
            console.error(`${txnLogHeader(threadId)} Something went wrong: ${err}`);
            // throw err;
        }
    } finally {
        await conn.end();
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