import React from 'react';
import { CheckCircle2, AlertTriangle, Calendar, Clock, BarChart3, AlertOctagon } from 'lucide-react';

const UsageBar = ({ label, used, total, unit, colorClass = "bg-blue-600" }) => {
    const percentage = Math.min(100, Math.round((used / total) * 100));
    const isNearLimit = percentage >= 80;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-xs text-gray-500 font-medium">
                    {used} / {total} {unit}
                </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? 'bg-amber-500' : colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const CurrentPlanCard = ({ subscription, onManage }) => {
    const status = subscription?.status || 'active';
    const renewalDate = subscription?.renewalDate || 'Feb 28, 2026';
    const daysLeft = subscription?.daysLeft;

    const getStatusBadge = () => {
        switch (status) {
            case 'trial': return { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Free Trial', icon: Clock };
            case 'expiring_soon': return { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Expiring Soon', icon: AlertTriangle };
            case 'expired': return { color: 'bg-red-100 text-red-700 border-red-200', text: 'Expired', icon: AlertOctagon };
            case 'cancelled': return { color: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Cancelled', icon: AlertTriangle };
            default: return { color: 'bg-green-100 text-green-700 border-green-200', text: 'Active', icon: CheckCircle2 };
        }
    };

    const badge = getStatusBadge();
    const BadgeIcon = badge.icon;

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel your subscription? You will lose access to premium features at the end of the current billing period.")) {
            alert("Subscription cancelled.");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden">

            {/* Renewal Banner - Only if daysLeft <= 7 and active/expiring */}
            {daysLeft !== undefined && daysLeft <= 7 && status !== 'expired' && status !== 'cancelled' && (
                <div className="absolute top-0 left-0 right-0 bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        Your plan renews in {daysLeft} days.
                    </div>
                </div>
            )}

            {/* Left: Plan Details */}
            <div className="flex-1 space-y-6 pt-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border flex items-center gap-1.5 ${badge.color}`}>
                            <BadgeIcon className="w-3.5 h-3.5" />
                            {badge.text}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">SalesPal Marketing</h3>
                    </div>
                    <p className="text-gray-500">
                        {status === 'cancelled' ? 'Ends on: ' : 'Next billing date: '}
                        <span className="text-gray-900 font-medium">{renewalDate}</span>
                    </p>
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">₹5,999</span>
                    <span className="text-gray-500">/ month</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onManage}
                        className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        Manage Subscription
                    </button>
                    {status !== 'cancelled' && status !== 'expired' && (
                        <button
                            onClick={handleCancel}
                            className="px-5 py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Right: Usage Stats */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-5 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-500" /> Plan Usage
                    </h4>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        Monthly Cycle
                    </span>
                </div>

                <UsageBar label="AI Calling Minutes" used={450} total={1000} unit="mins" colorClass="bg-indigo-500" />
                <UsageBar label="WhatsApp Conversations" used={120} total={500} unit="convs" colorClass="bg-emerald-500" />
                <UsageBar label="AI Generated Images" used={34} total={50} unit="imgs" colorClass="bg-amber-500" />
                <UsageBar label="AI Video Generations" used={2} total={5} unit="vids" colorClass="bg-rose-500" />
            </div>
        </div>
    );
};

export default CurrentPlanCard;
