import * as fs from "fs";

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

export function addLogForQueryMethod(conn, threadId) {
    const originalQuery = conn.query.bind(conn);
    conn.query = async function (sql, args) {
        // Printing logs before execution of SQL containing FOR UPDATE clause.
        const executeSQL = this.format(sql, args);
        if (executeSQL.toLowerCase().includes('for update')) {
            console.log(`${txnLogHeader(threadId)} > ${executeSQL} (start)`);
        }

        // Print the log after execution of SQL.
        let hasError = false;
        try {
            return await originalQuery(sql, args);
        } catch (err) {
            hasError = true;
            throw err;
        } finally {
            const executeState = hasError ? 'failed' : 'success';
            const logFn = hasError ? console.error : console.log;
            logFn(`${txnLogHeader(threadId)} > ${executeSQL} (${executeState})`);
        }
    }
}

export function txnLogHeader(threadId) {
    const indent = threadId !== 1 ? '\t' : '';
    return `/* txn ${threadId} */${indent}`;
}

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loadSampleData(conn, sqlFile) {
    // Load the SQL file.
    if (!fs.existsSync(sqlFile)) {
        throw new Error(`File not found: ${sqlFile}`);
    }
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL statements.
    try {
        await conn.query('SET @@tidb_multi_statement_mode = ON;');
        await conn.query(sql);
    } catch (err) {
        throw new Error('Failed to load sample data.', {
            cause: err
        });
    } finally {
        await conn.query('SET @@tidb_multi_statement_mode = OFF;');
    }
}