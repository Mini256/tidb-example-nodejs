import {createConnection} from "mysql2/promise";
import dotenv from "dotenv";
import {loadSampleData} from "../helper.js";
import path from "path";

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

        // Insert a new player.
        const player = {
            coins: 10,
            goods: 20
        };
        const [rsh] = await conn.query("INSERT INTO players (coins, goods) VALUES (?, ?)", [player.coins, player.goods]);

        console.log("Inserted %d row(s) on players table.", rsh.affectedRows);
        console.log("The ID of new player is %d.", rsh.insertId);
    } finally {
        // Release connection.
        await conn.end();
    }
}

void main();