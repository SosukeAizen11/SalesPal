import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';

const OrgContext = createContext();

export const useOrg = () => {
    const context = useContext(OrgContext);
    if (!context) {
        throw new Error('useOrg must be used within an OrgProvider');
    }
    return context;
};

export const OrgProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [org, setOrg] = useState(null);
    const [orgId, setOrgId] = useState(null);
    const [membership, setMembership] = useState(null);
    const [loading, setLoading] = useState(true);

    const bootstrap = useCallback(async () => {
        if (!user) {
            setOrg(null);
            setOrgId(null);
            setMembership(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // The /users/me endpoint returns org info if the user has one
            const data = await api.get('/users/me');
            const userData = data.user || data;

            if (userData.org_id) {
                setOrg({ id: userData.org_id, name: userData.org_name || "My Workspace" });
                setOrgId(userData.org_id);
                setMembership({ role: userData.role || 'owner' });
            } else {
                // No org yet — this shouldn't happen since backend auto-creates on register
                setOrg(null);
                setOrgId(null);
                setMembership(null);
            }
        } catch (err) {
            console.error('Org bootstrap error:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isAuthenticated) {
            bootstrap();
        } else {
            setOrg(null);
            setOrgId(null);
            setMembership(null);
            setLoading(false);
        }
    }, [isAuthenticated, bootstrap]);

    // Manual create org (for settings/onboarding page)
    const createOrganization = useCallback(async (name) => {
        if (!user) throw new Error('Must be authenticated');
        // Backend doesn't have a separate create-org endpoint yet,
        // so this is a no-op for now (org is created on register)
        await bootstrap();
    }, [user, bootstrap]);

    const value = useMemo(() => ({
        org,
        orgId,
        membership,
        loading,
        createOrganization,
        refetch: bootstrap,
    }), [org, orgId, membership, loading, createOrganization, bootstrap]);

    return (
        <OrgContext.Provider value={value}>
            {children}
        </OrgContext.Provider>
    );
};
