import React from 'react';
import { Check, Star } from 'lucide-react';

const PlanUpgradeCard = ({ plan, isCurrent, currentTier = 1, onSelect }) => {
    const planTier = plan.tier || 1;
    const isDowngrade = !isCurrent && planTier < currentTier;

    return (
        <div className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${isCurrent
                ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
            }`}>
            {plan.isBestValue && (
                <div className="absolute top-0 right-0 -mt-3 mr-4">
                    <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Best Value
                    </span>
                </div>
            )}

            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-sm text-gray-500">/mo</span>
                </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isCurrent ? 'text-blue-600' : 'text-green-500'}`} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onSelect}
                disabled={isCurrent}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${isCurrent
                        ? 'bg-blue-100 text-blue-700 cursor-default'
                        : isDowngrade
                            ? 'bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            : plan.isBestValue
                                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                                : 'bg-white border-2 border-primary text-primary hover:bg-blue-50'
                    }`}
            >
                {isCurrent ? 'Current Plan' : isDowngrade ? 'Downgrade' : 'Upgrade Plan'}
            </button>
        </div>
    );
};

export default PlanUpgradeCard;
