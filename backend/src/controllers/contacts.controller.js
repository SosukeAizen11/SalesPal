const db = require('../config/db');

async function listContacts(req, res, next) {
  try {
    const { status, company, search, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT * FROM contacts WHERE user_id = $1`;
    const params = [req.user.id];
    let idx = 2;

    if (status) { sql += ` AND status = $${idx++}`; params.push(status); }
    if (company) { sql += ` AND company ILIKE $${idx++}`; params.push(`%${company}%`); }
    if (search) { sql += ` AND (first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR email ILIKE $${idx})`; params.push(`%${search}%`); idx++; }

    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getContact(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT * FROM contacts WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contact not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createContact(req, res, next) {
  try {
    const { firstName, lastName, email, phone, company, jobTitle, source, status, tags, notes, metadata } = req.body;

    const orgResult = await db.query(`SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1`, [req.user.id]);
    const orgId = orgResult.rows[0]?.org_id || null;

    const { rows } = await db.query(
      `INSERT INTO contacts (user_id, org_id, first_name, last_name, email, phone, company, job_title, source, status, tags, notes, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [req.user.id, orgId, firstName, lastName, email, phone, company, jobTitle, source, status || 'active', tags || '{}', notes, metadata ? JSON.stringify(metadata) : '{}']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const { firstName, lastName, email, phone, company, jobTitle, source, status, tags, notes, metadata } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (firstName !== undefined) { updates.push(`first_name = $${idx++}`); values.push(firstName); }
    if (lastName !== undefined) { updates.push(`last_name = $${idx++}`); values.push(lastName); }
    if (email !== undefined) { updates.push(`email = $${idx++}`); values.push(email); }
    if (phone !== undefined) { updates.push(`phone = $${idx++}`); values.push(phone); }
    if (company !== undefined) { updates.push(`company = $${idx++}`); values.push(company); }
    if (jobTitle !== undefined) { updates.push(`job_title = $${idx++}`); values.push(jobTitle); }
    if (source !== undefined) { updates.push(`source = $${idx++}`); values.push(source); }
    if (status !== undefined) { updates.push(`status = $${idx++}`); values.push(status); }
    if (tags !== undefined) { updates.push(`tags = $${idx++}`); values.push(tags); }
    if (notes !== undefined) { updates.push(`notes = $${idx++}`); values.push(notes); }
    if (metadata !== undefined) { updates.push(`metadata = $${idx++}`); values.push(JSON.stringify(metadata)); }

    if (updates.length === 0) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id, req.user.id);

    const { rows } = await db.query(
      `UPDATE contacts SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
      values
    );

    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contact not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM contacts WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contact not found' } });
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listContacts, getContact, createContact, updateContact, deleteContact };
