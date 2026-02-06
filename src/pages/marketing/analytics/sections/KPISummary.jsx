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

const KPISummary = ({ data, onDetailClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* 1. ROAS (Primary) */}
            <KPICard
                title="ROAS"
                value={data.roas.value}
                trend={data.roas.trend}
                icon={Target}
                color="bg-indigo-100"
                onClick={() => onDetailClick('spend', 'Return on Ad Spend')}
            />
            {/* 2. Total Spend */}
            <KPICard
                title="Total Spend"
                value={data.totalSpend.value}
                trend={data.totalSpend.trend}
                icon={DollarSign}
                color="bg-red-100"
                onClick={() => onDetailClick('spend', 'Total Ad Spend')}
            />
            {/* 3. Total Leads */}
            <KPICard
                title="Total Leads"
                value={data.totalLeads.value}
                trend={data.totalLeads.trend}
                icon={Users}
                color="bg-purple-100"
                onClick={() => onDetailClick('leads', 'Total Leads Generated')}
            />
            {/* 4. Conversion Rate */}
            <KPICard
                title="Conversion Rate"
                value={data.convRate.value}
                trend={data.convRate.trend}
                icon={BarChart}
                color="bg-emerald-100"
                onClick={() => onDetailClick('conv', 'Conversion Rate')}
            />
            {/* 5. Avg CPC */}
            <KPICard
                title="Avg CPC"
                value={data.avgCpc.value}
                trend={data.avgCpc.trend}
                icon={MousePointer}
                color="bg-blue-100"
                onClick={() => onDetailClick('spend', 'Cost Per Click')}
            />
            {/* 6. Frequency (Fatigue Check) */}
            <KPICard
                title="Frequency"
                value={data.frequency.value}
                trend={data.frequency.trend} // Can be null if warning shown
                icon={Activity}
                color={data.frequency.isFatigue ? "bg-amber-100" : "bg-orange-100"}
                onClick={() => onDetailClick('projects', 'Ad Frequency')}
                isWarning={data.frequency.isFatigue}
            />
        </div>
    );
};

export default KPISummary;
