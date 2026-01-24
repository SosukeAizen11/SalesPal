import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCampaigns, addCampaign, updateCampaign, getProjects, addProject } from '../utils/storage';

const MarketingContext = createContext();

export const MarketingProvider = ({ children }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [projects, setProjects] = useState([]);

    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Load campaigns and projects on init
    useEffect(() => {
        const storedCampaigns = getCampaigns();
        const storedProjects = getProjects();
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

    const getCampaignsByProject = (projectId) => {
        return campaigns.filter(c => c.projectId === projectId);
    };

    const value = {
        campaigns,
        projects,
        socialPosts,
        selectedProjectId,
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
