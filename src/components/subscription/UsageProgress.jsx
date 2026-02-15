import React from 'react';
import { motion } from 'framer-motion';

const UsageProgress = ({ label, used, limit, color = 'blue' }) => {
    // Determine progress percentage
    const percentage = Math.min(100, Math.round((used / limit) * 100));

    // Determine color classes based on usage and prop
    const getColor = () => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-amber-500';
        return color === 'blue' ? 'bg-blue-600' :
            color === 'green' ? 'bg-emerald-600' :
                color === 'purple' ? 'bg-purple-600' : 'bg-blue-600';
    };

    const barColor = getColor();

    return (
        <div className="mb-3 last:mb-0 group">
            <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors">
                    {label}
                </span>
                <span className="text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    {used} <span className="text-gray-400 font-normal">/ {limit}</span>
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50 relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor} shadow-sm relative overflow-hidden`}
                >
                    {/* Shimmer effect integration */}
                    <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default UsageProgress;
