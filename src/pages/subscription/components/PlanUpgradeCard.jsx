import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

const PlanUpgradeCard = ({ plan, currentTier, isCurrent, isTerminated, onSelect }) => {
    const { cartItems } = useCart();
    const isFlagship = plan.isFlagship;
    const isInCart = cartItems.some(item => item.id === plan.id);

    return (
        <div className={`
            p-6 rounded-[24px] border transition-all relative overflow-hidden flex flex-col h-full
            ${isCurrent
                ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                : isFlagship
                    ? 'bg-white border-blue-400 shadow-[0_10px_40px_rgba(59,130,246,0.1)] border-opacity-40 hover:border-blue-500'
                    : isTerminated
                        ? 'bg-orange-50/30 border-orange-200 hover:border-orange-300'
                        : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5'}
        `}>
            {isFlagship && !isCurrent && (
                <div className="absolute top-0 right-0 py-1.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-sm z-10">
                    Flagship Suite
                </div>
            )}

            {plan.isBestValue && !isCurrent && !isFlagship && (
                <div className="absolute top-0 right-0 py-1.5 px-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-sm z-10">
                    Most Popular
                </div>
            )}

            <div className={`${isFlagship ? 'flex flex-col md:flex-row gap-8 items-start' : ''}`}>
                <div className={`${isFlagship ? 'md:w-1/2' : 'w-full'}`}>
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isFlagship ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30' :
                                    plan.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                        plan.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                                            plan.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                                                'bg-amber-50 text-amber-600'
                                }`}>
                                {plan.icon ? <plan.icon className={`w-6 h-6 ${isFlagship ? 'text-white' : ''}`} /> : <ArrowUpRight className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-black text-lg ${isFlagship ? 'text-gray-900 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent' : 'text-gray-900'}`}>{plan.name}</h3>
                                {isTerminated && (
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">Inactive / Terminated</p>
                                )}
                                {isFlagship && <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Enterprise Revenue Engine</p>}
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className={`text-3xl font-black ${isFlagship ? 'text-blue-600' : 'text-gray-900'}`}>₹{plan.price.toLocaleString()}</span>
                            <span className="text-gray-500 text-xs font-medium">/ month</span>
                        </div>

                        {isFlagship && (
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                                The ultimate SalesPal experience. Everything integrated into one high-performance dashboard with platinum support.
                            </p>
                        )}
                    </div>

                    {isTerminated && (
                        <p className="text-[10px] text-gray-500 mb-6 bg-gray-50 p-3 rounded-xl italic border border-gray-100">
                            This plan was terminated. You can reactivate or repurchase it anytime.
                        </p>
                    )}

                    <button
                        disabled={isCurrent}
                        onClick={onSelect}
                        className={`
                            w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2
                            ${isCurrent
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                                : isInCart
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100 cursor-default shadow-sm'
                                    : isFlagship
                                        ? 'bg-blue-600 text-white hover:bg-black shadow-xl shadow-blue-500/20 active:scale-95'
                                        : isTerminated
                                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-100'
                                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-200 active:scale-95'}
                        `}
                    >
                        {isCurrent ? (
                            <>
                                <Check className="w-4 h-4" /> Active Module
                            </>
                        ) : isInCart ? (
                            <>
                                <Check className="w-4 h-4" /> Added to Cart
                            </>
                        ) : isTerminated ? (
                            <>
                                <ArrowUpRight className="w-4 h-4" /> Buy Again
                            </>
                        ) : (
                            <>
                                {isFlagship ? 'Get Started 360' : 'Select Module'}
                                <ArrowUpRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>

                <div className={`${isFlagship ? 'md:w-1/2 bg-gray-50/50 p-6 rounded-3xl border border-gray-100' : 'mt-8'}`}>
                    <ul className={`space-y-3 flex-1 ${isFlagship ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 space-y-0' : ''}`}>
                        {(isFlagship ? plan.features : plan.features.slice(0, 3)).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 font-bold leading-tight">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isFlagship ? 'bg-blue-600 shadow-sm shadow-blue-500/20' : 'bg-emerald-50'}`}>
                                    <Check className={`w-2.5 h-2.5 ${isFlagship ? 'text-white' : 'text-emerald-600'}`} />
                                </div>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {isFlagship && (
                        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Enterprise Priority</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">Response &lt;15m</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanUpgradeCard;
