import React from 'react';

const Card = ({ children, className = "", hover = true }) => {
    return (
        <div className={`rounded-xl bg-white/5 border border-white/5 ${hover ? 'hover:border-white/10 transition-colors' : ''} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
