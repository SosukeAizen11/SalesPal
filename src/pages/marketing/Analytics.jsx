import React from 'react';
import { LayoutDashboard, Users, MousePointer2, Target, Download } from 'lucide-react';
import AnalyticsMetricCard from './components/analytics/AnalyticsMetricCard';
import PerformanceSection from './components/analytics/PerformanceSection';
import AIInsightsPanel from './components/analytics/AIInsightsPanel';
import NextActionsPanel from './components/analytics/NextActionsPanel';

const Analytics = () => {
    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Marketing Analytics</h2>
                    <p className="text-gray-500 mt-1">Real-time performance metrics and AI insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Last 30 Days</span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <AnalyticsMetricCard
                    label="Total Impressions"
                    value="124.5k"
                    trend="up"
                    trendValue="12%"
                    icon={LayoutDashboard}
                    colorClass="bg-purple-600"
                />
                <AnalyticsMetricCard
                    label="Link Clicks"
                    value="3,842"
                    trend="up"
                    trendValue="8.5%"
                    icon={MousePointer2}
                    colorClass="bg-blue-600"
                />
                <AnalyticsMetricCard
                    label="Total Leads"
                    value="145"
                    trend="up"
                    trendValue="24%"
                    icon={Users}
                    colorClass="bg-green-600"
                />
                <AnalyticsMetricCard
                    label="Cost Per Lead"
                    value="₹450"
                    trend="down"
                    trendValue="5%"
                    icon={Target}
                    colorClass="bg-amber-500"
                />
            </div>

            {/* Main Content Split */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left 2/3: Performance Table */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    <PerformanceSection />

                    {/* Placeholder for future Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 h-[300px] flex items-center justify-center relative overflow-hidden group">
                        <div className="text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">Lead Acquisition Trend</h3>
                            <p className="text-gray-500 text-sm">Interactive chart coming soon in the next update.</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80 pointer-events-none"></div>
                        {/* Fake chart bars for visual filler */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-12 opacity-10 gap-2">
                            {[40, 60, 45, 70, 55, 80, 65, 90, 75, 50, 60, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-secondary rounded-t-sm" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right 1/3: AI & Actions */}
                <div className="space-y-6 md:space-y-8">
                    <AIInsightsPanel />
                    <NextActionsPanel />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
