import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../commerce/SubscriptionContext';
import { getDefaultModuleRoute, getModuleRoute } from '../../utils/navigationUtils';

const PurchaseSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading } = useAuth();
    const { subscriptions } = useSubscription();
    const [isNavigating, setIsNavigating] = useState(false);

    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        // Trigger refined confetti burst on mount
        const end = Date.now() + 1000;

        const colors = ['#3b82f6', '#9ca3af', '#10b981'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Single burst for immediate impact
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            zIndex: 999, // Ensure it's on top
            disableForReducedMotion: true
        });

    }, []);

    /**
     * Determine the route for the just-purchased module.
     * Priority: purchased item from cart state → fallback to highest-priority active module.
     */
    const getPurchasedModuleRoute = () => {
        const purchasedItems = location.state?.purchasedItems;
        if (purchasedItems && purchasedItems.length > 0) {
            // If a bundle was purchased, go to /marketing (primary dashboard)
            const hasBundle = purchasedItems.some(item => item.type === 'bundle' || item.moduleId === 'bundle');
            if (hasBundle) return '/marketing';

            // Find the first subscription item and navigate to that module
            const subItem = purchasedItems.find(item => item.type === 'subscription');
            if (subItem?.moduleId) {
                return getModuleRoute(subItem.moduleId);
            }
        }
        // Fallback: use highest-priority active module
        return getDefaultModuleRoute(subscriptions);
    };

    const handleDashboardNavigation = () => {
        setIsNavigating(true);
        // Simulate a brief loading state for better UX
        setTimeout(() => {
            navigate(getPurchasedModuleRoute());
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-md w-full text-center space-y-8 relative z-10">

                {/* Success Hero Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        duration: 0.6
                    }}
                    className="flex justify-center"
                >
                    <motion.div
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center relative"
                        animate={{
                            boxShadow: [
                                "0 0 0 0px rgba(74, 222, 128, 0)",
                                "0 0 0 10px rgba(74, 222, 128, 0.1)",
                                "0 0 0 20px rgba(74, 222, 128, 0)"
                            ]
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 0.4,
                            ease: "easeOut",
                            times: [0, 0.5, 1]
                        }}
                    >
                        <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
                    </motion.div>
                </motion.div>

                {/* Text Reveal Animations */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                delayChildren: 0.3,
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className="space-y-4"
                >
                    <motion.h1
                        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                        className="text-3xl font-bold text-gray-900 tracking-tight"
                    >
                        Purchase Successful!
                    </motion.h1>

                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                        className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed"
                    >
                        Thank you for your purchase. Your account has been upgraded and you're ready to go.
                    </motion.p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <motion.button
                        whileHover={{
                            y: -2,
                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDashboardNavigation}
                        disabled={isNavigating}
                        className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all duration-200 shadow-md shadow-blue-200"
                    >
                        {isNavigating ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Opening Dashboard...
                            </>
                        ) : (
                            <>
                                Go to Dashboard
                                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Premium Welcome Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-sm font-medium text-blue-600 pt-4 border-t border-gray-100 max-w-xs mx-auto"
                >
                    Welcome to SalesPal. Your plan is now active.
                </motion.p>
            </div>
        </div>
    );
};

export default PurchaseSuccess;

