import envSchema from "env-schema";
import {createConnection} from "mysql";
import * as fs from "fs";
import ConnectionConfig from "mysql/lib/ConnectionConfig.js";

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

// Connect TiDB with TLS connection.
const conn = createConnection({
    host: config.TIDB_HOST,
    port: config.TIDB_PORT,
    user: config.TIDB_USER,
    password: config.TIDB_PASSWORD,
    database: config.TIDB_DATABASE,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
        // For Dedicated Tier:
        //
        // You can use the `ca` parameter to specify the CA certificate from TiDB Cloud, For example:
        // ca: fs.readFileSync("/path/to/ca.pem")
        //
        // For Serverless Tier:
        //
        // You can specify a system or public CA certificate with the `ca` parameter. If no ca parameter is provided,
        // Node.js will use the built-in list of root certificates (which is extract from Mozilla CA certificates).
        //
        // https://github.com/nodejs/node/blob/v20.2.0/src/node_root_certs.h
        //
        // For example:
        // ca: fs.readFileSync("/etc/ssl/cert.pem")
    }
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
