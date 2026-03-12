import React, { createContext, useContext, useState, useEffect } from 'react';

const PostSalesContext = createContext();

const pad = (n) => String(n).padStart(2, '0');
const today = new Date();
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 4);
const nextWeekStr = `${nextWeek.getFullYear()}-${pad(nextWeek.getMonth() + 1)}-${pad(nextWeek.getDate())}`;

const DEMO_CUSTOMERS = [
    {
        id: 'c-001',
        name: 'Amit Sharma',
        phone: '+91 98765 43210',
        totalDue: 32000,
        remaining: 20000,
        dueDate: nextWeekStr,
        status: 'Upcoming',
        lastContact: '2025-10-10'
    },
    {
        id: 'c-002',
        name: 'Priya Patel',
        phone: '+91 98765 43211',
        totalDue: 124500,
        remaining: 124500,
        dueDate: todayStr,
        status: 'Due Today',
        lastContact: '2025-10-12'
    },
    {
        id: 'c-003',
        name: 'Rahul Kumar',
        phone: '+91 98765 43212',
        totalDue: 45000,
        remaining: 0,
        dueDate: '2025-10-10',
        status: 'pending',
        lastContact: '2025-10-14'
    },
    {
        id: 'c-004',
        name: 'Neha Gupta',
        phone: '+91 98765 43213',
        totalDue: 85000,
        remaining: 85000,
        dueDate: nextWeekStr,
        status: 'Upcoming',
        lastContact: '2025-10-08'
    },
    {
        id: 'c-005',
        name: 'Vikram Singh',
        phone: '+91 98765 43214',
        totalDue: 60000,
        remaining: 0,
        dueDate: '2025-10-05',
        status: 'pending',
        lastContact: '2025-10-13'
    }
];

const DEMO_AUTOMATIONS = [
    { id: 'auto-1', customerId: 'c-001', trigger: 'payment_due_date', action: 'send_whatsapp', condition: '1_day_before', active: true },
];

const DEMO_PAYMENTS = [
    { id: 'p-001', customerId: 'c-003', amount: 45000, paymentDate: todayStr },
    { id: 'p-002', customerId: 'c-005', amount: 60000, paymentDate: todayStr }
];

const DEMO_FOLLOWUPS = [
    { id: 'f-001', customerId: 'c-001', date: todayStr, notes: 'Called regarding payment' }
];

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

    const [customers, setCustomersState] = useState(() => loadState('salespal_postsales_customers', DEMO_CUSTOMERS));
    const [automations, setAutomationsState] = useState(() => loadState('salespal_postsales_automations', DEMO_AUTOMATIONS));
    const [payments, setPaymentsState] = useState(() => loadState('salespal_postsales_payments', DEMO_PAYMENTS));
    const [followUps, setFollowUpsState] = useState(() => loadState('salespal_postsales_followups', DEMO_FOLLOWUPS));

    useEffect(() => saveState('salespal_postsales_customers', customers), [customers]);
    useEffect(() => saveState('salespal_postsales_automations', automations), [automations]);
    useEffect(() => saveState('salespal_postsales_payments', payments), [payments]);
    useEffect(() => saveState('salespal_postsales_followups', followUps), [followUps]);

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
            followUps, addFollowUp
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
