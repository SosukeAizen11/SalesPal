import { useState, useRef, useCallback } from 'react';
import api from '../lib/api';

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

        try {
            const data = await api.post('/marketing/drafts', {
                projectId: projectId || null,
                draftData: { steps: initialSteps, ai: { analysisDone: false }, data: initialDraftData }
            });

            if (data) {
                setActiveDraft({
                    id: data.id,
                    projectId: data.project_id,
                    currentStepIndex: data.wizard_step || 0,
                    status: 'draft',
                    data: initialDraftData,
                    steps: initialSteps,
                    ai: { analysisDone: false, recommendationsReady: false }
                });
            }
        } catch (err) {
            console.error('Failed to create draft:', err);
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

        // Persist to API
        try {
            await api.put(`/marketing/drafts/${activeDraft.id}`, {
                draftData: { steps: newSteps, ai: newAI, data: newData }
            });
        } catch (err) {
            console.error('Failed to save draft:', err);
        } finally {
            setIsSaving(false);
            setLastSaved(new Date());
        }
    };

    const debouncedUpdateDraftData = useCallback((stepData = {}) => {
        setIsSaving(true);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        setActiveDraft(prev => {
            if (!prev) return prev;

            const newData = { ...prev.data, ...stepData };
            const updatedDraft = { ...prev, data: newData };

            saveTimeoutRef.current = setTimeout(async () => {
                try {
                    await api.put(`/marketing/drafts/${updatedDraft.id}`, {
                        draftData: { steps: updatedDraft.steps, ai: updatedDraft.ai, data: updatedDraft.data }
                    });
                } catch (err) {
                    console.error('Failed to auto-save draft:', err);
                } finally {
                    setIsSaving(false);
                    setLastSaved(new Date());
                }
            }, 1500);

            return updatedDraft;
        });
    }, []);

    const setDraftStepIndex = async (index) => {
        if (!activeDraft) return;
        setActiveDraft(prev => ({ ...prev, currentStepIndex: index }));
        try {
            await api.put(`/marketing/drafts/${activeDraft.id}`, { wizardStep: index });
        } catch (err) {
            console.error('Failed to update step index:', err);
        }
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
        
        try {
            const campaign = await api.post(`/marketing/drafts/${activeDraft.id}/launch`);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            setActiveDraft(null);
            await refetchCampaigns();
            return { success: true, campaignId: campaign.id };
        } catch (err) {
            return { success: false, error: err.message || 'Launch failed' };
        }
    };

    const cancelDraft = async () => {
        if (activeDraft?.id) {
            try {
                await api.delete(`/marketing/drafts/${activeDraft.id}`);
            } catch (err) {
                console.error('Failed to delete draft:', err);
            }
        }
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        setActiveDraft(null);
    };

    // Resume an existing draft (e.g. on page load)
    const resumeDraft = async (draftId) => {
        try {
            const data = await api.get(`/marketing/drafts/${draftId}`);
            if (data) {
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
        } catch (err) {
            console.error('Failed to resume draft:', err);
        }
    };

    const checkExistingDraft = async (projectId) => {
        if (!orgId || !userId) return null;

        // Clear in-memory state if switching projects
        if (activeDraft && activeDraft.projectId !== projectId) {
            setActiveDraft(null);
        }

        try {
            const data = await api.get(`/marketing/drafts?projectId=${projectId || 'null'}`);
            if (data && data.length > 0) {
                return data[0];
            }
        } catch (err) {
            console.error('Failed to check existing drafts:', err);
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

        try {
            const data = await api.get(`/marketing/drafts?projectId=${projectId || 'null'}`);
            if (data && data.length > 0) {
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
        } catch (err) {
            console.error('Failed to load draft:', err);
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
