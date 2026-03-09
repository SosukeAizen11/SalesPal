const db = require('../config/db');

async function getOrgId(userId) {
  const { rows } = await db.query(`SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1`, [userId]);
  return rows[0]?.org_id || null;
}

async function listCampaigns(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.json([]);

    const { projectId, status, platform, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT * FROM campaigns WHERE org_id = $1`;
    const params = [orgId];
    let idx = 2;

    if (projectId) { sql += ` AND project_id = $${idx++}`; params.push(projectId); }
    if (status) { sql += ` AND status = $${idx++}`; params.push(status); }
    if (platform) { sql += ` AND platform = $${idx++}`; params.push(platform); }

    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getCampaign(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rows } = await db.query(
      `SELECT * FROM campaigns WHERE id = $1 AND org_id = $2`,
      [req.params.id, orgId]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Campaign not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createCampaign(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No organization found' } });

    const { name, platform, objective, status, dailyBudget, totalBudget, startDate, endDate, projectId, adPlatforms, adFormat, headline, primaryText, cta, mediaType, mediaUrl, budgetPlatforms, budgetSplit, currency, metadata } = req.body;

    const { rows } = await db.query(
      `INSERT INTO campaigns (org_id, project_id, name, platform, objective, status, daily_budget, total_budget, start_date, end_date, ad_platforms, ad_format, headline, primary_text, cta, media_type, media_url, budget_platforms, budget_split, currency, metadata, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
      [orgId, projectId || null, name, platform || 'meta', objective, status || 'draft', dailyBudget, totalBudget, startDate, endDate, adPlatforms || '{}', adFormat, headline, primaryText, cta, mediaType, mediaUrl, budgetPlatforms || '{}', budgetSplit ? JSON.stringify(budgetSplit) : '{}', currency || 'INR', metadata ? JSON.stringify(metadata) : '{}', req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateCampaign(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const fields = ['name', 'platform', 'objective', 'status', 'daily_budget', 'total_budget', 'start_date', 'end_date', 'project_id', 'impressions', 'clicks', 'conversions', 'spend', 'revenue', 'reach', 'ad_platforms', 'ad_format', 'headline', 'primary_text', 'cta', 'media_type', 'media_url', 'budget_platforms', 'budget_split', 'currency', 'metadata'];
    const camelToSnake = { dailyBudget: 'daily_budget', totalBudget: 'total_budget', startDate: 'start_date', endDate: 'end_date', projectId: 'project_id', adPlatforms: 'ad_platforms', adFormat: 'ad_format', primaryText: 'primary_text', mediaType: 'media_type', mediaUrl: 'media_url', budgetPlatforms: 'budget_platforms', budgetSplit: 'budget_split' };

    const updates = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(req.body)) {
      const dbField = camelToSnake[key] || key;
      if (fields.includes(dbField) && value !== undefined) {
        const val = (dbField === 'budget_split' || dbField === 'metadata') ? JSON.stringify(value) : value;
        updates.push(`${dbField} = $${idx++}`);
        values.push(val);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id, orgId);

    const { rows } = await db.query(
      `UPDATE campaigns SET ${updates.join(', ')} WHERE id = $${idx++} AND org_id = $${idx} RETURNING *`,
      values
    );

    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Campaign not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteCampaign(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rowCount } = await db.query(
      `DELETE FROM campaigns WHERE id = $1 AND org_id = $2`,
      [req.params.id, orgId]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Campaign not found' } });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    next(err);
  }
}

// --- Campaign Drafts (Wizard) ---

async function listDrafts(req, res, next) {
  try {
    const { projectId } = req.query;
    let sql = `SELECT * FROM campaign_drafts WHERE user_id = $1`;
    const params = [req.user.id];
    let idx = 2;

    if (projectId) {
      if (projectId === 'null') {
        sql += ` AND project_id IS NULL`;
      } else {
        sql += ` AND project_id = $${idx++}`;
        params.push(projectId);
      }
    }

    sql += ` ORDER BY updated_at DESC`;

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getDraft(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT * FROM campaign_drafts WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Draft not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createDraft(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { projectId, draftData } = req.body;

    const { rows } = await db.query(
      `INSERT INTO campaign_drafts (org_id, project_id, user_id, draft_data)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [orgId, projectId || null, req.user.id, JSON.stringify(draftData || {})]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateDraft(req, res, next) {
  try {
    const { wizardStep, draftData } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (wizardStep !== undefined) { updates.push(`wizard_step = $${idx++}`); values.push(wizardStep); }
    if (draftData !== undefined) { updates.push(`draft_data = $${idx++}`); values.push(JSON.stringify(draftData)); }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id, req.user.id);

    const { rows } = await db.query(
      `UPDATE campaign_drafts SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Draft not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function launchDraft(req, res, next) {
  try {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Fetch the draft
      const draftResult = await client.query(
        `SELECT * FROM campaign_drafts WHERE id = $1 AND user_id = $2`,
        [req.params.id, req.user.id]
      );
      const draft = draftResult.rows[0];
      if (!draft) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Draft not found' } });
      }

      const rawDraftData = typeof draft.draft_data === 'string' ? JSON.parse(draft.draft_data) : (draft.draft_data || {});
      const data = rawDraftData.data || rawDraftData;

      // Create the campaign from draft data
      const campaignResult = await client.query(
        `INSERT INTO campaigns (org_id, project_id, name, platform, objective, status, daily_budget, total_budget, start_date, end_date, ad_platforms, ad_format, headline, primary_text, cta, media_type, media_url, budget_platforms, budget_split, currency, metadata, created_by)
         VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
        [draft.org_id, draft.project_id, data.name || 'Untitled Campaign', data.platform || 'meta', data.objective, data.dailyBudget || data.daily_budget, data.totalBudget || data.total_budget, data.startDate || data.start_date, data.endDate || data.end_date, data.adPlatforms || data.ad_platforms || '{}', data.adFormat || data.ad_format, data.headline, data.primaryText || data.primary_text, data.cta, data.mediaType || data.media_type, data.mediaUrl || data.media_url, data.budgetPlatforms || data.budget_platforms || '{}', data.budgetSplit ? JSON.stringify(data.budgetSplit) : (data.budget_split ? JSON.stringify(data.budget_split) : '{}'), data.currency || 'INR', JSON.stringify(data.metadata || {}), req.user.id]
      );

      // Delete the draft
      await client.query(`DELETE FROM campaign_drafts WHERE id = $1`, [draft.id]);

      await client.query('COMMIT');
      res.status(201).json(campaignResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}

async function deleteDraft(req, res, next) {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM campaign_drafts WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Draft not found' } });
    res.json({ message: 'Draft deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign, listDrafts, getDraft, createDraft, updateDraft, launchDraft, deleteDraft };
