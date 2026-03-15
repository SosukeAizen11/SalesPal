/**
 * Creates a demo user for Razorpay verification.
 * Run once: node create_demo_user.js
 */
const bcrypt = require('bcrypt');
const db = require('./src/config/db');

async function createDemoUser() {
    const email = 'demo@salespal.ai';
    const password = 'Demo@1234';
    const fullName = 'Demo User';

    try {
        // Check if already exists
        const { rows: existing } = await db.query(
            'SELECT id FROM users WHERE email = $1', [email]
        );

        if (existing.length > 0) {
            console.log(`✅ Demo user already exists: ${email}`);
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const { rows } = await db.query(
            `INSERT INTO users (email, password_hash, full_name, email_verified, role)
             VALUES ($1, $2, $3, true, 'user')
             RETURNING id, email, full_name`,
            [email, passwordHash, fullName]
        );

        console.log('✅ Demo user created successfully!');
        console.log('─────────────────────────────');
        console.log(`Email    : ${email}`);
        console.log(`Password : ${password}`);
        console.log(`Name     : ${fullName}`);
        console.log(`ID       : ${rows[0].id}`);
        console.log('─────────────────────────────');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        process.exit(0);
    }
}

createDemoUser();
