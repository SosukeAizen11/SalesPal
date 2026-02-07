import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Sparkles } from 'lucide-react';

const StatBox = ({ label, value, trend, isPositive }) => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-end justify-between">
            <h4 className="text-xl font-bold text-gray-900">{value}</h4>
            <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {trend}
            </div>
        </div>
    </div>
);

const AnalyticsSnapshot = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles className="w-24 h-24 text-primary" />
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" /> Analytics Snapshot
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Real-time performance metrics for current billing cycle.</p>
                </div>
                <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    Live Updates
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatBox
                    label="Marketing ROI"
                    value="4.8x"
                    trend="+0.6x"
                    isPositive={true}
                />
                <StatBox
                    label="Revenue Impact"
                    value="₹14.5L"
                    trend="+12%"
                    isPositive={true}
                />
                <StatBox
                    label="Burn Rate"
                    value="₹540/day"
                    trend="-8%"
                    isPositive={true}
                />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-400 italic">
                    *Based on campaign performance data from Jan 1 - Feb 6.
                </div>
                <button
                    onClick={() => window.location.hash = '#financials'} // In real app use navigation
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                    View Detailed Financials
                </button>
            </div>
        </div>
    );
};

export default AnalyticsSnapshot;
