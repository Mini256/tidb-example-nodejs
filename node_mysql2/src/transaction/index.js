import {createConnection} from "mysql2/promise";
import dotenv from "dotenv";
import {loadSampleData} from "../helper.js";
import path from "path";

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

        if (!process.env.MOCK_ERROR) {
            await demo(conn, false);
        } else {
            await demo(conn, true);
        }
    } finally {
        // Close the connection.
        await conn.end();
    }
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
    const [rsh] = await conn.query('INSERT INTO players (coins, goods) VALUES (?, ?);', [initialCoins, initialGoods]);
    return rsh.insertId;
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

        // Commit the transaction.
        await conn.commit();
    } catch (err) {
        // Rollback the transaction
        await conn.rollback();
        throw err;
    }
}

main().catch(err => {
    console.error('Error occurred:', err);
    process.exit(1);
});