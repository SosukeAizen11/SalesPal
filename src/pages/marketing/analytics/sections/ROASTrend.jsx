import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot
} from 'recharts';
import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { usePreferences } from '../../../../context/PreferencesContext';

const PerformanceStability = ({ data }) => {
    const { formatCurrency } = usePreferences();
    // data format: { dates: [], roas: [], cpa: [] }

    // Process data for Recharts
    const chartData = useMemo(() => {
        if (!data || !data.dates) return [];
        return data.dates.map((date, index) => ({
            date,
            roas: Number(data.roas[index] || 0),
            cpa: Number(data.cpa[index] || 0),
        }));
    }, [data]);

    // Calculate Dynamic Domains for Better Visual Balance
    // We want to avoid squashing either metric by giving them appropriate padding.
    const axisDomains = useMemo(() => {
        if (chartData.length === 0) return { roas: ['auto', 'auto'], cpa: ['auto', 'auto'] };

        const roasVals = chartData.map(d => d.roas);
        const cpaVals = chartData.map(d => d.cpa);

        const minRoas = Math.min(...roasVals);
        const maxRoas = Math.max(...roasVals);
        const minCpa = Math.min(...cpaVals);
        const maxCpa = Math.max(...cpaVals);

        // Add ~10-20% padding
        const roasPad = (maxRoas - minRoas) * 0.2 || 0.5;
        const cpaPad = (maxCpa - minCpa) * 0.2 || 50;

        return {
            roas: [Math.max(0, minRoas - roasPad).toFixed(2), (maxRoas + roasPad).toFixed(2)],
            cpa: [Math.max(0, minCpa - cpaPad).toFixed(0), (maxCpa + cpaPad).toFixed(0)]
        };
    }, [chartData]);


    // Anomaly Detection Logic
    const anomalies = useMemo(() => {
        if (chartData.length === 0) return { maxROAS: null, minROAS: null, maxCPA: null };

        // Find Max ROAS
        const maxROAS = chartData.reduce((prev, current) => (prev.roas > current.roas) ? prev : current, chartData[0]);
        // Find Min ROAS
        const minROAS = chartData.reduce((prev, current) => (prev.roas < current.roas) ? prev : current, chartData[0]);
        // Find Max CPA (Spike)
        const maxCPA = chartData.reduce((prev, current) => (prev.cpa > current.cpa) ? prev : current, chartData[0]);

        // Calculate volatility (standard deviation estimate)
        const avgRoas = chartData.reduce((sum, d) => sum + d.roas, 0) / chartData.length;
        const roasVariance = chartData.reduce((sum, d) => sum + Math.pow(d.roas - avgRoas, 2), 0) / chartData.length;
        const isVolatile = Math.sqrt(roasVariance) > 0.5; // Threshold for volatility

        return { maxROAS, minROAS, maxCPA, isVolatile };
    }, [chartData]);

    // AI Insight Generator
    const getAIInsight = () => {
        if (chartData.length < 3) return { text: "Insufficient data for detailed stability analysis.", type: "neutral" };

        const { maxROAS, maxCPA, isVolatile } = anomalies;
        const lastDay = chartData[chartData.length - 1];

        // Priority 1: Recent CPA Spike
        if (maxCPA && lastDay && maxCPA.date === lastDay.date && maxCPA.cpa > 500) {
            return {
                text: `CPA spiked recently on ${maxCPA.date}. Consider reviewing audience targeting or bid strategy.`,
                type: "warning"
            };
        }

        // Priority 2: Volatility check
        if (isVolatile) {
            return {
                text: `ROAS peaked on ${maxROAS.date}, but performance shows significant daily volatility. Efficiency is fluctuating.`,
                type: "neutral" // or warning depending on strictness
            };
        }

        // Priority 3: ROAS Peak
        if (maxROAS && chartData.length > 0 && maxROAS.roas > 3.5) {
            return {
                text: `ROAS peaked on ${maxROAS.date}, showing strong efficiency. CPA remained relatively stable during this peak.`,
                type: "positive"
            };
        }

        // Priority 4: Stable
        return {
            text: "Performance remained stable with minor fluctuations. Efficiency is consistent.",
            type: "neutral"
        };
    };

    const insight = getAIInsight();

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">Performance Stability</h3>
                    </div>
                    {/* Legend Badges */}
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded border border-emerald-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-emerald-700">ROAS</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 rounded border border-rose-100">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-xs font-bold text-rose-700">CPA</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 ml-12">ROAS and CPA behavior over the last 7 days</p>
            </div>

            {/* Chart Area */}
            <div className="h-52 w-full mt-2 ml-[-10px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                            dy={10}
                        />
                        {/* Left Axis: ROAS */}
                        <YAxis
                            yAxisId="left"
                            hide
                            domain={axisDomains.roas}
                        />
                        {/* Right Axis: CPA */}
                        <YAxis
                            yAxisId="right"
                            hide
                            orientation="right"
                            domain={axisDomains.cpa}
                        />

                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: '500' }}
                            formatter={(value, name) => [
                                name === 'cpa' ? formatCurrency(value) : `${value}x`,
                                name === 'cpa' ? 'CPA' : 'ROAS'
                            ]}
                        />

                        {/* ROAS Line - Slightly thinner stroke for elegance */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="roas"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            dot={{ r: 0 }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                            isAnimationActive={true}
                        />

                        {/* CPA Line - Slightly thicker stroke for contrast */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cpa"
                            stroke="#f43f5e"
                            strokeWidth={2.5}
                            dot={{ r: 0 }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                            isAnimationActive={true}
                        />

                        {/* Anomaly Dots */}
                        {anomalies.maxROAS && (
                            <ReferenceDot
                                yAxisId="left"
                                x={anomalies.maxROAS.date}
                                y={anomalies.maxROAS.roas}
                                r={4}
                                fill="#10b981"
                                stroke="#fff"
                                strokeWidth={2}
                                isFront={true}
                            />
                        )}
                        {anomalies.maxCPA && (
                            <ReferenceDot
                                yAxisId="right"
                                x={anomalies.maxCPA.date}
                                y={anomalies.maxCPA.cpa}
                                r={4}
                                fill="#f43f5e"
                                stroke="#fff"
                                strokeWidth={2}
                                isFront={true}
                            />
                        )}

                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* AI Micro Insight */}
            <div className={`mt-4 rounded-lg p-3 text-sm flex items-start gap-2 border ${insight.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                insight.type === 'positive' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                    'bg-gray-50 border-gray-100 text-gray-600'
                }`}>
                {insight.type === 'warning' ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> :
                    insight.type === 'positive' ? <Zap className="w-4 h-4 mt-0.5 shrink-0" /> :
                        <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />}
                <p className="font-medium leading-snug">{insight.text}</p>
            </div>
        </div>
    );
};

export default PerformanceStability;
