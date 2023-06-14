# Connect with Options

## Introduction

### Create a connection with url

In some cases, you may prefer to use the URL string to configure the database connection like this:

```dotenv
DATABASE_URL=mysql://user:password@host:port/database
```

mysqljs/mysql provides the `ConnectionConfig.parseUrl()` utility method to help you parse URL strings into connection configuration objects.

```javascript
const conn = createConnection(ConnectionConfig.parseUrl(process.env.DATABASE_URL));
```

## Demo

Run the demo:

```shell
npm run demo:connect-with-url
```

Expected output:

```
Connected to TiDB cluster!
TiDB version: 5.7.25-TiDB-v7.0.0
```
