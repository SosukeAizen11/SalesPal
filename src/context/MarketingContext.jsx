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

    // ─── Social Posts (Supabase-backed) ───
    const [socialPosts, setSocialPosts] = useState([]);
    const [socialPostsLoading, setSocialPostsLoading] = useState(true);

    const fetchSocialPosts = useCallback(async () => {
        if (!orgId) { setSocialPosts([]); setSocialPostsLoading(false); return; }
        setSocialPostsLoading(true);
        const { data } = await supabase
            .from('social_posts')
            .select('*')
            .eq('org_id', orgId)
            .order('created_at', { ascending: false });
        setSocialPosts(data || []);
        setSocialPostsLoading(false);
    }, [orgId]);

    useEffect(() => { fetchSocialPosts(); }, [fetchSocialPosts]);

    const addSocialPost = async (post) => {
        if (!orgId) return null;
        const { data: userRes } = await supabase.auth.getUser();
        // Optimistic update
        const tempId = crypto.randomUUID();
        const optimistic = { ...post, id: tempId, org_id: orgId, created_at: new Date().toISOString() };
        setSocialPosts(prev => [optimistic, ...prev]);

        const { data, error } = await supabase
            .from('social_posts')
            .insert({
                org_id: orgId,
                project_id: selectedProjectId || null,
                created_by: userRes?.user?.id,
                content: post.content,
                post_type: post.type || post.post_type || 'image',
                status: post.status || 'draft',
                scheduled_for: post.scheduledFor || post.scheduled_for || null,
                platforms: post.platforms || [],
                media_urls: post.mediaUrls || post.media_urls || []
            })
            .select()
            .single();

        if (!error && data) {
            // Replace optimistic with real row
            setSocialPosts(prev => prev.map(p => p.id === tempId ? data : p));
            return data;
        } else {
            // Rollback on error
            setSocialPosts(prev => prev.filter(p => p.id !== tempId));
            return null;
        }
    };

    const deleteSocialPost = async (postId) => {
        // Optimistic removal
        setSocialPosts(prev => prev.filter(p => p.id !== postId));
        const { error } = await supabase
            .from('social_posts')
            .delete()
            .eq('id', postId);
        if (error) {
            // Rollback: refetch on failure
            fetchSocialPosts();
        }
    };

    const updateSocialPost = async (postId, updates) => {
        setSocialPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
        const { data, error } = await supabase
            .from('social_posts')
            .update(updates)
            .eq('id', postId)
            .select()
            .single();
        if (!error && data) setSocialPosts(prev => prev.map(p => p.id === postId ? data : p));
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
        const { error } = await supabase.rpc('add_credit', {
            p_org_id: orgId,
            p_amount: Number(quantity),
            p_source: `topup_${type}`
        });
        if (!error) await fetchCredits();
    };

    // ─── Draft State Machine (Supabase-backed) ───
    const [activeDraft, setActiveDraft] = useState(null);

    const startNewDraft = async (projectId) => {
        if (!orgId) return;
        const { data: userRes } = await supabase.auth.getUser();
        const userId = userRes?.user?.id;

        const initialDraftData = {
            name: '', goals: [], audiences: [], platforms: [],
            budget: { daily: 0, type: 'daily' }, ads: []
        };
        const initialSteps = {
            business: 'pending', analysis: 'pending',
            ads: 'pending', budget: 'pending', review: 'pending'
        };

        const { data, error } = await supabase
            .from('campaign_drafts')
            .insert({
                org_id: orgId,
                project_id: projectId || null,
                user_id: userId,
                wizard_step: 0,
                draft_data: { steps: initialSteps, ai: { analysisDone: false }, data: initialDraftData }
            })
            .select()
            .single();

        if (!error && data) {
            setActiveDraft({
                id: data.id,
                projectId: data.project_id,
                currentStepIndex: data.wizard_step,
                status: 'draft',
                data: initialDraftData,
                steps: initialSteps,
                ai: { analysisDone: false, recommendationsReady: false }
            });
        }
    };

    const updateDraftStep = async (step, stepData = {}) => {
        if (!activeDraft) return;

        const newSteps = { ...activeDraft.steps };
        if (step) newSteps[step] = 'completed';

        let newStatus = activeDraft.status;
        let newAI = { ...activeDraft.ai };
        if (step === 'business') newStatus = 'analyzing';
        if (step === 'analysis') { newStatus = 'draft'; newAI.analysisDone = true; }

        const newData = { ...activeDraft.data, ...stepData };

        const updatedDraft = {
            ...activeDraft,
            status: newStatus,
            steps: newSteps,
            ai: newAI,
            data: newData
        };
        setActiveDraft(updatedDraft);

        // Persist to Supabase
        await supabase
            .from('campaign_drafts')
            .update({
                draft_data: { steps: newSteps, ai: newAI, data: newData },
                updated_at: new Date().toISOString()
            })
            .eq('id', activeDraft.id);
    };

    const setDraftStepIndex = async (index) => {
        if (!activeDraft) return;
        setActiveDraft(prev => ({ ...prev, currentStepIndex: index }));
        await supabase
            .from('campaign_drafts')
            .update({ wizard_step: index })
            .eq('id', activeDraft.id);
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
        if (!activeDraft || !orgId) return { success: false, error: 'No active draft' };
        const { data: userRes } = await supabase.auth.getUser();
        const d = activeDraft.data;
        const ads = d.ads?.[0] || {};
        const budget = d.budget || {};

        const { data: campaignId, error } = await supabase.rpc('launch_campaign', {
            p_draft_id: activeDraft.id,
            p_org_id: orgId,
            p_project_id: activeDraft.projectId || null,
            p_name: d.name || 'Untitled Campaign',
            p_platform: (ads.platforms?.[0]) || 'meta',
            p_objective: d.goals?.[0] || null,
            p_daily_budget: budget.daily || 0,
            p_start_date: null,
            p_end_date: null,
            p_ad_platforms: ads.platforms || [],
            p_ad_format: ads.format || 'carousel',
            p_headline: ads.copy?.headline || null,
            p_primary_text: ads.copy?.primaryText || null,
            p_cta: ads.copy?.cta || null,
            p_media_type: ads.media?.type || 'ai-generated',
            p_media_url: ads.media?.url || null,
            p_budget_platforms: budget.platforms || [],
            p_budget_split: budget.split || {},
            p_currency: budget.currency || 'INR',
            p_created_by: userRes?.user?.id || null
        });

        if (!error && campaignId) {
            setActiveDraft(null);
            await fetchCampaigns();
            return { success: true, campaignId };
        }
        return { success: false, error: error?.message || 'Launch failed' };
    };

    const cancelDraft = async () => {
        if (activeDraft?.id) {
            await supabase.from('campaign_drafts').delete().eq('id', activeDraft.id);
        }
        setActiveDraft(null);
    };

    // Resume an existing draft (e.g. on page load)
    const resumeDraft = async (draftId) => {
        const { data, error } = await supabase
            .from('campaign_drafts')
            .select('*')
            .eq('id', draftId)
            .single();
        if (!error && data) {
            const dd = data.draft_data || {};
            setActiveDraft({
                id: data.id,
                projectId: data.project_id,
                currentStepIndex: data.wizard_step,
                status: 'draft',
                data: dd.data || {},
                steps: dd.steps || {},
                ai: dd.ai || { analysisDone: false }
            });
        }
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
        socialPostsLoading,
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
        cancelDraft,
        resumeDraft
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
