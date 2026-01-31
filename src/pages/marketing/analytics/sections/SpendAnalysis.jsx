import React from 'react';
import AnalyticsSection from '../AnalyticsSection';
import { DollarSign } from 'lucide-react';

const SpendAnalysis = ({ data }) => {
    return (
        <AnalyticsSection
            title="Spend Analysis"
            subtitle="Budget utilization & burn rate"
        >
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-xs text-red-600 font-bold uppercase">Total Spend</p>
                    <p className="text-xl font-bold text-gray-900">{data.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase">Daily Avg</p>
                    <p className="text-xl font-bold text-gray-900">{data.dailyAvg.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
            </div>

            {/* MOCK AREA CHART */}
            <div className="h-48 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100 flex items-end justify-between px-4 pb-0 overflow-hidden relative">
                {/* Mock Bars/Area */}
                {[40, 60, 45, 80, 55, 70, 65].map((h, i) => (
                    <div key={i} className="w-full mx-1 bg-red-200 hover:bg-red-300 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium bg-white px-2 py-1 rounded shadow-sm opacity-80">
                    Spend Trend
                </div>
            </div>
        </AnalyticsSection>
    );
};

export default SpendAnalysis;
