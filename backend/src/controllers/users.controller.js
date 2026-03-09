const db = require('../config/db');

async function getMe(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT u.id, u.email, u.full_name, u.avatar_url, u.role, u.metadata, u.created_at,
              om.org_id, om.role AS org_role, o.name AS org_name
       FROM users u
       LEFT JOIN org_members om ON u.id = om.user_id
       LEFT JOIN organizations o ON om.org_id = o.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    const { password_hash, ...user } = rows[0];
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { fullName, avatarUrl, metadata } = req.body;
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (fullName !== undefined) {
      updates.push(`full_name = $${paramIndex++}`);
      values.push(fullName);
    }
    if (avatarUrl !== undefined) {
      updates.push(`avatar_url = $${paramIndex++}`);
      values.push(avatarUrl);
    }
    if (metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(metadata));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'No fields to update' },
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user.id);

    const { rows } = await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, full_name, avatar_url, role, metadata, updated_at`,
      values
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id, email, full_name, avatar_url, role, created_at FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function getSettings(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT metadata->'settings' AS settings FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    res.json(rows[0].settings || {});
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const settings = req.body;
    
    // Merge new settings with existing metadata
    const { rows } = await db.query(
      `UPDATE users 
       SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('settings', COALESCE(metadata->'settings', '{}'::jsonb) || $1::jsonb),
           updated_at = NOW()
       WHERE id = $2 
       RETURNING metadata->'settings' AS settings`,
      [JSON.stringify(settings), req.user.id]
    );

    res.json(rows[0].settings || {});
  } catch (err) {
    next(err);
  }
}

async function getMyOrg(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT o.*, om.role as user_role 
       FROM organizations o
       JOIN org_members om ON o.id = om.org_id
       WHERE om.user_id = $1 LIMIT 1`,
      [req.user.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Organization not found' } });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function bootstrapOrg(req, res, next) {
  const client = await db.getClient();
  try {
    const userId = req.user.id;
    let orgName = req.body.name;

    if (!orgName) {
      const { rows: userRows } = await client.query('SELECT full_name, email FROM users WHERE id = $1', [userId]);
      const user = userRows[0];
      const userName = user.full_name || user.email?.split('@')[0] || 'My';
      orgName = `${userName}'s Workspace`;
    }

    await client.query('BEGIN');

    // Create organization
    const { rows: orgRows } = await client.query(
      `INSERT INTO organizations (name, slug) 
       VALUES ($1, $2) 
       RETURNING *`,
      [orgName, orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-')]
    );
    const orgId = orgRows[0].id;

    // Add user as admin to org_members
    await client.query(
      `INSERT INTO org_members (org_id, user_id, role) 
       VALUES ($1, $2, 'admin')`,
      [orgId, userId]
    );

    // Create initial billing subscription record
    await client.query(
      `INSERT INTO subscriptions (org_id, plan_id, status) 
       VALUES ($1, 'free', 'active')`,
      [orgId]
    );

    await client.query('COMMIT');
    res.status(201).json(orgRows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

module.exports = { getMe, updateMe, getUserById, getMyOrg, bootstrapOrg, getSettings, updateSettings };
