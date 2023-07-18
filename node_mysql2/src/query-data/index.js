import {createConnection} from "mysql2/promise";
import {loadSampleData} from "../helper.js";
import * as path from "path";
import dotenv from "dotenv";

async function main() {
    // Load environment variables from .env file.
    dotenv.config();

    // Connect TiDB with connection url.
    const conn = await createConnection({
        uri: process.env.DATABASE_URL
    });

    try {
        // Load sample data.
        await loadSampleData(conn, path.join(process.cwd(), 'sql/players.init.sql'));

        // Query data.
        const [rows] = await conn.query("SELECT * FROM players;");
        const players = rows.map(row => {
            return {
                id: row.id,
                coins: row.coins,
                goods: row.goods,
            }
        });

        console.table(players);
    } finally {
        // Release connection.
        await conn.end();
    }
}

void main();


