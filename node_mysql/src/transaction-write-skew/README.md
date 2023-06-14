# Write Skew Problem

## Demo

```shell
WITHOUT_FOR_UPDATE=1 npm run demo:transaction-write-skew
```

Expected output:

```
/* txn 1 */ Doctor Alice is asking for leave...
/* txn 2 */      Doctor Bob is asking for leave...
/* txn 1 */ > BEGIN; (success)
/* txn 2 */      > BEGIN; (success)
/* txn 1 */ > SELECT COUNT(*) AS cnt FROM doctors WHERE on_call = true; (success)
/* txn 1 */ There are 2 doctors on call.
/* txn 2 */      > SELECT COUNT(*) AS cnt FROM doctors WHERE on_call = true; (success)
/* txn 2 */      There are 2 doctors on call.
/* txn 1 */ > UPDATE doctors SET on_call = false WHERE name = 'Alice'; (success)
/* txn 2 */      > UPDATE doctors SET on_call = false WHERE name = 'Bob'; (success)
/* txn 1 */ > COMMIT; (success)
/* txn 1 */ Doctor Alice's leave has been approved.
/* txn 2 */      > COMMIT; (success)
/* txn 2 */      Doctor Bob's leave has been approved.

Finally, no doctor is on call (it's not what we expected).
```

To avoid the write skew problems, you can use `SELECT ... FOR UPDATE` statement to lock the rows you are going to update.

```shell
npm run demo:transaction-write-skew
```

Expected output:

```
/* txn 1 */ Doctor Alice is asking for leave...
/* txn 2 */      Doctor Bob is asking for leave...
/* txn 1 */ > BEGIN; (success)
/* txn 2 */      > BEGIN; (success)
/* txn 2 */      > SELECT COUNT(*) AS cnt FROM doctors WHERE on_call = true FOR UPDATE; (success)
/* txn 2 */      There are 2 doctors on call.
/* txn 2 */      > UPDATE doctors SET on_call = false WHERE name = 'Bob'; (success)
/* txn 2 */      > COMMIT; (success)
/* txn 2 */      Doctor Bob's leave has been approved.
/* txn 1 */ > SELECT COUNT(*) AS cnt FROM doctors WHERE on_call = true FOR UPDATE; (success)
/* txn 1 */ > ROLLBACK; (success)
/* txn 1 */ Something went wrong: Error: At least one doctor needs to be on call

Finally, doctor Alice is on call.
```
