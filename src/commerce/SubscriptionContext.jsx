import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../lib/api';
import { useOrg } from '../context/OrgContext';
import { useAuth } from '../context/AuthContext';
import { MODULES } from './commerce.config';

/**
 * SubscriptionContext — REST-backed subscription + credit management.
 * 
 * Backend routes:
 *   GET    /billing/subscriptions
 *   POST   /billing/subscriptions/activate       { moduleId }
 *   POST   /billing/subscriptions/:moduleId/deactivate
 *   POST   /billing/subscriptions/:moduleId/pause
 *   POST   /billing/subscriptions/:moduleId/resume
 *   GET    /billing/credits
 *   POST   /billing/credits/consume              { type }
 *   POST   /billing/credits/add                  { amount }
 */

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const { orgId } = useOrg();
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = useState({});
    const [credits, setCredits] = useState({ balance: 0 });
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        if (!user) {
            setSubscriptions({});
            setCredits({ balance: 0 });
            setLoading(false);
            return;
        }
        setLoading(true);

        try {
            // Fetch subscriptions and credits in parallel
            const [subRes, creditRes] = await Promise.allSettled([
                api.get('/billing/subscriptions'),
                api.get('/billing/credits'),
            ]);

            // Process subscriptions
            const subs = subRes.status === 'fulfilled'
                ? (subRes.value.subscriptions || subRes.value || [])
                : [];

            const subMap = {};
            const subArray = Array.isArray(subs) ? subs : (subs ? [subs] : []);
            subArray.forEach(row => {
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

            // Process credits
            const creditData = creditRes.status === 'fulfilled' ? creditRes.value : {};
            setCredits({ balance: creditData?.balance ?? creditData?.credits?.balance ?? 0 });
        } catch (err) {
            console.error('SubscriptionContext fetchAll error:', err);
        } finally {
            setLoading(false);
        }
    }, [user, orgId]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ─── Subscription management ───

    const activateSubscription = useCallback(async (input) => {
        if (!user) return;
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
            try {
                await api.post('/billing/subscriptions/activate', { moduleId });
            } catch (err) {
                console.error(`Failed to activate subscription for ${moduleId}:`, err);
            }
        }

        await fetchAll();
    }, [user, orgId, fetchAll]);

    const deactivateSubscription = useCallback(async (moduleId) => {
        if (!user) return;
        try {
            await api.post(`/billing/subscriptions/${moduleId}/deactivate`);
        } catch (err) {
            console.error('Error deactivating subscription:', err);
        }
        await fetchAll();
    }, [user, fetchAll]);

    const pauseSubscription = useCallback(async (moduleId) => {
        if (!user) return;
        try {
            await api.post(`/billing/subscriptions/${moduleId}/pause`);
        } catch (err) {
            console.error('Error pausing subscription:', err);
        }
        await fetchAll();
    }, [user, fetchAll]);

    const resumeSubscription = useCallback(async (moduleId) => {
        if (!user) return;
        try {
            await api.post(`/billing/subscriptions/${moduleId}/resume`);
        } catch (err) {
            console.error('Error resuming subscription:', err);
        }
        await fetchAll();
    }, [user, fetchAll]);

    const isModuleActive = (moduleId) => {
        return !!subscriptions[moduleId]?.active;
    };

    const getSubscription = (moduleId) => {
        return subscriptions[moduleId] || null;
    };

    // ─── Credit management ───

    const consume = useCallback(async (moduleId, type) => {
        if (!orgId || !isModuleActive(moduleId)) return false;

        try {
            const data = await api.post('/billing/credits/consume', {
                type,
                amount: 1,
            });

            if (data.success) {
                setCredits(prev => ({ balance: Math.max(0, prev.balance - 1) }));
            }
            return !!data.success;
        } catch (err) {
            console.error('consume_credit error:', err);
            return false;
        }
    }, [orgId, subscriptions]);

    const addCredits = useCallback(async (moduleId, resource, amount) => {
        if (!orgId) return false;

        try {
            await api.post('/billing/credits/add', {
                amount: Number(amount),
                source: `topup_${resource}`,
            });
            setCredits(prev => ({ balance: prev.balance + Number(amount) }));
            return true;
        } catch (err) {
            console.error('addCredits error:', err);
            return false;
        }
    }, [orgId]);

    const getRemaining = useCallback((moduleId, type) => {
        return credits.balance;
    }, [credits.balance]);

    const canConsume = useCallback((moduleId, type) => {
        return isModuleActive(moduleId) && credits.balance > 0;
    }, [subscriptions, credits.balance]);

    const clearCartAfterPurchase = () => {
        try { localStorage.removeItem('salespal_cart'); } catch { /* noop */ }
    };

    const value = useMemo(() => ({
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
    }), [
        subscriptions, credits, loading,
        fetchAll,
        activateSubscription, deactivateSubscription, pauseSubscription, resumeSubscription,
        consume, addCredits, getRemaining, canConsume,
    ]);

    return (
        <SubscriptionContext.Provider value={value}>
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
