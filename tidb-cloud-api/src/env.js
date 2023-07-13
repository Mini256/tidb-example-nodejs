"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.loadEnvConfig = void 0;
var env_schema_1 = __importDefault(require("env-schema"));
function loadEnvConfig() {
    return (0, env_schema_1["default"])({
        schema: {
            type: 'object',
            required: ['TIDB_CLOUD_PUBLIC_KEY', 'TIDB_CLOUD_PRIVATE_KEY'],
            properties: {
                TIDB_CLOUD_PUBLIC_KEY: {
                    type: 'string'
                },
                TIDB_CLOUD_PRIVATE_KEY: {
                    type: 'string'
                }
            }
        },
        dotenv: true
    });
}
exports.loadEnvConfig = loadEnvConfig;
//# sourceMappingURL=env.js.map