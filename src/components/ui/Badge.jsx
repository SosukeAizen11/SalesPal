import React from 'react';

const Badge = ({ children, className = "", variant = "secondary" }) => {
    const variants = {
        secondary: "bg-secondary text-primary",
        outline: "bg-white/5 text-secondary border border-white/10",
    };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${variants[variant] || variants.secondary} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
