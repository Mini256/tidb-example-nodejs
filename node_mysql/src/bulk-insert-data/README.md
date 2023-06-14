### Bulk insert data

Load the players table data into TiDB:

```shell
mycli --host 127.0.0.1 --port 4000 -u root --no-warn < ./sql/players.init.sql
```


Run the demo:

```shell
npm run demo:bulk-insert-data
```

Expected output:

```
Bulk insert 3 new players:
OkPacket {
  fieldCount: 0,
  affectedRows: 3,
  insertId: 7,
  serverStatus: 2,
  warningCount: 0,
  message: '&Records: 3  Duplicates: 0  Warnings: 0',
  protocol41: true,
  changedRows: 0
}
```
