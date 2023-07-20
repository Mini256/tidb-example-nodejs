# Query data

## Demo

### Steps

Run the demo:

```shell
npm run demo:simple
```

### Expected Output

```
[Simple Example Output]

Created new player with ID 9.
Get player by ID 3: Player { id:3, coins:4, goods:256 }
The total number of players: 9
List players with limit 3:
- Player { id:1, coins:1, goods:1024 }
- Player { id:2, coins:2, goods:512 }
- Player { id:3, coins:4, goods:256 }

[Bulk Example Output]

Bulk inserted 200 rows.
Bulk inserted 200 rows.
Bulk inserted 200 rows.
Bulk inserted 200 rows.
Bulk inserted 200 rows.

[Trade Example Output]

[Trade 1] Doing trade 10 goods from player 102 to player 101 for 500 coins.
[Trade 1] Trade failed (rollback the transaction): The coins of buy player 101 is not enough.

[Trade 2] Doing trade 2 goods from player 102 to player 101 for 100 coins.
[Trade 2] Trade success!

Player status after trade:
- Player { id:101, coins:0, goods:2 }
- Player { id:102, coins:2100, goods:18 }
```
