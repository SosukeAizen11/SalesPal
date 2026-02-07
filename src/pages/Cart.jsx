import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const Cart = () => {
    const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-primary">
                <Navbar />
                <main className="pt-32 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <ShoppingBag className="w-24 h-24 text-[#A8B3BD] mx-auto mb-6" />
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-[#A8B3BD] mb-8">Add some products to get started!</p>
                        <Link to="/">
                            <Button variant="primary" icon={ArrowLeft}>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Shopping Cart</h1>
                        <button
                            onClick={clearCart}
                            className="text-sm text-[#A8B3BD] hover:text-red-400 transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/30 transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 ${item.iconBg || 'bg-secondary/20'} rounded-xl flex items-center justify-center shrink-0`}>
                                            {item.icon && <item.icon className="w-8 h-8 text-white" />}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                                            <p className="text-sm text-[#A8B3BD] mb-3">{item.subtitle}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4 text-white" />
                                                    </button>
                                                    <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl font-bold text-white">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-[#A8B3BD]">
                                        <span>Subtotal ({cartCount} items)</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[#A8B3BD]">
                                        <span>Tax (18% GST)</span>
                                        <span>₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3 flex justify-between text-white text-xl font-bold">
                                        <span>Total</span>
                                        <span>₹{Math.round(cartTotal * 1.18).toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link to="/signin">
                                    <Button variant="primary" className="w-full mb-3">
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                                <Link to="/">
                                    <Button variant="outline" className="w-full">
                                        Continue Shopping
                                    </Button>
                                </Link>
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
