import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Image as ImageIcon, Video, Lock, ArrowRight, Check } from 'lucide-react';
import { useSubscription } from '../../commerce/SubscriptionContext';
import { useCart } from '../../commerce/CartContext';
import { useMarketing } from '../../context/MarketingContext';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';

const TopUpDrawer = ({ isOpen, onClose }) => {
    const { isModuleActive } = useSubscription();
    const { addProductToCart } = useCart();
    const { creditState } = useMarketing();
    const navigate = useNavigate();

    // Define packs first so they are available for state calculations
    const packs = [
        {
            id: 'marketing-images-10',
            name: '10 Image Credits',
            resource: 'images',
            amount: 10,
            price: 499,
            icon: ImageIcon,
            desc: 'Generate high-quality AI product photos.'
        },
        {
            id: 'marketing-images-25',
            name: '25 Image Credits',
            resource: 'images',
            amount: 25,
            price: 999,
            icon: ImageIcon,
            desc: 'Best value for bulk generation.',
            popular: true
        },
        {
            id: 'marketing-videos-5',
            name: '5 Video Credits',
            resource: 'videos',
            amount: 5,
            price: 799,
            icon: Video,
            desc: 'Create engaging marketing videos.'
        }
    ];

    // Quantity state: { [packId]: quantity }
    const [selectedPacks, setSelectedPacks] = useState({});

    const isMarketingActive = isModuleActive('marketing');

    const handleIncrement = (packId) => {
        setSelectedPacks(prev => ({
            ...prev,
            [packId]: (prev[packId] || 0) + 1
        }));
    };

    const handleDecrement = (packId) => {
        setSelectedPacks(prev => {
            const current = prev[packId] || 0;
            if (current <= 1) {
                const { [packId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [packId]: current - 1 };
        });
    };

    const handleCheckout = () => {
        const packsToAdd = Object.entries(selectedPacks).map(([packId, qty]) => {
            const pack = packs.find(p => p.id === packId);
            if (!pack) return null;
            return {
                id: pack.id,
                name: pack.name,
                type: 'credits',
                module: 'marketing',
                creditType: pack.resource,
                quantity: pack.amount, // credits per pack
                price: pack.price,
                cartQuantity: qty // Custom field for CartContext
            };
        }).filter(Boolean);

        packsToAdd.forEach(item => {
            addProductToCart(item);
        });

        onClose();
        navigate('/cart');
    };

    // Calculate totals
    const totalItems = Object.values(selectedPacks).reduce((sum, qty) => sum + qty, 0);
    const totalPrice = Object.entries(selectedPacks).reduce((sum, [packId, qty]) => {
        const pack = packs.find(p => p.id === packId);
        return sum + (pack ? pack.price * qty : 0);
    }, 0);



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-none">
                            <h2 className="text-lg font-semibold text-gray-900">Top Up Credits</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide pb-24">
                            {!isMarketingActive ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Lock className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Activate Plan First</h3>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                        You need an active Marketing subscription to purchase and use credits.
                                    </p>
                                    <Button
                                        onClick={() => window.location.href = '/#pricing'}


                                        className="mt-2"
                                    >
                                        View Plans
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Usage Snapshots */}
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-3">
                                            Current Balance
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-50">
                                                <div className="flex items-center text-gray-500 text-xs mb-1">
                                                    <ImageIcon className="w-3 h-3 mr-1" />
                                                    Images
                                                </div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {(creditState?.baseLimits?.images || 0) + (creditState?.extraCredits?.images || 0)}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    + {creditState?.extraCredits?.images || 0} Extra
                                                </div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-50">
                                                <div className="flex items-center text-gray-500 text-xs mb-1">
                                                    <Video className="w-3 h-3 mr-1" />
                                                    Videos
                                                </div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {(creditState?.baseLimits?.videos || 0) + (creditState?.extraCredits?.videos || 0)}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    + {creditState?.extraCredits?.videos || 0} Extra
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Credit Packs */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                            Available Packs
                                        </h3>
                                        <div className="space-y-4">
                                            {packs.map((pack) => {
                                                const quantity = selectedPacks[pack.id] || 0;
                                                return (
                                                    <div
                                                        key={pack.id}
                                                        className={`relative border rounded-xl p-4 transition-all bg-white ${quantity > 0 ? 'border-blue-500 ring-1 ring-blue-100 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                            }`}
                                                    >
                                                        {pack.popular && (
                                                            <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide z-10">
                                                                Best Value
                                                            </span>
                                                        )}

                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${quantity > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                                                                    <pack.icon size={20} strokeWidth={1.5} />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">{pack.name}</h4>
                                                                    <p className="text-xs text-gray-500 mt-0.5">{pack.desc}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold text-gray-900">₹{pack.price}</div>
                                                            </div>
                                                        </div>

                                                        {quantity === 0 ? (
                                                            <Button
                                                                onClick={() => handleIncrement(pack.id)}
                                                                variant="secondary"
                                                                className="w-full mt-3 justify-center text-sm py-2"
                                                            >
                                                                Add
                                                            </Button>
                                                        ) : (
                                                            <div className="flex items-center justify-between mt-3 bg-blue-50 rounded-lg p-1">
                                                                <button
                                                                    onClick={() => handleDecrement(pack.id)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-50 text-blue-600 transition-colors shadow-sm"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="font-bold text-blue-900 text-sm">
                                                                    {quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleIncrement(pack.id)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-50 text-blue-600 transition-colors shadow-sm"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Footer / Checkout Bar */}
                        <div className="bg-white border-t border-gray-100 p-4 flex-none z-20">
                            {totalItems > 0 ? (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="bg-gray-900 text-white rounded-xl p-4 shadow-lg flex items-center justify-between"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {totalItems} item{totalItems > 1 ? 's' : ''} added
                                        </span>
                                        <span className="font-bold text-lg leading-none">
                                            ₹{totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={handleCheckout}
                                        className="bg-white text-gray-900 hover:bg-gray-100 border-none font-bold px-6"
                                    >
                                        Checkout
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </motion.div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Secure payment via Stripe
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
};

export default TopUpDrawer;
