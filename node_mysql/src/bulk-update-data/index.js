import envSchema from "env-schema";
import {createConnection} from "mysql";
import ConnectionConfig from "mysql/lib/ConnectionConfig.js";

// Load environment variables from .env file.
const config = envSchema({
    schema: {
        type: 'object',
        required: [ 'DATABASE_URL' ],
        properties: {
            DATABASE_URL: {
                type: 'string'
            },
        },
    },
    dotenv: true,
});

// Connect TiDB with connection url.
const conn = createConnection(ConnectionConfig.parseUrl(config.DATABASE_URL));

conn.connect(async (err) => {
    if (err) {
        console.error('Failed to connect to TiDB cluster.', err);
    }

    // Bulk increase 3 players' coins by 100.
    try {
        const ok = await bulkIncPlayersCoins(conn, [3, 4, 5], 100);
        console.log("Bulk increase 3 players\' coins by 100:");
        console.log(ok);
    } catch (err) {
        console.error('Failed to bulk insert 3 new players.', err);
    }

    // Close the connection.
    conn.end();
});

function bulkIncPlayersCoins(conn, playerIds, coins) {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE players SET coins = coins + ? WHERE id IN (?);", [coins, playerIds], (err, ok) => {
            if (err) {
                reject(err);
            } else {
                resolve(ok);
            }
        });
    });
}



