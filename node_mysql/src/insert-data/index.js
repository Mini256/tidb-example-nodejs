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
        const rsh = await createPlayer(conn, {
            coins: 100,
            goods: 20,
        });
        console.log('Created a new player successfully:', );
        console.log(rsh);
    } catch (err) {
        console.error('Failed to create player:', err);
    }

    // Close the connection.
    conn.end();
});

function createPlayer(conn, player) {
    const {coins, goods} = player;

    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO players (coins, goods) VALUES (?, ?)", [coins, goods], (err, rs) => {
            if (err) {
                reject(err);
            } else {
                resolve(rs);
            }
        });
    });
}


