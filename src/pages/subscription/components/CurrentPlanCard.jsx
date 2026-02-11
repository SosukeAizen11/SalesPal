import React from 'react';
import { CheckCircle2, AlertTriangle, Calendar, Clock, BarChart3, AlertOctagon } from 'lucide-react';
import { PLANS } from '../../../data/billing';
import { useCart } from '../../../context/CartContext';

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
    const { terminatePlan } = useCart();
    const plan = PLANS.find(p => p.id === (subscription?.id || 'marketing')) || PLANS[0];
    const status = subscription?.status || 'active';
    const renewalDate = subscription?.renewalDate || 'Feb 28, 2026';
    const daysLeft = subscription?.daysLeft;

    const getStatusBadge = () => {
        switch (status) {
            case 'trial': return { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', text: 'Free Trial', icon: Clock };
            case 'expiring_soon': return { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Expiring Soon', icon: AlertTriangle };
            case 'expired': return { color: 'bg-red-100 text-red-700 border-red-200', text: 'Subscription Over', icon: AlertOctagon };
            case 'terminated': return { color: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Terminated', icon: AlertTriangle };
            default: return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Active Module', icon: CheckCircle2 };
        }
    };

    const badge = getStatusBadge();
    const BadgeIcon = badge.icon;

    const [showConfirm, setShowConfirm] = React.useState(false);

    const handleCancel = () => {
        terminatePlan(plan.id);
        setShowConfirm(false);
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden transition-all hover:shadow-md">

            {/* Cancellation Confirmation Backdrop */}
            {showConfirm && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 animate-fade-in flex items-center justify-center p-6 text-center">
                    <div className="max-w-sm">
                        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Terminate {plan.name}?</h4>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Your subscription will remain <span className="text-gray-900 font-bold">active until {renewalDate}</span>.
                            After that, you will lose access to premium resources and no further charges will occur.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl text-sm hover:bg-gray-200 transition-all"
                            >
                                Stay Protected
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Renewal Banner */}
            {daysLeft !== undefined && daysLeft <= 7 && status !== 'expired' && status !== 'terminated' && (
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
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border flex items-center gap-1.5 ${badge.color}`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.text}
                        </span>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{plan.name}</h3>
                    </div>
                    <p className="text-gray-500 text-sm">
                        {status === 'cancelled' ? 'Service ends on: ' : 'Renewal cycle date: '}
                        <span className="text-gray-900 font-bold">{renewalDate}</span>
                    </p>
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-500 font-medium text-sm">/ month</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onManage}
                        className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
                    >
                        Manage Subscription
                    </button>
                    {status !== 'terminated' && status !== 'expired' && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-6 py-3 text-red-600 text-sm font-bold hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                        >
                            Terminate
                        </button>
                    )}
                </div>
            </div>

            {/* Right: Usage Stats */}
            <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-5 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" /> Current Usage
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                        Monthly Cycle
                    </span>
                </div>

                <UsageBar label="AI Calling Minutes" used={450} total={1000} unit="mins" colorClass="bg-indigo-500" />
                <UsageBar label="WhatsApp Conversations" used={120} total={500} unit="convs" colorClass="bg-emerald-500" />
                <UsageBar label="AI Generated Images" used={34} total={50} unit="imgs" colorClass="bg-amber-500" />
            </div>
        </div>
    );
};

export default CurrentPlanCard;
