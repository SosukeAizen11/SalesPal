import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const Cart = () => {
    const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-32 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-blue-500" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added any AI products yet.</p>
                        <Link to="/">
                            <Button variant="primary" className="bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-lg hover:shadow-xl transition-all">
                                <span className="flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Continue Shopping</span>
                                </span>
                            </Button>
                        </Link>
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                            <p className="text-gray-600 mt-1">{cartCount} items in your order</p>
                        </div>
                        <button
                            onClick={clearCart}
                            className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-all"
                        >
                            Clear Cart
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Item Icon */}
                                        <div className={`w-20 h-20 ${item.iconBg || 'bg-blue-100'} rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                                            {item.icon && React.createElement(item.icon, { className: "w-8 h-8 text-white drop-shadow-sm" })}
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                                                    <p className="text-sm text-gray-500 font-medium">{item.subtitle}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-gray-900">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                    <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} / unit</p>
                                                </div>
                                            </div>

                                            {/* Features badge or similar could go here */}
                                            <div className="flex items-center gap-2 mb-6">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-xs text-gray-500">In stock & ready to setup</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 rounded-lg bg-white text-gray-600 hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-gray-200 flex items-center justify-center transition-all disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg bg-white text-gray-600 hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-gray-200 flex items-center justify-center transition-all"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all font-medium text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xl sticky top-28">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Subtotal ({cartCount} items)</span>
                                        <span className="font-semibold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Tax (18% GST)</span>
                                        <span className="font-semibold text-gray-900">₹{taxAmount.toLocaleString()}</span>
                                    </div>

                                    <div className="my-4 h-px bg-gray-200"></div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-gray-900 font-bold text-lg">Total</span>
                                            <p className="text-xs text-gray-500">Including all taxes</p>
                                        </div>
                                        <span className="text-3xl font-bold text-blue-600">₹{finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link to="/signin" className="block">
                                        <Button
                                            variant="primary"
                                            className="w-full py-4 text-base font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 border-0"
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                    <Link to="/" className="block">
                                        <div className="w-full py-3 flex items-center justify-center gap-2 text-center text-gray-500 font-semibold hover:text-gray-900 transition-colors cursor-pointer rounded-xl hover:bg-gray-50">
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Continue Shopping</span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                                    <span>Secure Checkout</span>
                                    <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                                </div>
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
