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

    let coins = await getPlayerCoins(conn, 1);
    console.log('Before, player 1 has coins:', coins);

    try {
        const ok = await increasePlayerCoins(conn, 1, 20);
        console.log('Increase player 1\'s coins by 20 successfully:');
        console.log(ok);
    } catch (err) {
        console.error('Failed to update player\'s coins:', err);
    }

    coins = await getPlayerCoins(conn, 1);
    console.log('Now, player 1 has coins:', coins);

    conn.end();
});

function getPlayerCoins(conn, playerId) {
    return new Promise((resolve, reject) => {
        conn.query("SELECT coins FROM players WHERE id = ? LIMIt 1;", [playerId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const coins = rows[0] ? rows[0]['coins'] : null;
                resolve(coins);
            }
        });
    });
}

function increasePlayerCoins(conn, playerId, coins) {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE players SET coins = coins + ? WHERE id = ?;", [coins, playerId], (err, ok) => {
            if (err) {
                reject(err);
            } else {
                resolve(ok);
            }
        });
    });
}
