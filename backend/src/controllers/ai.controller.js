const db = require('../config/db');
const aiService = require('../services/ai.service');
const analyticsService = require('../services/analytics.service');

async function getOrgId(userId) {
  const { rows } = await db.query(`SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1`, [userId]);
  return rows[0]?.org_id || null;
}

/**
 * General AI chat endpoint.
 */
async function chat(req, res, next) {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'message is required' } });

    const response = await aiService.callAI(message);
    res.json({ response });
  } catch (err) {
    next(err);
  }
}

/**
 * AI campaign analysis endpoint.
 */
async function analyzeCampaign(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    const { rows } = await db.query(
      `SELECT * FROM campaigns WHERE id = $1 AND org_id = $2`,
      [req.params.campaignId, orgId]
    );

    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Campaign not found' } });

    const prompt = aiService.buildCampaignAnalysisPrompt(rows[0]);
    const response = await aiService.callAI(prompt);

    res.json({ campaignId: req.params.campaignId, analysis: response });
  } catch (err) {
    next(err);
  }
}

/**
 * AI strategic insights based on aggregate analytics.
 */
async function getStrategicInsights(req, res, next) {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.json({ insights: 'No organization data available for analysis.' });

    const period = req.query.period || '30d';

    const [revenue, leads, platforms] = await Promise.all([
      analyticsService.getRevenueSummary(orgId, period),
      analyticsService.getLeadMetrics(orgId, period),
      analyticsService.getPlatformBreakdown(orgId, period),
    ]);

    const analyticsData = {
      ...revenue,
      ...leads,
      platforms,
    };

    const prompt = aiService.buildStrategicInsightsPrompt(analyticsData);
    const response = await aiService.callAI(prompt);

    res.json({ period, insights: response });
  } catch (err) {
    next(err);
  }
}

/**
 * AI ad copy generation endpoint.
 */
async function generateAdCopy(req, res, next) {
  try {
    const { productName, targetAudience, platform, objective, tone } = req.body;

    const prompt = `Generate marketing ad copy for the following:
Product/Service: ${productName}
Target Audience: ${targetAudience || 'General'}
Platform: ${platform || 'Facebook/Instagram'}
Objective: ${objective || 'Conversions'}
Tone: ${tone || 'Professional and engaging'}

Provide:
1. Headline (max 40 chars)
2. Primary text (max 125 chars)
3. Description (max 30 chars)
4. Call-to-action suggestion
5. Three variations of the headline`;

    const response = await aiService.callAI(prompt);
    res.json({ adCopy: response });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat, analyzeCampaign, getStrategicInsights, generateAdCopy };
