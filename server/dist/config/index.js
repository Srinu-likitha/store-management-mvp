"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
function getEnv(key, required = true) {
    const value = process.env[key];
    if (!value && required) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}
exports.config = {
    app: {
        env: getEnv("NODE_ENV", false) || "development",
        port: parseInt(getEnv("PORT", false) || "3000", 10),
    },
    db: {
        url: getEnv("DATABASE_URL"),
    },
    auth: {
        jwtSecret: getEnv("JWT_SECRET"),
    },
    supabase: {
        url: getEnv("SUPABASE_URL"),
        serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
        bucket: getEnv("SUPABASE_BUCKET"),
    }
};
