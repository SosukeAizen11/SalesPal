import React, { useState } from 'react';
import AnalyticsSection from '../AnalyticsSection';
import { BarChart2 } from 'lucide-react';

const PerformanceTrends = ({ data, timeRange }) => {
    const [metric, setMetric] = useState('leads'); // leads, spend, conversions

    const descriptions = {
        leads: "Tracking total form fills and calls.",
        spend: "Daily budget consumption across channels.",
        conversions: "Final deals closed from leads."
    };

    return (
        <AnalyticsSection
            title="Performance Trends"
            subtitle="Analyze your key metrics over time"
        >
            <div className="flex items-center gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                {['leads', 'spend', 'conversions'].map(m => (
                    <button
                        key={m}
                        onClick={() => setMetric(m)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${metric === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* MOCK CHART AREA */}
            <div className="h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                <BarChart2 className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-gray-400 font-medium text-sm">Line Chart Visualization</p>
                <p className="text-gray-300 text-xs mt-1">Showing {metric} for last {timeRange}</p>

                {/* TOOLTIP MOCK */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-xs text-gray-600">
                    <span className="font-bold text-gray-800 mr-1">Info:</span>
                    {descriptions[metric]}
                </div>
            </div>
        </AnalyticsSection>
    );
};

export default PerformanceTrends;
