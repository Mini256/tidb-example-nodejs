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

    // Bulk delete 3 players.
    try {
        const ok = await bulkDeletePlayers(conn, [3, 4, 5]);
        console.log("Bulk delete 3 players:");
        console.log(ok);
    } catch (err) {
        console.error('Failed to bulk insert 3 new players.', err);
    }

    // Close the connection.
    conn.end();
});

function bulkDeletePlayers(conn, playerIds) {
    return new Promise((resolve, reject) => {
        conn.query("DELETE FROM players WHERE id IN (?);", [playerIds], (err, ok) => {
            if (err) {
                reject(err);
            } else {
                resolve(ok);
            }
        });
    });
}
