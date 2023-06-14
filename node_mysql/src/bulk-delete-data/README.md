# Bulk delete data

Load the players table data into TiDB:

```shell
mycli --host 127.0.0.1 --port 4000 -u root --no-warn < ./sql/players.init.sql
```

Run the demo:

```shell
npm run demo:bulk-delete-data
```

Expected output:

```
Bulk delete 3 players:
OkPacket {
  fieldCount: 0,
  affectedRows: 3,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
```
