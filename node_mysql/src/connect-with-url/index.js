import envSchema from "env-schema";
import {createConnection} from "mysql";
import ConnectionConfig from "mysql/lib/ConnectionConfig.js";

// Load environment variables from .env file.
const config = envSchema({
    schema: {
        type: 'object',
        required: [ 'DATABASE_URL' ],
        properties: {
            DATABASE_URL: {
                type: 'string'
            },
        },
    },
    dotenv: true,
});

// Connect TiDB with connection url.
const conn = createConnection(ConnectionConfig.parseUrl(config.DATABASE_URL));

// Connect to TiDB cluster.
conn.connect(async (err) => {
    if (err) {
        console.error('Failed to connect to TiDB cluster.', err);
    }
    console.log("Connected to TiDB cluster!");

    // Checkout the TiDB version.
    conn.query("SELECT version() AS tidb_version;", (error, rows, fields) => {
        if (error) {
            console.error(error);
        } else {
            console.log("TiDB version:", rows[0]['tidb_version']);
        }

        // Close the connection.
        conn.end();
    });
});
