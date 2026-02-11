import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

const PlanUpgradeCard = ({ plan, isCurrent, isTerminated, onSelect }) => {
    const { cartItems } = useCart();
    const isFlagship = plan.isFlagship;
    const isInCart = cartItems.some(item => item.id === plan.id);

    return (
        <div className={`
            p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col h-full
            ${isCurrent
                ? 'bg-blue-50/20 border-blue-100'
                : isFlagship
                    ? 'bg-white border-gray-900 shadow-xl shadow-gray-200/20 hover:border-black'
                    : isTerminated
                        ? 'bg-gray-50 border-gray-100'
                        : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-lg'}
            group
        `}>
            {isFlagship && !isCurrent && (
                <div className="absolute top-0 right-0 py-1.5 px-4 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg z-10 transition-transform group-hover:scale-105">
                    Recommended
                </div>
            )}

            <div className={`${isFlagship ? 'flex flex-col lg:flex-row gap-8 items-start' : 'flex flex-col h-full'}`}>
                <div className={`${isFlagship ? 'lg:w-1/2' : 'w-full'}`}>
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isFlagship ? 'bg-gray-900 shadow-lg shadow-gray-900/10' : 'bg-gray-50 text-gray-900'}`}>
                                {plan.icon ? <plan.icon className={`w-5 h-5 ${isFlagship ? 'text-white' : 'text-gray-900'}`} /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-gray-900 tracking-tight">{plan.name}</h3>
                                {isTerminated && (
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inactive</p>
                                )}
                                {isFlagship && <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Enterprise Suite</p>}
                            </div>
                        </div>

                        <div className="flex items-baseline gap-1.5 mb-4">
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{plan.price.toLocaleString()}</span>
                            <span className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">/ Month</span>
                        </div>

                        {isFlagship && (
                            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                                Fully integrated marketing machine with dedicated resource allocation.
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isCurrent}
                        onClick={onSelect}
                        className={`
                            w-full px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2
                            ${isCurrent
                                ? 'bg-blue-50 text-blue-700 border border-blue-100 cursor-default shadow-none'
                                : isInCart
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : isFlagship
                                        ? 'bg-gray-900 text-white hover:bg-black'
                                        : isTerminated
                                            ? 'bg-gray-900 text-white hover:bg-black'
                                            : 'bg-white text-gray-900 border border-gray-100 hover:bg-gray-50'}
                        `}
                    >
                        {isCurrent ? (
                            <>
                                <Check className="w-3.5 h-3.5" /> Active Core
                            </>
                        ) : isInCart ? (
                            <>
                                <Check className="w-3.5 h-3.5" /> In Cart
                            </>
                        ) : isTerminated ? (
                            <>
                                <ArrowUpRight className="w-3.5 h-3.5" /> Reactivate
                            </>
                        ) : (
                            <>
                                {isFlagship ? 'Activate 360' : 'Select'}
                                <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${!isCurrent && !isInCart ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''}`} />
                            </>
                        )}
                    </button>
                </div>

                <div className={`${isFlagship ? 'lg:w-1/2 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 h-full flex flex-col' : 'mt-6 pt-5 border-t border-gray-50 flex-1'}`}>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Core Benefits</p>
                    <ul className={`space-y-3 ${isFlagship ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 space-y-0' : ''}`}>
                        {(isFlagship ? plan.features : plan.features.slice(0, 3)).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600 font-bold leading-tight">
                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isFlagship ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                    <Check className={`w-2 h-2 ${isFlagship ? 'text-white' : 'text-gray-900'}`} />
                                </div>
                                <span className="group-hover:text-gray-900 transition-colors line-clamp-1 font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {isFlagship && (
                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Priority Ops</span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400">&lt;15m</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanUpgradeCard;
