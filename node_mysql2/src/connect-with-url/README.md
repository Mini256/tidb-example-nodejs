# Connect with Options

## Demo

Run the demo:

```shell
npm run demo:connect-with-url
```

Expected output:

```
Connected to TiDB cluster!
TiDB version: 5.7.25-TiDB-v7.1.0
```

## Introduction

### Create a connection with url

In some cases, you may prefer to use the URL string to configure the database connection like this:

```dotenv
DATABASE_URL=mysql://user:password@host:port/database
```

You can add the `ssl` option configuration to the URL string, for example:

```dotenv
DATABASE_URL=mysql://username:password@host:4000/database?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}
```

If you used the URL string to configure the database connection, like this:

```javascript
const conn = createConnection(process.env.DATABASE_URL);
```