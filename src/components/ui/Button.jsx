import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

    const variants = {
        primary: "text-white hover:opacity-90 focus:ring-blue-500 shadow-lg",
        secondary: "bg-white border text-gray-700 hover:bg-gray-50 focus:ring-blue-200",
        outline: "bg-white border text-gray-700 hover:bg-blue-50 hover:border-blue-400 focus:ring-blue-200",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
        link: "text-blue-600 underline-offset-4 hover:underline p-0 h-auto"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            style={variant === 'primary' ? {
                background: 'linear-gradient(90deg, #1D7CFF 0%, #073B8F 100%)',
                boxShadow: '0px 14px 40px rgba(29, 124, 255, 0.25)'
            } : {}}
            onMouseEnter={(e) => {
                if (variant === 'primary') {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #2A88FF 0%, #0A4DB4 100%)';
                }
            }}
            onMouseLeave={(e) => {
                if (variant === 'primary') {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #1D7CFF 0%, #073B8F 100%)';
                }
            }}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
