import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
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
            // Try to find existing org membership
            const { data: member, error: memberError } = await supabase
                .from('org_members')
                .select('*, organizations(*)')
                .eq('user_id', user.id)
                .limit(1)
                .maybeSingle();

            if (memberError && memberError.code !== 'PGRST116') {
                console.error('Org members query error:', memberError);
            }

            if (!member) {
                // No org — call server-side bootstrap RPC
                console.log('No org found, calling bootstrap_user_org RPC...');
                const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'My';
                const orgName = `${userName}'s Workspace`;

                const { error: rpcError } = await supabase.rpc('bootstrap_user_org', {
                    p_org_name: orgName
                });

                if (rpcError) {
                    console.error('Bootstrap RPC failed:', rpcError);
                    setLoading(false);
                    return;
                }

                // Re-fetch the membership after bootstrap
                const { data: freshMember } = await supabase
                    .from('org_members')
                    .select('*, organizations(*)')
                    .eq('user_id', user.id)
                    .limit(1)
                    .maybeSingle();

                if (freshMember) {
                    const orgData = freshMember.organizations;
                    setOrg(orgData);
                    setOrgId(orgData.id);
                    setMembership({ role: freshMember.role });
                }

                setLoading(false);
                return;
            }

            // Existing member found
            const orgData = member.organizations;
            setOrg(orgData);
            setOrgId(orgData.id);
            setMembership({ role: member.role });
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

        const { data: result, error } = await supabase.rpc('bootstrap_user_org', {
            p_org_name: name
        });

        if (error) throw error;

        // Re-fetch to populate state
        await bootstrap();
        return result;
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
