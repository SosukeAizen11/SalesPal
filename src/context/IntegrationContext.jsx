import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrg } from './OrgContext';

/**
 * IntegrationContext - Supabase-backed integration states
 * DB columns: id, org_id, platform, status (connected|disconnected|error),
 *             access_token_enc, refresh_token_enc, token_expires_at, connected_by
 */

const IntegrationContext = createContext();

const PLATFORM_META = {
    meta: { name: 'Meta Ads', description: 'Facebook & Instagram advertising' },
    google: { name: 'Google Ads', description: 'Search and display advertising' },
    instagram: { name: 'Instagram', description: 'Organic posts and stories' },
    linkedin: { name: 'LinkedIn Ads', description: 'B2B advertising and campaigns' }
};

export const IntegrationProvider = ({ children }) => {
    const { orgId } = useOrg();
    const [integrations, setIntegrations] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch integrations from Supabase
    const fetchIntegrations = useCallback(async () => {
        // Build default disconnected state for all platforms
        const defaults = {};
        Object.entries(PLATFORM_META).forEach(([id, meta]) => {
            defaults[id] = { id, ...meta, connected: false, connectedAt: null, accountName: null };
        });

        if (!orgId) {
            setIntegrations(defaults);
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data } = await supabase
            .from('integrations')
            .select('*')
            .eq('org_id', orgId);

        // Overlay DB rows on defaults
        const result = { ...defaults };
        if (data) {
            data.forEach(row => {
                const id = row.platform;
                if (result[id]) {
                    result[id] = {
                        ...result[id],
                        connected: row.status === 'connected',
                        connectedAt: row.created_at,
                        accountName: 'Connected Account',
                        dbId: row.id
                    };
                }
            });
        }

        setIntegrations(result);
        setLoading(false);
    }, [orgId]);

    useEffect(() => { fetchIntegrations(); }, [fetchIntegrations]);

    const connectIntegration = useCallback(async (id, accountName = 'Connected Account') => {
        if (!orgId) return;

        const { data: user } = await supabase.auth.getUser();

        // Check if row exists
        const { data: existing } = await supabase
            .from('integrations')
            .select('id')
            .eq('org_id', orgId)
            .eq('platform', id)
            .maybeSingle();

        if (existing) {
            await supabase
                .from('integrations')
                .update({ status: 'connected', connected_by: user?.user?.id })
                .eq('id', existing.id);
        } else {
            await supabase
                .from('integrations')
                .insert({
                    org_id: orgId,
                    platform: id,
                    status: 'connected',
                    connected_by: user?.user?.id
                });
        }

        // Optimistic update
        setIntegrations(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                connected: true,
                connectedAt: new Date().toISOString(),
                accountName
            }
        }));
    }, [orgId]);

    const disconnectIntegration = useCallback(async (id) => {
        if (!orgId) return;

        await supabase
            .from('integrations')
            .update({ status: 'disconnected' })
            .eq('org_id', orgId)
            .eq('platform', id);

        setIntegrations(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                connected: false,
                connectedAt: null,
                accountName: null
            }
        }));
    }, [orgId]);

    // --- OAUTH FLOW (mock for now) ---
    const initiateConnection = useCallback((platformId, returnPath = '/') => {
        sessionStorage.setItem('oauth_return_path', returnPath);
        return `/connect/${platformId}`;
    }, []);

    const completeConnection = useCallback((platformId) => {
        connectIntegration(platformId);
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
