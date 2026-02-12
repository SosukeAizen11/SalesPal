import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, CreditCard, Package } from 'lucide-react';
import { useCart } from '../../commerce/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const CartPage = () => {
    const { cart, removeItem, getCartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const subtotal = getCartTotal();

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 max-w-sm mb-8 text-sm">
                    Looks like you haven't added any subscriptions or credits yet.
                </p>
                <Button onClick={() => navigate('/')} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5">
                    Explore Ecosystem
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-semibold mb-8 text-gray-900">
                    Your Cart
                </h1>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'subscription' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                        }`}>
                                        {item.type === 'subscription' ? <Package className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.type === 'subscription' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {item.type === 'subscription' ? 'Plan' : 'Credit'}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {item.type === 'subscription' ? 'Billed monthly' : `${item.amount} ${item.resource} items`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                    <div className="text-right">
                                        <span className="block text-lg font-semibold text-gray-900">
                                            ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-32">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-base font-medium text-gray-900">Total</span>
                                    <span className="text-2xl font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full justify-center py-3 text-sm font-semibold shadow-none bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
                                disabled
                            >
                                Proceed to Checkout
                            </Button>

                            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
