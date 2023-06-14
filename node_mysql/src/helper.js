import {createConnection} from "mysql";
import util from "util";

export async function withConn(pool, action, hooks) {
    const conn = await pool.getConnection();
    try {
        return await action();
    } catch (err) {
        throw err;
    } finally {
        await conn.release();
    }
}

export async function withTxn(conn, action) {
    try {
        await conn.beginTransaction();

        const result = await action();

        await conn.commit();

        return result;
    } catch (err) {
        await conn.rollback();
        throw err;
    }
}

export async function createPromisifyConn(config, threadId) {
    const conn = createConnection(config);
    conn.connect = util.promisify(conn.connect);
    conn.beginTransaction = util.promisify(conn.beginTransaction);
    conn.commit = util.promisify(conn.commit);
    conn.rollback = util.promisify(conn.rollback);
    const query = conn.query.bind(conn);
    conn.query[util.promisify.custom] = function (sql, args) {
        return new Promise((resolve, reject) => {
            query(sql, args, (err, rows, fields) => {
                // Log the SQL statement.
                if (threadId) {
                    const executeSQL = this.format(sql, args);
                    const executeState = err ? 'failed' : 'success';
                    const logFn = err ? console.error : console.log;
                    logFn(`${txnLogHeader(threadId)} > ${executeSQL} (${executeState})`);
                }

                if (err) {
                    reject(err);
                } else {
                    resolve([rows, fields]);
                }
            });
        });
    };
    conn.query = util.promisify(conn.query);
    conn.end = util.promisify(conn.end);
    return conn;
}

export function txnLogHeader(threadId) {
    const indent = threadId !== 1 ? '\t' : '';
    return `/* txn ${threadId} */${indent}`;
}

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
