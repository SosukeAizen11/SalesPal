import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Layers, DollarSign, Users, Target, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const ChannelPerformanceMix = ({ data }) => {
    // Data expected format: [{ platform: 'Meta', spend: 1200, revenue: 3600, conversions: 45, roas: 3.0 }]
    const [metric, setMetric] = useState('spend'); // spend, revenue, conversions

    const metricsResult = {
        spend: { label: 'Spend Share', color: '#8884d8', icon: DollarSign },
        revenue: { label: 'Revenue Share', color: '#82ca9d', icon: Target },
        conversions: { label: 'Conversion Share', color: '#ffc658', icon: Users },
    };

    const currentMetric = metricsResult[metric];
    const Icon = currentMetric.icon;

    // Find Winner (Highest ROAS) for visual emphasis
    const sortedByRoas = [...data].sort((a, b) => parseFloat(b.roas) - parseFloat(a.roas));
    const winner = sortedByRoas[0];
    const isWinner = (platform) => platform === winner.platform;

    // Custom Y-Axis Tick to show "Platform • ROAS"
    const CustomYAxisTick = (props) => {
        const { x, y, payload } = props;
        const item = data.find(d => d.platform === payload.value);
        const isBest = isWinner(payload.value);

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={4} textAnchor="end" fill={isBest ? "#111827" : "#6B7280"} fontSize={12} fontWeight={isBest ? 700 : 500}>
                    {payload.value}
                </text>
                <text x={0} y={16} dy={4} textAnchor="end" fill={isBest ? "#059669" : "#9CA3AF"} fontSize={10} fontWeight={isBest ? 600 : 400}>
                    {item ? `${item.roas}x ROAS` : ''} {isBest ? '★' : ''}
                </text>
            </g>
        );
    };

    // Calculate totals for percentages & Overall ROAS
    const totalValue = data.reduce((acc, d) => acc + (d[metric] || 0), 0);
    const totalSpend = data.reduce((acc, d) => acc + (Number(d.spend) || 0), 0);
    const totalRevenue = data.reduce((acc, d) => acc + (Number(d.revenue) || 0), 0);
    const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    // Helper: Contextual Hint
    const getContextHint = () => {
        if (!data || data.length < 2) return null;

        const loser = sortedByRoas[sortedByRoas.length - 1];

        // Safety check
        if (!winner || !loser) return null;

        const diff = parseFloat(winner.roas) - parseFloat(loser.roas);
        if (diff < 0.2) return null; // Ignore small differences

        let message = "";

        if (metric === 'spend') {
            // "Google Ads are currently delivering higher return per ₹ spent."
            message = `${winner.platform} is currently delivering higher return per ₹ spent.`;
        } else if (metric === 'revenue') {
            message = `${winner.platform} is your primary revenue driver ($${Number(winner.revenue).toLocaleString()} generated).`;
        } else {
            message = `${winner.platform} is leading in conversion efficiency.`;
        }

        return (
            <div className="mt-4 flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <TrendingUp className="w-4 h-4 text-gray-900 mt-0.5 shrink-0" />
                <span className="font-medium">{message}</span>
            </div>
        );
    };



    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">Channel Mix</h3>
                        <p className="text-xs text-gray-500">Where your budget performs best</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg self-start">
                    {Object.keys(metricsResult).map((key) => (
                        <button
                            key={key}
                            onClick={() => setMetric(key)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all capitalize whitespace-nowrap ${metric === key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fixed height container for chart to prevent Recharts "width/height(-1)" error */}
            <div className="h-64 w-full mt-4 ml-[-10px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="platform"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={<CustomYAxisTick />}
                            width={110}
                        />
                        <Tooltip
                            cursor={{ fill: '#f9fafb' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    const val = payload[0].value;
                                    return (
                                        <div className="bg-white p-2 border border-gray-100 shadow-sm rounded text-xs font-medium">
                                            {d.platform}: {metric === 'conversions' ? val : `$${val.toLocaleString()}`}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey={metric}
                            radius={[0, 4, 4, 0]}
                            barSize={32}
                            animationDuration={600}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color || currentMetric.color}
                                    opacity={isWinner(entry.platform) ? 1 : 0.4}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>



            {/* Contextual Hint */}
            {getContextHint()}
        </div>
    );
};

export default ChannelPerformanceMix;
