import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrg } from './OrgContext';

const MarketingContext = createContext();

export const MarketingProvider = ({ children }) => {
    const { orgId } = useOrg();

    // ─── Projects (Supabase-backed) ───
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const fetchProjects = useCallback(async () => {
        if (!orgId) { setProjects([]); setProjectsLoading(false); return; }
        setProjectsLoading(true);
        const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('org_id', orgId)
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        setProjects(data || []);
        setProjectsLoading(false);
    }, [orgId]);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const selectProject = (projectId) => {
        setSelectedProjectId(projectId);
    };

    const createProject = async (projectData) => {
        if (!orgId) return null;
        const { data: user } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('projects')
            .insert({ name: projectData.name, org_id: orgId, status: 'active', created_by: user?.user?.id })
            .select()
            .single();
        if (!error && data) setProjects(prev => [data, ...prev]);
        return data;
    };

    const getProjectById = (id) => projects.find(p => p.id === id) || null;

    const updateProject = async (projectId, updates) => {
        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', projectId)
            .select()
            .single();
        if (!error && data) setProjects(prev => prev.map(p => p.id === projectId ? data : p));
        return data;
    };

    const deleteProject = async (projectId) => {
        const { error } = await supabase
            .from('projects')
            .update({ status: 'archived' })
            .eq('id', projectId);
        if (!error) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
            if (selectedProjectId === projectId) setSelectedProjectId(null);
        }
    };

    // ─── Campaigns (Supabase-backed) ───
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
        const { data: user } = await supabase.auth.getUser();
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
                created_by: user?.user?.id
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

    const getCampaignsByProject = (projectId) => {
        return campaigns.filter(c => c.project_id === projectId);
    };

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

    // ─── Social Posts (local state for now — no table yet) ───
    const [socialPosts, setSocialPosts] = useState([]);

    const addSocialPost = (post) => {
        const newPost = { ...post, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setSocialPosts(prev => [newPost, ...prev]);
    };

    const deleteSocialPost = (postId) => {
        setSocialPosts(prev => prev.filter(p => p.id !== postId));
    };

    const updateSocialPost = (postId, updates) => {
        setSocialPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
    };

    // ─── Credits (Supabase-backed) ───
    const [creditState, setCreditState] = useState({ balance: 0 });

    const fetchCredits = useCallback(async () => {
        if (!orgId) return;
        const { data } = await supabase
            .from('marketing_credits')
            .select('balance')
            .eq('org_id', orgId)
            .single();
        if (data) setCreditState({ balance: data.balance });
    }, [orgId]);

    useEffect(() => { fetchCredits(); }, [fetchCredits]);

    const addCredits = async (type, quantity) => {
        if (!orgId) return;
        const { data: newBalance } = await supabase.rpc('topup_marketing_credits', {
            p_org_id: orgId,
            p_amount: Number(quantity),
            p_reference_type: `topup_${type}`
        });
        if (newBalance !== null) setCreditState({ balance: newBalance });
    };

    // ─── Draft State Machine (local state — persisted to campaign_drafts in future) ───
    const [activeDraft, setActiveDraft] = useState(null);

    const startNewDraft = (projectId) => {
        setActiveDraft({
            projectId,
            id: `draft_${Date.now()}`,
            status: 'draft',
            currentStepIndex: 0,
            data: {
                name: '',
                goals: [],
                audiences: [],
                platforms: [],
                budget: { daily: 0, type: 'daily' },
                ads: []
            },
            steps: {
                business: 'pending',
                analysis: 'pending',
                ads: 'pending',
                budget: 'pending',
                review: 'pending'
            },
            ai: {
                analysisDone: false,
                recommendationsReady: false
            }
        });
    };

    const updateDraftStep = (step, stepData = {}) => {
        if (!activeDraft) return;
        setActiveDraft(prev => {
            const newSteps = { ...prev.steps };
            if (step) newSteps[step] = 'completed';

            let newStatus = prev.status;
            let newAI = { ...prev.ai };

            if (step === 'business') newStatus = 'analyzing';
            if (step === 'analysis') { newStatus = 'draft'; newAI.analysisDone = true; }

            return { ...prev, status: newStatus, steps: newSteps, ai: newAI, data: { ...prev.data, ...stepData } };
        });
    };

    const setDraftStepIndex = (index) => {
        if (!activeDraft) return;
        setActiveDraft(prev => ({ ...prev, currentStepIndex: index }));
    };

    const canAccessStep = (stepIndex) => {
        if (!activeDraft) return false;
        const s = activeDraft.steps;
        switch (stepIndex) {
            case 0: return true;
            case 1: return s.business === 'completed';
            case 2: return s.analysis === 'completed' && activeDraft.ai.analysisDone;
            case 3: return s.ads === 'completed';
            case 4: return s.budget === 'completed';
            default: return false;
        }
    };

    const launchCampaign = async () => {
        if (!activeDraft) return { success: false, error: 'No active draft' };

        const finalizedCampaign = await createCampaign({
            ...activeDraft.data,
            projectId: activeDraft.projectId,
            status: 'active'
        });

        if (finalizedCampaign) {
            setActiveDraft(null);
            return { success: true, campaign: finalizedCampaign };
        }
        return { success: false, error: 'Failed to create campaign' };
    };

    const cancelDraft = () => {
        setActiveDraft(null);
    };

    const value = {
        // Projects
        projects,
        projectsLoading,
        selectedProjectId,
        selectProject,
        createProject,
        updateProject,
        deleteProject,
        getProjectById,

        // Campaigns
        campaigns,
        campaignsLoading,
        createCampaign,
        updateCampaign: updateCampaignData,
        deleteCampaign,
        getCampaignById,
        getCampaignsByProject,
        applyAIAction,

        // Social Posts
        socialPosts,
        addSocialPost,
        updateSocialPost,
        deleteSocialPost,

        // Credits
        creditState,
        addCredits,

        // Draft state machine
        activeDraft,
        startNewDraft,
        updateDraftStep,
        setDraftStepIndex,
        canAccessStep,
        launchCampaign,
        cancelDraft
    };

    return (
        <MarketingContext.Provider value={value}>
            {children}
        </MarketingContext.Provider>
    );
};

export const useMarketing = () => {
    const context = useContext(MarketingContext);
    if (!context) {
        throw new Error('useMarketing must be used within a MarketingProvider');
    }
    return context;
};
