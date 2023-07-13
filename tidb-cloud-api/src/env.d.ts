export interface EnvConfig {
    TIDB_CLOUD_PUBLIC_KEY: string;
    TIDB_CLOUD_PRIVATE_KEY: string;
}
export declare function loadEnvConfig(): EnvConfig;
