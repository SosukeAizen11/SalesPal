import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../commerce/SubscriptionContext';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

const ModuleAccessWrapper = ({ moduleName, children, title = 'Module Locked' }) => {
    const { isModuleActive, loading } = useSubscription();
    const navigate = useNavigate();

    // Mapping for friendlier display names if needed
    const moduleDisplayNames = {
        marketing: 'Marketing',
        sales: 'Sales Plan',
        postSale: 'Post-Sales Plan',
        support: 'Support Plan',
    };

    const displayName = moduleDisplayNames[moduleName] || moduleName || 'Plan';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Check if user has the active module
    const hasAccess = isModuleActive(moduleName);

    if (hasAccess) {
        return children;
    }

    // Locked UI
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-50/50 p-6 animate-fade-in-up">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                    <Lock className="w-8 h-8 text-gray-400" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {displayName} Locked
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    You do not have an active subscription for this plan.
                    Unlock powerful features to supercharge your workflow.
                </p>

                <div className="space-y-4">
                    <Button
                        onClick={() => {
                            // Navigate to pricing section on homepage
                            // Using window.location.href because pricing might be on a different layout/page 
                            // that requires a full reload or hash navigation from root
                            window.location.href = '/#pricing';
                        }}
                        className="w-full justify-center py-3"
                    >
                        View Plans & Pricing
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <button
                        onClick={() => navigate('/contact')}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Contact Sales
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Enterprise-grade security included</span>
                </div>
            </div>
        </div>
    );
};

export default ModuleAccessWrapper;
