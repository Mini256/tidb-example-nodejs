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
    // Check if connection failed.
    if (err) {
        console.error('Failed to connect to TiDB cluster.', err);
    }

    // Create a new player with initial coins and goods.
    try {
        const [rows, fields] = await getPlayers(conn);
        // console.log(fields);
        console.table(rows.map(row => {
            return {
                id: row.id,
                coins: row.coins,
                goods: row.goods,
            }
        }))
    } catch (err) {
        console.error('Failed to create player:', err);
    }

    // Close the connection.
    conn.end();
});

function getPlayers(conn) {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM players;", (err, result, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve([result, fields]);
            }
        });
    });
}


