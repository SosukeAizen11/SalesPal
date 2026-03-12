import React, { createContext, useContext, useState, useEffect } from 'react';

const PostSalesContext = createContext();

const pad = (n) => String(n).padStart(2, '0');
const today = new Date();
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 4);
const nextWeekStr = `${nextWeek.getFullYear()}-${pad(nextWeek.getMonth() + 1)}-${pad(nextWeek.getDate())}`;

export const PostSalesProvider = ({ children }) => {
    const loadState = (key, defaultState) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultState;
        } catch (e) {
            console.warn(`Error loading ${key} from localStorage`, e);
            return defaultState;
        }
    };

    const saveState = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`Error saving ${key} to localStorage`, e);
        }
    };

    const [customers, setCustomersState] = useState(() => loadState('salespal_postsales_customers', []));
    const [automations, setAutomationsState] = useState(() => loadState('salespal_postsales_automations', []));
    const [payments, setPaymentsState] = useState(() => loadState('salespal_postsales_payments', []));
    const [followUps, setFollowUpsState] = useState(() => loadState('salespal_postsales_followups', []));

    // Adding missing state variables to prevent crashes on Analytics and Onboarding pages
    const [documents, setDocumentsState] = useState(() => loadState('salespal_postsales_documents', []));
    const [onboardingFlows, setOnboardingFlowsState] = useState(() => loadState('salespal_postsales_onboarding', {}));

    useEffect(() => saveState('salespal_postsales_customers', customers), [customers]);
    useEffect(() => saveState('salespal_postsales_automations', automations), [automations]);
    useEffect(() => saveState('salespal_postsales_payments', payments), [payments]);
    useEffect(() => saveState('salespal_postsales_followups', followUps), [followUps]);
    useEffect(() => saveState('salespal_postsales_documents', documents), [documents]);
    useEffect(() => saveState('salespal_postsales_onboarding', onboardingFlows), [onboardingFlows]);

    const addCustomer = (customer) => {
        setCustomersState(prev => [{ ...customer, id: `c-${Date.now()}`, lastContact: new Date().toISOString().split('T')[0] }, ...prev]);
    };

    const updateCustomer = (id, updates) => {
        setCustomersState(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCustomer = (id) => {
        setCustomersState(prev => prev.filter(c => c.id !== id));
    };

    const getCustomer = (id) => customers.find(c => c.id === id);

    const toggleAutomation = (id) => {
        setAutomationsState(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    const addAutomation = (automation) => {
        setAutomationsState(prev => [{ ...automation, id: `auto-${Date.now()}`, active: true }, ...prev]);
    };

    const updateAutomation = (id, updates) => {
        setAutomationsState(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const getCustomerAutomations = (customerId) => automations.filter(a => a.customerId === customerId);

    const addPayment = (payment) => {
        setPaymentsState(prev => [{ ...payment, id: `p-${Date.now()}` }, ...prev]);
    };

    const addFollowUp = (followUp) => {
        setFollowUpsState(prev => [{ ...followUp, id: `f-${Date.now()}` }, ...prev]);
    };

    return (
        <PostSalesContext.Provider value={{
            customers, addCustomer, updateCustomer, deleteCustomer, getCustomer,
            automations, toggleAutomation, addAutomation, updateAutomation, getCustomerAutomations,
            payments, addPayment,
            followUps, addFollowUp,
            documents, onboardingFlows
        }}>
            {children}
        </PostSalesContext.Provider>
    );
};

export const usePostSales = () => {
    const context = useContext(PostSalesContext);
    if (!context) {
        throw new Error("usePostSales must be used within a PostSalesProvider");
    }
    return context;
};
