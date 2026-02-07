/**
 * Navigation utilities for the Marketing module.
 * Provides safe navigation helpers that prevent routes containing "undefined" or "null".
 */

/**
 * Returns the correct route for navigating back to projects.
 * @param {string | undefined | null} projectId - The current project ID, if any.
 * @returns {string} The safe navigation path.
 */
export const getProjectsBackRoute = (projectId) => {
    if (typeof projectId === 'string' && projectId.length > 0 && projectId !== 'undefined' && projectId !== 'null') {
        return `/marketing/projects/${projectId}`;
    }
    return '/marketing/projects';
};

/**
 * Returns the correct route for navigating to a campaign.
 * @param {string | undefined | null} projectId - The current project ID, if any.
 * @param {string} campaignId - The campaign ID.
 * @returns {string} The safe navigation path.
 */
export const getCampaignRoute = (projectId, campaignId) => {
    if (typeof projectId === 'string' && projectId.length > 0 && projectId !== 'undefined' && projectId !== 'null') {
        return `/marketing/projects/${projectId}/campaigns/${campaignId}`;
    }
    return `/marketing/campaigns/${campaignId}`;
};

/**
 * Returns the correct route for navigating to create a new campaign.
 * @param {string | undefined | null} projectId - The current project ID, if any.
 * @returns {string} The safe navigation path.
 */
export const getNewCampaignRoute = (projectId) => {
    if (typeof projectId === 'string' && projectId.length > 0 && projectId !== 'undefined' && projectId !== 'null') {
        return `/marketing/projects/${projectId}/campaigns/new`;
    }
    return '/marketing/campaigns/new';
};

/**
 * Returns the correct route for navigating to edit a campaign.
 * @param {string | undefined | null} projectId - The current project ID, if any.
 * @param {string} campaignId - The campaign ID.
 * @returns {string} The safe navigation path.
 */
export const getCampaignEditRoute = (projectId, campaignId) => {
    if (typeof projectId === 'string' && projectId.length > 0 && projectId !== 'undefined' && projectId !== 'null') {
        return `/marketing/projects/${projectId}/campaigns/${campaignId}/edit`;
    }
    // Fallback: No edit route without project, return campaign details
    return `/marketing/campaigns/${campaignId}`;
};
