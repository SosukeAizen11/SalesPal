import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Info, ArrowRight, Sparkles, Globe, Layers, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { PLANS, TOP_UPS, FEATURES } from '../data/billing';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionWrapper from '../components/layout/SectionWrapper';

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

        return {
            ...item,
            ...staticData,
            price,
            quantity: qty,
            icon: staticData?.icon || ShoppingBag // Ensure valid component
        };
    };

    const handleCheckout = () => {
        const success = purchaseCart();
        if (success) {
            navigate('/purchase-success');
        }
    };

    // Calculate subtotal accurately for everything
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

    // Detailed Breakdown Values
    const discount = activeCoupon ? Math.round(subtotal * (activeCoupon.percent / 100)) : 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const gstValue = taxableAmount > 0 ? Math.round(taxableAmount * 0.18) : 0;
    const convenienceFee = 0;
    const totalPayable = taxableAmount + gstValue + convenienceFee;

    const formatCurrency = (val) => {
        const num = Number(val);
        if (isNaN(num)) return "₹0";
        return `₹${num.toLocaleString()}`;
    };

    const resolvedItems = cartItems.map(getResolvedItem);
    const selectedPlans = resolvedItems.filter(item => item.type === 'subscription');
    const selectedAddons = resolvedItems.filter(item => item.type === 'topup' || item.type === 'addon');

    const [dismissed, setDismissed] = React.useState([]);

    const suggestedPlansList = React.useMemo(() => {
        if (dismissed.includes('plans_section')) return [];
        const inCartIds = cartItems.map(i => i.id);
        const ownedIds = ownedProducts.map(p => p.id);
        const allSuggestions = [];

        if (inCartIds.includes('marketing') && !inCartIds.includes('sales') && !ownedIds.includes('sales')) {
            allSuggestions.push({
                ...PLANS.find(p => p.id === 'sales'),
                benefit: "Direct conversion engine for your marketing leads."
            });
        }
        const others = PLANS.filter(p => !inCartIds.includes(p.id) && !ownedIds.includes(p.id) && !allSuggestions.some(s => s.id === p.id));
        allSuggestions.push(...others);
        return allSuggestions.slice(0, 2);
    }, [cartItems, ownedProducts, dismissed]);

    const suggestedAddonsList = React.useMemo(() => {
        if (dismissed.includes('addons_section')) return [];
        const inCartIds = cartItems.map(i => i.id);
        const selectedPlanIds = selectedPlans.map(p => p.id);
        const allAddonsStatic = [...TOP_UPS, ...FEATURES];
        const allSuggestions = [];
        const availableAddons = allAddonsStatic.filter(a => !inCartIds.includes(a.id));

        if (selectedPlanIds.includes('marketing')) {
            const mkt = availableAddons.filter(a => a.id === 'images' || a.id === 'carousels');
            allSuggestions.push(...mkt.map(a => ({ ...a, benefit: "Generate visuals for your social campaigns." })));
        }
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
                className={`p-6 rounded-2xl transition-all group relative overflow-hidden ${isSelected
                    ? 'bg-white border border-gray-100 hover:border-gray-200 shadow-sm'
                    : 'bg-gray-50 border border-dashed border-gray-200 opacity-60'
                    }`}
            >
                <div className="flex items-start gap-5 relative z-10">
                    <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-0.5">{item.name}</h3>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{item.type || 'Add-on'}</p>
                            </div>
                            <div className="text-right">
                                {isSelected ? (
                                    <>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest leading-none mb-1">{formatCurrency(price)} × {qty}</p>
                                        <p className="text-lg font-bold text-gray-900 leading-none">{formatCurrency(itemTotal)}</p>
                                    </>
                                ) : (
                                    <p className="text-lg font-bold text-gray-400">{formatCurrency(price)}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                            {isSelected ? (
                                <>
                                    {item.type !== 'subscription' ? (
                                        <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, qty - 1)}
                                                className="w-7 h-7 rounded bg-white hover:bg-gray-100 flex items-center justify-center transition-all text-gray-900 shadow-sm"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="text-gray-900 font-black w-8 text-center text-xs">{qty}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, qty + 1)}
                                                className="w-7 h-7 rounded bg-white hover:bg-gray-100 flex items-center justify-center transition-all text-gray-900 shadow-sm"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 rounded-lg bg-gray-50 text-[9px] text-gray-500 font-black uppercase tracking-widest border border-gray-100">
                                            Active Module
                                        </div>
                                    )}

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-[10px] text-gray-400 hover:text-red-600 transition-colors font-bold uppercase tracking-widest"
                                    >
                                        Remove Item
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Recommendation</p>
                                    <button
                                        onClick={() => {
                                            const price = Number(item.price ?? 0);
                                            addToCart({ ...item, price, quantity: 1 });
                                        }}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 transition-all font-black uppercase tracking-widest"
                                    >
                                        + Add to order
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
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-1 pt-32 pb-20 px-6">
                    <div className="max-w-xl mx-auto text-center">
                        <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-100 transition-transform hover:scale-110 duration-500">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Empty Order</h1>
                        <p className="text-gray-500 text-sm mb-10 leading-relaxed max-w-sm mx-auto">You haven't added any active modules or resource packs to your current selection yet.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/marketing/subscription">
                                <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all">
                                    Explore Ecosystem
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Link to="/marketing/subscription" className="text-gray-400 hover:text-gray-900 transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Order</h1>
                            </div>
                            <p className="text-gray-500 mt-1">Pricing Summary & Activation Hub</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Cart Content */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* SECTION A: Selected Plans */}
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> Active Modules
                                    </h2>
                                    <span className="text-[10px] font-bold text-gray-400">{selectedPlans.length} Items</span>
                                </div>
                                <div className="space-y-4">
                                    {selectedPlans.length > 0 ? (
                                        selectedPlans.map(item => <CartItemRow key={item.id} item={item} />)
                                    ) : (
                                        <div className="py-12 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No base modules selected</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* SECTION B: Selected Add-ons */}
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Expansion Packs
                                    </h2>
                                    <span className="text-[10px] font-bold text-gray-400">{selectedAddons.length} Items</span>
                                </div>
                                <div className="space-y-4">
                                    {selectedAddons.length > 0 ? (
                                        selectedAddons.map(item => <CartItemRow key={item.id} item={item} />)
                                    ) : (
                                        <div className="py-12 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No add-ons selected</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* SECTION C: Smart Suggestions */}
                            {hasSuggestions && (
                                <section className="pt-12 border-t border-gray-100 space-y-10">
                                    {suggestedPlansList.length > 0 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Suggested for you</h2>
                                                <button onClick={() => setDismissed([...dismissed, 'plans_section'])} className="text-[9px] font-bold text-gray-300 uppercase tracking-widest hover:text-gray-500 underline underline-offset-4">Dismiss</button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {suggestedPlansList.map(plan => (
                                                    <div key={plan.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-blue-200 transition-all">
                                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-tight">{plan.name}</h4>
                                                        <p className="text-[11px] text-gray-500 mb-6 leading-relaxed italic line-clamp-2">"{plan.benefit}"</p>
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                            <p className="text-sm font-bold text-gray-900">{formatCurrency(plan.price)}<span className="text-[10px] text-gray-400 font-normal">/mo</span></p>
                                                            <button
                                                                onClick={() => {
                                                                    const price = Number(plan.price ?? 0);
                                                                    addToCart({ ...plan, price, quantity: 1 });
                                                                }}
                                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                                            >
                                                                + Add Plan
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {suggestedAddonsList.length > 0 && (
                                        <div className="space-y-6 pt-10">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Growth Accelerators</h2>
                                                <button onClick={() => setDismissed([...dismissed, 'addons_section'])} className="text-[9px] font-bold text-gray-300 uppercase tracking-widest hover:text-gray-500 underline underline-offset-4">Dismiss</button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {suggestedAddonsList.map(addon => (
                                                    <div key={addon.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-blue-200 transition-all">
                                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-tight">{addon.name}</h4>
                                                        <p className="text-[11px] text-gray-500 mb-6 leading-relaxed italic line-clamp-2">"{addon.benefit}"</p>
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                            <p className="text-sm font-bold text-gray-900">{formatCurrency(addon.price)}</p>
                                                            <button
                                                                onClick={() => {
                                                                    const price = Number(addon.price ?? 0);
                                                                    addToCart({ ...addon, price, quantity: 1 });
                                                                }}
                                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                                            >
                                                                + Add to Order
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
                        <div className="lg:col-span-4 lg:sticky lg:top-32">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={clearCart}
                                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                                </button>
                            </div>
                            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Summary</h2>

                                {/* Coupon Section */}
                                <div className="mb-8">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Promotional Code</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="CODE"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-900 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-300 font-bold uppercase tracking-widest"
                                        />
                                        <button
                                            onClick={activeCoupon ? removeCoupon : applyCoupon}
                                            className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCoupon
                                                ? 'bg-gray-100 text-red-600'
                                                : 'bg-gray-900 text-white hover:bg-black'
                                                }`}
                                        >
                                            {activeCoupon ? 'X' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponStatus.message && (
                                        <p className={`mt-3 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg ${couponStatus.type === 'success' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-600'}`}>
                                            {couponStatus.message}
                                        </p>
                                    )}
                                </div>

                                {/* Bill Breakdown */}
                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-xs font-black text-blue-600 uppercase tracking-widest">
                                            <span>Promotion</span>
                                            <span>-{formatCurrency(discount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <span>GST (18%)</span>
                                        <span className="text-gray-900">{formatCurrency(gstValue)}</span>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Final Due</p>
                                        <p className="text-3xl font-bold text-gray-900 tracking-tighter">
                                            {formatCurrency(totalPayable)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all mb-4"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Activation
                                </button>

                                <div className="flex items-center justify-center gap-4 opacity-40">
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">PCI Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Globe className="w-3.5 h-3.5" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Worldwide</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-6 text-[10px] text-gray-400 leading-relaxed text-center font-medium">
                                Institutional support for deployment is available 24/7 after order confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
