import React from 'react';

const Card = ({ children, className = '', noPadding = false, onClick, ...props }) => {
    const baseStyles = "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden";
    const interactiveStyles = onClick ? "cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] transition-transform" : "";

    return (
        <div
            className={`${baseStyles} ${interactiveStyles} ${className}`}
            onClick={onClick}
            {...props}
        >
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </div>
    );
};

export default Card;
