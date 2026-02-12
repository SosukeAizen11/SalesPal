import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, TrendingUp, HeartHandshake, MessageSquare, Zap, CreditCard, ChevronRight } from 'lucide-react';
import AppHeader from '../../components/layout/AppHeader';

import { useSubscription } from '../../commerce/SubscriptionContext';

const ModuleGateway = () => {
    const navigate = useNavigate();
    const { isModuleActive, subscriptions } = useSubscription();

    const modules = [
        {
            id: 'marketing',
            name: 'Marketing',
            description: 'AI-driven campaigns & content generation',
            icon: LayoutGrid,
            path: '/marketing',
            productPath: '/products/marketing'
        },
        {
            id: 'sales',
            name: 'Sales',
            description: 'Lead scoring & pipeline management',
            icon: TrendingUp,
            path: '/console/sales',
            productPath: '/products/sales'
        },
        {
            id: 'postSale', // Changed from 'post-sale' to match config ID
            name: 'Post-Sales',
            description: 'Customer onboarding & retention',
            icon: HeartHandshake,
            path: '/console/post-sales',
            productPath: '/products/post-sale'
        },
        {
            id: 'support',
            name: 'Support',
            description: 'AI support tickets & resolution',
            icon: MessageSquare,
            path: '/console/support',
            productPath: '/products/support'
        }
    ];

    // Helper to get ANY active subscription for display
    const getActivePlan = () => {
        const activeModuleId = modules.find(m => isModuleActive(m.id))?.id;
        if (activeModuleId) {
            return {
                name: modules.find(m => m.id === activeModuleId).name,
                renewalDate: subscriptions[activeModuleId]?.renewalDate ? new Date(subscriptions[activeModuleId].renewalDate).toLocaleDateString() : 'N/A',
                usage: 45 // Mock for now until usage logic is granular
            };
        }
        return null;
    };

    const activePlan = getActivePlan();
    const hasActiveSubscription = !!activePlan;

    const handleModuleClick = (module) => {
        if (isModuleActive(module.id)) {
            navigate(module.path);
        } else {
            navigate(module.productPath);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppHeader />

            <main className="flex-1 w-full max-w-[1100px] mx-auto px-8 pt-10 pb-12">

                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Select a Module</h1>
                    <p className="mt-1 text-sm text-gray-500">Choose a module to continue</p>
                </div>

                {/* Active Plan Summary */}
                <div className="mb-8 bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${hasActiveSubscription ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                            {hasActiveSubscription ? <Zap className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Plan</p>
                            <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
                                {hasActiveSubscription ? (activePlan.name || 'SalesPal Subscription') : 'No Active Subscription'}
                            </h2>
                        </div>
                    </div>

                    {hasActiveSubscription ? (
                        <div className="flex items-center gap-6 text-sm">
                            {activePlan.usage !== undefined && (
                                <div className="text-right">
                                    <span className="block text-gray-500 text-xs">Credits</span>
                                    <span className="font-medium text-gray-900">{activePlan.usage}% Used</span>
                                </div>
                            )}
                            {activePlan.renewalDate && (
                                <div className="text-right border-l border-gray-100 pl-6">
                                    <span className="block text-gray-500 text-xs">Renews</span>
                                    <span className="font-medium text-gray-900">{activePlan.renewalDate}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/products/marketing')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                        >
                            View Plans <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Module Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules.map((module) => {
                        const isActive = isModuleActive(module.id);
                        const isMarketing = module.id === 'marketing';
                        const Icon = module.icon;

                        // Enhanced styling for active marketing module
                        const isPrimaryActive = isMarketing && isActive;
                        const cardClasses = `
                            bg-white border rounded-lg p-6 flex flex-col h-full transition-all duration-200
                            ${isPrimaryActive
                                ? 'border-blue-100 shadow-md ring-1 ring-blue-50/50'
                                : 'border-gray-200 shadow-sm hover:shadow-md'}
                        `;

                        return (
                            <div key={module.id} className={cardClasses}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${isActive
                                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}>
                                            {isActive ? 'Active' : 'Not Subscribed'}
                                        </span>
                                        {isPrimaryActive && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600/80">
                                                Primary Module
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-5 flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {module.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {module.description}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleModuleClick(module)}
                                        className={`w-full h-10 px-4 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${isActive
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200'
                                            }`}
                                    >
                                        {isActive ? 'Open Module' : 'View Plan'}
                                    </button>
                                    {!isActive && (
                                        <p className="mt-2 text-center text-xs text-muted-foreground text-gray-400">
                                            Upgrade your plan to unlock.
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default ModuleGateway;
