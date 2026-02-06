import React, { useMemo } from 'react';
import AnalyticsSection from '../AnalyticsSection';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-4 py-3">
            <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-lg font-bold text-indigo-600">
                {payload[0].value}x
            </p>
            <p className="text-xs text-gray-400 capitalize">ROAS</p>
        </div>
    );
};

const ROASTrend = ({ data }) => {
    // Transform data for Recharts
    const chartData = useMemo(() => {
        if (!data?.dates || !data?.roas) return [];

        return data.dates.map((date, i) => ({
            date,
            value: parseFloat(data.roas[i] || 0)
        }));
    }, [data]);

    const isEmpty = !chartData.length || chartData.every(d => d.value === 0);

    return (
        <AnalyticsSection
            title="ROAS Trend"
            subtitle="Efficiency over time"
        >
            {/* Chart Container */}
            <div className="h-72 w-full mt-4">
                {isEmpty ? (
                    <div className="h-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <p className="text-gray-500 font-medium text-sm">No data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorRoas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                tickFormatter={(v) => `${v}x`}
                                dx={-5}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRoas)"
                                activeDot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#4f46e5' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </AnalyticsSection>
    );
};

export default ROASTrend;
