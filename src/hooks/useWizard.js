import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useWizard — Campaign draft state machine hook.
 * Extracted from MarketingContext (Phase 4).
 *
 * Manages the full campaign creation wizard lifecycle:
 * start → update steps → launch / cancel / resume.
 *
 * @param {string}   orgId             — from useOrg()
 * @param {string}   userId            — from useAuth().user?.id
 * @param {Function} refetchCampaigns  — called after a successful launch_campaign RPC
 */
export function useWizard(orgId, userId, refetchCampaigns) {
    const [activeDraft, setActiveDraft] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const saveTimeoutRef = useRef(null);

    const startNewDraft = async (projectId) => {
        if (!orgId) return;

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

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        setIsSaving(true);

        // Persist to Supabase
        await supabase
            .from('campaign_drafts')
            .update({
                draft_data: { steps: newSteps, ai: newAI, data: newData },
                updated_at: new Date().toISOString()
            })
            .eq('id', activeDraft.id);

        setIsSaving(false);
        setLastSaved(new Date());
    };

    const debouncedUpdateDraftData = useCallback((stepData = {}) => {
        setIsSaving(true);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        setActiveDraft(prev => {
            if (!prev) return prev;

            const newData = { ...prev.data, ...stepData };
            const updatedDraft = { ...prev, data: newData };

            saveTimeoutRef.current = setTimeout(async () => {
                await supabase
                    .from('campaign_drafts')
                    .update({
                        draft_data: { steps: updatedDraft.steps, ai: updatedDraft.ai, data: updatedDraft.data },
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', updatedDraft.id);

                setIsSaving(false);
                setLastSaved(new Date());
            }, 1500);

            return updatedDraft;
        });
    }, []);

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
            p_created_by: userId || null
        });

        if (!error && campaignId) {
            // Cleanup draft upon launch
            await supabase.from('campaign_drafts').delete().eq('id', activeDraft.id);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            setActiveDraft(null);
            await refetchCampaigns();
            return { success: true, campaignId };
        }
        return { success: false, error: error?.message || 'Launch failed' };
    };

    const cancelDraft = async () => {
        if (activeDraft?.id) {
            await supabase.from('campaign_drafts').delete().eq('id', activeDraft.id);
        }
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
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

    const checkExistingDraft = async (projectId) => {
        if (!orgId || !userId) return null;

        // Clear in-memory state if switching projects
        if (activeDraft && activeDraft.projectId !== projectId) {
            setActiveDraft(null);
        }

        const { data, error } = await supabase
            .from('campaign_drafts')
            .select('*')
            .eq('org_id', orgId)
            .eq('project_id', projectId)
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(1);

        if (!error && data && data.length > 0) {
            return data[0];
        }
        return null;
    };

    const resumeDraftFromData = (row) => {
        const dd = row.draft_data || {};
        setActiveDraft({
            id: row.id,
            projectId: row.project_id,
            currentStepIndex: row.wizard_step,
            status: 'draft',
            data: dd.data || {},
            steps: dd.steps || {},
            ai: dd.ai || { analysisDone: false }
        });
    };

    const resetDraftState = () => {
        setActiveDraft(null);
    };

    const loadDraftForProject = async (projectId) => {
        if (!orgId || !userId) return;

        if (activeDraft && activeDraft.projectId === projectId) {
            return; // already loaded correct draft
        }

        // Clear in-memory state if switching projects
        if (activeDraft && activeDraft.projectId !== projectId) {
            setActiveDraft(null);
        }

        const { data, error } = await supabase
            .from('campaign_drafts')
            .select('*')
            .eq('org_id', orgId)
            .eq('project_id', projectId)
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(1);

        if (!error && data && data.length > 0) {
            const row = data[0];
            const dd = row.draft_data || {};
            setActiveDraft({
                id: row.id,
                projectId: row.project_id,
                currentStepIndex: row.wizard_step,
                status: 'draft',
                data: dd.data || {},
                steps: dd.steps || {},
                ai: dd.ai || { analysisDone: false }
            });
        } else {
            await startNewDraft(projectId);
        }
    };

    return {
        activeDraft,
        isSaving,
        lastSaved,
        startNewDraft,
        updateDraftStep,
        debouncedUpdateDraftData,
        setDraftStepIndex,
        canAccessStep,
        launchCampaign,
        cancelDraft,
        resumeDraft,
        resumeDraftFromData,
        checkExistingDraft,
        loadDraftForProject,
        resetDraftState,
    };
}
