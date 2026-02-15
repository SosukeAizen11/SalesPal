import React from 'react';
import { useSubscription } from '../../commerce/SubscriptionContext';
import { MODULES } from '../../commerce/commerce.config';
import { Megaphone, Phone, UserCheck, Headphones, ExternalLink, Sparkles, Layers } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import PlanCard from '../../components/subscription/PlanCard';
import { motion } from 'framer-motion';

const SubscriptionPage = () => {
    const {
        subscriptions,
        deactivateSubscription,
        pauseSubscription,
        resumeSubscription,
        isModuleActive
    } = useSubscription();
    const { addToast } = useToast();

    // Map keys to Icons and Colors
    const MODULE_CONFIG = {
        marketing: { icon: Megaphone, color: 'blue' },
        sales: { icon: Phone, color: 'green' },
        postSale: { icon: UserCheck, color: 'purple' }, // "UserCheck" as requested
        support: { icon: Headphones, color: 'orange' }, // "Headphones" as requested
        salespal360: { icon: Layers, color: 'indigo' } // "Layers" as requested
    };

    const handleCancel = (moduleId, moduleName) => {
        deactivateSubscription(moduleId);
        // Toast is handled by the interaction usually, but let's confirm here
        addToast(`Subscription for ${moduleName} cancelled. Access remains until end of cycle.`, 'info');
    };

    const handlePause = (moduleId, months) => {
        pauseSubscription(moduleId, months);
        addToast('Subscription paused successfully.', 'success');
    };

    const handleResume = (moduleId) => {
        resumeSubscription(moduleId); // Works for re-subscribing too if logic allows
        addToast('Subscription resumed.', 'success');
    };

    const handlePurchase = () => {
        window.location.href = '/#pricing';
    };

    const modulesList = [
        { key: 'marketing', label: 'Marketing Plan' },
        { key: 'sales', label: 'Sales Plan' },
        { key: 'postSale', label: 'Post-Sales Plan' },
        { key: 'support', label: 'Support Plan' },
        { key: 'salespal360', label: 'SalesPal 360' }
    ];

    // Calculate active count for Upsell logic
    const is360Active = isModuleActive('salespal360');
    // Only count individual modules, not the bundle itself
    const activeCount = modulesList.filter(m => m.key !== 'salespal360' && isModuleActive(m.key)).length;

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-900 tracking-tight"
                    >
                        Subscription Management
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 mt-2 text-lg"
                    >
                        Manage your active plans, usage, and billing status.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button variant="outline" className="text-gray-600 border-gray-300 hover:border-gray-400">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Billing Portal
                    </Button>
                </motion.div>
            </div>

            {/* SalesPal 360 Upsell Banner */}
            {activeCount >= 2 && !is360Active && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Sparkles className="w-8 h-8 text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Upgrade to SalesPal 360</h3>
                                <p className="text-indigo-100 max-w-xl leading-relaxed">
                                    You have multiple active plans. Consolidate them into SalesPal 360 to get all modules,
                                    unified billing, and exclusive premium features at a better rate.
                                </p>
                            </div>
                        </div>
                        <Button
                            className="bg-white text-indigo-600 hover:bg-indigo-50 border-transparent font-semibold shadow-lg whitespace-nowrap"
                            onClick={() => window.location.href = '/#pricing'}
                        >
                            View SalesPal 360
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 mb-12">
                {modulesList.map((mod, index) => {
                    const subData = subscriptions[mod.key];
                    const config = MODULES[mod.key] || {};
                    const { icon: Icon, color } = MODULE_CONFIG[mod.key] || { icon: Layers, color: 'gray' };

                    return (
                        <div key={mod.key} style={{ animationDelay: `${index * 100}ms` }}>
                            <PlanCard
                                moduleKey={mod.key}
                                label={mod.label}
                                subData={subData}
                                config={config}
                                icon={Icon}
                                color={color}
                                onPause={months => handlePause(mod.key, months)}
                                onResume={() => handleResume(mod.key)}
                                onCancel={() => handleCancel(mod.key, mod.label)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Support Note */}
            <div className="mt-12 text-center border-t border-gray-100 pt-8">
                <p className="text-sm text-gray-500">
                    Need help with your invoice? <a href="#" className="text-blue-600 font-medium hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
};

export default SubscriptionPage;
