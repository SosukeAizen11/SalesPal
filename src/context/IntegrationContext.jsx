import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * IntegrationContext - Global single source of truth for all integration states
 * Used by campaigns, social features, and settings
 */

const IntegrationContext = createContext();

const INITIAL_INTEGRATIONS = {
    meta: {
        id: 'meta',
        name: 'Meta Ads',
        description: 'Facebook & Instagram advertising',
        connected: false,
        connectedAt: null,
        accountName: null
    },
    google: {
        id: 'google',
        name: 'Google Ads',
        description: 'Search and display advertising',
        connected: false,
        connectedAt: null,
        accountName: null
    },
    instagram: {
        id: 'instagram',
        name: 'Instagram',
        description: 'Organic posts and stories',
        connected: false,
        connectedAt: null,
        accountName: null
    },
    linkedin: {
        id: 'linkedin',
        name: 'LinkedIn Ads',
        description: 'B2B advertising and campaigns',
        connected: false,
        connectedAt: null,
        accountName: null
    }
};

export const IntegrationProvider = ({ children }) => {
    const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);

    const connectIntegration = useCallback((id, accountName = 'Connected Account') => {
        setIntegrations(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                connected: true,
                connectedAt: new Date().toISOString(),
                accountName
            }
        }));
    }, []);

    const disconnectIntegration = useCallback((id) => {
        setIntegrations(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                connected: false,
                connectedAt: null,
                accountName: null
            }
        }));
    }, []);

    const isConnected = useCallback((id) => {
        return integrations[id]?.connected ?? false;
    }, [integrations]);

    const getIntegration = useCallback((id) => {
        return integrations[id] ?? null;
    }, [integrations]);

    /**
     * Validate required integrations for a given set of platforms
     * Returns { valid: boolean, errors: Array<{ id, message }> }
     */
    const validateIntegrations = useCallback((platforms = []) => {
        const errors = [];

        // Meta is required for Facebook/Instagram ad campaigns
        if (platforms.includes('facebook') || platforms.includes('meta')) {
            if (!integrations.meta.connected) {
                errors.push({
                    id: 'meta',
                    message: 'Meta Ads integration required for Facebook campaigns'
                });
            }
        }

        // Google required for Google campaigns
        if (platforms.includes('google')) {
            if (!integrations.google.connected) {
                errors.push({
                    id: 'google',
                    message: 'Google Ads integration required for Google campaigns'
                });
            }
        }

        // Instagram for Instagram posts/stories
        if (platforms.includes('instagram')) {
            if (!integrations.meta.connected && !integrations.instagram.connected) {
                errors.push({
                    id: 'instagram',
                    message: 'Meta Ads or Instagram integration required for Instagram'
                });
            }
        }

        // LinkedIn for LinkedIn campaigns
        if (platforms.includes('linkedin')) {
            if (!integrations.linkedin.connected) {
                errors.push({
                    id: 'linkedin',
                    message: 'LinkedIn Ads integration required for LinkedIn campaigns'
                });
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }, [integrations]);

    const value = {
        integrations,
        connectIntegration,
        disconnectIntegration,
        isConnected,
        getIntegration,
        validateIntegrations
    };

    return (
        <IntegrationContext.Provider value={value}>
            {children}
        </IntegrationContext.Provider>
    );
};

export const useIntegrations = () => {
    const context = useContext(IntegrationContext);
    if (!context) {
        throw new Error('useIntegrations must be used within an IntegrationProvider');
    }
    return context;
};

export default IntegrationContext;
