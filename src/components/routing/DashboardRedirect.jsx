import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../../commerce/SubscriptionContext';

const DashboardRedirect = () => {
    const { subscriptions, loading } = useSubscription();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
            </div>
        );
    }

    const activeModules = Object.values(subscriptions || {})
        .filter(sub => sub.active)
        .map(sub => sub.module);

    if (activeModules.includes('marketing')) {
        return <Navigate to="/marketing/dashboard" replace />;
    }
    if (activeModules.includes('sales')) {
        return <Navigate to="/sales/dashboard" replace />;
    }
    if (activeModules.includes('postSale') || activeModules.includes('post-sales')) {
        return <Navigate to="/post-sales/dashboard" replace />;
    }
    if (activeModules.includes('support')) {
        return <Navigate to="/support/dashboard" replace />;
    }

    // Fallback if no active modules
    return <Navigate to="/marketing/dashboard" replace />;
};

export default DashboardRedirect;
