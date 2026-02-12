import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Calendar, Clock, BarChart3, AlertOctagon, ArrowRight } from 'lucide-react';
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
            case 'trial': return { color: 'bg-blue-50 text-blue-700 border-blue-100', text: 'Free Trial', icon: Clock };
            case 'expiring_soon': return { color: 'bg-white text-gray-900 border-gray-200 shadow-sm', text: 'Ending Soon', icon: AlertTriangle };
            case 'expired': return { color: 'bg-gray-900 text-white border-transparent', text: 'Closed', icon: AlertOctagon };
            case 'terminated': return { color: 'bg-gray-100 text-gray-400 border-gray-200', text: 'Inactive', icon: AlertTriangle };
            default: return { color: 'bg-white text-gray-900 border-gray-200 shadow-sm', text: 'Active Plan', icon: CheckCircle2 };
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden transition-all hover:shadow-md group">

            {/* Confirmation Overlay */}
            {showConfirm && (
                <div className="absolute inset-0 bg-white/98 backdrop-blur-md z-20 animate-in fade-in flex items-center justify-center p-6 text-center">
                    <div className="max-w-sm">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-1">Pause {plan.name}?</h4>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            Your benefits stay <span className="font-bold text-gray-900">active until {renewalDate}</span>.
                            Reactivate anytime to keep your data.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="py-2.5 px-4 bg-gray-900 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                Keep Plan
                            </button>
                            <button
                                onClick={handleCancel}
                                className="py-2.5 px-4 bg-red-50 text-red-600 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Column: Plan Summary */}
            <div className="flex-1 space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${badge.color}`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.text}
                        </span>
                        {daysLeft <= 7 && status === 'active' && (
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                {daysLeft}D Left
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{plan.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {status === 'terminated' ? 'Ends' : 'Next Billing'}:
                        <span className="text-gray-900 ml-2">{renewalDate}</span>
                    </p>
                </div>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">/ Month</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50">
                    <button
                        onClick={onManage}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                    >
                        Scale Resources <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {status !== 'terminated' && status !== 'expired' && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-4 py-3 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-all"
                        >
                            Terminate
                        </button>
                    )}
                </div>
            </div>

            {/* Right Column: Usage Visualization */}
            <div className="flex-1 bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-5">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5" /> Consumption
                    </h4>
                    <Link to="/marketing/analytics" className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest">
                        Analytics
                    </Link>
                </div>

                <div className="space-y-5">
                    <UsageBar label="Calling Minutes" used={450} total={1000} unit="mins" colorClass="bg-gray-900" />
                    <UsageBar label="WhatsApp Comms" used={120} total={500} unit="convs" colorClass="bg-gray-400" />
                    <UsageBar label="AI Content" used={34} total={50} unit="units" colorClass="bg-gray-200" />
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200/50">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 italic">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Resets on {renewalDate}.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentPlanCard;
