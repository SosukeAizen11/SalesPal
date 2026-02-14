import React from 'react';
import { useSubscription } from '../../commerce/SubscriptionContext';
import { MODULES } from '../../commerce/commerce.config';
import { CheckCircle, XCircle, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

const SubscriptionPage = () => {
    const { subscriptions, deactivateSubscription, isModuleActive } = useSubscription();
    const { addToast } = useToast();

    const handleCancel = (moduleId, moduleName) => {
        if (window.confirm(`Are you sure you want to cancel your ${moduleName} subscription?`)) {
            deactivateSubscription(moduleId);
            addToast(`Subscription for ${moduleName} cancelled successfully.`, 'success');
        }
    };

    const handlePurchase = () => {
        window.location.href = '/#pricing';
    };

    const modulesList = [
        { key: 'marketing', label: 'Marketing' },
        { key: 'sales', label: 'Sales Plan' },
        { key: 'postSale', label: 'Post-Sales Plan' },
        { key: 'support', label: 'Support Plan' }
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
                <p className="text-gray-500 mt-1">Manage your active plans and billing status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modulesList.map((mod) => {
                    const isActive = isModuleActive(mod.key);
                    const subData = subscriptions[mod.key];
                    const config = MODULES[mod.key] || {};

                    // Format renewal date if available
                    const renewalDate = subData?.renewalDate
                        ? new Date(subData.renewalDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        : null;

                    return (
                        <div
                            key={mod.key}
                            className={`bg-white rounded-lg border ${isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50/50'} p-6 shadow-sm transition-shadow hover:shadow-md`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{mod.label}</h3>
                                    <div className="flex items-center mt-2">
                                        {isActive ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                <XCircle className="w-3 h-3 mr-1" />
                                                Not Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`p-2 rounded-full ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <CreditCard className="w-5 h-5" />
                                </div>
                            </div>

                            {isActive ? (
                                <div className="space-y-4">
                                    {renewalDate && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            <span>Renews on <span className="font-medium text-gray-900">{renewalDate}</span></span>
                                        </div>
                                    )}

                                    {/* Usage Summary (If available in context/config) */}
                                    {config.limits && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Monthly Usage</p>
                                            <div className="space-y-2">
                                                {Object.entries(config.limits).map(([limitKey, limitVal]) => {
                                                    const used = subData?.usage?.[limitKey] || 0;
                                                    const percentage = Math.min(100, Math.round((used / limitVal) * 100));

                                                    return (
                                                        <div key={limitKey}>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="capitalize">{limitKey}</span>
                                                                <span className="text-gray-500">{used} / {limitVal}</span>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                                <div
                                                                    className={`h-1.5 rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 mt-auto">
                                        <Button
                                            variant="outline"
                                            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 justify-center"
                                            onClick={() => handleCancel(mod.key, mod.label)}
                                        >
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">
                                        Subscribe to unlock features and supercharge your workflow with our {mod.label}.
                                    </p>
                                    <div className="pt-4">
                                        <Button
                                            className="w-full justify-center"
                                            onClick={handlePurchase}
                                        >
                                            Purchase Plan
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-medium text-blue-900">Need help with your billing?</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        If you have questions about charges or need to update your payment method,
                        please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
