# Pessimistic Transaction Mode

## Demo

Load the bookshop tables data into TiDB:

```shell
mycli --host 127.0.0.1 --port 4000 -u root --no-warn < ./sql/bookshop.init.sql
```

Run the demo:

```shell
npm run demo:transaction-pessimistic
```

Expected output:

```
/* txn 1 */ > BEGIN PESSIMISTIC; (success)
/* txn 2 */      > BEGIN PESSIMISTIC; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 54 LIMIT 1 FOR UPDATE; (success)
/* txn 1 */ > UPDATE books SET stock = stock - 1 WHERE id = 54 AND stock - 1 >= 0; (success)
/* txn 1 */ > INSERT INTO orders (book_id, user_id, quality) VALUES (54, 80, 1); (success)
/* txn 1 */ > UPDATE users SET balance = balance - 100 WHERE id = 80 AND balance - 100 >= 0; (success)
/* txn 1 */ > COMMIT; (success)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 54 LIMIT 1 FOR UPDATE; (success)
/* txn 2 */      > UPDATE books SET stock = stock - 2 WHERE id = 54 AND stock - 2 >= 0; (success)
/* txn 2 */      > INSERT INTO orders (book_id, user_id, quality) VALUES (54, 81, 2); (success)
/* txn 2 */      > UPDATE users SET balance = balance - 200 WHERE id = 81 AND balance - 200 >= 0; (success)
/* txn 2 */      > COMMIT; (success)
```
