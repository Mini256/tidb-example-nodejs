import {addLogForQueryMethod, loadSampleData, sleep, txnLogHeader} from "../helper.js";
import {createConnection} from "mysql2/promise";
import path from "path";
import dotenv from "dotenv";

const REPEATABLE_ERROR_CODE_SET = new Set([
    9007, // Transactions in TiKV encounter write conflicts.
    8028, // table schema changes
    8002, // "SELECT FOR UPDATE" commit conflict
    8022, // The transaction commit fails and has been rolled back
]);

async function main() {
    // Load environment variables from .env file.
    dotenv.config();

    // Load sample data.
    const conn = await createConnection(process.env.DATABASE_URL);
    try {
        await loadSampleData(conn, path.join(process.cwd(), 'sql/bookshop.init.sql'));
    } finally {
        await conn.end();
    }

    // Run the demo.
    const conn1 = await createConnection(process.env.DATABASE_URL);
    const conn2 = await createConnection(process.env.DATABASE_URL);
    try {
        const bookId = 1;
        const bobId = 1;
        const aliceId = 2;

        // Create thread 1.
        addLogForQueryMethod(conn1, 1);
        const thread1 = buyWithOptimisticTxn(conn1, 1, bookId, bobId, 1, 1);

        // Create thread 2.
        addLogForQueryMethod(conn2, 2);
        const thread2 = buyWithOptimisticTxn(conn2, 2, bookId, aliceId, 2, 1);

        // Run two threads to buy the book concurrently.
        await Promise.all([thread1, thread2]);
    } finally {
        // Close the connection.
        await conn1.end();
        await conn2.end();
    }
}

async function buyWithOptimisticTxn(conn, threadId, bookId, userId, amount, retryTimes = 5) {
    await conn.query('BEGIN OPTIMISTIC;');
    await sleep(1000);

    try {
        // Check if the book exists.
        const selectBookForUpdate = 'SELECT price, stock FROM books WHERE id = ? LIMIT 1 FOR UPDATE;';
        const [books] = await conn.query(selectBookForUpdate, [bookId]);
        if (books.length === 0) {
            throw new Error('book_id not exist');
        }

        // Check if the stock is enough.
        const { price, stock } = books[0];
        if (stock < amount) {
            throw new Error('book not enough, rollback');
        }

        // Update the stock.
        const updateStock = 'UPDATE books SET stock = stock - ? WHERE id = ? AND stock - ? >= 0;';
        const [updateStockRs] = await conn.query(updateStock, [amount, bookId, amount]);
        if (updateStockRs.affectedRows === 0) {
            throw new Error('stock not enough, rollback');
        }

        // Insert the order.
        const insertOrder = 'INSERT INTO orders (book_id, user_id, quality) VALUES (?, ?, ?);';
        await conn.query(insertOrder, [bookId, userId, amount]);

        // Update the user balance.
        const totalCost = amount * price;
        const updateUser = 'UPDATE users SET balance = balance - ? WHERE id = ? AND balance - ? >= 0;';
        const [updateUserRs] = await conn.query(updateUser, [totalCost, userId, totalCost]);

        // Check if the user balance is enough.
        if (updateUserRs.affectedRows === 0) {
            throw new Error('balance not enough, rollback');
        }
    } catch (err) {
        await conn.query('ROLLBACK;');
        console.error(`something went wrong: ${err}`);
        throw err;
    }

    // !!!IMPORTANT!!!
    try {
        await conn.query('COMMIT;');
    } catch (err) {
        const shouldRetry = REPEATABLE_ERROR_CODE_SET.has(err.errno);
        if (shouldRetry && retryTimes > 0) {
            console.error(`${txnLogHeader(threadId)} Failed to commit transaction due to error ${err.errno}, retry it (remaining ${retryTimes - 1} times), error details:\n${err.sqlMessage}`);
            await conn.query('ROLLBACK;');
            await buyWithOptimisticTxn(conn, threadId, bookId, userId, amount, retryTimes - 1);
        } else {
            console.error(`${txnLogHeader(threadId)} Failed to commit transaction due to error ${err.errno}, error details:\n${err.sqlMessage}`);
            await conn.query('ROLLBACK;');
            throw err;
        }
    }
}

main().catch(err => {
    console.error('Error occurred:', err);
    process.exit(1);
});