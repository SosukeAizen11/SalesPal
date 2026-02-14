import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSubscription } from './SubscriptionContext';
import { MODULES } from './commerce.config';

const CartContext = createContext();

const STORAGE_KEY = 'salespal_cart';

export const CartProvider = ({ children }) => {
    const { isModuleActive } = useSubscription();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

    // Initialize from LocalStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setCart(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cart", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, loading]);

    const addProductToCart = (product) => {
        if (!product || !product.id) {
            console.error('addProductToCart requires a product with an id');
            return;
        }

        const { id, name, price, type, module: moduleId } = product;

        // Prevent adding if already owned for subscription products
        if (type === 'subscription' && moduleId && isModuleActive(moduleId)) {
            console.warn(`User already owns module: ${moduleId}`);
            return;
        }

        // Prevent duplicates in cart by product id or module id fallback
        const exists = cart.some(item =>
            (item.productId && item.productId === id) ||
            (!item.productId && item.type === 'subscription' && moduleId && item.moduleId === moduleId)
        );

        if (exists) {
            console.warn(`Product already in cart: ${id}`);
            return;
        }

        const newItem = {
            id: `prod_${id}_${Date.now()}`,
            productId: id,
            type: type === 'bundle' ? 'bundle' : 'subscription',
            moduleId: moduleId || null,
            name,
            price,
            quantity: 1
        };

        setCart(prev => [...prev, newItem]);
    };

    const addSubscription = (moduleId) => {
        const moduleConfig = MODULES[moduleId];

        if (!moduleConfig) {
            console.error(`Invalid module ID: ${moduleId}`);
            return;
        }

        // Prevent adding if already owned
        if (isModuleActive(moduleId)) {
            console.warn(`User already owns module: ${moduleId}`);
            return;
        }

        // Prevent duplicates in cart
        if (cart.some(item => item.type === 'subscription' && item.moduleId === moduleId)) {
            console.warn(`Subscription already in cart: ${moduleId}`);
            return;
        }

        const newItem = {
            id: `sub_${moduleId}_${Date.now()}`,
            type: 'subscription',
            moduleId: moduleId,
            name: `SalesPal ${moduleConfig.name} Plan`,
            price: moduleConfig.price,
            quantity: 1
        };

        setCart(prev => [...prev, newItem]);
    };

    const addCreditPack = (moduleId, resource, amount, price) => {
        // Find if identical pack exists
        const existingItemIndex = cart.findIndex(
            item => item.type === 'credit' &&
                item.moduleId === moduleId &&
                item.resource === resource &&
                item.amount === amount
        );

        if (existingItemIndex > -1) {
            // Increase quantity
            setCart(prev => prev.map((item, idx) =>
                idx === existingItemIndex
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            ));
        } else {
            // Add new item
            const newItem = {
                id: `cred_${moduleId}_${resource}_${Date.now()}`,
                type: 'credit',
                moduleId: moduleId,
                resource: resource,
                amount: amount,
                name: `${amount} ${resource} Credits`,
                price: price,
                quantity: 1
            };
            setCart(prev => [...prev, newItem]);
        }
    };

    const removeItem = (itemId) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    const openMiniCart = () => setIsMiniCartOpen(true);
    const closeMiniCart = () => setIsMiniCartOpen(false);
    const toggleMiniCart = () => setIsMiniCartOpen(prev => !prev);

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            isMiniCartOpen,
            addProductToCart,
            addSubscription,
            addCreditPack,
            removeItem,
            clearCart,
            getCartTotal,
            openMiniCart,
            closeMiniCart,
            toggleMiniCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
