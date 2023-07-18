# Connect to TiDB

## Demo

```shell
npm run demo:connect-with-ssl-options
```

Expected output:

```
Connected to TiDB cluster!
TiDB version: 5.7.25-TiDB-v6.6.0-serverless
```

Unexpected output:

<details>

<summary>Error: Server does not support secure connection</summary>

If you encounter the following error, it means that the TiDB cluster you are connecting to does not have SSL (TLS) enabled, try to remove the `ssl` options or enable SSL (TLS) config in your self-hosted cluster.

</details>

## Introduction

If you want to connect a TiDB Serverless cluster, you are required to use SSL (TLS) to establish a secure connection with the TiDB cluster.

Or when your application is not deploy in the same network as the TiDB cluster, it is also recommended to use SSL (TLS) to establish a secure connection.

### Create a connection with SSL options

You can add the `ssl` option configuration to the original connection option configuration, for example:

```javascript
const conn = createConnection({
    host: config.TIDB_HOST,
    port: config.TIDB_PORT,
    user: config.TIDB_USER,
    password: config.TIDB_PASSWORD,
    database: config.TIDB_DATABASE,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
    }
});
```

### Custom root certificate

By default, `mysql2` driver will use the built-in root certificate of Node.js (which is extract from Mozilla CA certificates) to establish a secure connection with TiDB, so you don't need to configure the `ssl.ca` option.

If you need to specify a custom root certificate (for example: the CA certificate provided by the TiDB Cloud dedicated cluster), you can configure the `ssl.ca` option as follows:

```javascript
const conn = createConnection({
    host: config.TIDB_HOST,
    port: config.TIDB_PORT,
    user: config.TIDB_USER,
    password: config.TIDB_PASSWORD,
    database: config.TIDB_DATABASE,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
        ca: fs.readFileSync("/path/to/cert.pem")
    }
});
```


