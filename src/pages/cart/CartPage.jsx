import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, CreditCard, Package, Megaphone, Phone, UserCheck, Headphones, Layers } from 'lucide-react';
import { useCart } from '../../commerce/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../commerce/SubscriptionContext';
import { MODULES } from '../../commerce/commerce.config';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

const CartPage = () => {
    const { cart, removeItem, getCartTotal, addSubscription, openMiniCart, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { isModuleActive, activateSubscription, addCredits, clearCartAfterPurchase } = useSubscription();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const subtotal = getCartTotal();

    const handleContinueShopping = () => {
        navigate('/#pricing');
    };

    const [billingDetails, setBillingDetails] = useState({
        fullName: '',
        email: user?.email || '',
        companyName: '',
        taxId: '',
        billingAddress: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card');

    const handleBillingChange = (field, value) => {
        setBillingDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const suggestedModules = Object.values(MODULES).filter((module) => {
        const inCart = cart.some(
            (item) => item.type === 'subscription' && item.moduleId === module.id
        );
        return !isModuleActive(module.id) && !inCart;
    });

    const handleQuickAdd = (module) => {
        addSubscription(module.id);
        openMiniCart();
        showToast({
            title: 'Added to Cart',
            description: `SalesPal ${module.name} Plan has been added to your cart.`,
            duration: 3000,
        });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty.</h1>
                <p className="text-gray-500 max-w-sm mb-8 text-sm">
                    You haven&apos;t added any plans or credits yet. Explore our modules to get started.
                </p>
                <Button
                    onClick={handleContinueShopping}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5"
                >
                    Explore Plans
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Checkout
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Review your order and complete your subscription.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleContinueShopping}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        <span>Continue Shopping</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Left: Order, Billing, and Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Your Order */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                Your Order
                            </h2>
                            <div className="space-y-3">
                                {cart.map((item) => {
                                    let iconBg = 'bg-gray-100 text-gray-500';
                                    let Icon = Package;

                                    if (item.type === 'subscription' || item.type === 'bundle') {
                                        switch (item.moduleId) {
                                            case 'marketing':
                                                iconBg = 'bg-blue-100 text-blue-600';
                                                Icon = Megaphone;
                                                break;
                                            case 'sales':
                                                iconBg = 'bg-green-100 text-green-600';
                                                Icon = Phone;
                                                break;
                                            case 'postSale':
                                                iconBg = 'bg-orange-100 text-orange-600';
                                                Icon = UserCheck;
                                                break;
                                            case 'support':
                                                iconBg = 'bg-red-100 text-red-600';
                                                Icon = Headphones;
                                                break;
                                            case 'bundle':
                                                iconBg = 'bg-purple-100 text-purple-600';
                                                Icon = Layers;
                                                break;
                                            default:
                                                iconBg = 'bg-blue-50 text-blue-600';
                                                Icon = Package;
                                        }
                                    } else if (item.type === 'credit') {
                                        iconBg = 'bg-green-100 text-green-600';
                                        Icon = CreditCard;
                                    }

                                    return (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.type === 'subscription' || item.type === 'bundle'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {item.type === 'subscription' || item.type === 'bundle' ? 'Plan' : 'Credit'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {item.type === 'subscription' || item.type === 'bundle'
                                                            ? 'Billed monthly'
                                                            : `${item.amount} ${item.resource} items`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                                <div className="text-right">
                                                    <span className="block text-sm font-semibold text-gray-900">
                                                        ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 border-t border-gray-100" />
                        </div>

                        {/* Billing Details */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                Billing Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your full name"
                                        value={billingDetails.fullName}
                                        onChange={(e) => handleBillingChange('fullName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="you@company.com"
                                        value={billingDetails.email}
                                        onChange={(e) => handleBillingChange('email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name <span className="text-gray-400 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Your company"
                                        value={billingDetails.companyName}
                                        onChange={(e) => handleBillingChange('companyName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        GST / Tax ID <span className="text-gray-400 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your GST or tax ID"
                                        value={billingDetails.taxId}
                                        onChange={(e) => handleBillingChange('taxId', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Billing Address <span className="text-gray-400 text-xs">(optional)</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street, city, state, postal code"
                                        value={billingDetails.billingAddress}
                                        onChange={(e) => handleBillingChange('billingAddress', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                Payment Method
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-800">
                                            Credit / Debit Card
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            value="upi"
                                            checked={paymentMethod === 'upi'}
                                            onChange={() => setPaymentMethod('upi')}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-800">
                                            UPI
                                        </span>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Secure payment will be processed via Razorpay.
                                </p>
                            </div>

                            {/* Subscription terms */}
                            <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    You will be charged <span className="font-semibold">₹{subtotal.toLocaleString()}</span> today.
                                    This is a recurring monthly subscription. You can cancel anytime from Billing Settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-32 space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">Order Summary</h2>
                                <p className="text-xs text-gray-500">
                                    Billed monthly • Renews automatically
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-base font-medium text-gray-900">Total due today</span>
                                    <span className="text-2xl font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full justify-center py-3 text-sm font-semibold shadow-none"
                                onClick={() => {
                                    if (!cart.length) return;

                                    // Simulated successful payment + subscription activation
                                    cart.forEach((item) => {
                                        if (item.type === 'subscription' || item.type === 'bundle') {
                                            activateSubscription(item);
                                        } else if (item.type === 'credit') {
                                            addCredits(item.moduleId, item.resource, (item.amount || 0) * (item.quantity || 1));
                                        }
                                    });

                                    clearCart();
                                    clearCartAfterPurchase();
                                    navigate('/purchase-success');
                                }}
                            >
                                Complete Purchase
                            </Button>

                            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Secure Checkout</span>
                                </span>
                                <span className="h-3 w-px bg-gray-200 hidden sm:inline-block" />
                                <span>GST Invoice Available</span>
                                <span className="h-3 w-px bg-gray-200 hidden sm:inline-block" />
                                <span>Cancel Anytime</span>
                            </div>
                        </div>
                    </div>
                </div>

                {suggestedModules.length > 0 && (
                    <div className="mt-12 border-t border-gray-100 pt-10">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Recommended for You
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                            Add complementary SalesPal modules to unlock a more complete revenue stack.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {suggestedModules.map((module) => (
                                <div
                                    key={module.id}
                                    className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
                                            Suggested Module
                                        </p>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            SalesPal {module.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            ₹{module.price.toLocaleString()} / month
                                        </p>
                                    </div>

                                    <Button
                                        size="sm"
                                        className="mt-2 w-full justify-center"
                                        onClick={() => handleQuickAdd(module)}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
