import {createConnection} from "mysql2/promise";
import path from "path";
import {loadSampleData} from "../helper.js";
import dotenv from "dotenv";

async function main() {
    // Load environment variables from .env file.
    dotenv.config();

    // Connect TiDB with connection url.
    const conn = await createConnection({
        uri: process.env.DATABASE_URL,
    });

    try {
        // Load sample data.
        await loadSampleData(conn, path.join(process.cwd(), 'sql/players.init.sql'));

        console.log('Before, player 1 has coins:', await getPlayerCoins(conn, 1));

        // Update player's coins.
        try {
            const [ok] = await conn.query("UPDATE players SET coins = coins + ? WHERE id = ?;", [20, 1]);
            console.log('Increase player 1\'s coins by 20 successfully:');
            console.log(ok);
        } catch (err) {
            console.error('Failed to update player\'s coins:', err);
        }

        console.log('Now, player 1 has coins:', await getPlayerCoins(conn, 1));

    } finally {
        // Release connection.
        await conn.end();
    }
}

void main();

async function getPlayerCoins(conn, playerId) {
    const [rows] = await conn.query("SELECT coins FROM players WHERE id = ? LIMIt 1;", [playerId]);
    return rows?.[0]?.coins;
}
