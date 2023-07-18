import {createConnection} from "mysql2/promise";
import dotenv from "dotenv";

async function main() {
    // Load environment variables from .env file.
    dotenv.config();

    // Connect TiDB with connection options.
    const conn = await createConnection({
        host: process.env.TIDB_HOST,
        port: process.env.TIDB_PORT,
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE,
    });

    // Connect to TiDB cluster.
    try {
        await conn.connect();
        console.log("Connected to TiDB cluster!");
    } catch (err) {
        console.error('Failed to connect to TiDB cluster.', err);
        return;
    }

    // Get TiDB version.
    try {
        const [rows] = await conn.query("SELECT version() AS tidb_version;");
        console.log("TiDB version:", rows[0]['tidb_version']);
    } catch (err) {
        console.error('Failed to get TiDB version.', err);
    } finally {
        // Close the connection.
        await conn.end();
    }
}

void main();