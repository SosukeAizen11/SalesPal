import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrg } from './OrgContext';
import { MODULES } from './commerce.config';
// Note: commerce.config.js lives at src/commerce/commerce.config.js — same directory

/**
 * SubscriptionContext — Supabase-backed subscription + credit management.
 * Replaces localStorage keys: salespal_subscriptions, salespal_marketing_credits
 *
 * DB tables used:
 *   - subscriptions  (org_id, module, plan, status, activated_at, expires_at)
 *   - marketing_credits (org_id, balance)
 *   - credit_transactions (org_id, type, amount, balance_after, reference_type)
 *
 * DB functions used:
 *   - consume_credit(p_org_id, p_type, p_amount)  → boolean
 *   - add_credit(p_org_id, p_amount, p_source)    → void
 */

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const { orgId } = useOrg();
    const [subscriptions, setSubscriptions] = useState({});
    const [credits, setCredits] = useState({ balance: 0 });
    const [loading, setLoading] = useState(true);

    // ─── Fetch subscription + credits from Supabase ───
    const fetchAll = useCallback(async () => {
        if (!orgId) {
            setSubscriptions({});
            setCredits({ balance: 0 });
            setLoading(false);
            return;
        }
        setLoading(true);

        const [subRes, creditRes] = await Promise.all([
            supabase.from('subscriptions').select('*').eq('org_id', orgId),
            supabase.from('marketing_credits').select('balance').eq('org_id', orgId).maybeSingle()
        ]);

        // Build subscriptions map keyed by module
        const subMap = {};
        (subRes.data || []).forEach(row => {
            subMap[row.module] = {
                id: row.id,
                module: row.module,
                plan: row.plan,
                status: row.status,
                active: row.status === 'active' || row.status === 'trial',
                activatedAt: row.activated_at,
                expiresAt: row.expires_at,
                limits: MODULES[row.module]?.limits || null,
            };
        });
        setSubscriptions(subMap);

        setCredits({ balance: creditRes.data?.balance ?? 0 });
        setLoading(false);
    }, [orgId]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ─── Subscription management ───

    const activateSubscription = async (input) => {
        if (!orgId) return;
        const moduleIds = [];

        if (typeof input === 'string') {
            moduleIds.push(input);
        } else {
            const moduleKey = input.module || input.moduleId;
            const productId = input.productId || input.id;
            if (productId === 'salespal-360' || input.type === 'bundle') {
                moduleIds.push('marketing', 'sales', 'postSale', 'support', 'salespal360');
            } else if (moduleKey) {
                moduleIds.push(moduleKey);
            }
        }

        for (const moduleId of moduleIds) {
            const now = new Date().toISOString();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

            await supabase.from('subscriptions').upsert({
                org_id: orgId,
                module: moduleId,
                status: 'active',
                plan: 'starter',
                activated_at: now,
                expires_at: expiresAt,
            }, { onConflict: 'org_id,module' });

            // Allocate base credits for marketing on activation
            if (moduleId === 'marketing') {
                const limits = MODULES.marketing.limits;
                const baseCredits = (limits?.images || 20) + (limits?.videos || 4);
                await supabase.rpc('add_credit', {
                    p_org_id: orgId,
                    p_amount: baseCredits,
                    p_source: 'subscription'
                });
            }
        }

        await fetchAll();
    };

    const deactivateSubscription = async (moduleId) => {
        if (!orgId) return;
        await supabase.from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('org_id', orgId)
            .eq('module', moduleId);
        await fetchAll();
    };

    const pauseSubscription = async (moduleId) => {
        if (!orgId) return;
        await supabase.from('subscriptions')
            .update({ status: 'paused' })
            .eq('org_id', orgId)
            .eq('module', moduleId);
        await fetchAll();
    };

    const resumeSubscription = async (moduleId) => {
        if (!orgId) return;
        await supabase.from('subscriptions')
            .update({ status: 'active' })
            .eq('org_id', orgId)
            .eq('module', moduleId);
        await fetchAll();
    };

    const isModuleActive = (moduleId) => {
        return !!subscriptions[moduleId]?.active;
    };

    const getSubscription = (moduleId) => {
        return subscriptions[moduleId] || null;
    };

    // ─── Credit management ───

    /**
     * Deduct credits via the consume_credit() DB function.
     * Returns true if successful, false if insufficient balance.
     */
    const consume = async (moduleId, type) => {
        if (!orgId || !isModuleActive(moduleId)) return false;

        const { data: success, error } = await supabase.rpc('consume_credit', {
            p_org_id: orgId,
            p_type: type,
            p_amount: 1,
        });

        if (error) {
            console.error('consume_credit error:', error);
            return false;
        }

        if (success) {
            setCredits(prev => ({ balance: Math.max(0, prev.balance - 1) }));
        }

        return !!success;
    };

    /**
     * Add credits (purchase pack or manual top-up).
     */
    const addCredits = async (moduleId, resource, amount) => {
        if (!orgId) return false;

        const { error } = await supabase.rpc('add_credit', {
            p_org_id: orgId,
            p_amount: Number(amount),
            p_source: `topup_${resource}`
        });

        if (!error) {
            setCredits(prev => ({ balance: prev.balance + Number(amount) }));
        }

        return !error;
    };

    const getRemaining = (moduleId, type) => {
        // Single credit pool stored in marketing_credits.balance
        return credits.balance;
    };

    const canConsume = (moduleId, type) => {
        return isModuleActive(moduleId) && credits.balance > 0;
    };

    const clearCartAfterPurchase = () => {
        try { localStorage.removeItem('salespal_cart'); } catch { /* noop */ }
    };

    return (
        <SubscriptionContext.Provider value={{
            subscriptions,
            credits,
            loading,
            activateSubscription,
            deactivateSubscription,
            pauseSubscription,
            resumeSubscription,
            isModuleActive,
            getSubscription,
            consume,
            addCredits,
            getRemaining,
            canConsume,
            clearCartAfterPurchase,
            refetch: fetchAll,
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
