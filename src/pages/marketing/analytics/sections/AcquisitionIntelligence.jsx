import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Sparkles, Users, Target, Filter } from 'lucide-react';

// --- MOCK DATA ---
const mockKpis = {
    totalLeads: { value: '1,240', change: 12.5, isPositive: true, sparkline: [120, 130, 140, 150, 180, 200, 240] },
    cpl: { value: '₹124', change: -5.2, isPositive: true, sparkline: [140, 135, 130, 125, 128, 126, 124] }, // Negative change is positive for CPL
    cvr: { value: '3.4%', change: 0.8, isPositive: true, sparkline: [2.8, 2.9, 3.1, 3.0, 3.2, 3.3, 3.4] },
    qualified: { value: '850', change: 15.3, isPositive: true, sparkline: [300, 350, 400, 500, 600, 750, 850] }
};

const mockTrendData = [
    { name: 'Mon', leads: 120, cpl: 140 },
    { name: 'Tue', leads: 145, cpl: 135 },
    { name: 'Wed', leads: 160, cpl: 132 },
    { name: 'Thu', leads: 155, cpl: 138 },
    { name: 'Fri', leads: 180, cpl: 125 },
    { name: 'Sat', leads: 220, cpl: 120 },
    { name: 'Sun', leads: 260, cpl: 118 },
];

const mockFunnel = {
    leads: 1240,
    qualified: 850,
    converted: 289
};

const mockChannels = [
    { name: 'Meta Ads', leads: 640, cpl: '₹145', qualRate: '62%', status: 'warning' },
    { name: 'Google Ads', leads: 480, cpl: '₹110', qualRate: '71%', status: 'optimal' },
    { name: 'LinkedIn', leads: 120, cpl: '₹320', qualRate: '85%', status: 'neutral' }
];

const mockCampaigns = [
    { name: 'Brand Awareness – Q1', leads: 340, cpl: '₹118', qualRate: '64%', status: 'efficient' },
    { name: 'Retargeting – High Intent', leads: 290, cpl: '₹96', qualRate: '72%', status: 'efficient' },
    { name: 'Prospecting – Broad', leads: 210, cpl: '₹165', qualRate: '48%', status: 'high-cost' }
];

// --- SUB-COMPONENTS ---

const KPICard = ({ title, metric, change, isPositive, icon, inverseColorLogic = false }) => {
    const IconComponent = icon;
    // If inverseColorLogic is true (like for CPL), negative change is good (green), positive is bad (red)
    const isGood = inverseColorLogic ? !isPositive : isPositive;
    const colorClass = isGood ? 'text-emerald-600' : 'text-rose-600';
    const bgColorClass = isGood ? 'bg-emerald-50' : 'bg-rose-50';
    const strokeColor = isGood ? '#059669' : '#e11d48';

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between" style={{ height: '140px' }}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{title}</span>
                </div>
            </div>
            <div className="flex items-end justify-between mt-auto">
                <div>
                    <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">{metric}</h4>
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${bgColorClass} ${colorClass}`}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(change).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium ml-1 uppercase tracking-wider mt-0.5">vs last 7 days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const AcquisitionIntelligence = () => {
    // Funnel calculations
    const qualDrop = Math.round((1 - mockFunnel.qualified / mockFunnel.leads) * 100);
    const convDrop = Math.round((1 - mockFunnel.converted / mockFunnel.qualified) * 100);

    return (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-indigo-50 rounded-lg">
                            <Target className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Acquisition Intelligence</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Lead generation performance and funnel efficiency</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-gray-700">Live Acquisition Data</span>
                </div>
            </div>

            <div className="p-6">
                {/* 1. KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <KPICard
                        title="Total Leads"
                        metric={mockKpis.totalLeads.value}
                        change={mockKpis.totalLeads.change}
                        isPositive={mockKpis.totalLeads.isPositive}
                        icon={Users}
                    />
                    <KPICard
                        title="Cost Per Lead"
                        metric={mockKpis.cpl.value}
                        change={mockKpis.cpl.change}
                        isPositive={mockKpis.cpl.change < 0} // Negative is good
                        icon={Target}
                        inverseColorLogic={true}
                    />
                    <KPICard
                        title="Conversion Rate"
                        metric={mockKpis.cvr.value}
                        change={mockKpis.cvr.change}
                        isPositive={mockKpis.cvr.isPositive}
                        icon={Sparkles}
                    />
                    <KPICard
                        title="Qualified Leads"
                        metric={mockKpis.qualified.value}
                        change={mockKpis.qualified.change}
                        isPositive={mockKpis.qualified.isPositive}
                        icon={Filter}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* 2. Lead Trend Chart */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Lead Volume vs CPL (7 Days)
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickFormatter={(val) => `₹${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        name="Leads"
                                        dataKey="leads"
                                        stroke="#4F46E5"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#4F46E5' }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        name="CPL (₹)"
                                        dataKey="cpl"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ r: 3, fill: '#10B981' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* NEW: Top Campaign Lead Performance */}
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-1">Top Campaign Lead Performance</h3>
                            <p className="text-xs text-gray-500 mb-4">Campaign-level acquisition efficiency</p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold rounded-l-lg">Campaign Name</th>
                                            <th className="px-4 py-2 font-semibold text-right">Leads</th>
                                            <th className="px-4 py-2 font-semibold text-right">CPL</th>
                                            <th className="px-4 py-2 font-semibold text-right">Qual. Rate</th>
                                            <th className="px-4 py-2 font-semibold text-center rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {mockCampaigns.map((camp, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900">{camp.name}</td>
                                                <td className="px-4 py-3 text-right text-gray-700">{camp.leads}</td>
                                                <td className="px-4 py-3 text-right text-gray-700">{camp.cpl}</td>
                                                <td className="px-4 py-3 text-right text-gray-700">{camp.qualRate}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {camp.status === 'efficient' && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                            Efficient
                                                        </span>
                                                    )}
                                                    {camp.status === 'monitor' && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                            Monitor
                                                        </span>
                                                    )}
                                                    {camp.status === 'high-cost' && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
                                                            High Cost
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 3. Mini Funnel & 4. Channel Efficiency */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* 3. Mini Funnel Visual */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Funnel Efficiency</h3>
                            <div className="space-y-3">
                                <div className="relative">
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-gray-600">Total Leads</span>
                                        <span className="text-gray-900">{mockFunnel.leads}</span>
                                    </div>
                                    <div className="h-4 bg-indigo-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 px-2 py-0.5">
                                    <span className="flex items-center gap-1"><ArrowDownRight className="w-3 h-3 text-rose-400" /> {qualDrop}% drop</span>
                                </div>
                                <div className="relative">
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-gray-600">Qualified Leads</span>
                                        <span className="text-gray-900">{mockFunnel.qualified}</span>
                                    </div>
                                    <div className="h-4 bg-blue-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(mockFunnel.qualified / mockFunnel.leads) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 px-2 py-0.5">
                                    <span className="flex items-center gap-1"><ArrowDownRight className="w-3 h-3 text-rose-400" /> {convDrop}% drop</span>
                                </div>
                                <div className="relative">
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-gray-600">Converted</span>
                                        <span className="text-gray-900">{mockFunnel.converted}</span>
                                    </div>
                                    <div className="h-4 bg-emerald-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(mockFunnel.converted / mockFunnel.leads) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Channel Lead Efficiency */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Channel Lead Efficiency</h3>
                            <div className="space-y-3">
                                {mockChannels.map((channel, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white transition-colors">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{channel.name}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
                                                <span>{channel.leads} leads</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span>{channel.qualRate} qual.</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-gray-900">{channel.cpl}</div>
                                            <div className="text-[10px] text-gray-500 uppercase font-semibold">CPL</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. AI Lead Insight */}
                <div className="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-4">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 mt-0.5">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900 mb-1">AI Acquisition Insight</h4>
                        <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                            Google is generating leads at a lower CPL and higher qualification rate compared to Meta. Consider increasing Google budget allocation by 15% to optimize acquisition efficiency this week.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AcquisitionIntelligence;
