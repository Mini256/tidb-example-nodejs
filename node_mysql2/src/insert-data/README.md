# Insert data

## Demo

Run the demo:

```shell
npm run demo:insert-data
```

Expected output:

As a result, a new player record is inserted into the `players` table.

```
Inserted 1 row(s) on players table.
The ID of new player is 9.
```

## Introduction

### Basic Usage

Basically, you can call the `conn.query(sql, callback);` method to execute an insert statement.

```javascript
conn.query("INSERT INTO players (coins, goods) VALUES (100, 20)", (err, ok) => {
    if (err) {
        throw(err);
    } else {
        console.log(ok)
    }
});
```

There are two parameters will be passed into the callback function: 

- `err`: If the insertion fails, an `Error` object will be passed, otherwise it is `null`.
- `ok`: If the insertion is successful, it will pass an `OkPacket` object, which include the information about the insertion.

    ```
    OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 5,
      serverStatus: 2,
      warningCount: 0,
      message: '',
      protocol41: true,
      changedRows: 0
    }
    ```

### Using escaping insert values

**Notice:** If the values in the insert statement are variables, especially if they are provided by the user, you should carefully consider escaping the insert value to **prevent [SQL injection](https://en.wikipedia.org/wiki/SQL_injection)**.

Using `conn.query(sql, values, callback);` can help you escape inserted values to avoid SQL injection.

You need to replace the inserted values in the `sql` parameter with `?` placeholders and then pass the inserted values into the `values` parameter. 

The `values` parameter is an array, and the values in the array will be filled in order into the placeholders in the SQL statement.

```javascript
conn.query("INSERT INTO players (coins, goods) VALUES (?, ?)", [coins, goods], (err, ok) => {
    // ...
});
```

### Getting the id of an inserted row

After the SQL statement is executed successfully, an `OkPacket` object (`ok`) will be returned.

```javascript
conn.query("INSERT INTO players (coins, goods) VALUES (?, ?)", [coins, goods], (err, ok) => {
    if (err) {
        throw(err);
    } else {
        console.log(ok.insertId)
    }
});
```

If you are inserting a row into a table with an [`AUTO_INCREMENT`](https://docs.pingcap.com/tidb/dev/auto-increment) / [`AUTO_RANDOM`](https://docs.pingcap.com/tidb/dev/auto-random) primary key, you can retrieve the insert id through the `ok.insertId` field:

**Notice:** The primary key using the `AUTO_RANDOM` attribute must be of type `INT64`. You need to enable the `supportBigNumbers` option of the connection to read the insert id as a string, otherwise an error will be thrown due to the JavaScript Number precision limitation.

