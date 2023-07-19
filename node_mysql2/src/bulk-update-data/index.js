import {createConnection} from "mysql2/promise";
import path from "path";
import {loadSampleData} from "../helper.js";
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

        // Bulk increase 3 players' coins by 100.
        const increaseCoins = 100;
        const playerIds = [3, 4, 5];
        const [rsh] = await conn.query("UPDATE players SET coins = coins + ? WHERE id IN (?);", [increaseCoins, playerIds]);
        console.log(`Bulk increase ${rsh.affectedRows} players' coins by ${increaseCoins}.`);
    } finally {
        // Close the connection.
        await conn.end();
    }
}

void main();
