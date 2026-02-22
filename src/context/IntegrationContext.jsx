import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

/**
 * IntegrationContext — Supabase-backed integration state.
 * Uses user_id (not org_id) for RLS simplicity.
 * No OAuth, no sessionStorage, no redirects.
 * Table: integrations (user_id, platform, status)
 */

const IntegrationContext = createContext();

const PLATFORM_DEFAULTS = {
    meta: { name: 'Meta Ads', description: 'Facebook & Instagram advertising' },
    google: { name: 'Google Ads', description: 'Search and display advertising' },
    instagram: { name: 'Instagram', description: 'Organic posts and stories' },
    linkedin: { name: 'LinkedIn Ads', description: 'B2B advertising and campaigns' }
};

export const IntegrationProvider = ({ children }) => {
    const { user } = useAuth();
    const [integrations, setIntegrations] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch all integrations for the user from Supabase
    const fetchIntegrations = useCallback(async () => {
        if (!user) { setIntegrations({}); setLoading(false); return; }
        setLoading(true);

        const { data, error } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', user.id);

        if (!error && data) {
            const map = {};
            data.forEach(row => {
                map[row.platform] = {
                    id: row.id,
                    platform_id: row.platform,
                    name: PLATFORM_DEFAULTS[row.platform]?.name || row.platform,
                    description: PLATFORM_DEFAULTS[row.platform]?.description || '',
                    connected: row.status === 'connected',
                    connectedAt: row.connected_at || row.created_at,
                    status: row.status,
                };
            });
            setIntegrations(map);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchIntegrations(); }, [fetchIntegrations]);

    // Connect platform — direct insert, no OAuth
    const connectIntegration = useCallback(async (platformId) => {
        if (!user) return;

        // Optimistic update
        setIntegrations(prev => ({
            ...prev,
            [platformId]: {
                ...(prev[platformId] || {}),
                platform_id: platformId,
                name: PLATFORM_DEFAULTS[platformId]?.name || platformId,
                connected: true,
                connectedAt: new Date().toISOString(),
                status: 'connected',
            }
        }));

        const { error } = await supabase
            .from('integrations')
            .upsert({
                user_id: user.id,
                platform: platformId,
                status: 'connected',
                connected_by: user.id,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,platform' });

        if (error) {
            console.error('Error connecting integration:', error);
            await fetchIntegrations(); // rollback
        }
    }, [user, fetchIntegrations]);

    // Disconnect platform — delete the row
    const disconnectIntegration = useCallback(async (platformId) => {
        if (!user) return;

        // Optimistic update
        setIntegrations(prev => {
            const next = { ...prev };
            delete next[platformId];
            return next;
        });

        const { error } = await supabase
            .from('integrations')
            .delete()
            .eq('user_id', user.id)
            .eq('platform', platformId);

        if (error) {
            console.error('Error disconnecting integration:', error);
            await fetchIntegrations(); // rollback
        }
    }, [user, fetchIntegrations]);

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
