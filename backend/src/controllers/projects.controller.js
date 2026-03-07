const db = require('../config/db');

async function getOrgId(userId) {
  const { rows } = await db.query(`SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1`, [userId]);
  return rows[0]?.org_id || null;
}

async function listProjects(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.json([]);

    const { status, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT * FROM projects WHERE org_id = $1`;
    const params = [orgId];
    let idx = 2;

    if (status) { sql += ` AND status = $${idx++}`; params.push(status); }

    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rows } = await db.query(
      `SELECT * FROM projects WHERE id = $1 AND org_id = $2`,
      [req.params.id, orgId]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No organization found' } });

    const { name, description, industry, metadata } = req.body;

    const { rows } = await db.query(
      `INSERT INTO projects (org_id, name, description, industry, metadata, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orgId, name, description, industry, metadata ? JSON.stringify(metadata) : '{}', req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { name, description, status, industry, metadata } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }
    if (status !== undefined) { updates.push(`status = $${idx++}`); values.push(status); }
    if (industry !== undefined) { updates.push(`industry = $${idx++}`); values.push(industry); }
    if (metadata !== undefined) { updates.push(`metadata = $${idx++}`); values.push(JSON.stringify(metadata)); }

    if (updates.length === 0) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id, orgId);

    const { rows } = await db.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${idx++} AND org_id = $${idx} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function archiveProject(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rows } = await db.query(
      `UPDATE projects SET status = 'archived', updated_at = NOW() WHERE id = $1 AND org_id = $2 RETURNING *`,
      [req.params.id, orgId]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rowCount } = await db.query(
      `DELETE FROM projects WHERE id = $1 AND org_id = $2`,
      [req.params.id, orgId]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProjects, getProject, createProject, updateProject, archiveProject, deleteProject };
