const db = require('../config/db');

// ─── Helpers ────────────────────────────────────────────────────────────────
async function getOrgId(userId) {
  const { rows } = await db.query(`SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1`, [userId]);
  return rows[0]?.org_id || null;
}

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

async function listCustomers(req, res, next) {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT * FROM ps_customers WHERE user_id = $1`;
    const params = [req.user.id];
    let idx = 2;

    if (status) { sql += ` AND status = $${idx++}`; params.push(status); }
    if (search) {
      sql += ` AND (name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx})`;
      params.push(`%${search}%`); idx++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
}

async function getCustomer(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT * FROM ps_customers WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Customer not found' } });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

async function createCustomer(req, res, next) {
  try {
    const { name, phone, email, company, totalDue, amountPaid, dueDate, currency, status, tags, notes, metadata } = req.body;
    const orgId = await getOrgId(req.user.id);

    const { rows } = await db.query(
      `INSERT INTO ps_customers
        (user_id, org_id, name, phone, email, company, total_due, amount_paid, due_date, currency, status, last_contact, tags, notes, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW()::DATE,$12,$13,$14) RETURNING *`,
      [req.user.id, orgId, name, phone || null, email || null, company || null,
       totalDue || 0, amountPaid || 0, dueDate || null, currency || 'INR',
       status || 'active', tags || '{}', notes || null, metadata ? JSON.stringify(metadata) : '{}']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

async function updateCustomer(req, res, next) {
  try {
    const { name, phone, email, company, totalDue, amountPaid, dueDate, currency, status, healthScore, tags, notes, metadata } = req.body;
    const updates = []; const values = []; let idx = 1;

    if (name !== undefined)        { updates.push(`name = $${idx++}`); values.push(name); }
    if (phone !== undefined)       { updates.push(`phone = $${idx++}`); values.push(phone); }
    if (email !== undefined)       { updates.push(`email = $${idx++}`); values.push(email); }
    if (company !== undefined)     { updates.push(`company = $${idx++}`); values.push(company); }
    if (totalDue !== undefined)    { updates.push(`total_due = $${idx++}`); values.push(totalDue); }
    if (amountPaid !== undefined)  { updates.push(`amount_paid = $${idx++}`); values.push(amountPaid); }
    if (dueDate !== undefined)     { updates.push(`due_date = $${idx++}`); values.push(dueDate); }
    if (currency !== undefined)    { updates.push(`currency = $${idx++}`); values.push(currency); }
    if (status !== undefined)      { updates.push(`status = $${idx++}`); values.push(status); }
    if (healthScore !== undefined) { updates.push(`health_score = $${idx++}`); values.push(healthScore); }
    if (tags !== undefined)        { updates.push(`tags = $${idx++}`); values.push(tags); }
    if (notes !== undefined)       { updates.push(`notes = $${idx++}`); values.push(notes); }
    if (metadata !== undefined)    { updates.push(`metadata = $${idx++}`); values.push(JSON.stringify(metadata)); }

    if (updates.length === 0) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } });

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id, req.user.id);

    const { rows } = await db.query(
      `UPDATE ps_customers SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Customer not found' } });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

async function deleteCustomer(req, res, next) {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM ps_customers WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Customer not found' } });
    res.json({ message: 'Customer deleted' });
  } catch (err) { next(err); }
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

async function listPayments(req, res, next) {
  try {
    const { customerId, status, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT p.* FROM ps_payments p
               JOIN ps_customers c ON p.customer_id = c.id
               WHERE p.user_id = $1`;
    const params = [req.user.id]; let idx = 2;

    if (customerId) { sql += ` AND p.customer_id = $${idx++}`; params.push(customerId); }
    if (status)     { sql += ` AND p.status = $${idx++}`; params.push(status); }
    sql += ` ORDER BY p.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
}

async function createPayment(req, res, next) {
  try {
    const { customerId, amount, currency, status, dueDate, paymentMethod, notes, metadata } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ps_payments (customer_id, user_id, amount, currency, status, due_date, payment_method, notes, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [customerId, req.user.id, amount, currency || 'INR', status || 'pending',
       dueDate || null, paymentMethod || null, notes || null, metadata ? JSON.stringify(metadata) : '{}']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const { status } = req.body;
    const paidAt = status === 'paid' ? 'NOW()' : 'NULL';
    const { rows } = await db.query(
      `UPDATE ps_payments SET status = $1, paid_at = ${paidAt}, updated_at = NOW()
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Payment not found' } });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

// ─── AUTOMATIONS ─────────────────────────────────────────────────────────────

async function listAutomations(req, res, next) {
  try {
    const { customerId } = req.query;
    let sql = `SELECT * FROM ps_automations WHERE user_id = $1`;
    const params = [req.user.id]; let idx = 2;
    if (customerId) { sql += ` AND customer_id = $${idx++}`; params.push(customerId); }
    sql += ` ORDER BY created_at DESC`;
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
}

async function createAutomation(req, res, next) {
  try {
    const { name, trigger, action, customerId, metadata } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ps_automations (user_id, customer_id, name, trigger, action, metadata)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, customerId || null, name, trigger, action, metadata ? JSON.stringify(metadata) : '{}']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

async function toggleAutomation(req, res, next) {
  try {
    const { rows } = await db.query(
      `UPDATE ps_automations SET active = NOT active, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Automation not found' } });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

async function deleteAutomation(req, res, next) {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM ps_automations WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Automation not found' } });
    res.json({ message: 'Automation deleted' });
  } catch (err) { next(err); }
}

// ─── FOLLOW-UPS ──────────────────────────────────────────────────────────────

async function listFollowUps(req, res, next) {
  try {
    const { customerId, status } = req.query;
    let sql = `SELECT * FROM ps_followups WHERE user_id = $1`;
    const params = [req.user.id]; let idx = 2;
    if (customerId) { sql += ` AND customer_id = $${idx++}`; params.push(customerId); }
    if (status)     { sql += ` AND status = $${idx++}`; params.push(status); }
    sql += ` ORDER BY created_at DESC`;
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
}

async function createFollowUp(req, res, next) {
  try {
    const { customerId, task, dueAt, notes } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ps_followups (customer_id, user_id, task, due_at, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [customerId, req.user.id, task, dueAt || null, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

async function updateFollowUpStatus(req, res, next) {
  try {
    const { status } = req.body;
    const completedAt = status === 'done' ? 'NOW()' : 'NULL';
    const { rows } = await db.query(
      `UPDATE ps_followups SET status = $1, completed_at = ${completedAt}
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Follow-up not found' } });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

async function listDocuments(req, res, next) {
  try {
    const { customerId } = req.query;
    let sql = `SELECT * FROM ps_documents WHERE user_id = $1`;
    const params = [req.user.id]; let idx = 2;
    if (customerId) { sql += ` AND customer_id = $${idx++}`; params.push(customerId); }
    sql += ` ORDER BY created_at DESC`;
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
}

async function createDocument(req, res, next) {
  try {
    const { customerId, name, type, fileUrl, status, metadata } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ps_documents (customer_id, user_id, name, type, file_url, status, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [customerId, req.user.id, name, type || null, fileUrl || null, status || 'pending', metadata ? JSON.stringify(metadata) : '{}']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

// ─── ONBOARDING ──────────────────────────────────────────────────────────────

async function listOnboarding(req, res, next) {
  try {
    const { customerId } = req.query;
    let sql = `SELECT * FROM ps_onboarding WHERE user_id = $1`;
    const params = [req.user.id]; let idx = 2;
    if (customerId) { sql += ` AND customer_id = $${idx++}`; params.push(customerId); }
    sql += ` ORDER BY step_order ASC`;
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
}

async function upsertOnboardingStep(req, res, next) {
  try {
    const { customerId, stepName, stepOrder, status, notes } = req.body;
    const { rows } = await db.query(
      `INSERT INTO ps_onboarding (customer_id, user_id, step_name, step_order, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (customer_id, step_name)
       DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes,
         completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN NOW() ELSE NULL END
       RETURNING *`,
      [customerId, req.user.id, stepName, stepOrder || 0, status || 'pending', notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

module.exports = {
  listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer,
  listPayments, createPayment, updatePaymentStatus,
  listAutomations, createAutomation, toggleAutomation, deleteAutomation,
  listFollowUps, createFollowUp, updateFollowUpStatus,
  listDocuments, createDocument,
  listOnboarding, upsertOnboardingStep,
};
