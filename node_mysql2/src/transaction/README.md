# Transaction

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

## Introduction

A transaction is a set of SQL statements that are executed together as a single unit. A transaction is considered successful only if all the statements in it are executed successfully. If any statement in a transaction fails, the entire transaction fails and is rolled back.

Like MySQL, in TiDB, you can:

- Use the `BEGIN` statement to start a transaction.
- Use the `COMMIT` statement to commit the transaction. 
- If you want to roll back the transaction, you can use the `ROLLBACK` statement.

### Basic Usage

When you use mysql2 driver in Node.js to execute the above statements, you can use the `conn.beginTransaction()`, `conn.commit()`, and `conn.rollback()` methods instead.

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

### Avoid Forgetting to Commit the Transaction

Forgetting to commit a transaction is one of the mistakes that transaction beginners tend to make, which can result in changes in the transaction not being persisted.

To avoid it, you can encapsulate the boilerplate code into a `withTxn` function as follows:

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

Then you can call the utils function elsewhere like this:

```javascript
await withTxn(conn, async () => {
    // Do something in the transaction.
});
```

### Transaction Mode in TiDB

TiDB supports the following transaction modes:

- [`pessimistic`](../transaction-pessimistic/README.md) (default)
- [`optimistic`](../transaction-optimistic/README.md)

