const env = require('../config/env');
const logger = require('../config/logger');

/**
 * The SalesPal AI system prompt — pricing, features, recommendation logic.
 * Matches the frontend config/aiPrompt.js.
 */
const SYSTEM_PROMPT = `
You are "SalesPal AI", the official SalesPal assistant.
Help users understand SalesPal pricing, plans, features, and give actionable marketing insights.
Be concise, structured, and helpful. Use bullet points for comparisons.
Pricing (INR): Marketing ₹5,999 | Sales ₹9,999 | Post-Sale ₹9,999 | Support ₹9,999 | SalesPal 360 ₹29,999.
Do not invent discounts or guarantees. If asked about refunds, direct to support.
`;

/**
 * Build a context-aware prompt for campaign analysis.
 */
function buildCampaignAnalysisPrompt(campaignData) {
  return `Analyze the following campaign performance data and provide actionable insights:

Campaign: ${campaignData.name}
Platform: ${campaignData.platform}
Status: ${campaignData.status}
Budget: ₹${campaignData.total_budget || 0}
Spend: ₹${campaignData.spend || 0}
Impressions: ${campaignData.impressions || 0}
Clicks: ${campaignData.clicks || 0}
Conversions: ${campaignData.conversions || 0}
Revenue: ₹${campaignData.revenue || 0}
CTR: ${campaignData.impressions > 0 ? ((campaignData.clicks / campaignData.impressions) * 100).toFixed(2) : 0}%
ROAS: ${campaignData.spend > 0 ? (campaignData.revenue / campaignData.spend).toFixed(2) : 0}x

Provide:
1. Performance summary (2-3 sentences)
2. Key strengths (bullet points)
3. Areas for improvement (bullet points)
4. Specific recommendations (numbered list)
5. Budget optimization suggestions`;
}

/**
 * Build a strategic insights prompt from aggregate analytics.
 */
function buildStrategicInsightsPrompt(analyticsData) {
  return `Based on the following marketing analytics summary, provide strategic insights:

Total Spend: ₹${analyticsData.total_spend}
Total Revenue: ₹${analyticsData.total_revenue}
ROAS: ${analyticsData.roas}x
Campaign Count: ${analyticsData.campaign_count}
Total Leads: ${analyticsData.total_leads}
Converted Leads: ${analyticsData.converted_leads}
Conversion Rate: ${analyticsData.conversion_rate}%

Platform Breakdown:
${(analyticsData.platforms || []).map(p => `- ${p.platform}: Spend ₹${p.spend}, Revenue ₹${p.revenue}, ROAS ${p.roas}x`).join('\n')}

Provide:
1. Executive summary (3-4 sentences)
2. Best performing channel and why
3. Underperforming areas with specific fixes
4. Budget reallocation recommendation
5. Next 30-day action plan (numbered steps)`;
}

/**
 * Call the external AI API with a prompt.
 * @param {string} userMessage — The user's message or generated prompt
 * @param {string} [systemPrompt] — Optional custom system prompt
 * @returns {Promise<string>} — The AI response text
 */
async function callAI(userMessage, systemPrompt = SYSTEM_PROMPT) {
  if (!env.ai.apiKey) {
    logger.warn('AI API key not configured, returning fallback response');
    return 'AI insights are not available at this time. Please configure your AI API key.';
  }

  try {
    const response = await fetch(env.ai.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: env.ai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('AI API call failed', { status: response.status, error: errorData });
      const err = new Error('AI service request failed');
      err.statusCode = 502;
      err.code = 'AI_SERVICE_ERROR';
      throw err;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  } catch (err) {
    if (err.code === 'AI_SERVICE_ERROR') throw err;
    logger.error('AI service call error', { error: err.message });
    const error = new Error('AI service is temporarily unavailable');
    error.statusCode = 503;
    error.code = 'AI_SERVICE_UNAVAILABLE';
    throw error;
  }
}

module.exports = {
  SYSTEM_PROMPT,
  buildCampaignAnalysisPrompt,
  buildStrategicInsightsPrompt,
  callAI,
};
