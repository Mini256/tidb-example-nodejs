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

        // Bulk insert 3 new players.
        const newPlayers = [
            { coins: 100, goods: 20 },
            { coins: 100, goods: 30 },
            { coins: 100, goods: 40 },
        ];
        console.log("Bulk inserting 3 new players.")

        const values = newPlayers.map(player => [player.coins, player.goods]);
        const [rsh] = await conn.query("INSERT INTO players (coins, goods) VALUES ?", [values]);
        console.log(`Eventually ${rsh.affectedRows} players were added.`);
    } finally {
        // Close the connection.
        await conn.end();
    }
}

void main();
