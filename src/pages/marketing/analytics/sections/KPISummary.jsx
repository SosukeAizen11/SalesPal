import React from 'react';
import { Users, DollarSign, TrendingUp, BarChart } from 'lucide-react';

const KPICard = ({ title, value, trend, icon: Icon, color, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-5 rounded-xl border border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group relative overflow-hidden"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 text-gray-800" />
            </div>
            {trend && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
                title="Active Projects"
                value={data.activeProjects.value}
                trend={null}
                icon={TrendingUp}
                color="bg-blue-100"
                onClick={() => onDetailClick('projects', 'Active Projects')}
            />
            <KPICard
                title="Total Leads"
                value={data.totalLeads.value}
                trend={data.totalLeads.trend}
                icon={Users}
                color="bg-purple-100" // Changed color for visual distinction
                onClick={() => onDetailClick('leads', 'Total Leads Generated')}
            />
            <KPICard
                title="Total Spend"
                value={data.totalSpend.value}
                trend={data.totalSpend.trend}
                icon={DollarSign}
                color="bg-red-100"
                onClick={() => onDetailClick('spend', 'Total Ad Spend')}
            />
            <KPICard
                title="Conversion Rate"
                value={data.convRate.value}
                trend={data.convRate.trend}
                icon={BarChart} // Changed Icon
                color="bg-emerald-100"
                onClick={() => onDetailClick('conv', 'Conversion Rate')}
            />
        </div>
    );
};

export default KPISummary;
