const db = require('../config/db');

/**
 * Module pricing and limits configuration (matches frontend commerce.config.js).
 */
const MODULES = {
  marketing: { id: 'marketing', name: 'Marketing', price: 5999, limits: { images: 20, videos: 4, posts: 30, calls: 500, whatsapp: 300 } },
  sales: { id: 'sales', name: 'Sales', price: 9999 },
  postSale: { id: 'postSale', name: 'Post-Sales', price: 9999 },
  support: { id: 'support', name: 'Support', price: 9999 },
  salespal360: { id: 'salespal360', name: 'SalesPal 360', price: 29999, limits: { images: 100, videos: 20, posts: 150, calls: 1000, whatsapp: 500 } },
};

/**
 * Get all active subscriptions for a user.
 */
async function getUserSubscriptions(userId) {
  const { rows } = await db.query(
    `SELECT * FROM subscriptions WHERE user_id = $1`,
    [userId]
  );
  return rows;
}

/**
 * Get a specific subscription by user and module.
 */
async function getSubscription(userId, moduleId) {
  const { rows } = await db.query(
    `SELECT * FROM subscriptions WHERE user_id = $1 AND module = $2`,
    [userId, moduleId]
  );
  return rows[0] || null;
}

/**
 * Activate a subscription for a user.
 * Handles single modules and bundle (salespal360 activates all modules).
 */
async function activateSubscription(userId, orgId, moduleId) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const moduleIds = moduleId === 'salespal360' || moduleId === 'bundle'
      ? ['marketing', 'sales', 'postSale', 'support', 'salespal360']
      : [moduleId];

    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const results = [];

    for (const modId of moduleIds) {
      const { rows } = await client.query(
        `INSERT INTO subscriptions (user_id, org_id, module, status, plan, activated_at, expires_at)
         VALUES ($1, $2, $3, 'active', 'starter', $4, $5)
         ON CONFLICT (user_id, module)
         DO UPDATE SET status = 'active', activated_at = $4, expires_at = $5, updated_at = NOW()
         RETURNING *`,
        [userId, orgId, modId, now, expiresAt]
      );
      results.push(rows[0]);

      // Allocate base credits for marketing on activation
      if (modId === 'marketing' && orgId) {
        const limits = MODULES.marketing.limits;
        const baseCredits = (limits.images || 20) + (limits.videos || 4);

        // Ensure marketing_credits row exists
        await client.query(
          `INSERT INTO marketing_credits (org_id, balance)
           VALUES ($1, $2)
           ON CONFLICT (org_id) DO UPDATE SET balance = marketing_credits.balance + $2, updated_at = NOW()`,
          [orgId, baseCredits]
        );

        // Log the transaction
        const { rows: creditRows } = await client.query(
          `SELECT balance FROM marketing_credits WHERE org_id = $1`,
          [orgId]
        );
        await client.query(
          `INSERT INTO credit_transactions (org_id, type, amount, balance_after, reference_type, description)
           VALUES ($1, 'credit', $2, $3, 'subscription', 'Base credits from subscription activation')`,
          [orgId, baseCredits, creditRows[0]?.balance || baseCredits]
        );
      }
    }

    await client.query('COMMIT');
    return results;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Deactivate (cancel) a subscription.
 */
async function deactivateSubscription(userId, moduleId) {
  const { rows } = await db.query(
    `UPDATE subscriptions SET status = 'cancelled', updated_at = NOW()
     WHERE user_id = $1 AND module = $2 RETURNING *`,
    [userId, moduleId]
  );
  return rows[0] || null;
}

/**
 * Pause a subscription.
 */
async function pauseSubscription(userId, moduleId) {
  const { rows } = await db.query(
    `UPDATE subscriptions SET status = 'paused', updated_at = NOW()
     WHERE user_id = $1 AND module = $2 RETURNING *`,
    [userId, moduleId]
  );
  return rows[0] || null;
}

/**
 * Resume a paused subscription.
 */
async function resumeSubscription(userId, moduleId) {
  const { rows } = await db.query(
    `UPDATE subscriptions SET status = 'active', updated_at = NOW()
     WHERE user_id = $1 AND module = $2 RETURNING *`,
    [userId, moduleId]
  );
  return rows[0] || null;
}

/**
 * Get credit balance for an org.
 */
async function getCreditBalance(orgId) {
  const { rows } = await db.query(
    `SELECT balance FROM marketing_credits WHERE org_id = $1`,
    [orgId]
  );
  return rows[0]?.balance || 0;
}

/**
 * Consume credits (decrement balance).
 * Returns true if successful, false if insufficient balance.
 */
async function consumeCredit(orgId, type, amount = 1) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Lock the row for update
    const { rows } = await client.query(
      `SELECT balance FROM marketing_credits WHERE org_id = $1 FOR UPDATE`,
      [orgId]
    );

    if (!rows[0] || rows[0].balance < amount) {
      await client.query('ROLLBACK');
      return false;
    }

    const newBalance = rows[0].balance - amount;

    await client.query(
      `UPDATE marketing_credits SET balance = $1, updated_at = NOW() WHERE org_id = $2`,
      [newBalance, orgId]
    );

    await client.query(
      `INSERT INTO credit_transactions (org_id, type, amount, balance_after, reference_type, description)
       VALUES ($1, 'debit', $2, $3, $4, $5)`,
      [orgId, amount, newBalance, type, `Consumed ${amount} ${type} credit(s)`]
    );

    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Add credits to an org's balance.
 */
async function addCredits(orgId, amount, source = 'topup') {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO marketing_credits (org_id, balance)
       VALUES ($1, $2)
       ON CONFLICT (org_id) DO UPDATE SET balance = marketing_credits.balance + $2, updated_at = NOW()
       RETURNING balance`,
      [orgId, amount]
    );

    await client.query(
      `INSERT INTO credit_transactions (org_id, type, amount, balance_after, reference_type, description)
       VALUES ($1, 'credit', $2, $3, $4, $5)`,
      [orgId, amount, rows[0].balance, source, `Added ${amount} credits via ${source}`]
    );

    await client.query('COMMIT');
    return rows[0].balance;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get credit transaction history for an org.
 */
async function getCreditTransactions(orgId, limit = 50) {
  const { rows } = await db.query(
    `SELECT * FROM credit_transactions WHERE org_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [orgId, limit]
  );
  return rows;
}

/**
 * Check if a module is active for a user.
 */
async function isModuleActive(userId, moduleId) {
  const sub = await getSubscription(userId, moduleId);
  return sub && (sub.status === 'active' || sub.status === 'trial');
}

module.exports = {
  MODULES,
  getUserSubscriptions,
  getSubscription,
  activateSubscription,
  deactivateSubscription,
  pauseSubscription,
  resumeSubscription,
  getCreditBalance,
  consumeCredit,
  addCredits,
  getCreditTransactions,
  isModuleActive,
};
