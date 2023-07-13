import envSchema from "env-schema";

export interface EnvConfig {
    TIDB_CLOUD_PUBLIC_KEY: string;
    TIDB_CLOUD_PRIVATE_KEY: string;
}

export function loadEnvConfig(): EnvConfig {
    return envSchema<EnvConfig>({
        schema: {
            type: 'object',
            required: [ 'TIDB_CLOUD_PUBLIC_KEY', 'TIDB_CLOUD_PRIVATE_KEY' ],
            properties: {
                TIDB_CLOUD_PUBLIC_KEY: {
                    type: 'string',
                },
                TIDB_CLOUD_PRIVATE_KEY: {
                    type: 'string'
                }
            },
        },
        dotenv: true,
    });
}