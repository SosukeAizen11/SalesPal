const STORAGE_KEY = 'salespal_marketing_campaigns';

export const getCampaigns = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading campaigns from storage:', error);
        return [];
    }
};

export const saveCampaigns = (campaigns) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (error) {
        console.error('Error saving campaigns to storage:', error);
    }
};

// Clear all campaigns (for resetting demo data)
export const clearCampaigns = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing campaigns from storage:', error);
    }
};

export const addCampaign = (campaign) => {
    const campaigns = getCampaigns();
    const newCampaign = {
        ...campaign,
        id: campaign.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: campaign.status || 'draft', // specific default if missing
    };
    const updatedCampaigns = [newCampaign, ...campaigns];
    saveCampaigns(updatedCampaigns);
    return newCampaign;
};

export const updateCampaign = (campaignId, updates) => {
    const campaigns = getCampaigns();
    const updatedCampaigns = campaigns.map(c =>
        c.id === campaignId ? { ...c, ...updates } : c
    );
    saveCampaigns(updatedCampaigns);
    return updatedCampaigns.find(c => c.id === campaignId);
};

const PROJECTS_KEY = 'salespal_marketing_projects';

export const getProjects = () => {
    try {
        const data = localStorage.getItem(PROJECTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading projects from storage:', error);
        return [];
    }
};

export const saveProjects = (projects) => {
    try {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects to storage:', error);
    }
};

export const addProject = (project) => {
    const projects = getProjects();
    // Create a simple slug from the name
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newProject = {
        ...project,
        id: slug || crypto.randomUUID(), // Fallback if name is empty (shouldn't happen)
        createdAt: new Date().toISOString(),
        status: 'active',
    };
    const updatedProjects = [newProject, ...projects];
    saveProjects(updatedProjects);
    return newProject;
};
