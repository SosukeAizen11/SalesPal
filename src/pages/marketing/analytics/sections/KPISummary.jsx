import React from 'react';
import { Users, DollarSign, TrendingUp, BarChart, MousePointer, Target, Activity, AlertTriangle } from 'lucide-react';

const KPICard = ({ title, value, trend, icon: Icon, color, onClick, isWarning }) => (
    <div
        onClick={onClick}
        className={`bg-white p-5 rounded-xl border cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden ${isWarning ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 hover:border-blue-300'}`}
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 text-gray-800" />
            </div>
            {isWarning ? (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> High Fatigue
                </span>
            ) : trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{title}</p>
        </div>
    </div>
);

const KPISummary = ({ data, onDetailClick, mode = 'full' }) => {
    // Helper to render card if data exists
    const renderCard = (key, title, icon, color, label) => {
        if (!data[key]) return null;
        return (
            <KPICard
                key={key}
                title={title}
                value={data[key].value}
                trend={data[key].trend}
                icon={icon}
                color={color}
                onClick={() => onDetailClick(key, label || title)}
                isWarning={data[key].isFatigue}
            />
        );
    };

    const gridClass = mode === 'pulse'
        ? "grid grid-cols-2 lg:grid-cols-4 gap-4"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4";

    return (
        <div className={gridClass}>
            {/* 1. ROAS (Primary - Financial Health) */}
            {renderCard('roas', 'ROAS', Target, 'bg-indigo-100', 'Return on Ad Spend')}

            {/* 2. Total Revenue (Financial Health) - NEW */}
            {renderCard('totalRevenue', 'Total Revenue', TrendingUp, 'bg-emerald-100', 'Total Revenue')}

            {/* 3. Total Spend (Financial Health) */}
            {renderCard('totalSpend', 'Total Spend', DollarSign, 'bg-red-100', 'Total Ad Spend')}

            {/* 4. CPA (Efficiency) - NEW */}
            {renderCard('cpa', 'Avg CPA', MousePointer, 'bg-blue-100', 'Cost Per Acquisition')}

            {/* Extended Metrics (Non-Pulse Mode Only) */}
            {mode !== 'pulse' && (
                <>
                    {renderCard('totalConversions', 'Conversions', Users, 'bg-purple-100', 'Total Conversions')}
                    {renderCard('frequency', 'Frequency', Activity, data.frequency?.isFatigue ? "bg-amber-100" : "bg-orange-100", 'Ad Frequency')}
                </>
            )}
        </div>
    );
};

export default KPISummary;
