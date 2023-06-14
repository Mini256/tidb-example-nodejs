# Connect to TiDB

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

`mysqljs/mysql` will use the built-in root certificate of Node.js (which is extract from Mozilla CA certificates) to establish a secure connection with TiDB.

If you need to use a custom root certificate (for example: the CA certificate provided by the TiDB Cloud dedicated cluster), you can use the `ssl.ca` option to configure, for example:

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

### Using Database URL with SSL options

If you used the URL string to configure the database connection, like this:

```javascript
const conn = createConnection(ConnectionConfig.parseUrl(process.env.DATABASE_URL));
```

You can add the `ssl` option configuration to the URL string, for example:

```dotenv
DATABASE_URL=mysql://username:password@host:4000/database?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}
```

## Demo

```shell
npm run demo:connect-with-ssl-options
```

Expected output:

```
Connected to TiDB cluster!
TiDB version: 5.7.25-TiDB-v6.6.0-serverless
```
