import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCampaigns, addCampaign, updateCampaign, getProjects, addProject, saveCampaigns, saveProjects } from '../utils/storage';
import { seedProjects, seedCampaigns } from '../utils/seedData';

const MarketingContext = createContext();

export const MarketingProvider = ({ children }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Load campaigns and projects on init
    useEffect(() => {
        let storedCampaigns = getCampaigns();
        let storedProjects = getProjects();

        // SEEDING LOGIC: Ensure Demo Data Exists
        const hasDemoConfig = storedProjects.some(p => p.id === 'proj_acme_re');

        if (!hasDemoConfig) {
            console.log("Seeding Demo Data (Acme & Zenith)...");
            // Merge seed data with existing data to avoid data loss
            storedProjects = [...storedProjects, ...seedProjects];
            storedCampaigns = [...storedCampaigns, ...seedCampaigns];

            saveProjects(storedProjects);
            saveCampaigns(storedCampaigns);
        }

        setCampaigns(storedCampaigns);
        setProjects(storedProjects);

        // Load persisted project selection
        const savedProjectId = localStorage.getItem('salespal_active_project_id');
        if (savedProjectId && storedProjects.find(p => p.id === savedProjectId)) {
            setSelectedProjectId(savedProjectId);
        } else if (storedProjects.length > 0) {
            // Default to first project if none selected
            setSelectedProjectId(storedProjects[0].id);
        }
    }, []);

    const selectProject = (projectId) => {
        setSelectedProjectId(projectId);
        localStorage.setItem('salespal_active_project_id', projectId);
    };

    const createCampaign = (campaignData) => {
        const newCampaign = addCampaign({
            ...campaignData,
            projectId: campaignData.projectId || selectedProjectId // Fallback to selected
        });
        setCampaigns(prev => [newCampaign, ...prev]);
        return newCampaign;
    };

    const getCampaignById = (id) => {
        return campaigns.find(c => c.id === id);
    };

    const applyAIAction = (campaignId, actionType) => {
        const campaign = getCampaignById(campaignId);
        if (!campaign) return;

        let updates = {};

        switch (actionType) {
            case 'SCALE_CAMPAIGN':
                // Increase budget by 20%
                const currentBudget = parseInt(campaign.dailyBudget.replace(/[^0-9]/g, '')) || 0;
                const newBudget = Math.floor(currentBudget * 1.2);
                updates = { dailyBudget: `₹${newBudget.toLocaleString()}` };
                break;
            case 'OPTIMIZE_BUDGET':
                // Mock update - maybe reorder platforms mock or just set a flag
                updates = { lastOptimized: new Date().toISOString() };
                break;
            case 'ROTATE_CREATIVES':
                // Mock update
                updates = { activeCreativeId: 'creative_v2' };
                break;
            default:
                break;
        }

        const updatedCampaign = updateCampaign(campaignId, updates);

        // Update local state
        setCampaigns(prev => prev.map(c => c.id === campaignId ? updatedCampaign : c));

        return updatedCampaign;
    };

    const createProject = (projectData) => {
        const newProject = addProject(projectData);
        setProjects(prev => [newProject, ...prev]);
        return newProject;
    };

    const getProjectById = (id) => {
        return projects.find(p => p.id === id);
    };

    const [socialPosts, setSocialPosts] = useState([]);

    const updateProject = (projectId, updates) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
        // In a real app, this would be an API call
        // For now, we manually update the local storage in a real implementation we'd use the util
        const updatedProjects = projects.map(p => p.id === projectId ? { ...p, ...updates } : p);
        localStorage.setItem('salespal_projects', JSON.stringify(updatedProjects));
    };

    const deleteProject = (projectId) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setCampaigns(prev => prev.filter(c => c.projectId !== projectId));

        // Persist deletion
        const updatedProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('salespal_projects', JSON.stringify(updatedProjects));

        if (selectedProjectId === projectId) {
            setSelectedProjectId(null);
            localStorage.removeItem('salespal_active_project_id');
        }
    };

    const updateCampaign = (campaignId, updates) => {
        setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, ...updates } : c));
        // Persist
        const updatedCampaigns = campaigns.map(c => c.id === campaignId ? { ...c, ...updates } : c);
        localStorage.setItem('salespal_campaigns', JSON.stringify(updatedCampaigns));
    };

    const deleteCampaign = (campaignId) => {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
        // Persist
        const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
        localStorage.setItem('salespal_campaigns', JSON.stringify(updatedCampaigns));
    };

    const addSocialPost = (post) => {
        const newPost = { ...post, id: Date.now().toString(), createdAt: new Date().toISOString() };
        setSocialPosts(prev => [newPost, ...prev]);
    };

    const deleteSocialPost = (postId) => {
        setSocialPosts(prev => prev.filter(p => p.id !== postId));
    };

    const updateSocialPost = (postId, updates) => {
        setSocialPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
    };

    const getCampaignsByProject = (projectId) => {
        return campaigns.filter(c => c.projectId === projectId);
    };

    // --- STATE MACHINE LOGIC ---

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
            // Mark current step as completed
            if (step) newSteps[step] = 'completed';

            // Special Transition Logic
            let newStatus = prev.status;
            let newAI = { ...prev.ai };

            if (step === 'business') {
                newStatus = 'analyzing';
                // Reset AI flags if business changes? Maybe not for now to keep simple
            }

            if (step === 'analysis') {
                newStatus = 'draft';
                newAI.analysisDone = true;
            }

            return {
                ...prev,
                status: newStatus,
                steps: newSteps,
                ai: newAI,
                data: { ...prev.data, ...stepData }
            };
        });
    };

    const setDraftStepIndex = (index) => {
        if (!activeDraft) return;
        setActiveDraft(prev => ({ ...prev, currentStepIndex: index }));
    };

    const canAccessStep = (stepIndex) => {
        if (!activeDraft) return false;

        // Linear dependencies
        // 0: Business -> Always Open
        // 1: Analysis -> Rewuires Business Complete
        // 2: Ads -> Requires Analysis Complete
        // 3: Budget -> Requires Ads Complete
        // 4: Review -> Requires Budget Complete

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

    const launchCampaign = () => {
        if (!activeDraft) return { success: false, error: 'No active draft' };

        // Note: Integration validation is now handled by the frontend guard (canLaunchCampaign)
        // The StepReviewLaunch component ensures integrations are connected before calling this

        const finalizedCampaign = addCampaign({
            ...activeDraft.data,
            id: `cmp_${Date.now()}`,
            projectId: activeDraft.projectId,
            status: 'running',
            createdAt: new Date().toISOString(),
            // RAW METRICS (Canonical Schema Root)
            spend: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            reach: 0,
            // Detailed Breakdown Containers
            details: {
                creatives: [],      // [{ id, name, spend, impressions, clicks, conversions }]
                demographics: {},   // { age: [{ range, impressions... }], gender: ... }
                device: [],         // [{ name, impressions, clicks... }]
                platformSpecific: {} // { qualityScore: 7, ... } raw values only
            }
        });

        setCampaigns(prev => [finalizedCampaign, ...prev]);
        setActiveDraft(null);
        return { success: true, campaign: finalizedCampaign };
    };

    const cancelDraft = () => {
        setActiveDraft(null);
    };

    const value = {
        campaigns,
        projects,
        socialPosts,
        selectedProjectId,
        activeDraft,
        startNewDraft,
        updateDraftStep,
        setDraftStepIndex,
        canAccessStep,
        launchCampaign,
        cancelDraft,
        selectProject,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        getCampaignById,
        applyAIAction,
        createProject,
        updateProject,
        deleteProject,
        getProjectById,
        getCampaignsByProject,
        addSocialPost,
        updateSocialPost,
        deleteSocialPost
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
