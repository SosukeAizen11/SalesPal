import React from 'react';
import { Users, TrendingUp, MousePointer, Target, Activity, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import CurrencyIcon from '../../../../components/ui/CurrencyIcon';

const KPICard = ({ title, value, trend, percentageChange, isPositive, icon: Icon, color, onClick, isWarning }) => {

    // Determination of color for trend indicator
    // Standard: Up = Green (Good), Down = Red (Bad)
    // Inverted (CPA): Down = Green (Good), Up = Red (Bad)

    // However, the `isPositive` prop passed from parent already handles the logic of "is this good?"
    // So if isPositive is true -> Green. If false -> Red.

    // But we also need the arrow direction.
    // Trend string starts with '+' for up, '-' for down (usually).
    const isUp = trend && trend.startsWith('+');

    const trendColor = isPositive
        ? 'text-emerald-600 bg-emerald-50'
        : 'text-rose-600 bg-rose-50';

    const ArrowIcon = isUp ? ArrowUp : ArrowDown;

    return (
        <div
            onClick={onClick}
            className={`
                relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 cursor-pointer
                transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                ${isWarning ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 hover:border-indigo-100'}
            `}
            style={{ height: '160px' }} // Fixed height for consistency
        >
            {/* Header: Icon & Trend */}
            <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${color} bg-opacity-50 text-gray-700`}>
                    <Icon className="w-5 h-5" />
                </div>

                {isWarning ? (
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                        <AlertTriangle className="w-3 h-3" /> Fatigue
                    </span>
                ) : (percentageChange !== undefined) && (
                    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${trendColor}`}>
                        <ArrowIcon className="w-3 h-3" />
                        <span>{percentageChange}%</span>
                    </div>
                )}
            </div>

            <div className="relative z-10 flex flex-col justify-center flex-1 mt-2">
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
                <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">vs last 7 days</p>
            </div>
        </div>
    );
};

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
                percentageChange={data[key].percentageChange}
                isPositive={data[key].isPositive}
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
            {renderCard('totalSpend', 'Total Spend', CurrencyIcon, 'bg-red-100', 'Total Ad Spend')}

            {/* 4. CPA (Efficiency) - NEW */}
            {renderCard('cpa', 'Avg CPA', MousePointer, 'bg-blue-100', 'Cost Per Acquisition')}

            {/* Extended Metrics (Non-Pulse Mode Only) */}
            {mode !== 'pulse' && (
                <>
                    {renderCard('totalConversions', 'Conversions', Users, 'bg-purple-100', 'Total Conversions')}
                    {renderCard('frequency', 'Frequency', Activity, "bg-orange-100", 'Ad Frequency')}
                </>
            )}
        </div>
    );
};

export default KPISummary;
