import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingCart, Trash2, Package, CreditCard } from 'lucide-react';
import { useCart } from '../../commerce/CartContext';
import Button from '../ui/Button';

const MiniCartDrawer = () => {
    const {
        cart,
        removeItem,
        getCartTotal,
        isMiniCartOpen,
        closeMiniCart,
    } = useCart();

    const navigate = useNavigate();
    const itemCount = cart.length;
    const subtotal = getCartTotal();

    useEffect(() => {
        if (!isMiniCartOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isMiniCartOpen]);

    const handleClose = () => {
        closeMiniCart();
    };

    const handleContinueShopping = () => {
        closeMiniCart();
    };

    const handleProceedToCheckout = () => {
        closeMiniCart();
        navigate('/cart');
    };

    return (
        <AnimatePresence>
            {isMiniCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-[400px] bg-white shadow-2xl flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        aria-label="Mini cart"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Your Cart
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        {itemCount === 0
                                            ? 'No items added yet'
                                            : `${itemCount} item${itemCount > 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Close mini cart"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-sm text-gray-500">
                                    <p className="mb-1 font-medium text-gray-900">Your cart is empty</p>
                                    <p className="text-xs text-gray-500">
                                        Add plans or credits to see them here.
                                    </p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-3 border border-gray-100 rounded-lg px-3 py-3 bg-white shadow-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'subscription'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-green-50 text-green-600'
                                                    }`}
                                            >
                                                {item.type === 'subscription' ? (
                                                    <Package className="w-4 h-4" />
                                                ) : (
                                                    <CreditCard className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span
                                                        className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${item.type === 'subscription'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}
                                                    >
                                                        {item.type === 'subscription' ? 'Plan' : 'Credits'}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-gray-900 line-clamp-2">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">
                                                    {item.type === 'subscription'
                                                        ? 'Billed monthly'
                                                        : `${item.amount} ${item.resource} items`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 px-6 py-4 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-base font-semibold text-gray-900">
                                    ₹{subtotal.toLocaleString()}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="md"
                                    className="w-full justify-center text-gray-700 bg-gray-50 hover:bg-gray-100"
                                    onClick={handleContinueShopping}
                                >
                                    Continue Shopping
                                </Button>
                                <Button
                                    type="button"
                                    size="md"
                                    className="w-full justify-center"
                                    onClick={handleProceedToCheckout}
                                    disabled={cart.length === 0}
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default MiniCartDrawer;

