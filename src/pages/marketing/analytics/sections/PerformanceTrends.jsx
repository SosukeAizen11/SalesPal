import React, { useMemo } from 'react';
import AnalyticsSection from '../AnalyticsSection';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium mb-2">{label}</p>
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-semibold text-gray-700 capitalize w-16">{entry.name}:</span>
                    <span className="text-sm font-bold text-gray-900">${entry.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

const PerformanceTrends = ({ data, timeRange }) => {
    // Transform data for Recharts
    const chartData = useMemo(() => {
        if (!data?.dates || !data?.spend || !data?.revenue) return [];

        return data.dates.map((date, i) => ({
            date,
            spend: data.spend[i] || 0,
            revenue: data.revenue[i] || 0
        }));
    }, [data]);

    const isEmpty = !chartData.length || chartData.every(d => d.spend === 0 && d.revenue === 0);

    return (
        <AnalyticsSection
            title="Spend vs Revenue"
            subtitle="Financial efficiency overview"
        >
            {/* Chart Container */}
            <div className="h-72 w-full mt-4">
                {isEmpty ? (
                    <div className="h-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <p className="text-gray-500 font-medium text-sm">No data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
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
                                tickFormatter={(v) => `$${v}`}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                stroke="#10b981" // Green
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 6 }}
                                animationDuration={1000}
                            />
                            <Line
                                type="monotone"
                                dataKey="spend"
                                name="Spend"
                                stroke="#ef4444" // Red
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 6 }}
                                animationDuration={1000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </AnalyticsSection>
    );
};

export default PerformanceTrends;
