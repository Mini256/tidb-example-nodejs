import envSchema from "env-schema";

export function loadEnvWithDatabaseURL() {
    return envSchema({
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
}