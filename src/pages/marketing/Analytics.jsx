import React from 'react';
import LeadsOverTimeChart from './analytics/components/LeadsOverTimeChart';
import SpendOverTimeChart from './analytics/components/SpendOverTimeChart';
import PlatformSplitChart from './analytics/components/PlatformSplitChart';
import AIActionList from './components/AIActionList';

const MOCK_LEADS_DATA = [
    { date: 'Jan 10', leads: 24 },
    { date: 'Jan 11', leads: 28 },
    { date: 'Jan 12', leads: 35 },
    { date: 'Jan 13', leads: 32 },
    { date: 'Jan 14', leads: 40 },
    { date: 'Jan 15', leads: 45 },
    { date: 'Jan 16', leads: 38 },
];

const MOCK_SPEND_DATA = [
    { date: 'Jan 10', spend: 2000 },
    { date: 'Jan 11', spend: 2200 },
    { date: 'Jan 12', spend: 2100 },
    { date: 'Jan 13', spend: 2400 },
    { date: 'Jan 14', spend: 2800 },
    { date: 'Jan 15', spend: 3000 },
    { date: 'Jan 16', spend: 2900 },
];

const MOCK_PLATFORM_DATA = [
    { name: 'Facebook', value: 45 },
    { name: 'Google Ads', value: 35 },
    { name: 'LinkedIn', value: 20 },
];

const MOCK_AI_ACTIONS = [
    {
        type: 'OPTIMIZE_BUDGET',
        title: 'Optimize Budget Allocation',
        description: 'Shift 15% of budget from LinkedIn to Google Ads based on CPL performance.',
        impact: 'Lower CPL'
    },
    {
        type: 'ROTATE_CREATIVES',
        title: 'Refresh Creative Assets',
        description: 'Facebook Ad Set "Summer Promo" is showing fatigue. Auto-rotate to "Variant B".',
        impact: 'Improve CTR'
    }
];

const Analytics = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trends */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
                        <p className="text-sm text-gray-500">Daily lead generation over the last 7 days</p>
                    </div>
                    <LeadsOverTimeChart data={MOCK_LEADS_DATA} />
                </div>

                {/* Spend Analysis */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Spend Analysis</h3>
                        <p className="text-sm text-gray-500">Daily budget utilization trend</p>
                    </div>
                    <SpendOverTimeChart data={MOCK_SPEND_DATA} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Platform Distribution */}
                <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Platform Split</h3>
                        <p className="text-sm text-gray-500">Budget allocation by channel</p>
                    </div>
                    <PlatformSplitChart data={MOCK_PLATFORM_DATA} />
                </div>

                {/* Key Metrics Summary (Static for now) */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Insight Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                            <span className="text-sm text-indigo-600 font-medium">Avg. CPL</span>
                            <p className="text-2xl font-bold text-indigo-900 mt-1">₹240</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <span className="text-sm text-emerald-600 font-medium">Conv. Rate</span>
                            <p className="text-2xl font-bold text-emerald-900 mt-1">4.2%</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <span className="text-sm text-purple-600 font-medium">Total Spend</span>
                            <p className="text-2xl font-bold text-purple-900 mt-1">₹17,400</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                            <span className="text-sm text-amber-600 font-medium">Total Leads</span>
                            <p className="text-2xl font-bold text-amber-900 mt-1">72</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recommended AI Actions</h3>
                    <p className="text-sm text-gray-500">Optimization opportunities across all campaigns</p>
                </div>
                <AIActionList
                    actions={MOCK_AI_ACTIONS}
                    onApplyAction={() => alert('Action applied! (Mock)')}
                />
            </div>
        </div>
    );
};

export default Analytics;
