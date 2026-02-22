import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrg } from './OrgContext';

/**
 * IntegrationContext — Supabase-backed integration state.
 * Replaces localStorage key: salespal_integrations
 * Table: integrations (org_id, platform, status, connected_by, created_at, updated_at)
 */

const IntegrationContext = createContext();

const PLATFORM_DEFAULTS = {
    meta: { name: 'Meta Ads', description: 'Facebook & Instagram advertising' },
    google: { name: 'Google Ads', description: 'Search and display advertising' },
    instagram: { name: 'Instagram', description: 'Organic posts and stories' },
    linkedin: { name: 'LinkedIn Ads', description: 'B2B advertising and campaigns' }
};

export const IntegrationProvider = ({ children }) => {
    const { orgId } = useOrg();
    const [integrations, setIntegrations] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch all integrations for the org from Supabase
    const fetchIntegrations = useCallback(async () => {
        if (!orgId) { setIntegrations({}); setLoading(false); return; }
        setLoading(true);

        const { data, error } = await supabase
            .from('integrations')
            .select('*')
            .eq('org_id', orgId);

        if (!error && data) {
            // Convert rows into a map keyed by platform
            const map = {};
            data.forEach(row => {
                map[row.platform] = {
                    id: row.id,
                    platform_id: row.platform,
                    name: PLATFORM_DEFAULTS[row.platform]?.name || row.platform,
                    description: PLATFORM_DEFAULTS[row.platform]?.description || '',
                    connected: row.status === 'connected',
                    connectedAt: row.created_at,
                    accountName: null, // stored in ad_accounts table
                    status: row.status,
                };
            });
            setIntegrations(map);
        }
        setLoading(false);
    }, [orgId]);

    useEffect(() => { fetchIntegrations(); }, [fetchIntegrations]);

    const connectIntegration = useCallback(async (platformId, accountName = 'Connected Account') => {
        if (!orgId) return;
        const { data: userRes } = await supabase.auth.getUser();

        // Optimistic update
        setIntegrations(prev => ({
            ...prev,
            [platformId]: {
                ...(prev[platformId] || {}),
                platform_id: platformId,
                name: PLATFORM_DEFAULTS[platformId]?.name || platformId,
                connected: true,
                connectedAt: new Date().toISOString(),
                accountName,
                status: 'connected',
            }
        }));

        const { error } = await supabase
            .from('integrations')
            .upsert({
                org_id: orgId,
                platform: platformId,
                status: 'connected',
                connected_by: userRes?.user?.id || null,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'org_id,platform' });

        if (error) {
            console.error('Error connecting integration:', error);
            await fetchIntegrations(); // rollback
        }
    }, [orgId, fetchIntegrations]);

    const disconnectIntegration = useCallback(async (platformId) => {
        if (!orgId) return;

        // Optimistic update
        setIntegrations(prev => ({
            ...prev,
            [platformId]: {
                ...(prev[platformId] || {}),
                connected: false,
                connectedAt: null,
                accountName: null,
                status: 'disconnected',
            }
        }));

        const { error } = await supabase
            .from('integrations')
            .upsert({
                org_id: orgId,
                platform: platformId,
                status: 'disconnected',
                updated_at: new Date().toISOString(),
            }, { onConflict: 'org_id,platform' });

        if (error) {
            console.error('Error disconnecting integration:', error);
            await fetchIntegrations(); // rollback
        }
    }, [orgId, fetchIntegrations]);

    // OAuth mock flow — still uses sessionStorage (UI concern, not persisted)
    const initiateConnection = useCallback((platformId, returnPath = '/') => {
        sessionStorage.setItem('oauth_return_path', returnPath);
        return `/connect/${platformId}`;
    }, []);

    const completeConnection = useCallback(async (platformId) => {
        await connectIntegration(platformId);
        const returnPath = sessionStorage.getItem('oauth_return_path') || '/marketing/settings';
        sessionStorage.removeItem('oauth_return_path');
        return returnPath;
    }, [connectIntegration]);

    const isConnected = useCallback((id) => {
        return integrations[id]?.connected ?? false;
    }, [integrations]);

    const getIntegration = useCallback((id) => {
        return integrations[id] ?? null;
    }, [integrations]);

    const validateIntegrations = useCallback((platforms = []) => {
        const errors = [];
        if (platforms.includes('facebook') || platforms.includes('meta')) {
            if (!integrations.meta?.connected) {
                errors.push({ id: 'meta', message: 'Meta Ads integration required for Facebook campaigns' });
            }
        }
        if (platforms.includes('google')) {
            if (!integrations.google?.connected) {
                errors.push({ id: 'google', message: 'Google Ads integration required for Google campaigns' });
            }
        }
        if (platforms.includes('instagram')) {
            if (!integrations.meta?.connected && !integrations.instagram?.connected) {
                errors.push({ id: 'instagram', message: 'Meta Ads or Instagram integration required for Instagram' });
            }
        }
        if (platforms.includes('linkedin')) {
            if (!integrations.linkedin?.connected) {
                errors.push({ id: 'linkedin', message: 'LinkedIn Ads integration required for LinkedIn campaigns' });
            }
        }
        return { valid: errors.length === 0, errors };
    }, [integrations]);

    const value = {
        integrations,
        loading,
        connectIntegration,
        disconnectIntegration,
        initiateConnection,
        completeConnection,
        isConnected,
        getIntegration,
        validateIntegrations,
        refetch: fetchIntegrations,
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
