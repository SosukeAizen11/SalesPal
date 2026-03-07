const env = require('../config/env');
const logger = require('../config/logger');

const META_GRAPH_BASE = 'https://graph.facebook.com/v19.0';

/**
 * Exchange a short-lived auth code for a long-lived token via Meta Graph API.
 */
async function exchangeCodeForToken(code, redirectUri) {
  const url = `${META_GRAPH_BASE}/oauth/access_token?` +
    `client_id=${env.meta.appId}` +
    `&client_secret=${env.meta.appSecret}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code=${code}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    logger.error('Meta token exchange failed', { error: data.error });
    const err = new Error(data.error.message || 'Meta token exchange failed');
    err.statusCode = 400;
    err.code = 'INTEGRATION_ERROR';
    throw err;
  }

  // Exchange for long-lived token
  const longLivedUrl = `${META_GRAPH_BASE}/oauth/access_token?` +
    `grant_type=fb_exchange_token` +
    `&client_id=${env.meta.appId}` +
    `&client_secret=${env.meta.appSecret}` +
    `&fb_exchange_token=${data.access_token}`;

  const longLivedResponse = await fetch(longLivedUrl);
  const longLivedData = await longLivedResponse.json();

  if (longLivedData.error) {
    logger.warn('Long-lived token exchange failed, using short-lived', { error: longLivedData.error });
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in || 3600,
    };
  }

  return {
    accessToken: longLivedData.access_token,
    expiresIn: longLivedData.expires_in || 5184000, // ~60 days
  };
}

/**
 * Get pages the user manages via Meta Graph API.
 */
async function getUserPages(accessToken) {
  const url = `${META_GRAPH_BASE}/me/accounts?access_token=${accessToken}&fields=id,name,access_token,category`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    logger.error('Failed to fetch Meta pages', { error: data.error });
    const err = new Error('Failed to fetch Meta pages');
    err.statusCode = 400;
    err.code = 'INTEGRATION_ERROR';
    throw err;
  }

  return data.data || [];
}

/**
 * Get Instagram Business Account linked to a Facebook Page.
 */
async function getInstagramAccount(pageId, pageAccessToken) {
  const url = `${META_GRAPH_BASE}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.instagram_business_account || null;
}

/**
 * Publish a post to a Facebook Page.
 */
async function publishToFacebook(pageId, pageAccessToken, { message, link, imageUrl }) {
  let url;
  const params = new URLSearchParams({ access_token: pageAccessToken });

  if (imageUrl) {
    url = `${META_GRAPH_BASE}/${pageId}/photos`;
    params.append('url', imageUrl);
    if (message) params.append('message', message);
  } else {
    url = `${META_GRAPH_BASE}/${pageId}/feed`;
    if (message) params.append('message', message);
    if (link) params.append('link', link);
  }

  const response = await fetch(url, {
    method: 'POST',
    body: params,
  });

  const data = await response.json();
  if (data.error) {
    logger.error('Facebook publish failed', { error: data.error });
    const err = new Error(data.error.message || 'Failed to publish to Facebook');
    err.statusCode = 400;
    err.code = 'SOCIAL_PUBLISH_ERROR';
    throw err;
  }

  return data;
}

/**
 * Get page insights from Meta Graph API.
 */
async function getPageInsights(pageId, pageAccessToken, metrics, period = 'day') {
  const metricList = metrics.join(',');
  const url = `${META_GRAPH_BASE}/${pageId}/insights?metric=${metricList}&period=${period}&access_token=${pageAccessToken}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    logger.error('Failed to fetch page insights', { error: data.error });
    return [];
  }

  return data.data || [];
}

module.exports = {
  exchangeCodeForToken,
  getUserPages,
  getInstagramAccount,
  publishToFacebook,
  getPageInsights,
};
