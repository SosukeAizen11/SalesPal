const dotenv = require("dotenv");
const path = require("path");

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const REQUIRED_VARS = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `❌ Missing required environment variables:\n  ${missing.join("\n  ")}`,
  );
  console.error("Copy .env.example to .env and fill in all required values.");
  process.exit(1);
}

const env = {
  // Server
  PORT: parseInt(process.env.PORT, 10) || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  // Database
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true",
    poolMax: parseInt(process.env.DB_POOL_MAX, 10) || 20,
    cloudSqlConnectionName: process.env.CLOUD_SQL_CONNECTION_NAME || null,
  },

  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTTL: parseInt(process.env.JWT_ACCESS_TTL, 10) || 900,
    refreshTTL: parseInt(process.env.JWT_REFRESH_TTL, 10) || 604800,
  },

  // Auth
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,

  // CORS
  corsOrigins: (() => {
    const raw = process.env.CORS_ORIGINS || "http://localhost:5173";
    if (raw.trim() === "*") return "*";
    return raw.split(",").map((s) => s.trim());
  })(),

  // AI
  ai: {
    apiUrl:
      process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions",
    apiKey: process.env.AI_API_KEY || "",
    model: process.env.AI_MODEL || "gpt-4o-mini",
  },

  // Social / Meta
  meta: {
    appId: process.env.META_APP_ID || "",
    appSecret: process.env.META_APP_SECRET || "",
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
};

module.exports = env;
