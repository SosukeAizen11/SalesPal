import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useOrg } from './OrgContext';
import { useAuth } from './AuthContext';

/**
 * useCampaignContext — REST-backed campaign CRUD.
 * Replaces Supabase .from('campaigns') calls with REST endpoints.
 */
export function useCampaignContext(selectedProjectId, onLaunchSuccess) {
    const { orgId } = useOrg();
    const { user } = useAuth();

    const [campaigns, setCampaigns] = useState([]);
    const [campaignsLoading, setCampaignsLoading] = useState(true);

    const fetchCampaigns = useCallback(async () => {
        if (!orgId) { setCampaigns([]); setCampaignsLoading(false); return; }
        setCampaignsLoading(true);
        try {
            const data = await api.get('/marketing/campaigns');
            setCampaigns(data.campaigns || data || []);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            setCampaigns([]);
        }
        setCampaignsLoading(false);
    }, [orgId]);

    useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

    const createCampaign = async (campaignData) => {
        if (!orgId) return null;
        const projectId = campaignData.projectId || campaignData.project_id || selectedProjectId;

        try {
            const data = await api.post('/marketing/campaigns', {
                name: campaignData.name,
                projectId: projectId,
                platform: campaignData.platform || 'meta',
                objective: campaignData.objective || null,
                status: campaignData.status || 'draft',
                dailyBudget: campaignData.dailyBudget || campaignData.daily_budget || null,
                totalBudget: campaignData.totalBudget || campaignData.total_budget || null,
                startDate: campaignData.startDate || campaignData.start_date || null,
                endDate: campaignData.endDate || campaignData.end_date || null,
            });
            const campaign = data.campaign || data;
            setCampaigns(prev => [campaign, ...prev]);
            return campaign;
        } catch (err) {
            console.error('Error creating campaign:', err);
            return null;
        }
    };

    const getCampaignById = (id) => campaigns.find(c => c.id === id) || null;

    const updateCampaignData = async (campaignId, updates) => {
        const dbUpdates = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
        if (updates.objective !== undefined) dbUpdates.objective = updates.objective;
        if (updates.dailyBudget !== undefined) dbUpdates.daily_budget = updates.dailyBudget;
        if (updates.daily_budget !== undefined) dbUpdates.daily_budget = updates.daily_budget;
        if (updates.totalBudget !== undefined) dbUpdates.total_budget = updates.totalBudget;
        if (updates.total_budget !== undefined) dbUpdates.total_budget = updates.total_budget;
        if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
        if (updates.start_date !== undefined) dbUpdates.start_date = updates.start_date;
        if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
        if (updates.end_date !== undefined) dbUpdates.end_date = updates.end_date;

        try {
            const data = await api.put(`/marketing/campaigns/${campaignId}`, dbUpdates);
            const campaign = data.campaign || data;
            setCampaigns(prev => prev.map(c => c.id === campaignId ? campaign : c));
            return campaign;
        } catch (err) {
            console.error('Error updating campaign:', err);
            return null;
        }
    };

    const deleteCampaign = async (campaignId) => {
        try {
            await api.del(`/marketing/campaigns/${campaignId}`);
            setCampaigns(prev => prev.filter(c => c.id !== campaignId));
        } catch (err) {
            console.error('Error deleting campaign:', err);
        }
    };

    const getCampaignsByProject = (projectId) =>
        campaigns.filter(c => c.project_id === projectId);

    // ─── AI Actions (stub — will be fully wired in Phase E) ───
    const applyAIAction = async (campaignId, actionType) => {
        const campaign = getCampaignById(campaignId);
        if (!campaign) return;

        let updates = {};
        switch (actionType) {
            case 'SCALE_CAMPAIGN': {
                const currentBudget = Number(campaign.daily_budget) || 0;
                updates = { daily_budget: Math.floor(currentBudget * 1.2) };
                break;
            }
            case 'OPTIMIZE_BUDGET':
            case 'ROTATE_CREATIVES':
                break;
            default:
                break;
        }

        if (Object.keys(updates).length) {
            return await updateCampaignData(campaignId, updates);
        }
        return campaign;
    };

    return {
        campaigns,
        campaignsLoading,
        createCampaign,
        updateCampaign: updateCampaignData,
        deleteCampaign,
        getCampaignById,
        getCampaignsByProject,
        applyAIAction,
        refetchCampaigns: fetchCampaigns,
    };
}
