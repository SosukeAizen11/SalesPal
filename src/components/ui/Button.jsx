import React from 'react';
import { ArrowRight } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    icon: Icon,
    ...props
}) => {
    const baseStyles = "px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-secondary text-primary hover:bg-secondary/90 transform hover:scale-105",
        outline: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    };

    return (
        <button className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`} {...props}>
            {children}
            {Icon && <Icon className="w-5 h-5" />}
        </button>
    );
};

export default Button;
