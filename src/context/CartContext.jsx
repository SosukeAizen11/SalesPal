import React, { createContext, useContext, useState, useEffect } from 'react';
import { PLANS, TOP_UPS, FEATURES } from '../data/billing';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('salespal_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [ownedProducts, setOwnedProducts] = useState(() => {
        const saved = localStorage.getItem('salespal_owned_products');
        return saved ? JSON.parse(saved) : [
            { id: 'marketing', type: 'subscription', renewalDate: 'Mar 15, 2026', status: 'active', usage: 65 },
            { id: 'images', type: 'topup', balance: 5, total: 10, usage: 50 }
        ];
    });

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        localStorage.setItem('salespal_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('salespal_owned_products', JSON.stringify(ownedProducts));
    }, [ownedProducts]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addToCart = (product) => {
        let alreadyInCart = false;

        setCartItems(prev => {
            // Rule 1: Prevent Duplicate plans (same ID)
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                alreadyInCart = true;
                if (product.type === 'subscription') {
                    showNotification("This plan is already selected.", "info");
                }
                return prev;
            }

            // Rule 2: Prevent Duplicate Active Subscriptions
            if (product.type === 'subscription') {
                const activeOwned = ownedProducts.find(p => p.id === product.id && p.type === 'subscription' && p.status === 'active');
                if (activeOwned) {
                    showNotification("You already have this active module.", "info");
                    return prev;
                }
            }

            // Rule 3: Add-On Compatibility
            if (product.type === 'addon') {
                const activePlan = ownedProducts.find(p => p.type === 'subscription' && p.status === 'active') ||
                    prev.find(p => p.type === 'subscription');
                if (!activePlan) {
                    showNotification("Please select a base plan first.", "error");
                    return prev;
                }
            }

            showNotification("Item added to cart. You can continue selecting more.", "success");
            return [...prev, { ...product, quantity: Number(product.quantity || 1) }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        const numQty = Number(quantity);
        if (numQty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === productId) {
                    if (item.type === 'subscription') return item;
                    return { ...item, quantity: numQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const purchaseCart = () => {
        const newOwned = [...ownedProducts];
        cartItems.forEach(item => {
            if (item.type === 'subscription') {
                const existingIdx = newOwned.findIndex(p => p.id === item.id);
                const planData = {
                    id: item.id,
                    type: 'subscription',
                    renewalDate: 'Apr 08, 2026',
                    status: 'active',
                    usage: 0
                };
                if (existingIdx > -1) newOwned[existingIdx] = planData;
                else newOwned.push(planData);
            } else if (item.type === 'topup') {
                const idx = newOwned.findIndex(p => p.id === item.id);
                const qty = Number(item.quantity || 1);
                if (idx > -1) {
                    newOwned[idx].balance += qty * 10;
                } else {
                    newOwned.push({ id: item.id, type: 'topup', balance: qty * 10, total: qty * 10, usage: 0 });
                }
            } else {
                newOwned.push({ ...item, status: 'active' });
            }
        });
        setOwnedProducts(newOwned);
        clearCart();
        return true;
    };

    const terminatePlan = (planId) => {
        setOwnedProducts(prev => prev.map(p => {
            if (p.id === planId && p.type === 'subscription') {
                return { ...p, status: 'terminated' };
            }
            return p;
        }));
        showNotification("Plan terminated. You can reactivate it anytime.", "info");
    };

    const cartCount = cartItems.length;
    const cartTotal = cartItems.reduce((sum, item) => {
        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        return sum + (price * qty);
    }, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                ownedProducts,
                notification,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                purchaseCart,
                terminatePlan
            }}
        >
            {children}

            {/* Simple Toast UI */}
            {notification && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-fade-in-up border backdrop-blur-md
                    ${notification.type === 'success' ? 'bg-gray-900/95 text-white border-white/10' :
                        notification.type === 'error' ? 'bg-red-600/95 text-white border-red-500' :
                            'bg-blue-600/95 text-white border-blue-500'}`}>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-sm font-bold tracking-tight">{notification.message}</span>
                </div>
            )}
        </CartContext.Provider>
    );
};
