# Update data

## Introduction

You can use the `UPDATE` statement to update data in a table.

```sql
UPDATE players SET coins = coins + 20 WHERE id = 20;
```

Use the `conn.query(sql, values, callbak);` API to execute the SQL statement.

Use the `?` as a placeholder to replace the parameter values (`players` and `coins`) in the SQL statement, and the parameter values will be filled in the SQL statement in order before executing.

After the SQL statement is executed successfully, an `OkPacket` object (`ok`) will be returned.
You can judge whether the update is successful by checking whether the number of `ok.affectedRows` is greater than `0`.

```javascript
function increasePlayerCoins(conn, playerId, coins) {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE players SET coins = coins + ? WHERE id = ?;", [coins, playerId], (err, ok) => {
            if (err) {
                reject(err);
            } else {
                resolve(ok);
            }
        });
    });
}
```

## Demo

Load the players table data into TiDB:

```shell
mycli --host 127.0.0.1 --port 4000 -u root --no-warn < ./sql/players.init.sql
```

Run the demo:

```shell
npm run demo:update-data
```

Expected output:

As a result, player 1's coins increased by 20.

```
Before, player 1 has coins: 140
Increase player 1's coins by 20 successfully:
OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  protocol41: true,
  changedRows: 1
}
Now, player 1 has coins: 160
```


