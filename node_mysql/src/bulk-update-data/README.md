# Bulk update data

Load the players table data into TiDB:

```shell
mycli --host 127.0.0.1 --port 4000 -u root --no-warn < ./sql/players.init.sql
```

Run the demo:

```shell
npm run demo:bulk-update-data
```

Expected output:

```
Bulk increase 3 players' coins by 100:
OkPacket {
  fieldCount: 0,
  affectedRows: 3,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '(Rows matched: 3  Changed: 0  Warnings: 0',
  protocol41: true,
  changedRows: 0
}
```
