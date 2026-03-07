const { Pool } = require('pg');
const env = require('./env');
const logger = require('./logger');

const poolConfig = {
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: env.db.poolMax,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Cloud Run with Cloud SQL Proxy uses Unix socket
if (env.db.cloudSqlConnectionName && env.isProduction) {
  poolConfig.host = `/cloudsql/${env.db.cloudSqlConnectionName}`;
} else {
  poolConfig.host = env.db.host;
  poolConfig.port = env.db.port;
}

if (env.db.ssl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL pool error', { error: err.message });
});

pool.on('connect', () => {
  logger.debug('New PostgreSQL client connected');
});

/**
 * Execute a parameterized SQL query.
 * @param {string} text — SQL query with $1, $2, … placeholders
 * @param {any[]} params — Parameter values
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = async (text, params = []) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text: text.substring(0, 80), duration, rows: result.rowCount });
  return result;
};

/**
 * Get a client from the pool for transactions.
 * Caller MUST call client.release() when done.
 * @returns {Promise<import('pg').PoolClient>}
 */
const getClient = async () => {
  return pool.connect();
};

/**
 * Gracefully close the pool.
 */
const close = async () => {
  logger.info('Closing PostgreSQL connection pool');
  await pool.end();
};

module.exports = { pool, query, getClient, close };
