import {createConnection} from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import {loadSampleData} from "../helper.js";

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

        // Delete a player by id.
        const playerId = 2;
        const [rsh] = await conn.query("DELETE FROM players WHERE id = ? LIMIt 1;", [playerId]);

        if (rsh.affectedRows > 0) {
            console.log("Deleted the player with ID %d.", playerId);
        } else {
            console.error("Failed to delete the player with ID %d.", playerId);
        }
    } finally {
        // Release connection.
        await conn.end();
    }
}

void main();