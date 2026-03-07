const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');
const logger = require('../config/logger');

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

async function runMigrations() {
  const client = await pool.connect();

  try {
    // Read all .sql files in numeric order
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    logger.info(`Found ${files.length} migration files`);

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      logger.info(`Running migration: ${file}`);
      await client.query(sql);
      logger.info(`Completed migration: ${file}`);
    }

    logger.info('All migrations completed successfully');
  } catch (err) {
    logger.error(`Migration failed: ${err.message}`, { stack: err.stack });
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
