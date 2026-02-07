/**
 * ARCHITECTURE GUARD: LAYER 2 - CAMPAIGN OPTIMIZATION
 * ---------------------------------------------------
 * Scope: Actionable Campaign & Project Level Data.
 * Rules:
 * 1. Focus on actionable optimization metrics (CPC, CPM, Device, Creative).
 * 2. Data must be strictly scoped to the selected Campaign/Project.
 * 3. NO deep root-cause diagnostics by default (must use Drilldown).
 * 4. Must provide access to Layer 3 (AdvancedDrilldown).
 */
import React, { useState } from 'react';
import {
    Megaphone, Activity, BarChart2, ChevronDown, ChevronUp,
    Smartphone, Monitor, Calendar, Zap, Layers
} from 'lucide-react';
import AdvancedDrilldown from './AdvancedDrilldown';

const MetricCard = ({ label, value, subtext }) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg text-center shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
);

const SectionHeader = ({ title, icon: Icon, isOpen, onToggle }) => (
    <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 bg-gray-50 border border-gray-100 first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 transition-colors"
    >
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            {title}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
);

const PlatformScoreCard = ({ score, impShare, clickSplit }) => (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-indigo-900">Platform Intelligence</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">{score?.label || 'Score'}</span>
                <span className="text-2xl font-bold text-indigo-700">{score?.value || 'N/A'}</span>
                <span className="text-xs text-indigo-500">{score?.sub || 'No Data'}</span>
            </div>
            {impShare && (
                <div className="flex flex-col border-l border-indigo-100 pl-6">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Impression Share</span>
                    <span className="text-2xl font-bold text-indigo-700">{impShare}</span>
                    <span className="text-xs text-indigo-500">Lost to rank: Low</span>
                </div>
            )}
            {clickSplit && (
                <div className="flex flex-col border-l border-indigo-100 pl-6">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Link Click Ratio</span>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-indigo-700">
                            {Math.round((clickSplit.link / clickSplit.all) * 100)}%
                        </span>
                        <span className="text-xs text-indigo-500 mb-1">({clickSplit.link} / {clickSplit.all})</span>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const CampaignDetailView = ({ campaign }) => {
    const details = campaign.details || {};
    const [sections, setSections] = useState({
        device: true,
        day: false,
        creative: false
    });
    const [showDrilldown, setShowDrilldown] = useState(false);

    const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="relative overflow-hidden" style={{ minHeight: '600px' }}>
            {/* Main Content (pushed aside or static background when drawer open) */}
            <div className={`transition-all duration-300 ${showDrilldown ? 'opacity-0 translate-x-[-20%]' : 'opacity-100'}`}>
                <div className="space-y-6">
                    {/* 1. Header Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm text-blue-600">
                            <Megaphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                            <p className="text-sm text-gray-500">{campaign.platform} • <span className={campaign.status === 'Running' ? 'text-green-600 font-medium' : 'text-gray-500'}>{campaign.status}</span></p>
                        </div>
                        <div className="ml-auto text-right flex flex-col items-end gap-2">
                            <button
                                onClick={() => setShowDrilldown(true)}
                                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1"
                            >
                                <BarChart2 className="w-3 h-3" /> Advanced Insights
                            </button>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Total Spend</p>
                                <p className="text-xl font-bold text-gray-900">{campaign.spend}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Core Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard label="CPC" value={campaign.cpl} />
                        <MetricCard label="CPM" value={details.cpm || '$12.50'} />
                        <MetricCard label="ROAS" value={details.roas ? `${details.roas}x` : '2.4x'} subtext="Target: 3.0x" />
                        <MetricCard label="Conv. Value" value={details.convValue || '$1,200'} />
                    </div>

                    {/* 3. Platform Intelligence */}
                    {(details.platformScore || details.impShare || details.clickSplit) && (
                        <PlatformScoreCard
                            score={details.platformScore}
                            impShare={details.impShare}
                            clickSplit={details.clickSplit}
                        />
                    )}

                    {/* 4. Optimization Sections (Accordion) */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                        {/* Device Performance */}
                        <div>
                            <SectionHeader
                                title="Device Performance"
                                icon={Smartphone}
                                isOpen={sections.device}
                                onToggle={() => toggleSection('device')}
                            />
                            {sections.device && details.device && (
                                <div className="p-5 bg-white border-t border-gray-100">
                                    <div className="flex h-4 rounded-full overflow-hidden mb-2">
                                        {details.device.map((d, i) => (
                                            <div key={i} style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        {details.device.map((d, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                                <span className="font-medium">{d.name} ({d.value}%)</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Day of Week */}
                        <div className="border-t border-gray-100">
                            <SectionHeader
                                title="Day of Week Performance"
                                icon={Calendar}
                                isOpen={sections.day}
                                onToggle={() => toggleSection('day')}
                            />
                            {sections.day && details.dayPerf && (
                                <div className="p-5 bg-white">
                                    <div className="flex items-end justify-between gap-2 h-24">
                                        {details.dayPerf.map((day, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1 w-full">
                                                <div
                                                    className="w-full bg-blue-100 rounded-t-sm relative group hover:bg-blue-200 transition-colors"
                                                    style={{ height: `${day.value}%` }}
                                                >
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {day.value}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{day.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Creative Performance */}
                        <div className="border-t border-gray-100">
                            <SectionHeader
                                title="Creative Performance"
                                icon={Layers}
                                isOpen={sections.creative}
                                onToggle={() => toggleSection('creative')}
                            />
                            {sections.creative && details.creatives && (
                                <div className="p-0 bg-white">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Creative Name</th>
                                                <th className="px-4 py-3 font-semibold">CTR</th>
                                                <th className="px-4 py-3 font-semibold">CPA</th>
                                                <th className="px-4 py-3 font-semibold">Spend</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {details.creatives.map((c, i) => (
                                                <tr key={i} className="hover:bg-blue-50/30">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                                    <td className={`px-4 py-3 font-bold ${parseFloat(c.ctr) > 2 ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {c.ctr}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{c.cpa}</td>
                                                    <td className="px-4 py-3 text-gray-500">{c.spend}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* AI Insight Footer */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex gap-3 text-amber-900 mt-4">
                        <Zap className="w-5 h-5 shrink-0 text-amber-600" />
                        <div>
                            <h4 className="text-sm font-bold mb-1">AI Recommendation</h4>
                            <p className="text-xs opacity-90 leading-relaxed">
                                Mobile performance is dominating (65% share).
                                Consider increasing mobile bid adjustments by +15% to capture more efficient traffic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DRILLDOWN DRAWER */}
            <div className={`absolute top-0 right-0 w-full h-full bg-white transition-transform duration-300 shadow-xl ${showDrilldown ? 'translate-x-0' : 'translate-x-full'}`}>
                <AdvancedDrilldown details={details} onClose={() => setShowDrilldown(false)} />
            </div>
        </div>
    );
};

export default CampaignDetailView;
