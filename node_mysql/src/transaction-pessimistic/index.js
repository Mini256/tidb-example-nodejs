import ConnectionConfig from "mysql/lib/ConnectionConfig.js";
import {loadEnvWithDatabaseURL} from "../env.js";
import {createPromisifyConn, sleep} from "../helper.js";

// Load environment variables from .env file.
const config = loadEnvWithDatabaseURL();

async function main() {
    // Prepare sample data.
    const conn = await createPromisifyConn(ConnectionConfig.parseUrl(config.DATABASE_URL));
    const bookId = await createBook(conn, {
        title: "Designing Data-Intensive Application",
        type: "Science & Technology",
        publishedAt: new Date('2018-09-01'),
        price: 100,
        stock: 10
    });
    const bobId = await createUser(conn, {
        nickname: "Bob",
        balance: 1000
    });
    const aliceId = await createUser(conn, {
        nickname: "Alice",
        balance: 1000
    });

    // Run two threads to buy the book concurrently.
    const thread1 = buyWithPessimisticTxn(1, bookId, bobId, 1, 1);
    const thread2 = buyWithPessimisticTxn(2, bookId, aliceId, 2, 1);
    await Promise.all([thread1, thread2]);

    // Close the connection.
    await conn.end();
}

async function buyWithPessimisticTxn(threadId, bookId, userId, amount, retryTimes = 5) {
    const conn = await createPromisifyConn(ConnectionConfig.parseUrl(config.DATABASE_URL), threadId);

    try {
        await conn.query('BEGIN PESSIMISTIC;');
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

            await conn.query('COMMIT;');
        } catch (err) {
            await conn.query('ROLLBACK;');
            console.error(`something went wrong: ${err}`);
            throw err;
        }
    } finally {
        await conn.end();
    }
}

async function createBook(conn, book) {
    const [ok] = await conn.query(
        'INSERT INTO `books` (`title`, `type`, `published_at`, `price`, `stock`) VALUES (?, ?, ?, ?, ?);',
        [book.title, book.type, book.publishedAt, book.price, book.stock]
    );
    return ok.insertId;
}

async function createUser(conn, user) {
    const [ok] = await conn.query('INSERT INTO `users` (`nickname`, `balance`) VALUES (?, ?);', [user.nickname, user.balance]);
    return ok.insertId;
}

main().catch(err => {
    console.error('Error occurred:', err);
    process.exit(1);
});