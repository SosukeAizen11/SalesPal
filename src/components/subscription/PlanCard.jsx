import React, { useState } from 'react';
import { CheckCircle, XCircle, Calendar, PauseCircle, PlayCircle, AlertCircle, CreditCard, ChevronRight, RefreshCw, X } from 'lucide-react';
import Button from '../ui/Button';
import UsageProgress from './UsageProgress';
import { PauseSubscriptionModal, CancelSubscriptionModal } from './ActionModals';
import { motion } from 'framer-motion';

const PlanCard = ({ moduleKey, label, subData, config, onPause, onResume, onCancel, icon: Icon, color }) => {
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const isActive = subData?.status === 'active';
    const isPaused = subData?.status === 'paused';
    const isCancelled = subData?.status === 'cancelled';

    // Determine visual state
    const isVisuallyActive = isActive || isCancelled;
    const isInactive = !subData || (!isActive && !isPaused && !isCancelled);

    // Format renewal date
    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renewalDate = formatDate(subData?.renewalDate);
    const pausedUntilDate = formatDate(subData?.pausedUntil);
    const cancellationDate = formatDate(subData?.cancellationDate);

    // Status Badge Component
    const StatusBadge = () => {
        if (isActive) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                    <CheckCircle className="w-3 h-3 mr-1.5" />
                    Active
                </span>
            );
        }
        if (isPaused) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                    <PauseCircle className="w-3 h-3 mr-1.5" />
                    Paused
                </span>
            );
        }
        if (isCancelled) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                    <XCircle className="w-3 h-3 mr-1.5" />
                    Cancelled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-400 border border-gray-200">
                <CreditCard className="w-3 h-3 mr-1.5" />
                Not Active
            </span>
        );
    };

    // Helper for color classes
    const getColorClasses = (colorName) => {
        const colors = {
            blue: 'bg-blue-500 shadow-blue-200',
            green: 'bg-emerald-500 shadow-emerald-200',
            purple: 'bg-purple-500 shadow-purple-200',
            orange: 'bg-orange-500 shadow-orange-200',
            indigo: 'bg-indigo-600 shadow-indigo-200',
            gray: 'bg-gray-500 shadow-gray-200'
        };
        return colors[colorName] || 'bg-gray-900 shadow-gray-200';
    };

    const iconBgClass = isActive || isPaused || isCancelled ? getColorClasses(color) : 'bg-gray-200';

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`
                    relative bg-white rounded-2xl border flex flex-col h-full overflow-hidden
                    transition-all duration-300 ease-in-out group hover:shadow-xl hover:-translate-y-1
                    ${isVisuallyActive ? 'border-gray-200 shadow-sm' : 'border-gray-100 bg-gray-50/50'}
                `}
            >
                <div className="p-6 flex-1 flex flex-col relative z-10">
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            {Icon && (
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${iconBgClass} transition-colors duration-300`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <div>
                                <h3 className={`text-lg font-bold ${isInactive ? 'text-gray-500' : 'text-gray-900'} leading-tight mb-1.5`}>{label}</h3>
                                <StatusBadge />
                            </div>
                        </div>
                    </div>

                    {/* Billing Info Row */}
                    {!isInactive && (
                        <div className="flex items-center justify-between text-sm py-4 border-t border-b border-gray-50 mb-6 bg-gray-50/30 -mx-6 px-6">
                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {isPaused ? (
                                    <span>Paused until <span className="text-gray-900">{pausedUntilDate || 'Resumed'}</span></span>
                                ) : isCancelled ? (
                                    <span>Access until <span className="text-gray-900">{cancellationDate || renewalDate}</span></span>
                                ) : (
                                    <span>Renews on <span className="text-gray-900">{renewalDate}</span></span>
                                )}
                            </div>
                            <div className="font-bold text-gray-900 flex items-center">
                                {subData?.price ? `₹${subData.price.toLocaleString()}` : '₹9,999'}<span className="text-gray-400 font-normal text-xs ml-0.5">/mo</span>
                            </div>
                        </div>
                    )}

                    {/* Usage Section (Active Plans Only) */}
                    {isActive && config?.limits && (
                        <div className="mb-6 space-y-5">
                            {Object.entries(config.limits).map(([limitKey, limitVal]) => {
                                const used = subData?.usage?.[limitKey] || 0;
                                return (
                                    <UsageProgress
                                        key={limitKey}
                                        label={limitKey}
                                        used={used}
                                        limit={limitVal}
                                        color={color || 'blue'}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Paused State Placeholder */}
                    {isPaused && (
                        <div className="mb-6 py-6 text-center rounded-xl bg-amber-50 mx-2 border border-amber-100 border-dashed">
                            <div className="inline-flex p-2 bg-white rounded-full shadow-sm mb-2">
                                <PauseCircle className="w-5 h-5 text-amber-500" />
                            </div>
                            <h4 className="text-amber-900 font-semibold text-sm mb-1">Subscription Paused</h4>
                            <p className="text-xs text-amber-700/80 px-4">Billing is paused. Resume to access features.</p>
                        </div>
                    )}

                    {/* Cancelled State Placeholder */}
                    {isCancelled && (
                        <div className="mb-6 py-4 px-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Cancellation Scheduled</p>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        You still have access until the end of the billing cycle. Reactivate anytime to keep your data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inactive State Description */}
                    {isInactive && (
                        <div className="mb-6 space-y-4">
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Unlock powerful features to supercharge your workflow.
                                Get started today with our flexible plans.
                            </p>
                            <div className="h-1 w-1/3 bg-gray-100 rounded-full"></div>
                        </div>
                    )}

                    {/* Actions Row */}
                    <div className="mt-auto pt-2">
                        {isActive && (
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="justify-center text-gray-700 font-medium hover:text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                    onClick={() => setShowPauseModal(true)}
                                >
                                    <PauseCircle className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600" />
                                    Pause
                                </Button>
                                <Button
                                    variant="outline"
                                    className="justify-center text-red-600 font-medium border-red-100 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                                    onClick={() => setShowCancelModal(true)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}

                        {isPaused && (
                            <Button
                                className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-md transition-all transform hover:-translate-y-0.5"
                                onClick={onResume}
                            >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Resume Subscription
                            </Button>
                        )}

                        {isCancelled && (
                            <Button
                                variant="outline"
                                className="w-full justify-center text-blue-600 font-medium border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 shadow-sm transition-all"
                                onClick={onResume} // Re-activate logic (same as resume usually, or distinct handler)
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Re-Subscribe
                            </Button>
                        )}

                        {isInactive && (
                            <Button
                                className="w-full justify-center bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-0.5"
                                onClick={() => window.location.href = '/#pricing'}
                            >
                                Purchase Plan <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Modals */}
            <PauseSubscriptionModal
                isOpen={showPauseModal}
                onClose={() => setShowPauseModal(false)}
                onConfirm={(months) => {
                    setShowPauseModal(false);
                    onPause(months);
                }}
                planName={label}
                renewalDate={subData?.renewalDate}
            />

            <CancelSubscriptionModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => {
                    setShowCancelModal(false);
                    onCancel();
                }}
                planName={label}
                renewalDate={subData?.renewalDate}
            />
        </>
    );
};

export default PlanCard;
