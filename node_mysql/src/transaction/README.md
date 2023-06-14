# Transaction

## Introduction

A transaction is a set of SQL statements that are executed together as a single unit. A transaction is considered successful only if all the statements in it are executed successfully. If any statement in a transaction fails, the entire transaction fails and is rolled back.

In TiDB, you can use the `BEGIN` statement to start a transaction, and use the `COMMIT` statement to commit the transaction. If you want to roll back the transaction, you can use the `ROLLBACK` statement.

For example, you can use the following statements to transfer 50 coins from player 1 to player 2:

```sql
BEGIN;
UPDATE players SET coins = coins - 50 WHERE id = 1;
UPDATE players SET coins = coins + 50 WHERE id = 2;
COMMIT;
```

### Basic Usage

When you use mysqljs/mysql library to execute the above statements, you can use the `conn.beginTransaction()`, `conn.commit()`, and `conn.rollback()` methods to start, commit, and roll back the transaction, respectively.

The default methods all use the callback approach to implement asynchronous programming interfaces, which leads to the problem of callback hell. We can use `util.promisify` to convert it into a Promise-based approach, as shown below:

<details>

<summary>About <code>util.promisify</code></summary>

</details>

```javascript
const util = require('util');

const conn = createConnection(config);
conn.connect = util.promisify(conn.connect);
conn.beginTransaction = util.promisify(conn.beginTransaction);
conn.commit = util.promisify(conn.commit);
conn.rollback = util.promisify(conn.rollback);
conn.rollback = util.promisify(conn.query);
```

For example:

```javascript
async function transferCoins(conn, fromPlayerId, toPlayerId, coins) {
    try {
        await conn.beginTransaction();

        // Reduce coins from the player.
        await conn.query('UPDATE players SET coins = coins - ? WHERE id = ?;', [coins, fromPlayerId]);

        // Increase coins to the another player.
        await conn.query('UPDATE players SET coins = coins + ? WHERE id = ?;', [coins, toPlayerId]);

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    }
}
```


### Transaction Helper

To avoid forgetting commit or rollback the translation, you can encapsulate the boilerplate code into a `withTxn` function to simplify the code, as follows:

```javascript
async function withTxn(conn, action) {
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
```

Then you can call it elsewhere like this:

```javascript
await withTxn(conn, async () => {
    // do something
});
```

### Transaction Mode in TiDB

TiDB supports the following transaction modes:

- [`pessimistic`](../transaction-pessimistic/README.md) (default)
- [`optimistic`](../transaction-optimistic/README.md)

## Demo

### Transaction Commit

In this example, no exception occurred during the execution of the transaction, so the transaction was committed normally.

```shell
npm run demo:transaction
```

Expected output:

```
Before transfer coins:
Player 1 coins: 100
Player 2 coins: 100

Transferring 50 coins between players...
Transfer coins successfully.

After transfer coins:
Player 1 coins: 50
Player 2 coins: 150
```

### Transaction Rollback

In this example, a mocked error occurred during the execution of the transaction, the transaction was rolled back, and the player's gold coins did not change.

```shell
MOCK_ERROR=true npm run demo:transaction
```

Expected output:

```
Before transfer coins:
Player 1 coins: 100
Player 2 coins: 100

Transferring 50 coins between players...
An error occurred during the transfer, rollback the transaction and the coins of players will no changes: mock error

After transfer coins:
Player 1 coins: 100
Player 2 coins: 100
```

If no rollback is performed, player 1's coins have been reduced, but player 2's coins have not increased. The transfer operation has not been completed, but player 1's coins are now less. This is not what we expected.