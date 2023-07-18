# Pessimistic Transaction Mode

## Demo

Run the demo:

```shell
npm run demo:transaction-pessimistic
```

Expected output:

```
/* txn 1 */ > BEGIN PESSIMISTIC; (success)
/* txn 2 */      > BEGIN PESSIMISTIC; (success)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (start)
/* txn 1 */ > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 1 */ > UPDATE books SET stock = stock - 1 WHERE id = 1 AND stock - 1 >= 0; (success)
/* txn 1 */ > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 1, 1); (success)
/* txn 1 */ > UPDATE users SET balance = balance - 100 WHERE id = 1 AND balance - 100 >= 0; (success)
/* txn 1 */ > COMMIT; (success)
/* txn 2 */      > SELECT price, stock FROM books WHERE id = 1 LIMIT 1 FOR UPDATE; (success)
/* txn 2 */      > UPDATE books SET stock = stock - 2 WHERE id = 1 AND stock - 2 >= 0; (success)
/* txn 2 */      > INSERT INTO orders (book_id, user_id, quality) VALUES (1, 2, 2); (success)
/* txn 2 */      > UPDATE users SET balance = balance - 200 WHERE id = 2 AND balance - 200 >= 0; (success)
/* txn 2 */      > COMMIT; (success)
```
