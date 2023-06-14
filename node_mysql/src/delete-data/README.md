# Delete data

Load the players table data into TiDB:

```shell
mycli --host 127.0.0.1 --port 4000 -u root --no-warn < ./sql/players.init.sql
```

Run the demo:

```shell
npm run demo:delete-data
```

Expected output:

```
Player 2 has been deleted successfully:
OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
```
