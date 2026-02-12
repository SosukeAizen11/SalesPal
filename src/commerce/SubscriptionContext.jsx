import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODULES } from './commerce.config';

const SubscriptionContext = createContext();

const STORAGE_KEY = 'salespal_subscriptions';

export const SubscriptionProvider = ({ children }) => {
    // Structure: { [moduleId]: { active: boolean, renewalDate: string, usage: {}, extraCredits: {} } }
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

    const activateSubscription = (moduleId) => {
        if (!MODULES[moduleId]) {
            console.error(`Invalid module ID: ${moduleId}`);
            return;
        }

        const now = new Date();
        const renewalDate = new Date(now.setDate(now.getDate() + 30)).toISOString();

        setSubscriptions(prev => ({
            ...prev,
            [moduleId]: {
                active: true,
                renewalDate: renewalDate,
                usage: {}, // Track usage against limits
                extraCredits: {} // Purchased top-ups
            }
        }));
    };

    const deactivateSubscription = (moduleId) => {
        setSubscriptions(prev => {
            const next = { ...prev };
            delete next[moduleId];
            return next;
        });
    };

    const isModuleActive = (moduleId) => {
        return !!subscriptions[moduleId]?.active;
    };

    const addCredits = (moduleId, resource, amount) => {
        if (!isModuleActive(moduleId)) return;

        setSubscriptions(prev => {
            const moduleState = prev[moduleId];
            const currentExtra = moduleState.extraCredits?.[resource] || 0;

            return {
                ...prev,
                [moduleId]: {
                    ...moduleState,
                    extraCredits: {
                        ...moduleState.extraCredits,
                        [resource]: currentExtra + amount
                    }
                }
            };
        });
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

    // --- TEMPORARY TESTING HELPER ---
    useEffect(() => {
        window.__activate = (moduleId) => {
            console.log(`[TEST] Manually activating ${moduleId}...`);
            activateSubscription(moduleId);
            return `Activated ${moduleId}`;
        };

        window.__deactivate = (moduleId) => {
            console.log(`[TEST] Manually deactivating ${moduleId}...`);
            deactivateSubscription(moduleId);
            return `Deactivated ${moduleId}`;
        };

        window.__status = () => {
            console.log(subscriptions);
            return subscriptions;
        }
    }, [subscriptions]);

    return (
        <SubscriptionContext.Provider value={{
            subscriptions,
            activateSubscription,
            deactivateSubscription,
            isModuleActive,
            addCredits,
            resetMonthlyUsage,
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
