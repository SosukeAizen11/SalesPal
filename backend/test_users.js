const pool = require('./src/config/db');

async function checkUsers() {
  try {
    const res = await pool.query('SELECT email, email_verified FROM users ORDER BY created_at DESC LIMIT 5');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkUsers();
