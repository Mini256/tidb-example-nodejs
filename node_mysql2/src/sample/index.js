import {createConnection} from 'mysql2/promise';
import dotenv from "dotenv";
import {loadSampleData} from "../helper.js";
import path from "path";

// Main function.

async function main() {
    // Load environment variables from .env file.
    dotenv.config();

    // Load sample data.
    const conn = await createConnection(process.env.DATABASE_URL);
    try {
        await loadSampleData(conn, path.join(process.cwd(), 'sql/players.init.sql'));
    } finally {
        await conn.end();
    }

    // Run examples.
    console.log('[Simple Example Output]\n');
    await simple_example();

    console.log('\n[Bulk Example Output]\n');
    await  bulk_example();

    console.log('\n[Trade Example Output]\n');
    await  trade_example();
}

void main();

// Simple example.

async function simple_example() {
    const conn = await getConnection();

    try {
        // Create player.
        const newPlayerID = await createPlayer(conn, {
            coins: 1,
            goods: 1,
        });
        console.log(`Created new player with ID ${newPlayerID}.`);

        // Get player by ID.
        const player = await getPlayerByID(conn, 3);
        console.log(`Get player by ID 3: Player { id:${player.id}, coins:${player.coins}, goods:${player.goods} }`);

        // Count players.
        const playerTotal = await countPlayers(conn);
        console.log(`The total number of players: ${playerTotal}`);

        // List players with limit.
        console.log('List players with limit 3:')
        const players = await listPlayersWithLimit(conn, 3);
        players.forEach(p => {
            console.log(`- Player { id:${p.id}, coins:${p.coins}, goods:${p.goods} }`);
        });
    } finally {
        await conn.end();
    }
}

async function createPlayer(conn, player) {
    const [rsh] = await conn.execute(
        'INSERT INTO players (id, coins, goods) VALUES (?, ?, ?);',
        [player.id || null, player.coins, player.goods]
    );
    return rsh.insertId;
}

async function getPlayerByID(conn, playerId) {
    const [rows] = await conn.execute(
        'SELECT id, coins, goods FROM players WHERE id = ?;',
        [playerId]
    );
    return rows[0];
}

async function listPlayersWithLimit(conn, limit) {
    const [rows] = await conn.query('SELECT id, coins, goods FROM players LIMIT ?;', [limit]);
    return rows;
}

async function countPlayers(conn) {
    const [rows] = await conn.execute('SELECT COUNT(*) AS cnt FROM players;');
    return rows[0]?.cnt || null;
}

// Bulk operations example.

async function bulk_example() {
    const conn = await getConnection();
    try {
        // Bulk create players.
        const players = [];
        for (let i = 1000; i < 2000; i++) {
            players.push([i, 10000, 10000]);
        }

        for (let i = 0; i < players.length; i += 200) {
            const chunk = players.slice(i, i + 200);
            const insertedRows = await bulkCreatePlayer(conn, chunk);
            console.log(`Bulk inserted ${insertedRows} rows.`);
        }
    } finally {
        await conn.end();
    }
}

async function bulkCreatePlayer(conn, players) {
    const [rsh] = await conn.query('INSERT INTO players (id, coins, goods) VALUES ?;', [players]);
    return rsh.affectedRows;
}

// Transaction example.

async function trade_example() {
    const conn = await getConnection();

    try {
        // Create players.
        await createPlayer(conn, { id: 101, coins: 100, goods: 0 });
        await createPlayer(conn, { id: 102, coins: 2000, goods: 20 });

        // Trade attempt 1.
        await trade(1, conn, 102, 101, 10, 500);

        // Trade attempt 2.
        await trade(2, conn, 102, 101, 2, 100);

        // Get player status.
        console.log('\nPlayer status after trade:');

        const player1 = await getPlayerByID(conn, 101);
        console.log(`- Player { id:101, coins:${player1.coins}, goods:${player1.goods} }`);

        const player2 = await getPlayerByID(conn, 102);
        console.log(`- Player { id:102, coins:${player2.coins}, goods:${player2.goods} }`);
    } finally {
        await conn.end();
    }
}

async function trade(tradeSeq, conn, sellId, buyId, amount, price) {
    console.log(`[Trade ${tradeSeq}] Doing trade ${amount} goods from player ${sellId} to player ${buyId} for ${price} coins.`)

    // Start transaction.
    await conn.beginTransaction();
    try {
        // Lock rows and check.
        const getPlayerSql = 'SELECT coins, goods FROM players WHERE id = ? FOR UPDATE;';

        const [sellRows] = await conn.execute(getPlayerSql, [sellId]);
        const sellGoods = sellRows[0].goods;
        const sellCoins = sellRows[0].coins;
        if (sellGoods < amount) {
            throw new Error(`The goods of sell player ${sellId} are not enough.`);
        }

        const [buyRows] = await conn.execute(getPlayerSql, [buyId]);
        const buyGoods = buyRows[0].goods;
        const buyCoins = buyRows[0].coins;
        if (buyCoins < price) {
            throw new Error(`The coins of buy player ${buyId} is not enough.`);
        }

        // Update if checks passed.
        const updatePlayerSql = 'UPDATE players SET goods = ?, coins = ? WHERE id = ?;';
        await conn.execute(updatePlayerSql, [sellGoods - amount, sellCoins + price, sellId]);
        await conn.execute(updatePlayerSql, [buyGoods + amount, buyCoins - price, buyId]);

        // Commit transaction.
        await conn.commit();
        console.log(`[Trade ${tradeSeq}] Trade success!`);
    } catch (error) {
        // Rollback transaction.
        await conn.rollback();
        console.error(`[Trade ${tradeSeq}] Trade failed (rollback the transaction): ${error.message}\n`);
    }
}

// Common functions.

async function getConnection() {
    return createConnection(process.env.DATABASE_URL);
}
