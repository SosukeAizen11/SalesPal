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

        const { id, name, price, type, module: moduleId, creditType, quantity, cartQuantity } = product;

        // Prevent adding if already owned for subscription products
        if (type === 'subscription' && moduleId && isModuleActive(moduleId)) {
            console.warn(`User already owns module: ${moduleId}`);
            return;
        }

        // Check for existing item by ID
        const existingItemIndex = cart.findIndex(item => item.id === id);

        if (existingItemIndex > -1) {
            // If credit pack exists, increment quantity (of packs)
            if (type === 'credits') {
                setCart(prev => prev.map((item, idx) =>
                    idx === existingItemIndex
                        ? { ...item, quantity: (item.quantity || 1) + (cartQuantity || 1) }
                        : item
                ));
                return;
            } else {
                console.warn(`Product already in cart: ${id}`);
                return;
            }
        }

        // Correctly mapping incoming product data to cart item structure
        const isCreditPack = type === 'credits';

        // Map product IDs to clean display names
        const displayNames = {
            'marketing': 'Marketing',
            'sales': 'Sales',
            'post-sales': 'Post-Sales',
            'support': 'Support',
            'salespal-360': 'SalesPal 360'
        };

        const newItem = {
            id: id, // Use standardized ID
            productId: id,
            type: type === 'bundle' ? 'bundle' : (isCreditPack ? 'credits' : 'subscription'),
            moduleId: moduleId || null,
            name: displayNames[id] || name, // Use clean display name
            iconKey: moduleId || id, // Store icon key for mapping
            price,
            // For credits: `quantity` passed from TopUp is the amount of credits (e.g. 10).
            // We store that as `amount` for the logic.
            // `quantity` for the cart item itself starts at 1 (1 pack).
            amount: isCreditPack ? quantity : undefined,
            resource: creditType || undefined,
            quantity: cartQuantity || 1 // Use passed quantity or default to 1
            // Wait, in `TopUpDrawer`: `quantity: pack.amount` (credits). 
            // My previous thought: `quantity` passed to `addProductToCart` is credits count.
            // I need a separate field for `packCount`.

            // Let's defer this and fix TopUpDrawer to pass `cartQuantity`.
            // In TopUpDrawer: `cartQuantity: quantity` (pack count).
            // In CartContext: `const { ..., cartQuantity } = product`.

            // I need to update destructuring in CartContext first.
            // Let's do that in a separate step or assume I'll fix it.
            // I'll update line 42 as well.
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

        // Map module IDs to clean display names
        const displayNames = {
            'marketing': 'Marketing',
            'sales': 'Sales',
            'postSale': 'Post-Sales',
            'support': 'Support',
            'bundle': 'SalesPal 360'
        };

        const newItem = {
            id: `sub_${moduleId}_${Date.now()}`,
            type: 'subscription',
            moduleId: moduleId,
            name: displayNames[moduleId] || moduleConfig.name,
            iconKey: moduleId, // Store icon key for mapping
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
