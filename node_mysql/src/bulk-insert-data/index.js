import envSchema from "env-schema";
import {createConnection} from "mysql";
import ConnectionConfig from "mysql/lib/ConnectionConfig.js";
import {loadEnvWithDatabaseURL} from "../env.js";

// Load environment variables from .env file.
const config = loadEnvWithDatabaseURL();

// Connect TiDB with connection url.
const conn = createConnection(ConnectionConfig.parseUrl(config.DATABASE_URL));

conn.connect(async (err) => {
    if (err) {
        console.error('Failed to connect to TiDB cluster.', err);
    }

    // Bulk insert 3 new players.
    try {
        const ok = await bulkCreatePlayers(conn, [
            { coins: 100, goods: 20 },
            { coins: 100, goods: 30 },
            { coins: 100, goods: 40 },
        ]);
        console.log("Bulk insert 3 new players:");
        console.log(ok);
    } catch (err) {
        console.error('Failed to bulk insert 3 new players.', err);
    }

    // Close the connection.
    conn.end();
});

function bulkCreatePlayers(conn, players) {
    const values = players.map(player => [player.coins, player.goods]);
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO players (coins, goods) VALUES ?", [values], (err, ok) => {
            if (err) {
                reject(err);
            } else {
                resolve(ok);
            }
        });
    });
}