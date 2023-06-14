import envSchema from "env-schema";
import {createConnection} from "mysql";

// Load environment variables from .env file.
const config = envSchema({
    schema: {
        type: 'object',
        required: [ 'TIDB_HOST', 'TIDB_PORT', 'TIDB_USER', 'TIDB_PASSWORD', 'TIDB_DATABASE' ],
        properties: {
            TIDB_HOST: {
                type: 'string'
            },
            TIDB_PORT: {
                type: 'number'
            },
            TIDB_USER: {
                type: 'string'
            },
            TIDB_PASSWORD: {
                type: 'string'
            },
            TIDB_DATABASE: {
                type: 'string'
            },
        },
    },
    dotenv: true,
});

// Connect TiDB with connection options.
const conn = createConnection({
    host: config.TIDB_HOST,
    port: config.TIDB_PORT,
    user: config.TIDB_USER,
    password: config.TIDB_PASSWORD,
    database: config.TIDB_DATABASE,
});

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