import React, { useState, useMemo } from 'react';
import AnalyticsSection from '../AnalyticsSection';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const METRIC_CONFIG = {
    leads: {
        color: '#6366f1',
        label: 'Leads',
        desc: 'Tracking total form fills and calls.',
        format: (v) => v.toLocaleString()
    },
    spend: {
        color: '#10b981',
        label: 'Spend',
        desc: 'Daily budget consumption across channels.',
        format: (v) => `$${v.toLocaleString()}`
    },
    conversions: {
        color: '#f59e0b',
        label: 'Conversions',
        desc: 'Final deals closed from leads.',
        format: (v) => v.toLocaleString()
    }
};

const CustomTooltip = ({ active, payload, label, metric }) => {
    if (!active || !payload?.length) return null;
    const config = METRIC_CONFIG[metric];

    return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-lg font-bold" style={{ color: config.color }}>
                {config.format(payload[0].value)}
            </p>
            <p className="text-xs text-gray-400 capitalize">{config.label}</p>
        </div>
    );
};

const PerformanceTrends = ({ data, timeRange }) => {
    const [metric, setMetric] = useState('leads');
    const config = METRIC_CONFIG[metric];

    // Transform data for Recharts
    const chartData = useMemo(() => {
        if (!data?.dates || !data?.[metric]) return [];

        return data.dates.map((date, i) => ({
            date,
            value: data[metric][i] || 0
        }));
    }, [data, metric]);

    const isEmpty = !chartData.length || chartData.every(d => d.value === 0);

    return (
        <AnalyticsSection
            title="Performance Trends"
            subtitle="Analyze your key metrics over time"
        >
            {/* Metric Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                {Object.entries(METRIC_CONFIG).map(([key, cfg]) => (
                    <button
                        key={key}
                        onClick={() => setMetric(key)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${metric === key
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {cfg.label}
                    </button>
                ))}
            </div>

            {/* Chart Container */}
            <div className="h-72 w-full">
                {isEmpty ? (
                    <div className="h-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No data available</p>
                        <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                        >
                            <defs>
                                <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={config.color} stopOpacity={0.1} />
                                    <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickFormatter={(v) => metric === 'spend' ? `$${v}` : v}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip metric={metric} />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={config.color}
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: config.color }}
                                animationDuration={500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Info Badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                {config.desc}
            </div>
        </AnalyticsSection>
    );
};

export default PerformanceTrends;
