import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Info, ArrowRight, Sparkles, Globe, Layers, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { PLANS, TOP_UPS, FEATURES } from '../data/billing';

const Cart = () => {
    const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart, ownedProducts, purchaseCart, addToCart } = useCart();
    const navigate = useNavigate();

    // Coupon & Checkout State
    const [couponCode, setCouponCode] = React.useState('');
    const [activeCoupon, setActiveCoupon] = React.useState(null);
    const [couponStatus, setCouponStatus] = React.useState({ type: '', message: '' });

    // Safely resolve item details from billing data
    const getResolvedItem = (item) => {
        const price = Number(item.price ?? 0);
        const qty = Number(item.quantity ?? 1);
        const staticData = PLANS.find(p => p.id === item.id) ||
            TOP_UPS.find(t => t.id === item.id) ||
            FEATURES.find(f => f.id === item.id);
        return { ...item, ...staticData, price, quantity: qty };
    };

    const handleCheckout = () => {
        const success = purchaseCart();
        if (success) {
            navigate('/purchase-success');
        }
    };

    // Calculate subtotal accurately for everything (PART 4 FIX)
    const subtotal = React.useMemo(() => {
        const value = cartItems.reduce(
            (sum, item) => sum + (Number(item.price ?? 0) * Number(item.quantity ?? 1)),
            0
        );
        return isNaN(value) ? 0 : value;
    }, [cartItems]);

    // Mock Coupon Application
    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        if (!code) return;

        if (code === 'WELCOME20') {
            setActiveCoupon({ code: 'WELCOME20', percent: 20 });
            setCouponStatus({ type: 'success', message: 'WELCOME20 applied! 20% savings active.' });
        } else if (code === 'BUNDLE50') {
            setActiveCoupon({ code: 'BUNDLE50', percent: 50 });
            setCouponStatus({ type: 'success', message: 'BUNDLE50 applied! 50% discount active.' });
        } else {
            setActiveCoupon(null);
            setCouponStatus({ type: 'error', message: 'Invalid or expired coupon code.' });
        }
    };

    const removeCoupon = () => {
        setCouponCode('');
        setActiveCoupon(null);
        setCouponStatus({ type: '', message: '' });
    };

    // Detailed Breakdown Values (RE-CALCULATED EVERY RENDER - PART 4)
    const discount = activeCoupon ? Math.round(subtotal * (activeCoupon.percent / 100)) : 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const gstValue = taxableAmount > 0 ? Math.round(taxableAmount * 0.18) : 0;
    const convenienceFee = 0; // Waived as per policy
    const totalPayable = taxableAmount + gstValue + convenienceFee;

    // Formatter for safety (PART 1 FIX)
    const formatCurrency = (val) => {
        const num = Number(val);
        if (isNaN(num)) return "₹0";
        return `₹${num.toLocaleString()}`;
    };


    const resolvedItems = cartItems.map(getResolvedItem);
    const selectedPlans = resolvedItems.filter(item => item.type === 'subscription');
    const selectedAddons = resolvedItems.filter(item => item.type === 'topup' || item.type === 'addon');

    // Dismissal state for suggestions
    const [dismissed, setDismissed] = React.useState([]);

    // Logic: Multiple Higher Plan Recommendations (PART 2 & 3)
    const suggestedPlansList = React.useMemo(() => {
        if (dismissed.includes('plans_section')) return [];

        const inCartIds = cartItems.map(i => i.id);
        const ownedIds = ownedProducts.map(p => p.id);
        const allSuggestions = [];

        // 1. Specific Upsell Paths
        if (inCartIds.includes('marketing') && !inCartIds.includes('sales') && !ownedIds.includes('sales')) {
            allSuggestions.push({
                ...PLANS.find(p => p.id === 'sales'),
                benefit: "Direct conversion engine for your marketing leads."
            });
        }

        if (inCartIds.includes('sales') && !inCartIds.includes('postsale') && !ownedIds.includes('postsale')) {
            allSuggestions.push({
                ...PLANS.find(p => p.id === 'postsale'),
                benefit: "Automate retention after closing deals."
            });
        }

        // 2. Generic available plans (up to 3 total)
        const others = PLANS.filter(p => !inCartIds.includes(p.id) && !ownedIds.includes(p.id) && !allSuggestions.some(s => s.id === p.id));
        allSuggestions.push(...others);

        return allSuggestions.slice(0, 2); // Show 2 per category
    }, [cartItems, ownedProducts, dismissed]);

    // Logic: Multiple Smart Add-on Suggestions (PART 2 & 3)
    const suggestedAddonsList = React.useMemo(() => {
        if (dismissed.includes('addons_section')) return [];

        const inCartIds = cartItems.map(i => i.id);
        const selectedPlanIds = selectedPlans.map(p => p.id);
        const allAddonsStatic = [...TOP_UPS, ...FEATURES];
        const allSuggestions = [];

        // Filter out what's already in cart or owned
        const availableAddons = allAddonsStatic.filter(a => !inCartIds.includes(a.id));

        // 1. Contextual matches
        if (selectedPlanIds.includes('marketing')) {
            const mkt = availableAddons.filter(a => a.id === 'images' || a.id === 'carousels');
            allSuggestions.push(...mkt.map(a => ({ ...a, benefit: "Generate visuals for your social campaigns." })));
        }

        if (selectedPlanIds.includes('sales')) {
            const sls = availableAddons.filter(a => a.id === 'mins' || a.id === 'adv_analytics');
            allSuggestions.push(...sls.map(a => ({ ...a, benefit: "Essential for tracking ROI and outbound calling." })));
        }

        // 2. Generic fill (up to 3 total)
        const others = availableAddons.filter(a => !allSuggestions.some(s => s.id === a.id));
        allSuggestions.push(...others.map(a => ({ ...a, benefit: "Commonly added by users like you." })));

        return allSuggestions.slice(0, 3);
    }, [cartItems, selectedPlans, dismissed]);

    const hasSuggestions = suggestedPlansList.length > 0 || suggestedAddonsList.length > 0;

    const CartItemRow = ({ item, isSelected = true }) => {
        const Icon = item.icon || ShoppingBag;
        const price = Number(item.price ?? 0);
        const qty = Number(item.quantity ?? 1);
        const itemTotal = price * qty;

        return (
            <div
                className={`p-6 rounded-3xl transition-all group relative overflow-hidden ${isSelected
                    ? 'bg-white/5 border border-white/10 hover:border-white/20'
                    : 'bg-white/[0.02] border border-dashed border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
            >
                <div className="flex items-start gap-5 relative z-10">
                    <div className={`w-14 h-14 ${item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                        item.color === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                            item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                item.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                                    item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-gray-500/20 text-gray-400'} rounded-xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-105 transition-transform animate-in fade-in zoom-in duration-300`}>
                        <Icon className="w-7 h-7" />
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                                <p className="text-[11px] text-[#A8B3BD] line-clamp-1">{item.subtitle || item.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-col gap-1 items-end">
                                    {isSelected ? (
                                        <>
                                            <p className="text-xs text-[#A8B3BD]">{formatCurrency(price)} × {qty}</p>
                                            <p className="text-xl font-black text-white">{formatCurrency(itemTotal)}</p>
                                        </>
                                    ) : (
                                        <p className="text-xl font-black text-white/50">{formatCurrency(price)}</p>
                                    )}
                                </div>
                                <p className="text-[10px] text-[#A8B3BD] mt-1 uppercase font-bold tracking-widest">{item.type === 'subscription' ? '/ month' : 'one-time bundle'}</p>
                            </div>
                        </div>

                        <div className={`flex items-center justify-between mt-6 pt-4 border-t border-white/5 ${!isSelected && 'opacity-60'}`}>
                            {isSelected ? (
                                <>
                                    {item.type !== 'subscription' ? (
                                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 shadow-inner">
                                            <button
                                                onClick={() => updateQuantity(item.id, qty - 1)}
                                                className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white active:scale-95"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-white font-black w-10 text-center text-sm animate-in fade-in slide-in-from-bottom-2">{qty}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, qty + 1)}
                                                className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white active:scale-95"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            Selected Plan
                                        </div>
                                    )}

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="flex items-center gap-2 text-[11px] text-red-400/70 hover:text-red-400 transition-colors font-bold px-3 py-2 rounded-lg hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" /> REMOVE
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        Upsell Recommendation
                                    </div>
                                    <button
                                        onClick={() => {
                                            const price = Number(item.price ?? 0);
                                            addToCart({ ...item, price, quantity: 1 });
                                        }}
                                        className="flex items-center gap-2 text-[11px] text-blue-400 hover:text-blue-300 transition-all font-bold px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 active:scale-95"
                                    >
                                        <Plus className="w-4 h-4" /> ADD TO CART
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-[#0A0F16]">
                <Navbar />
                <main className="pt-40 pb-20 px-6">
                    <div className="max-w-xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 group">
                            <ShoppingBag className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Your Cart Is Empty</h1>
                        <p className="text-[#A8B3BD] text-lg mb-2">You haven't added any plans or add-ons yet.</p>
                        <p className="text-gray-600 text-sm mb-12 italic">Browse our modular ecosystem to empower your workspace.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/marketing/subscription" className="w-full sm:w-auto">
                                <Button variant="primary" icon={Zap} className="w-full sm:w-auto px-8 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/10">
                                    Browse Plans
                                </Button>
                            </Link>
                            <Link to="/marketing/subscription" className="w-full sm:w-auto">
                                <Button variant="secondary" icon={Sparkles} className="w-full sm:w-auto px-8 py-6 rounded-2xl font-bold text-xs tracking-widest bg-white/5 border-white/5 hover:bg-white/10 transition-all">
                                    Explore Add-ons
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-center gap-8 opacity-40">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#A8B3BD]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#A8B3BD]">Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[#A8B3BD]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#A8B3BD]">Global Support</span>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Calculate tax and total with new values
    const taxAmount = Math.round(cartTotal * 0.18);
    const finalTotal = cartTotal + taxAmount;

    return (
        <div className="min-h-screen bg-[#0A0F16]">
            <Navbar />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div className="flex items-center gap-4">
                            <Link to="/marketing/subscription" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Billing Cart</h1>
                                <p className="text-[#A8B3BD] text-sm font-medium">Clear, transparent & modular pricing structure.</p>
                            </div>
                        </div>
                        <button
                            onClick={clearCart}
                            className="text-[11px] font-bold uppercase tracking-widest text-[#A8B3BD] hover:text-red-400 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Clear Selection
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Cart Content */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* SECTION A: Selected Plans */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Selected Plans</h2>
                                    <span className="ml-auto text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">{selectedPlans.length}</span>
                                </div>
                                <div className="space-y-4">
                                    {selectedPlans.length > 0 ? (
                                        selectedPlans.map(item => <CartItemRow key={item.id} item={item} />)
                                    ) : (
                                        <p className="text-gray-500 text-center py-8 border-2 border-dashed border-white/5 rounded-3xl text-sm italic">
                                            No plans selected. Add a base module to continue.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* SECTION B: Selected Add-ons */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Added Resources</h2>
                                    <span className="ml-auto text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">{selectedAddons.length}</span>
                                </div>
                                <div className="space-y-4">
                                    {selectedAddons.length > 0 ? (
                                        selectedAddons.map(item => <CartItemRow key={item.id} item={item} />)
                                    ) : (
                                        <p className="text-gray-500 text-center py-8 border-2 border-dashed border-white/5 rounded-3xl text-sm italic">
                                            No add-ons selected yet.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* SECTION C: Smart Suggestions (PART 1, 2, 3, 4, 6) */}
                            {hasSuggestions && (
                                <section className="pt-12 border-t border-white/5 space-y-12">
                                    {/* Sub-section: Recommended Plans */}
                                    {suggestedPlansList.length > 0 && (
                                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                        <Zap className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-black text-white uppercase tracking-widest leading-none">Recommended Plans</h2>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">Enhance your workspace with more modules</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setDismissed([...dismissed, 'plans_section'])}
                                                    className="text-[10px] font-bold text-gray-600 hover:text-gray-400 uppercase tracking-widest border border-white/5 px-2 py-1 rounded transition-colors"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {suggestedPlansList.map(plan => (
                                                    <div key={plan.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.05] transition-all group relative animate-in fade-in slide-in-from-bottom-4">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                                {React.createElement(plan.icon || Zap, { className: "w-5 h-5" })}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-white leading-tight">{plan.name}</h4>
                                                                <p className="text-[10px] text-blue-400/80 font-bold uppercase tracking-wide">Suggested Module</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mb-6 line-clamp-2 leading-relaxed h-8 italic">
                                                            "{plan.benefit || 'Empower your business growth.'}"
                                                        </p>
                                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                            <div>
                                                                <p className="text-lg font-black text-white">{formatCurrency(plan.price)}<span className="text-[10px] text-gray-500 font-normal ml-1">/mo</span></p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const price = Number(plan.price ?? 0);
                                                                    addToCart({ ...plan, price, quantity: 1 });
                                                                }}
                                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/10 active:scale-95 flex items-center gap-2"
                                                            >
                                                                <Plus className="w-3 h-3" /> Add Plan
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-section: Recommended Add-ons */}
                                    {suggestedAddonsList.length > 0 && (
                                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                                        <Sparkles className="w-5 h-5 text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-black text-white uppercase tracking-widest leading-none">Add-on Resources</h2>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">Boost your current workflows with credits</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setDismissed([...dismissed, 'addons_section'])}
                                                    className="text-[10px] font-bold text-gray-600 hover:text-gray-400 uppercase tracking-widest border border-white/5 px-2 py-1 rounded transition-colors"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {suggestedAddonsList.map(addon => (
                                                    <div key={addon.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 hover:bg-white/[0.05] transition-all group animate-in fade-in slide-in-from-bottom-4">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                                                                {React.createElement(addon.icon || Sparkles, { className: "w-4 h-4" })}
                                                            </div>
                                                            <h4 className="text-xs font-bold text-white leading-tight truncate">{addon.name}</h4>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-black text-white">{formatCurrency(addon.price)}</p>
                                                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{addon.quantity || 'One-time'}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const price = Number(addon.price ?? 0);
                                                                    addToCart({ ...addon, price, quantity: 1 });
                                                                }}
                                                                className="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"
                                                                title="Add to Cart"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24">
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px]" />

                                <h2 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
                                    Summary
                                    <span className="text-blue-400 text-xs font-bold bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">SaaS BILLING</span>
                                </h2>

                                {/* Coupon Section (PART 2 FIX) */}
                                <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <p className="text-xs font-bold text-white uppercase tracking-widest">Special Offers</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500/50 outline-none transition-colors placeholder:text-gray-600 font-medium"
                                        />
                                        <button
                                            onClick={activeCoupon ? removeCoupon : applyCoupon}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCoupon
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/10'
                                                }`}
                                        >
                                            {activeCoupon ? 'Remove' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponStatus.message && (
                                        <p className={`mt-3 text-[10px] font-bold px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-1 ${couponStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {couponStatus.message}
                                        </p>
                                    )}
                                </div>

                                {/* Bill Breakdown (PART 4 - REAL TIME) */}
                                <div className="space-y-4 mb-8 relative z-10">
                                    <div className="flex justify-between text-[#A8B3BD] text-sm font-medium">
                                        <span>Subtotal (Plans + Add-ons)</span>
                                        <span className="text-white">{formatCurrency(subtotal)}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-400 text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                                            <span className="flex items-center gap-2">Discount Applied ({activeCoupon.percent}%)</span>
                                            <span>-{formatCurrency(discount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-[#A8B3BD] text-sm font-medium">
                                        <span className="flex items-center gap-2">GST Estimate (18%)</span>
                                        <span className="text-white">{formatCurrency(gstValue)}</span>
                                    </div>

                                    <div className="flex justify-between text-[#A8B3BD] text-sm font-medium pb-4 border-b border-white/5">
                                        <span>Convenience Fee</span>
                                        <span className="text-emerald-400 font-bold tracking-widest text-[9px] bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">WAIVED</span>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-[10px] text-[#A8B3BD] uppercase tracking-widest font-black mb-1">Final Payable Amount</p>
                                                <p className="text-4xl font-black text-white tracking-tight animate-in fade-in zoom-in duration-500 [text-shadow:0_0_20px_rgba(59,130,246,0.3)]" key={totalPayable}>
                                                    {formatCurrency(totalPayable)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 whitespace-nowrap tracking-wider">SECURE CHECKOUT</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#A8B3BD] font-medium italic mt-4 border-l-2 border-white/10 pl-3 leading-relaxed">
                                            (Includes GST and applicable convenience fees. Final pricing calculated in real-time based on active modular selection.)
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        variant="primary"
                                        className="w-full py-5 text-base font-black shadow-xl shadow-blue-600/10 bg-blue-600 hover:bg-blue-500 rounded-2xl active:scale-[0.98] transition-all"
                                        onClick={handleCheckout}
                                    >
                                        PROCEED TO ACTIVATION
                                    </Button>

                                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5 opacity-50 flex-wrap">
                                        <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-help" title="PCI-DSS v4.0 Compliant">
                                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Secure</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-help" title="Available in 190+ Countries">
                                            <Globe className="w-3.5 h-3.5 text-white" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Global</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Note */}
                            <div className="mt-4 p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-amber-400" />
                                </div>
                                <p className="text-[11px] text-[#A8B3BD] leading-relaxed">
                                    <span className="text-white font-bold block mb-1">Institutional Support</span>
                                    Your personal account manager will reach out within 4 hours to assist with multi-module onboarding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
