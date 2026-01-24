import React from 'react';
import { Megaphone, Users, DollarSign, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm font-medium">{title}</span>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 text-gray-700" />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className={`text-sm mt-1 font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {change} <span className="text-gray-400 font-normal">vs last month</span>
                </p>
            </div>
        </div>
    </div>
);

const MarketingDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketing Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your AI marketing activity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Campaigns"
                    value="12"
                    change="+2"
                    icon={Megaphone}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Leads Generated"
                    value="1,420"
                    change="+15.3%"
                    icon={Users}
                    color="bg-purple-100"
                />
                <StatCard
                    title="Ad Spend"
                    value="$12,450"
                    change="-4.2%"
                    icon={DollarSign}
                    color="bg-green-100"
                />
                <StatCard
                    title="AI Efficiency"
                    value="94%"
                    change="+5.1%"
                    icon={TrendingUp}
                    color="bg-orange-100"
                />
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center py-20">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Feed</h3>
                    <p className="text-gray-500">
                        Your recent campaign updates and AI optimizations will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MarketingDashboard;
