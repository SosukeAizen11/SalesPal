import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Zap,
    ArrowUpCircle,
    ShoppingCart,
    CreditCard,
    FileText,
    LayoutDashboard,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    Check,
    Minus,
    Plus,
    Trash2,
    BarChart3,
    History,
    Wallet,
    ShoppingBag,
    HelpCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PLANS, TOP_UPS, FEATURES } from '../../data/billing';
import CurrentPlanCard from './components/CurrentPlanCard';
import PlanUpgradeCard from './components/PlanUpgradeCard';
import TopUpCard from './components/TopUpCard';
import PaymentModal from './components/PaymentModal';
import BillingHistoryModal from './components/BillingHistoryModal';
import RecentInvoicesCard from './components/RecentInvoicesCard';
import AnalyticsSnapshot from './components/AnalyticsSnapshot';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SubscriptionManagement = () => {
    const { ownedProducts, addToCart, cartCount, cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    // State
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Ref for scrolling
    const storeRef = useRef(null);

    const activeSubscriptions = ownedProducts.filter(p => p.type === 'subscription' && p.status === 'active');

    // Check if a plan is owned (active)
    const isPlanOwned = (planId) => ownedProducts.some(p => p.id === planId && p.type === 'subscription' && p.status === 'active');

    const handleAction = (item) => {
        addToCart(item);
    };

    const handlePaymentMethods = () => {
        alert("Payment Method management is coming soon.");
    };

    // Calculate total monthly burn
    const monthlyBurn = activeSubscriptions.reduce((acc, sub) => {
        const plan = PLANS.find(p => p.id === sub.id);
        return acc + (plan?.price || 0);
    }, 0);

    return (
        <div className="animate-in fade-in duration-700">
            {/* --- PAGE HEADER (Matched to Dashboard) --- */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 mb-8 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Billing & Products
                        <HelpCircle className="w-4 h-4 text-gray-300 cursor-help hover:text-blue-600 transition-colors" />
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your subscriptions, resource scaling, and payment history.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <History className="w-4 h-4 text-gray-400" />
                        Billing History
                    </button>
                    <button
                        onClick={handlePaymentMethods}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <Wallet className="w-4 h-4 text-gray-400" />
                        Payment Methods
                    </button>
                    <Link to="/cart">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                            <ShoppingCart className="w-4 h-4" />
                            View Cart {cartCount > 0 && `(${cartCount})`}
                        </button>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* --- MAIN COLUMN (2/3) --- */}
                <div className="xl:col-span-8 space-y-12">

                    {/* SECTION 1: BILLING OVERVIEW / ACTIVE MODULES */}
                    <section id="section-1" className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-600" /> Active Modules
                            </h2>
                            <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-widest">
                                Monthly Spend: ₹{monthlyBurn.toLocaleString()}
                            </div>
                        </div>

                        {activeSubscriptions.length > 0 ? (
                            <div className="space-y-6">
                                {activeSubscriptions.map(sub => (
                                    <CurrentPlanCard
                                        key={sub.id}
                                        subscription={sub}
                                        onManage={() => storeRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center bg-gray-50/50">
                                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium text-sm">No active modules. Scale your business by adding a plan below.</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => storeRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Browse Modular Ecosystem
                                </Button>
                            </div>
                        )}
                    </section>


                    {/* SECTION 3: SCALING STORE / ADD-ONS */}
                    <section id="section-3" ref={storeRef} className="pt-8 border-t border-gray-100 space-y-10">
                        <div>
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-amber-500" /> Scaling Store
                            </h2>
                            <p className="text-sm text-gray-500">Add new modules or one-time extensions to your workspace.</p>
                        </div>

                        {/* Modular Plans */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {PLANS.filter(p => !p.isFlagship).map(plan => (
                                <PlanUpgradeCard
                                    key={plan.id}
                                    plan={plan}
                                    isCurrent={isPlanOwned(plan.id)}
                                    isTerminated={ownedProducts.some(p => p.id === plan.id && p.status === 'terminated')}
                                    onSelect={() => handleAction(plan)}
                                />
                            ))}
                            {/* Flagship Plan */}
                            <div className="md:col-span-2">
                                {PLANS.filter(p => p.isFlagship).map(plan => (
                                    <PlanUpgradeCard
                                        key={plan.id}
                                        plan={plan}
                                        isCurrent={isPlanOwned(plan.id)}
                                        isTerminated={ownedProducts.some(p => p.id === plan.id && p.status === 'terminated')}
                                        onSelect={() => handleAction(plan)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Power-up Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {FEATURES.map(feature => {
                                const isOwned = ownedProducts.some(p => p.id === feature.id);
                                const cartItem = cartItems.find(item => item.id === feature.id);
                                const isInCart = !!cartItem;
                                const quantity = cartItem ? cartItem.quantity : 1;

                                if (isOwned) return null;
                                return (
                                    <div key={feature.id} className={`bg-white p-5 rounded-2xl border transition-all flex flex-col h-full ${isInCart ? 'border-blue-200 bg-blue-50/20 ring-4 ring-blue-500/5' : 'border-gray-100 hover:border-blue-200 shadow-sm'
                                        } group`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isInCart ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                                                }`}>
                                                <feature.icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-gray-900">₹{feature.price.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Expansion Pack</p>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2">{feature.name}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-6 h-10 line-clamp-2 italic">
                                            {feature.description}
                                        </p>

                                        <div className="flex items-center gap-3 mt-auto">
                                            {isInCart && (
                                                <div className="flex items-center bg-white rounded-xl p-1 border border-blue-100 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(feature.id, Number(quantity) - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-all active:scale-95"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-black text-gray-900">{quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(feature.id, Number(quantity) + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-all active:scale-95"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => isInCart ? removeFromCart(feature.id) : handleAction(feature)}
                                                className={`flex-1 py-3 font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${isInCart ? 'bg-blue-600 text-white hover:bg-red-500' : 'bg-gray-900 text-white hover:bg-black'
                                                    }`}
                                            >
                                                {isInCart ? (
                                                    <>
                                                        <span className="group-hover:hidden flex items-center gap-2"><Check className="w-4 h-4" /> Added</span>
                                                        <span className="hidden group-hover:flex items-center gap-2"><Trash2 className="w-4 h-4" /> Remove</span>
                                                    </>
                                                ) : (
                                                    <>Add to Order <ArrowRight className="w-4 h-4" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 5: ECOSYSTEM FAQ & SUPPORT */}
                    <section id="section-5" className="pt-16 border-t border-gray-100 space-y-12 pb-12">
                        <div>
                            <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                <HelpCircle className="w-4 h-4 text-gray-400" /> Ecosystem Guard
                            </h2>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Essential intelligence</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { q: "Can I swap modules mid-cycle?", a: "Yes. Our pro-rata system automatically calculates the difference and applies it as a credit. No wasted spending." },
                                { q: "What happens if I exhaust credits?", a: "Modules will pause, but your data is safe. You can buy one-time top-ups or upgrade your tier instantly." },
                                { q: "Are there any hidden setup fees?", a: "Never. You only pay for the active modules in your workspace. Transparent, modular pricing is our core." },
                                { q: "Can I cancel modules individually?", a: "Absolutely. Each module is independent. You can terminate one without affecting your entire ecosystem." }
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <h4 className="font-bold text-gray-900 text-sm flex items-start gap-2 mb-2 group-hover:text-blue-600 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-1.5 shrink-0" /> {item.q}
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed pl-3.5 border-l border-gray-100 italic">
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Help Banner */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 text-gray-900 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group hover:border-gray-200 transition-all">
                            <div className="relative z-10 text-center md:text-left">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Technical Assistance</p>
                                <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">Professional Support</h3>
                                <p className="text-sm text-gray-500 max-w-md">Consult with our engineering team for custom modular deployment and high-volume billing.</p>
                            </div>
                            <button className="relative z-10 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 whitespace-nowrap">
                                Open Inquiry
                            </button>
                        </div>
                    </section>
                </div>

                {/* --- SIDEBAR COLUMN (1/3) --- */}
                <div className="xl:col-span-4 space-y-8">

                    {/* SECTION 2: USAGE & CREDITS SNAPSHOT (Moved to Sidebar) */}
                    <section id="section-2" className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-emerald-600" /> Resource Snapshot
                            </h2>
                        </div>

                        <AnalyticsSnapshot />

                        <div className="space-y-3">
                            {ownedProducts.filter(p => p.type === 'topup').map(product => {
                                const meta = TOP_UPS.find(t => t.id === product.id);
                                if (!meta) return null;
                                const Icon = meta.icon;
                                return (
                                    <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                                <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-xs">{meta.name}</h4>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Balance</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900">{product.balance}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 4: BILLING HISTORY & PAYMENT OPTIONS */}
                    <section id="section-4" className="pt-8 border-t border-gray-100 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" /> Records & Billing
                            </h2>
                        </div>

                        <RecentInvoicesCard onViewAll={() => setIsHistoryOpen(true)} />

                        {/* Quick Top-up Sidebar Store */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-sm uppercase">
                                    Instant Credits
                                </h3>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Resource Boost</p>
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
                        </div>

                        {/* Enterprise Support Card */}
                        <div className="p-6 rounded-2xl bg-gray-900 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="font-bold flex items-center gap-2 mb-2 text-sm">
                                    Enterprise Suite
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                    Consolidated billing and институционал accounts for 50+ projects.
                                </p>
                                <button className="flex items-center gap-2 text-[10px] font-bold text-white group-hover:translate-x-1 transition-transform border-b border-white/20 pb-0.5 hover:border-white uppercase tracking-widest">
                                    Contact Sales <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* MODALS */}
            <BillingHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
    );
};

export default SubscriptionManagement;
