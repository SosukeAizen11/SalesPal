import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * Premium animated button with shine effect on hover
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - 'primary' or 'secondary'
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const AnimatedButton = ({
    children,
    variant = 'primary',
    onClick,
    className = '',
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const baseClasses = "relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300";

    const variantClasses = {
        primary: "text-white",
        secondary: "text-gray-900 border-2 border-gray-300 hover:border-gray-400"
    };

    const variantStyles = {
        primary: {
            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0px 8px 20px rgba(59, 130, 246, 0.3)'
        },
        secondary: {
            background: 'transparent'
        }
    };

    return (
        <motion.button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={variantStyles[variant]}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={prefersReducedMotion ? {} : {
                y: -2,
                boxShadow: variant === 'primary'
                    ? '0px 12px 24px rgba(59, 130, 246, 0.4)'
                    : '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            {...props}
        >
            {/* Shine effect for primary buttons */}
            {variant === 'primary' && !prefersReducedMotion && (
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                        transform: 'translateX(-100%)'
                    }}
                    animate={isHovered ? {
                        transform: 'translateX(100%)'
                    } : {
                        transform: 'translateX(-100%)'
                    }}
                    transition={{
                        duration: 0.6,
                        ease: 'easeInOut'
                    }}
                />
            )}

            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default AnimatedButton;
