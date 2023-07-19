import {createConnection} from "mysql2/promise";
import {loadSampleData} from "../helper.js";
import path from "path";
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

        // Bulk delete 3 players.
        const playerIds = [3, 4, 5];
        console.log(`Bulk deleting players with id: ${playerIds}`)

        const [rsh] = await conn.query("DELETE FROM players WHERE id IN (?);", [playerIds]);
        console.log(`Eventually ${rsh.affectedRows} players were deleted.`);
    } finally {
        // Close the connection.
        await conn.end();
    }
}

void main();
