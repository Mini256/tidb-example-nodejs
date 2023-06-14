# Optimistic Transaction Mode

## Demo

Load the bookshop tables data into TiDB:

```shell
mycli --host 127.0.0.1 --port 4000 -u root --no-warn < ./sql/bookshop.init.sql
```

Run the demo:

```shell
npm run demo:transaction-optimistic
```

Expected output:

```
/* txn 1 */ > BEGIN OPTIMISTIC; (success)
/* txn 2 */      > BEGIN OPTIMISTIC; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 53 LIMIT 1 FOR UPDATE; (success)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 53 LIMIT 1 FOR UPDATE; (success)
/* txn 1 */ > UPDATE books SET stock = stock - 1 WHERE id = 53 AND stock - 1 >= 0; (success)
/* txn 2 */      > UPDATE books SET stock = stock - 2 WHERE id = 53 AND stock - 2 >= 0; (success)
/* txn 1 */ > INSERT INTO orders (book_id, user_id, quality) VALUES (53, 78, 1); (success)
/* txn 2 */      > INSERT INTO orders (book_id, user_id, quality) VALUES (53, 79, 2); (success)
/* txn 2 */      > UPDATE users SET balance = balance - 200 WHERE id = 79 AND balance - 200 >= 0; (success)
/* txn 1 */ > UPDATE users SET balance = balance - 100 WHERE id = 78 AND balance - 100 >= 0; (success)
/* txn 2 */      > COMMIT; (success)
/* txn 1 */ > COMMIT; (failed)
/* txn 1 */ Failed to commit transaction due to error 9007, retry it (remaining 0 times), error details:
Write conflict, txnStartTS=441735276642172930, conflictStartTS=441735276642172932, conflictCommitTS=0, key={tableID=130, tableName=test.books, handle=53}, originalKey=7480000000000000825f728000000000000035, primary=[]byte(nil), originalPrimaryKey=, reason=Optimistic [try again later]
/* txn 1 */ > ROLLBACK; (success)
/* txn 1 */ > BEGIN OPTIMISTIC; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 53 LIMIT 1 FOR UPDATE; (success)
/* txn 1 */ > UPDATE books SET stock = stock - 1 WHERE id = 53 AND stock - 1 >= 0; (success)
/* txn 1 */ > INSERT INTO orders (book_id, user_id, quality) VALUES (53, 78, 1); (success)
/* txn 1 */ > UPDATE users SET balance = balance - 100 WHERE id = 78 AND balance - 100 >= 0; (success)
/* txn 1 */ > COMMIT; (success)
```