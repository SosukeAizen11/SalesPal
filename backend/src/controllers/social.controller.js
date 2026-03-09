const db = require('../config/db');
const socialService = require('../services/social.service');

async function getOrgId(userId) {
  const { rows } = await db.query(`SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1`, [userId]);
  return rows[0]?.org_id || null;
}

async function listPosts(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.json([]);

    const { status, projectId, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT * FROM social_posts WHERE org_id = $1`;
    const params = [orgId];
    let idx = 2;

    if (status) { sql += ` AND status = $${idx++}`; params.push(status); }
    if (projectId) { sql += ` AND project_id = $${idx++}`; params.push(projectId); }

    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rows } = await db.query(
      `SELECT * FROM social_posts WHERE id = $1 AND org_id = $2`,
      [req.params.id, orgId]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createPost(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No organization found' } });

    const { content, postType, status, scheduledFor, platforms, mediaUrls, projectId, metadata } = req.body;

    const { rows } = await db.query(
      `INSERT INTO social_posts (org_id, project_id, created_by, content, post_type, status, scheduled_for, platforms, media_urls, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [orgId, projectId || null, req.user.id, content, postType || 'image', status || 'draft', scheduledFor || null, platforms || '{}', mediaUrls || '{}', metadata ? JSON.stringify(metadata) : '{}']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { content, postType, status, scheduledFor, platforms, mediaUrls, engagement, metadata } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (content !== undefined) { updates.push(`content = $${idx++}`); values.push(content); }
    if (postType !== undefined) { updates.push(`post_type = $${idx++}`); values.push(postType); }
    if (status !== undefined) { updates.push(`status = $${idx++}`); values.push(status); }
    if (scheduledFor !== undefined) { updates.push(`scheduled_for = $${idx++}`); values.push(scheduledFor); }
    if (platforms !== undefined) { updates.push(`platforms = $${idx++}`); values.push(platforms); }
    if (mediaUrls !== undefined) { updates.push(`media_urls = $${idx++}`); values.push(mediaUrls); }
    if (engagement !== undefined) { updates.push(`engagement = $${idx++}`); values.push(JSON.stringify(engagement)); }
    if (metadata !== undefined) { updates.push(`metadata = $${idx++}`); values.push(JSON.stringify(metadata)); }
    if (status === 'published') { updates.push(`published_at = NOW()`); }

    if (updates.length === 0) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id, orgId);

    const { rows } = await db.query(
      `UPDATE social_posts SET ${updates.join(', ')} WHERE id = $${idx++} AND org_id = $${idx} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rowCount } = await db.query(
      `DELETE FROM social_posts WHERE id = $1 AND org_id = $2`,
      [req.params.id, orgId]
    );
    if (rowCount === 0) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post not found' } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}

// --- Integrations ---

async function listIntegrations(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id, platform, status, platform_user_id, platform_page_id, connected_at, metadata, created_at
       FROM integrations WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function connectIntegration(req, res, next) {
  try {
    const { platform, accessToken, platformUserId, platformPageId, metadata } = req.body;

    let tokenData = {};
    if (platform === 'meta' && req.body.code) {
      const redirectUri = req.body.redirectUri || `${req.headers.origin}/connect/meta`;
      tokenData = await socialService.exchangeCodeForToken(req.body.code, redirectUri);
    }

    const tokenExpiresAt = tokenData.expiresIn
      ? new Date(Date.now() + tokenData.expiresIn * 1000).toISOString()
      : null;

    const { rows } = await db.query(
      `INSERT INTO integrations (user_id, platform, status, access_token, token_expires_at, platform_user_id, platform_page_id, connected_by, connected_at, metadata)
       VALUES ($1, $2, 'connected', $3, $4, $5, $6, $1, NOW(), $7)
       ON CONFLICT (user_id, platform)
       DO UPDATE SET status = 'connected', access_token = COALESCE($3, integrations.access_token), token_expires_at = COALESCE($4, integrations.token_expires_at), platform_user_id = COALESCE($5, integrations.platform_user_id), platform_page_id = COALESCE($6, integrations.platform_page_id), connected_at = NOW(), metadata = COALESCE($7, integrations.metadata), updated_at = NOW()
       RETURNING id, platform, status, platform_user_id, platform_page_id, connected_at`,
      [req.user.id, platform, tokenData.accessToken || accessToken || null, tokenExpiresAt, platformUserId || null, platformPageId || null, metadata ? JSON.stringify(metadata) : '{}']
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function disconnectIntegration(req, res, next) {
  try {
    const { rows } = await db.query(
      `UPDATE integrations SET status = 'disconnected', access_token = NULL, token_expires_at = NULL, updated_at = NOW()
       WHERE user_id = $1 AND platform = $2 RETURNING id, platform, status`,
      [req.user.id, req.params.platform]
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Integration not found' } });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost, listIntegrations, connectIntegration, disconnectIntegration };
