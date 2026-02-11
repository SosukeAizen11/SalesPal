import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowUpCircle, ShoppingCart, CreditCard, FileText, LayoutDashboard, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Check, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PLANS, TOP_UPS, FEATURES } from '../../data/billing';
import CurrentPlanCard from './components/CurrentPlanCard';
import PlanUpgradeCard from './components/PlanUpgradeCard';
import TopUpCard from './components/TopUpCard';
import PaymentModal from './components/PaymentModal';
import BillingHistoryModal from './components/BillingHistoryModal';
import RecentInvoicesCard from './components/RecentInvoicesCard';
import AnalyticsSnapshot from './components/AnalyticsSnapshot';

const SubscriptionManagement = () => {
    const { ownedProducts, addToCart, cartCount, cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    // State
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Ref for scrolling
    const upgradesRef = useRef(null);

    const activeSubscriptions = ownedProducts.filter(p => p.type === 'subscription' && p.status === 'active');

    // Check if a plan is owned (active)
    const isPlanOwned = (planId) => ownedProducts.some(p => p.id === planId && p.type === 'subscription' && p.status === 'active');

    const handleAction = (item) => {
        addToCart(item);
        // Silent add as per requirements
    };

    const handleManageSubscription = () => {
        upgradesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handlePaymentMethods = () => {
        alert("Payment Method management is coming soon.");
    };

    // Smart Recommendations Logics
    const recommendations = [];
    ownedProducts.forEach(product => {
        if (product.type === 'topup' && product.balance < 5) {
            const topup = TOP_UPS.find(t => t.id === product.id);
            recommendations.push({
                type: 'usage',
                title: `Low balance on ${topup?.name || 'credits'}.`,
                description: 'Consider topping up now to avoid interruption.',
                action: 'Top-Up',
                item: topup
            });
        }
    });

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in-up">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <LayoutDashboard className="w-5 h-5 text-gray-400" />
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Products</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Manage your individual modules, resource scaling, and billing preferences.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <FileText className="w-4 h-4 text-gray-400" /> Billing History
                    </button>
                    <button
                        onClick={handlePaymentMethods}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <CreditCard className="w-4 h-4 text-gray-400" /> Payment Methods
                    </button>
                </div>
            </div>

            {/* Smart Recommendations Banner */}
            {recommendations.length > 0 && (
                <div className="mb-10 grid gap-4">
                    {recommendations.slice(0, 1).map((rec, i) => (
                        <div key={i} className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/10 border border-white/5">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <Sparkles className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{rec.title}</h3>
                                    <p className="text-gray-300 text-sm">{rec.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAction(rec.item)}
                                className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm whitespace-nowrap shadow-lg active:scale-95"
                            >
                                {rec.action}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Main Content (Owned & Features) */}
                <div className="xl:col-span-8 space-y-12">

                    {/* SECTION 1: YOUR ACTIVE PRODUCTS */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                                Your Active Modules
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {activeSubscriptions.length > 0 ? (
                                activeSubscriptions.map(sub => (
                                    <CurrentPlanCard
                                        key={sub.id}
                                        subscription={sub}
                                        onManage={handleManageSubscription}
                                    />
                                ))
                            ) : (
                                <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                                    <p className="text-gray-500 font-medium">No active modules found. Start by selecting a plan below.</p>
                                </div>
                            )}

                            {/* Card-style list for top-ups */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ownedProducts.filter(p => p.type === 'topup').map(product => {
                                    const meta = TOP_UPS.find(t => t.id === product.id);
                                    if (!meta) return null;
                                    const Icon = meta.icon;
                                    return (
                                        <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Icon className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{meta.name}</h4>
                                                    <p className="text-xs text-gray-500">Resource Credit</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">{product.balance} Items Left</p>
                                                <button onClick={() => handleAction(meta)} className="text-[10px] font-bold text-blue-600 hover:underline mt-1">Add More</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* SECTION 2: AVAILABLE MODULES */}
                    <section ref={upgradesRef} className="pt-8 border-t border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-6 bg-blue-600 rounded-full" />
                                Explore Modules
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Assemble your custom suite by selecting the modules you need.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Modular Plans */}
                            {PLANS.filter(p => !p.isFlagship).map(plan => (
                                <PlanUpgradeCard
                                    key={plan.id}
                                    plan={plan}
                                    isCurrent={isPlanOwned(plan.id)}
                                    isTerminated={ownedProducts.some(p => p.id === plan.id && p.status === 'terminated')}
                                    onSelect={() => handleAction(plan)}
                                />
                            ))}

                            {/* Flagship Plan - Full Width */}
                            {PLANS.filter(p => p.isFlagship).map(plan => (
                                <div key={plan.id} className="md:col-span-2">
                                    <PlanUpgradeCard
                                        plan={plan}
                                        isCurrent={isPlanOwned(plan.id)}
                                        isTerminated={ownedProducts.some(p => p.id === plan.id && p.status === 'terminated')}
                                        onSelect={() => handleAction(plan)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 3: POWER-UPS */}
                    <section className="pt-8 border-t border-gray-100 pb-10">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-6 bg-amber-500 rounded-full" />
                                Add-ons & Extensions
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">One-time power-ups to enhance your selected modules.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {FEATURES.map(feature => {
                                const isOwned = ownedProducts.some(p => p.id === feature.id);
                                const cartItem = cartItems.find(item => item.id === feature.id);
                                const isInCart = !!cartItem;
                                const quantity = cartItem ? cartItem.quantity : 1;

                                if (isOwned) return null;
                                return (
                                    <div key={feature.id} className={`bg-white p-6 rounded-3xl border transition-all flex flex-col h-full ring-1 ring-black/[0.02] ${isInCart ? 'bg-blue-50/30 border-blue-200' : 'border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                                        } group`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isInCart ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                                                }`}>
                                                <feature.icon className="w-6 h-6" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-gray-900">₹{feature.price.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Modular Add-on</p>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2 truncate">{feature.name}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6 h-10 overflow-hidden line-clamp-2 italic">
                                            {feature.description}
                                        </p>

                                        <div className="flex items-center gap-3 mt-auto">
                                            {isInCart && (
                                                <div className="flex items-center bg-white rounded-xl p-1 border border-blue-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                                                    <button
                                                        onClick={() => updateQuantity(feature.id, Number(quantity) - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-all active:scale-90"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-black text-gray-900">{quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(feature.id, Number(quantity) + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-all active:scale-90"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => isInCart ? removeFromCart(feature.id) : handleAction(feature)}
                                                className={`flex-1 py-2.5 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 group/btn ${isInCart
                                                    ? 'bg-blue-600 text-white hover:bg-red-500 shadow-md'
                                                    : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 shadow-sm'
                                                    }`}
                                            >
                                                {isInCart ? (
                                                    <>
                                                        <span className="group-hover:hidden flex items-center gap-2"><Check className="w-4 h-4" /> Added</span>
                                                        <span className="hidden group-hover:flex items-center gap-2"><Trash2 className="w-4 h-4" /> Remove</span>
                                                    </>
                                                ) : (
                                                    <>Add to Cart <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Sidebar (History & Top Ups) */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Store Card */}
                    <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm relative overflow-hidden ring-1 ring-black/[0.02]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px]" />

                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> Scaling Store
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Instant usage boost. No commitment change.</p>
                            </div>
                            <Link to="/cart" className="relative p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all group">
                                <ShoppingCart className="w-5 h-5 text-gray-600 transition-colors group-hover:text-blue-600" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-subtle">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {TOP_UPS.map(item => (
                                <TopUpCard
                                    key={item.id}
                                    item={item}
                                    onBuy={handleAction}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Analytics Snapshot */}
                    <AnalyticsSnapshot />

                    {/* Recent Billing Info */}
                    <RecentInvoicesCard onViewAll={() => setIsHistoryOpen(true)} />

                    <div className="p-6 rounded-3xl bg-gray-900 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400" /> Enterprise Support
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                Need custom multi-plan discounts for your organization?
                            </p>
                            <button className="text-xs font-bold text-white border-b-2 border-white/20 pb-0.5 hover:border-white transition-colors">
                                Contact Sales Representative
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                    </div>
                </div>

            </div>

            {/* Billing History Modal */}
            <BillingHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />

        </div>
    );
};

// Helper Icon
function CheckCircle2Icon({ className }) { return <ShoppingCart className={className} />; }

export default SubscriptionManagement;
