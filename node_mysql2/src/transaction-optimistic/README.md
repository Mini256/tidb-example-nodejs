# Optimistic Transaction Mode

## Demo

Run the demo:

```shell
npm run demo:transaction-optimistic
```

Expected output:

In optimistic transaction mode, the second transaction executing the `SELECT ... FOR UPDATE` statement will NOT be blocked by it.

The two transactions continue to execute until commit when conflict detection is performed:

- txn 1 (transaction 1) commits the transaction before txn 2 (transaction 2), and the commit is successful.
- txn 2 commits the transaction next, a transaction conflict occurs and an exception is thrown, and txn 2 rollback.
- txn 2 tried to retry and succeeded when committing the transaction again.

```
/* txn 1 */ > BEGIN OPTIMISTIC; (success)
/* txn 2 */      > BEGIN OPTIMISTIC; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 1 */ > UPDATE books SET stock = stock - 1 WHERE id = 1 AND stock - 1 >= 0; (success)
/* txn 2 */      > UPDATE books SET stock = stock - 2 WHERE id = 1 AND stock - 2 >= 0; (success)
/* txn 1 */ > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 1, 1); (success)
/* txn 2 */      > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 2, 2); (success)
/* txn 1 */ > UPDATE users SET balance = balance - 100 WHERE id = 1 AND balance - 100 >= 0; (success)
/* txn 2 */      > UPDATE users SET balance = balance - 200 WHERE id = 2 AND balance - 200 >= 0; (success)
/* txn 1 */ > COMMIT; (success)
/* txn 2 */      > COMMIT; (failed)
/* txn 2 */      Failed to commit transaction due to error 9007, retry it (remaining 0 times), error details:
Write conflict, txnStartTS=442841716518551569, conflictStartTS=442841716518551565, conflictCommitTS=442841716780695567, key={tableID=742, tableName=test.books, handle=1}, originalKey=7480000000000002e65f728000000000000001, primary={tableID=742, tableName=test.books, handle=1}, originalPrimaryKey=7480000000000002e65f728000000000000001, reason=Optimistic [try again later]
/* txn 2 */      > ROLLBACK; (success)
/* txn 2 */      > BEGIN OPTIMISTIC; (success)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 2 */      > UPDATE books SET stock = stock - 2 WHERE id = 1 AND stock - 2 >= 0; (success)
/* txn 2 */      > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 2, 2); (success)
/* txn 2 */      > UPDATE users SET balance = balance - 200 WHERE id = 2 AND balance - 200 >= 0; (success)
/* txn 2 */      > COMMIT; (success)
```

Or:

```
/* txn 1 */ > BEGIN OPTIMISTIC; (success)
/* txn 2 */      > BEGIN OPTIMISTIC; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 2 */      > UPDATE books SET stock = stock - 2 WHERE id = 1 AND stock - 2 >= 0; (success)
/* txn 1 */ > UPDATE books SET stock = stock - 1 WHERE id = 1 AND stock - 1 >= 0; (success)
/* txn 2 */      > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 2, 2); (success)
/* txn 1 */ > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 1, 1); (success)
/* txn 2 */      > UPDATE users SET balance = balance - 200 WHERE id = 2 AND balance - 200 >= 0; (success)
/* txn 1 */ > UPDATE users SET balance = balance - 100 WHERE id = 1 AND balance - 100 >= 0; (success)
/* txn 2 */      > COMMIT; (success)
/* txn 1 */ > COMMIT; (failed)
/* txn 1 */ Failed to commit transaction due to error 9007, retry it (remaining 0 times), error details:
Write conflict, txnStartTS=442841729324285974, conflictStartTS=442841729324285976, conflictCommitTS=0, key={tableID=814, tableName=test.books, handle=1}, originalKey=74800000000000032e5f728000000000000001, primary=[]byte(nil), originalPrimaryKey=, reason=Optimistic [try again later]
/* txn 1 */ > ROLLBACK; (success)
/* txn 1 */ > BEGIN OPTIMISTIC; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 1 */ > UPDATE books SET stock = stock - 1 WHERE id = 1 AND stock - 1 >= 0; (success)
/* txn 1 */ > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 1, 1); (success)
/* txn 1 */ > UPDATE users SET balance = balance - 100 WHERE id = 1 AND balance - 100 >= 0; (success)
/* txn 1 */ > COMMIT; (success)
```