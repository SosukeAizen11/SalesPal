const db = require('../config/db');

async function listDeals(req, res, next) {
  try {
    const { stage, assignedTo, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT d.*, c.first_name AS contact_first_name, c.last_name AS contact_last_name, c.email AS contact_email
               FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
               WHERE d.user_id = $1`;
    const params = [req.user.id];
    let idx = 2;

    if (stage) { sql += ` AND d.stage = $${idx++}`; params.push(stage); }
    if (assignedTo) { sql += ` AND d.assigned_to = $${idx++}`; params.push(assignedTo); }

    sql += ` ORDER BY d.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getDeal(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT d.*, c.first_name AS contact_first_name, c.last_name AS contact_last_name
       FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
       WHERE d.id = $1 AND d.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createDeal(req, res, next) {
  try {
    const { title, description, value, currency, stage, priority, expectedCloseDate, contactId, assignedTo, tags, metadata } = req.body;

    // Resolve org_id for the user
    const orgResult = await db.query(`SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1`, [req.user.id]);
    const orgId = orgResult.rows[0]?.org_id || null;

    const { rows } = await db.query(
      `INSERT INTO deals (user_id, org_id, title, description, value, currency, stage, priority, expected_close_date, contact_id, assigned_to, tags, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [req.user.id, orgId, title, description, value || 0, currency || 'INR', stage || 'lead', priority || 'medium', expectedCloseDate || null, contactId || null, assignedTo || null, tags || '{}', metadata ? JSON.stringify(metadata) : '{}']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateDeal(req, res, next) {
  try {
    const { title, description, value, currency, stage, priority, expectedCloseDate, actualCloseDate, contactId, assignedTo, tags, metadata } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) { updates.push(`title = $${idx++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }
    if (value !== undefined) { updates.push(`value = $${idx++}`); values.push(value); }
    if (currency !== undefined) { updates.push(`currency = $${idx++}`); values.push(currency); }
    if (stage !== undefined) { updates.push(`stage = $${idx++}`); values.push(stage); }
    if (priority !== undefined) { updates.push(`priority = $${idx++}`); values.push(priority); }
    if (expectedCloseDate !== undefined) { updates.push(`expected_close_date = $${idx++}`); values.push(expectedCloseDate); }
    if (actualCloseDate !== undefined) { updates.push(`actual_close_date = $${idx++}`); values.push(actualCloseDate); }
    if (contactId !== undefined) { updates.push(`contact_id = $${idx++}`); values.push(contactId); }
    if (assignedTo !== undefined) { updates.push(`assigned_to = $${idx++}`); values.push(assignedTo); }
    if (tags !== undefined) { updates.push(`tags = $${idx++}`); values.push(tags); }
    if (metadata !== undefined) { updates.push(`metadata = $${idx++}`); values.push(JSON.stringify(metadata)); }

    if (updates.length === 0) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id, req.user.id);

    const { rows } = await db.query(
      `UPDATE deals SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
      values
    );

    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteDeal(req, res, next) {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM deals WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    res.json({ message: 'Deal deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listDeals, getDeal, createDeal, updateDeal, deleteDeal };
