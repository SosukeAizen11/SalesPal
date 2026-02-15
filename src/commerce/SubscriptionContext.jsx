import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODULES } from './commerce.config';

const SubscriptionContext = createContext();

const STORAGE_KEY = 'salespal_subscriptions';
const CART_STORAGE_KEY = 'salespal_cart';

export const SubscriptionProvider = ({ children }) => {
    // Structure: { [moduleId]: { module: string, status: 'active'|'paused'|'cancelled_pending', active: boolean, renewalDate: string, pausedUntil?: string, cancellationDate?: string, limits?: {}, usage: {}, extraCredits: {}, productId?: string } }
    const [subscriptions, setSubscriptions] = useState({});
    const [loading, setLoading] = useState(true);

    // Initialize from LocalStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSubscriptions(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load subscriptions", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
        }
    }, [subscriptions, loading]);

    const buildCounters = (existing, limits) => {
        const usage = { ...(existing?.usage || {}) };
        const extraCredits = { ...(existing?.extraCredits || {}) };

        if (limits) {
            Object.keys(limits).forEach((key) => {
                if (typeof usage[key] !== 'number' || usage[key] < 0) {
                    usage[key] = 0;
                }
                if (typeof extraCredits[key] !== 'number' || extraCredits[key] < 0) {
                    extraCredits[key] = 0;
                }
            });
        }

        return { usage, extraCredits };
    };

    const internalActivateModule = (moduleId, sourceProductId) => {
        if (!MODULES[moduleId]) {
            console.error(`Invalid module ID: ${moduleId}`);
            return;
        }

        setSubscriptions(prev => {
            const existing = prev[moduleId];
            if (existing?.active) {
                return prev;
            }

            const now = new Date();
            const renewalDate = new Date(now.setDate(now.getDate() + 30)).toISOString();
            const limits = MODULES[moduleId].limits || existing?.limits || null;
            const { usage, extraCredits } = buildCounters(existing, limits);

            return {
                ...prev,
                [moduleId]: {
                    ...existing,
                    module: moduleId,
                    status: 'active',
                    active: true,
                    renewalDate,
                    limits,
                    usage,
                    extraCredits,
                    productId: sourceProductId || existing?.productId
                }
            };
        });
    };

    /**
     * Activate subscriptions for a product or module.
     * Supports:
     * - moduleId string ("marketing")
     * - cart item / product object with type/module/moduleId/productId
     */
    const activateSubscription = (input) => {
        if (!input) return;

        const moduleIds = [];
        let sourceProductId = null;

        if (typeof input === 'string') {
            moduleIds.push(input);
        } else {
            const type = input.type;
            const moduleKey = input.module || input.moduleId;
            const productId = input.productId || input.id;
            sourceProductId = productId || null;

            // Bundle product (e.g. SalesPal 360) activates multiple modules
            if (type === 'bundle' || moduleKey === 'bundle' || productId === 'salespal-360') {
                moduleIds.push('marketing', 'sales', 'postSale', 'support', 'salespal360');
            } else if (moduleKey) {
                moduleIds.push(moduleKey);
            } else if (productId && MODULES[productId]) {
                moduleIds.push(productId);
            }
        }

        moduleIds.forEach((moduleId) => internalActivateModule(moduleId, sourceProductId));
    };

    const deactivateSubscription = (moduleId) => {
        setSubscriptions(prev => {
            const existing = prev[moduleId];
            if (!existing) return prev;

            // In a real app, this might set a "cancel_at_period_end" flag.
            // For now, we'll simulate a "cancelled_pending" state if it's active,
            // or just remove it if it's already past due or inactive.

            // If we want to simulate immediate cancellation (old behavior):
            // const next = { ...prev };
            // delete next[moduleId];
            // return next;

            // New "Premium" behavior: Cancel at end of cycle
            // We'll calculate the end of the current billing cycle based on renewalDate
            const cancellationDate = existing.renewalDate;

            return {
                ...prev,
                [moduleId]: {
                    ...existing,
                    status: 'cancelled',
                    active: true, // Still active until the date
                    cancellationDate
                }
            };
        });
    };

    const pauseSubscription = (moduleId, months) => {
        setSubscriptions(prev => {
            const existing = prev[moduleId];
            if (!existing) return prev;

            const now = new Date();
            let pausedUntil = new Date();

            if (months === 'next_billing') {
                pausedUntil = new Date(existing.renewalDate);
            } else {
                pausedUntil.setMonth(now.getMonth() + months);
            }

            return {
                ...prev,
                [moduleId]: {
                    ...existing,
                    status: 'paused',
                    active: false, // Paused means inactive for usage
                    pausedUntil: pausedUntil.toISOString()
                }
            };
        });
    };

    const resumeSubscription = (moduleId) => {
        setSubscriptions(prev => {
            const existing = prev[moduleId];
            if (!existing) return prev;

            // When resuming, we ideally adjust the renewal date.
            // For simplicity, we just set it back to active and keep the old renewal date
            // or reset it if it expired. 
            // Let's just switch status back to active.

            return {
                ...prev,
                [moduleId]: {
                    ...existing,
                    status: 'active',
                    active: true,
                    pausedUntil: null,
                    cancellationDate: null
                }
            };
        });
    };

    const isModuleActive = (moduleId) => {
        return !!subscriptions[moduleId]?.active;
    };

    const getSubscription = (moduleId) => {
        return subscriptions[moduleId] || null;
    };

    const addCredits = (moduleId, resource, amount) => {
        if (!isModuleActive(moduleId)) return false;

        setSubscriptions(prev => {
            const moduleState = prev[moduleId];
            // Ensure counters exist
            const currentExtra = moduleState.extraCredits?.[resource] || 0;

            return {
                ...prev,
                [moduleId]: {
                    ...moduleState,
                    extraCredits: {
                        ...(moduleState.extraCredits || {}),
                        [resource]: currentExtra + amount
                    }
                }
            };
        });
        return true;
    };

    const resetMonthlyUsage = (moduleId) => {
        if (!isModuleActive(moduleId)) return;

        setSubscriptions(prev => ({
            ...prev,
            [moduleId]: {
                ...prev[moduleId],
                usage: {}
            }
        }));
    };

    const canConsume = (moduleId, type) => {
        const sub = subscriptions[moduleId];
        if (!sub || !sub.active || !sub.limits) return false;

        const limit = sub.limits[type];
        if (typeof limit !== 'number') return false;

        const used = (sub.usage && typeof sub.usage[type] === 'number') ? sub.usage[type] : 0;
        const extra = (sub.extraCredits && typeof sub.extraCredits[type] === 'number') ? sub.extraCredits[type] : 0;

        return used < limit || extra > 0;
    };

    const consume = (moduleId, type) => {
        const sub = subscriptions[moduleId];
        if (!sub || !sub.active || !sub.limits) return false;

        const limit = sub.limits[type];
        if (typeof limit !== 'number') return false;

        const currentUsage = (sub.usage && typeof sub.usage[type] === 'number') ? sub.usage[type] : 0;
        const currentExtra = (sub.extraCredits && typeof sub.extraCredits[type] === 'number') ? sub.extraCredits[type] : 0;

        let nextUsage = currentUsage;
        let nextExtra = currentExtra;

        if (currentUsage < limit) {
            nextUsage = currentUsage + 1;
        } else if (currentExtra > 0) {
            nextExtra = currentExtra - 1;
        } else {
            return false;
        }

        if (nextUsage < 0 || nextExtra < 0) {
            return false;
        }

        setSubscriptions(prev => {
            const existing = prev[moduleId];
            if (!existing) return prev;

            const limits = existing.limits || sub.limits || {};
            const usage = { ...(existing.usage || {}), [type]: nextUsage };
            const extraCredits = { ...(existing.extraCredits || {}), [type]: nextExtra };

            return {
                ...prev,
                [moduleId]: {
                    ...existing,
                    limits,
                    usage,
                    extraCredits
                }
            };
        });

        return true;
    };

    const getRemaining = (moduleId, type) => {
        const sub = subscriptions[moduleId];
        if (!sub || !sub.active || !sub.limits) return 0;

        const limit = sub.limits[type];
        if (typeof limit !== 'number') return 0;

        const used = (sub.usage && typeof sub.usage[type] === 'number') ? sub.usage[type] : 0;
        const extra = (sub.extraCredits && typeof sub.extraCredits[type] === 'number') ? sub.extraCredits[type] : 0;

        const remainingBase = Math.max(0, limit - used);
        return remainingBase + Math.max(0, extra);
    };

    const resetIfRenewalPassed = (moduleId) => {
        const sub = subscriptions[moduleId];
        if (!sub || !sub.active || !sub.renewalDate) return;

        const now = new Date();
        const renewalDate = new Date(sub.renewalDate);

        if (now <= renewalDate) return;

        setSubscriptions(prev => {
            const existing = prev[moduleId];
            if (!existing) return prev;

            const limits = existing.limits || null;
            const usage = {};

            if (limits) {
                Object.keys(limits).forEach((key) => {
                    usage[key] = 0;
                });
            }

            const nextRenewal = new Date();
            nextRenewal.setDate(nextRenewal.getDate() + 30);

            return {
                ...prev,
                [moduleId]: {
                    ...existing,
                    usage,
                    renewalDate: nextRenewal.toISOString()
                }
            };
        });
    };

    const clearCartAfterPurchase = () => {
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch {
            // Fail silently – do not surface storage errors to users
        }
    };

    return (
        <SubscriptionContext.Provider value={{
            subscriptions,
            activateSubscription,
            deactivateSubscription,
            isModuleActive,
            getSubscription,
            addCredits,
            resetMonthlyUsage,
            canConsume,
            consume,
            getRemaining,
            resetIfRenewalPassed,
            clearCartAfterPurchase,
            pauseSubscription,
            resumeSubscription,
            loading
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
