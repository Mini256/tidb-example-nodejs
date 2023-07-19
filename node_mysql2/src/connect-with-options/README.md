# Connect with Options

## Demo

Run the demo:

```shell
npm run demo:connect-with-options
```

Expected output:

```
Connected to TiDB cluster!
TiDB version: 5.7.25-TiDB-v7.1.0
```

## Introduction

### Create a connection with options

You can create a connection with the `createConnection()` method, for example:

```javascript
const conn = createConnection({
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
});
```

### Check if the connection is successful

Use the `err` parameter in the callback function of the `conn.connect()` method to determine whether the connection is successful, for example:

```javascript
conn.connect(async (err) => {
    if (err) {
        console.error('Failed to connect to TiDB cluster.', err);
    }

    console.log("Connected to TiDB cluster!");
});
```

### Terminate connection

If the connection is no longer used, you should use the `conn.end()` method to terminate the connection in time to avoid causing too many idle connections.
```javascript
conn.end();
```
