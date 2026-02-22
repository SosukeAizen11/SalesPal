import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    const bootstrap = useCallback(async () => {
        if (!user) {
            setOrg(null);
            setOrgId(null);
            setMembership(null);
            setSubscription(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // 1. Try to find existing org membership
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

                const { data: result, error: rpcError } = await supabase.rpc('bootstrap_user_org', {
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

                    // Fetch subscription
                    const { data: sub } = await supabase
                        .from('subscriptions')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('module', 'marketing')
                        .in('status', ['active', 'trial'])
                        .limit(1)
                        .maybeSingle();

                    setSubscription(sub || null);
                }

                setLoading(false);
                return;
            }

            // Existing member found
            const orgData = member.organizations;
            setOrg(orgData);
            setOrgId(orgData.id);
            setMembership({ role: member.role });

            // 2. Check marketing subscription
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('module', 'marketing')
                .in('status', ['active', 'trial'])
                .limit(1)
                .maybeSingle();

            setSubscription(sub || null);
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
            setSubscription(null);
            setLoading(false);
        }
    }, [isAuthenticated, bootstrap]);

    // Manual create org (for settings/onboarding page)
    const createOrganization = async (name) => {
        if (!user) throw new Error('Must be authenticated');

        const { data: result, error } = await supabase.rpc('bootstrap_user_org', {
            p_org_name: name
        });

        if (error) throw error;

        // Re-fetch to populate state
        await bootstrap();
        return result;
    };

    const isMarketingActive = !!subscription;

    return (
        <OrgContext.Provider value={{
            org,
            orgId,
            membership,
            subscription,
            isMarketingActive,
            loading,
            createOrganization,
            refetch: bootstrap
        }}>
            {children}
        </OrgContext.Provider>
    );
};
