import { useState } from 'react';
import api from '../lib/api';

/**
 * useWizard — Campaign draft state machine hook.
 *
 * Backend expects:
 *   POST /marketing/drafts           { projectId, draftData }
 *   PUT  /marketing/drafts/:id       { wizardStep, draftData }
 *   POST /marketing/drafts/:id/launch  (reads draft_data from DB)
 *   DELETE /marketing/drafts/:id
 */
export function useWizard(orgId, userId, refetchCampaigns) {
    const [activeDraft, setActiveDraft] = useState(null);

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
            const draft = data;

            setActiveDraft({
                id: draft.id,
                projectId: draft.project_id,
                currentStepIndex: draft.wizard_step || 0,
                status: 'draft',
                data: initialDraftData,
                steps: initialSteps,
                ai: { analysisDone: false, recommendationsReady: false }
            });
        } catch (err) {
            console.error('Error starting draft:', err);
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

        try {
            await api.put(`/marketing/drafts/${activeDraft.id}`, {
                draftData: { steps: newSteps, ai: newAI, data: newData },
            });
        } catch (err) {
            console.error('Error updating draft step:', err);
        }
    };

    const setDraftStepIndex = async (index) => {
        if (!activeDraft) return;
        setActiveDraft(prev => ({ ...prev, currentStepIndex: index }));
        try {
            await api.put(`/marketing/drafts/${activeDraft.id}`, { wizardStep: index });
        } catch (err) {
            console.error('Error setting draft step index:', err);
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
            // First, make sure the draft_data in the DB has all the campaign info
            // needed by the launchDraft backend (it reads from stored draft_data)
            const d = activeDraft.data;
            const ads = d.ads?.[0] || {};
            const budget = d.budget || {};

            await api.put(`/marketing/drafts/${activeDraft.id}`, {
                draftData: {
                    ...activeDraft,
                    name: d.name || 'Untitled Campaign',
                    platform: (ads.platforms?.[0]) || 'meta',
                    objective: d.goals?.[0] || null,
                    dailyBudget: budget.daily || 0,
                    adPlatforms: ads.platforms || [],
                    adFormat: ads.format || 'carousel',
                    headline: ads.copy?.headline || null,
                    primaryText: ads.copy?.primaryText || null,
                    cta: ads.copy?.cta || null,
                    mediaType: ads.media?.type || 'ai-generated',
                    mediaUrl: ads.media?.url || null,
                    budgetPlatforms: budget.platforms || [],
                    budgetSplit: budget.split || {},
                    currency: budget.currency || 'INR',
                    data: d,
                    steps: activeDraft.steps,
                    ai: activeDraft.ai,
                }
            });

            const result = await api.post(`/marketing/drafts/${activeDraft.id}/launch`);
            const campaignId = result.id || result.campaignId || result.campaign_id;
            setActiveDraft(null);
            if (refetchCampaigns) await refetchCampaigns();
            return { success: true, campaignId };
        } catch (err) {
            return { success: false, error: err.message || 'Launch failed' };
        }
    };

    const cancelDraft = async () => {
        if (activeDraft?.id) {
            try {
                await api.del(`/marketing/drafts/${activeDraft.id}`);
            } catch (err) {
                console.error('Error cancelling draft:', err);
            }
        }
        setActiveDraft(null);
    };

    const resumeDraft = async (draftId) => {
        try {
            const data = await api.get('/marketing/drafts');
            const drafts = Array.isArray(data) ? data : (data.drafts || []);
            const draft = drafts.find(d => d.id === draftId);
            if (!draft) { console.error('Draft not found:', draftId); return; }
            const dd = draft.draft_data || {};
            setActiveDraft({
                id: draft.id,
                projectId: draft.project_id,
                currentStepIndex: draft.wizard_step || 0,
                status: 'draft',
                data: dd.data || {},
                steps: dd.steps || {},
                ai: dd.ai || { analysisDone: false }
            });
        } catch (err) {
            console.error('Error resuming draft:', err);
        }
    };

    return {
        activeDraft,
        startNewDraft,
        updateDraftStep,
        setDraftStepIndex,
        canAccessStep,
        launchCampaign,
        cancelDraft,
        resumeDraft,
    };
}
