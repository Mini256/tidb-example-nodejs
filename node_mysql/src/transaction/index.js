import ConnectionConfig from "mysql/lib/ConnectionConfig.js";
import {loadEnvWithDatabaseURL} from "../env.js";
import {createPromisifyConn} from "../helper.js";

async function main() {
    // Load environment variables from .env file.
    const config = loadEnvWithDatabaseURL();

    // Connect TiDB with connection url.
    const conn = await createPromisifyConn(ConnectionConfig.parseUrl(config.DATABASE_URL));

    // Check if the connection is successful.
    try {
        await conn.connect();
    } catch (err) {
        console.error('Failed to connect to TiDB cluster.', err);
        process.exit(1);
    }

    if (!process.env.MOCK_ERROR) {
        await demo(conn, false);
    } else {
        await demo(conn, true);
    }

    // Close the connection.
    await conn.end();
}

async function demo(conn, mockError) {
    // Prepare sample data.
    const player1Id = await createPlayer(conn, 100, 20);
    const player2Id = await createPlayer(conn, 100, 20);

    console.log('Before transfer coins:');
    console.log('Player 1 coins:', await getPlayerCoins(conn, player1Id));
    console.log('Player 2 coins:', await getPlayerCoins(conn, player2Id));

    // Transfer coins between players.
    try {
        console.log('\nTransferring 50 coins between players...');
        await transferCoins(conn, player1Id, player2Id, 50, mockError);
        console.log('Transfer coins successfully.');
    } catch (err) {
        console.error('An error occurred during the transfer, rollback the transaction and the coins of players will no changes:', err.message);
    }

    console.log('\nAfter transfer coins:');
    console.log('Player 1 coins:', await getPlayerCoins(conn, player1Id));
    console.log('Player 2 coins:', await getPlayerCoins(conn, player2Id));
}

async function createPlayer(conn, initialCoins, initialGoods) {
    const [ok] = await conn.query('INSERT INTO players (coins, goods) VALUES (?, ?);', [initialCoins, initialGoods]);
    return ok.insertId;
}

async function getPlayerCoins(conn, playerId) {
    const [rows] = await conn.query('SELECT coins FROM players WHERE id = ?;', [playerId]);
    return rows[0] ? rows[0].coins : null;
}

async function transferCoins(conn, fromPlayerId, toPlayerId, coins, mockError) {
    try {
        await conn.beginTransaction();

        // Check if the player has enough coins to transfer.
        const fromPlayerCoins = getPlayerCoins(conn, fromPlayerId);
        if (fromPlayerCoins < coins) {
            throw new Error('Insufficient coins');
        }

        // Reduce coins from the player.
        await conn.query('UPDATE players SET coins = coins - ? WHERE id = ?;', [coins, fromPlayerId]);

        if (mockError) {
            throw new Error('mock error');
        }

        // Increase coins to the another player.
        await conn.query('UPDATE players SET coins = coins + ? WHERE id = ?;', [coins, toPlayerId]);

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    }
}

main().catch(err => {
    console.error('Error occurred:', err);
    process.exit(1);
});