import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrg } from './OrgContext';
import { useAuth } from './AuthContext';

/**
 * useCampaignContext — internal hook, consumed only by MarketingProvider.
 * Owns all campaign CRUD, AI action stubs, and the fetchCampaigns + launchCampaign
 * dependency on the wizard. Extracted from MarketingContext (Phase 4).
 *
 * @param {string|null} selectedProjectId — passed in from MarketingProvider local state
 * @param {Function}    onLaunchSuccess   — called after launch_campaign RPC succeeds
 */
export function useCampaignContext(selectedProjectId, onLaunchSuccess) {
    const { orgId } = useOrg();
    const { user } = useAuth();

    const [campaigns, setCampaigns] = useState([]);
    const [campaignsLoading, setCampaignsLoading] = useState(true);

    const fetchCampaigns = useCallback(async () => {
        if (!orgId) { setCampaigns([]); setCampaignsLoading(false); return; }
        setCampaignsLoading(true);
        const { data } = await supabase
            .from('campaigns')
            .select('*')
            .eq('org_id', orgId)
            .order('created_at', { ascending: false });
        setCampaigns(data || []);
        setCampaignsLoading(false);
    }, [orgId]);

    useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

    const createCampaign = async (campaignData) => {
        if (!orgId) return null;
        const projectId = campaignData.projectId || campaignData.project_id || selectedProjectId;

        const { data, error } = await supabase
            .from('campaigns')
            .insert({
                name: campaignData.name,
                org_id: orgId,
                project_id: projectId,
                platform: campaignData.platform || 'meta',
                objective: campaignData.objective || null,
                status: campaignData.status || 'draft',
                daily_budget: campaignData.dailyBudget || campaignData.daily_budget || null,
                total_budget: campaignData.totalBudget || campaignData.total_budget || null,
                start_date: campaignData.startDate || campaignData.start_date || null,
                end_date: campaignData.endDate || campaignData.end_date || null,
                created_by: user?.id
            })
            .select()
            .single();

        if (!error && data) setCampaigns(prev => [data, ...prev]);
        return data;
    };

    const getCampaignById = (id) => campaigns.find(c => c.id === id) || null;

    const updateCampaignData = async (campaignId, updates) => {
        // Map camelCase to snake_case for known fields
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

        const { data, error } = await supabase
            .from('campaigns')
            .update(dbUpdates)
            .eq('id', campaignId)
            .select()
            .single();

        if (!error && data) setCampaigns(prev => prev.map(c => c.id === campaignId ? data : c));
        return data;
    };

    const deleteCampaign = async (campaignId) => {
        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', campaignId);
        if (!error) setCampaigns(prev => prev.filter(c => c.id !== campaignId));
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
                // Will call AI edge function in Phase E
                break;
            case 'ROTATE_CREATIVES':
                // Will call AI edge function in Phase E
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
        // Exposed so useWizard can call fetchCampaigns after launchCampaign
        refetchCampaigns: fetchCampaigns,
    };
}
