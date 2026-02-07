import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Pause, Play, Edit, AlertTriangle, TrendingUp, TrendingDown,
    DollarSign, Target, Users, MousePointerClick, Activity, ChevronDown,
    ChevronUp, Facebook, Chrome, Linkedin, Smartphone, Monitor, Tablet,
    Eye, AlertCircle, CheckCircle, XCircle, ArrowRight, X
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ComposedChart, Line, BarChart, Bar, Cell
} from 'recharts';
import { useMarketing } from '../../../context/MarketingContext';
import { useIntegrations } from '../../../context/IntegrationContext';
import { canLaunchCampaign } from '../../../utils/campaignGuard';
import { getProjectsBackRoute, getCampaignEditRoute } from '../../../utils/navigationUtils';
import { formatCurrency } from '../../../utils/formatCurrency';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

// ============================================
// DECISION-FIRST CAMPAIGN CONTROL PANEL
// ============================================

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-xs">
                <p className="font-semibold text-gray-900 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-gray-500 capitalize">{entry.name}:</span>
                        <span className="font-semibold text-gray-900">
                            {entry.name === 'ROAS' ? `${entry.value}x` :
                                entry.name === 'CPA' ? formatCurrency(entry.value) : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Health Status Calculation
const getCampaignHealth = (roas, cpa, spend, revenue) => {
    if (spend > 500 && revenue === 0) return { status: 'burning', color: 'bg-red-500', textColor: 'text-red-600', label: 'BURNING', action: 'Pause immediately' };
    if (roas < 1.5) return { status: 'at-risk', color: 'bg-amber-500', textColor: 'text-amber-600', label: 'AT RISK', action: 'Review targeting' };
    if (roas >= 3) return { status: 'healthy', color: 'bg-emerald-500', textColor: 'text-emerald-600', label: 'HEALTHY', action: 'Consider scaling' };
    return { status: 'stable', color: 'bg-blue-500', textColor: 'text-blue-600', label: 'STABLE', action: 'Monitor performance' };
};

export default function CampaignDetails() {
    const { projectId, campaignId } = useParams();
    const navigate = useNavigate();
    const { getCampaignById, updateCampaign } = useMarketing();
    const { integrations } = useIntegrations();

    const [campaign, setCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [launchError, setLaunchError] = useState(null);
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const [activeKPI, setActiveKPI] = useState(null); // 'roas' | 'revenue' | 'spend' | 'cpa' | 'convValue'

    useEffect(() => {
        const data = getCampaignById(campaignId);
        setCampaign(data);
        setIsLoading(false);
    }, [campaignId, getCampaignById]);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading campaign control panel...</div>;

    if (!campaign) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">Campaign not found</div>
                <Button onClick={() => navigate(getProjectsBackRoute(projectId))}>Back to Projects</Button>
            </div>
        );
    }

    const { status, name, dailyBudget, platforms } = campaign;
    const isRunning = status === 'active';
    const isPaused = status === 'paused';
    const isDraft = status === 'draft';

    const campaignForGuard = { platforms: platforms || ['facebook', 'google'] };
    const launchCheck = canLaunchCampaign(campaignForGuard, integrations);

    const handleAction = (action) => {
        if (action === 'pause') {
            updateCampaign(campaignId, { status: 'paused' });
            setCampaign(prev => ({ ...prev, status: 'paused' }));
            return;
        }
        if (action === 'resume' || action === 'launch') {
            const check = canLaunchCampaign(campaignForGuard, integrations);
            if (!check.allowed) {
                setLaunchError({ message: `Connect ${check.missing.join(', ')} to ${action}`, missing: check.missing });
                return;
            }
        }
        setLaunchError(null);
        updateCampaign(campaignId, { status: 'active' });
        setCampaign(prev => ({ ...prev, status: 'active' }));
    };

    const handleEdit = () => navigate(getCampaignEditRoute(projectId, campaignId));

    const getPlatformIcon = (p) => {
        if (p?.includes('Facebook') || p?.includes('Meta')) return <Facebook className="w-4 h-4 text-[#1877F2]" />;
        if (p?.includes('Google')) return <Chrome className="w-4 h-4 text-[#EA4335]" />;
        if (p?.includes('LinkedIn')) return <Linkedin className="w-4 h-4 text-[#0077B5]" />;
        return null;
    };

    // --- DATA CALCULATIONS ---
    // Read directly from campaign object (same source as Dashboard/KPI Drilldown)
    const parseValue = (val) => typeof val === 'number' ? val : parseFloat(String(val || 0).replace(/[^0-9.-]/g, ''));

    // Use campaign-level data, same as seedData.js structure
    const rawSpend = parseValue(campaign.spend);
    const rawRevenue = parseValue(campaign.revenue);
    const rawConversions = parseValue(campaign.conversions);
    const rawClicks = parseValue(campaign.clicks);
    const rawImpressions = parseValue(campaign.impressions);

    const roasValue = rawSpend > 0 ? rawRevenue / rawSpend : 0;
    const cpaValue = rawConversions > 0 ? rawSpend / rawConversions : 0;
    const convValue = rawConversions > 0 ? rawRevenue / rawConversions : 0;
    const ctr = rawImpressions > 0 ? (rawClicks / rawImpressions) * 100 : 0;
    const cvr = rawClicks > 0 ? (rawConversions / rawClicks) * 100 : 0;
    const cpc = rawClicks > 0 ? rawSpend / rawClicks : 0;
    const cpm = rawImpressions > 0 ? (rawSpend / rawImpressions) * 1000 : 0;
    const frequency = campaign.frequency || 1.4;

    const health = getCampaignHealth(roasValue, cpaValue, rawSpend, rawRevenue);

    // Mock efficiency trend (7 days)
    const efficiencyTrend = [
        { day: 'Mon', roas: 2.1, cpa: 45 },
        { day: 'Tue', roas: 2.3, cpa: 42 },
        { day: 'Wed', roas: 1.9, cpa: 48 },
        { day: 'Thu', roas: 2.5, cpa: 38 },
        { day: 'Fri', roas: 2.8, cpa: 35 },
        { day: 'Sat', roas: 2.6, cpa: 40 },
        { day: 'Sun', roas: roasValue.toFixed(1), cpa: cpaValue.toFixed(0) },
    ];

    // Mock creatives with auto-tagging
    const creatives = [
        { id: 1, name: 'Ad Variant A', spend: 3200, ctr: 2.1, cvr: 4.5, conversions: 12, cpa: 267 },
        { id: 2, name: 'Ad Variant B', spend: 5800, ctr: 3.2, cvr: 6.1, conversions: 28, cpa: 207 },
        { id: 3, name: 'Ad Variant C', spend: 3450, ctr: 0.8, cvr: 1.2, conversions: 5, cpa: 690 },
    ].map(c => ({
        ...c,
        tag: c.cvr >= 5 ? 'winner' : c.cvr < 2 ? 'bleeder' : 'neutral'
    })).sort((a, b) => b.conversions - a.conversions);

    // Click-to-Conversion funnel
    const estimatedLeads = Math.round(rawConversions * 2.5);
    const clickToLeadDrop = rawClicks > 0 ? ((rawClicks - estimatedLeads) / rawClicks * 100).toFixed(0) : 0;
    const leadToConvDrop = estimatedLeads > 0 ? ((estimatedLeads - rawConversions) / estimatedLeads * 100).toFixed(0) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============================================ */}
            {/* 1. STICKY STATUS BAR - Decision in 3 seconds */}
            {/* ============================================ */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left: Identity */}
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(getProjectsBackRoute(projectId))} className="text-gray-400 hover:text-gray-600">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-lg font-bold text-gray-900">{name}</h1>
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${health.color}`}>
                                        {health.label}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                    {platforms?.map(p => <span key={p} className="flex items-center gap-1">{getPlatformIcon(p)} {p}</span>)}
                                    <span>•</span>
                                    <span>Budget: {dailyBudget}/day</span>
                                    <span>•</span>
                                    <span>Today: {formatCurrency(rawSpend / 7)} spent</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Primary Actions */}
                        <div className="flex items-center gap-2">
                            {isRunning && (
                                <Button variant="secondary" size="sm" onClick={() => handleAction('pause')}>
                                    <Pause className="w-4 h-4 mr-1" /> Pause
                                </Button>
                            )}
                            {isPaused && (
                                <Button size="sm" onClick={() => handleAction('resume')} disabled={!launchCheck.allowed}>
                                    <Play className="w-4 h-4 mr-1" /> Resume
                                </Button>
                            )}
                            {isDraft && (
                                <Button size="sm" onClick={() => handleAction('launch')} disabled={!launchCheck.allowed}>
                                    Launch Campaign
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={handleEdit}>
                                <Edit className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {launchError && (
                        <div className="mt-2 bg-red-50 border border-red-100 text-red-700 text-xs p-2 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> {launchError.message}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

                {/* ============================================ */}
                {/* 2. FINANCIAL REALITY - What's happening with money? */}
                {/* ============================================ */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Financial Reality</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'ROAS', kpiKey: 'roas', value: `${roasValue.toFixed(2)}x`, icon: TrendingUp, color: roasValue >= 3 ? 'text-emerald-600' : roasValue >= 2 ? 'text-blue-600' : 'text-red-600', threshold: roasValue >= 3 ? 'Excellent' : roasValue >= 2 ? 'Good' : 'Low' },
                            { label: 'Revenue', kpiKey: 'revenue', value: formatCurrency(rawRevenue), icon: DollarSign, color: 'text-emerald-600', threshold: '' },
                            { label: 'Spend', kpiKey: 'spend', value: formatCurrency(rawSpend), icon: DollarSign, color: 'text-gray-600', threshold: '' },
                            { label: 'CPA', kpiKey: 'cpa', value: formatCurrency(cpaValue), icon: Target, color: cpaValue <= 300 ? 'text-emerald-600' : 'text-amber-600', threshold: cpaValue <= 300 ? 'Efficient' : 'High' },
                            { label: 'Conv. Value', kpiKey: 'convValue', value: formatCurrency(convValue), icon: Users, color: 'text-indigo-600', threshold: '' },
                        ].map((kpi, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setActiveKPI(kpi.kpiKey);
                                }}
                                className={`bg-white border rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-md transition-all group ${activeKPI === kpi.kpiKey ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                                    {kpi.threshold && <span className={`text-[10px] font-medium ${kpi.color}`}>{kpi.threshold}</span>}
                                </div>
                                <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                                <div className="text-xs text-gray-500">{kpi.label}</div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ============================================ */}
                {/* KPI INSIGHT PANEL - Campaign-scoped deep dive */}
                {/* ============================================ */}
                {activeKPI && (
                    <section id="kpi-insight-panel" className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                    {activeKPI === 'roas' && <TrendingUp className="w-5 h-5 text-white" />}
                                    {activeKPI === 'revenue' && <DollarSign className="w-5 h-5 text-white" />}
                                    {activeKPI === 'spend' && <DollarSign className="w-5 h-5 text-white" />}
                                    {activeKPI === 'cpa' && <Target className="w-5 h-5 text-white" />}
                                    {activeKPI === 'convValue' && <Users className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {activeKPI === 'roas' && 'ROAS Deep Dive'}
                                        {activeKPI === 'revenue' && 'Revenue Breakdown'}
                                        {activeKPI === 'spend' && 'Spend Analysis'}
                                        {activeKPI === 'cpa' && 'CPA Optimization'}
                                        {activeKPI === 'convValue' && 'Conversion Value Insights'}
                                    </h3>
                                    <p className="text-xs text-gray-500">Campaign: {name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveKPI(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-white/50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ROAS Insight */}
                        {activeKPI === 'roas' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Current ROAS</div>
                                        <div className={`text-2xl font-bold ${roasValue >= 3 ? 'text-emerald-600' : roasValue >= 2 ? 'text-blue-600' : 'text-red-600'}`}>{roasValue.toFixed(2)}x</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Target ROAS</div>
                                        <div className="text-2xl font-bold text-gray-400">3.0x</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Gap</div>
                                        <div className={`text-2xl font-bold ${roasValue >= 3 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {roasValue >= 3 ? '+' : ''}{(roasValue - 3).toFixed(2)}x
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">💡 What to do next</h4>
                                    <p className="text-sm text-gray-600">
                                        {roasValue >= 3
                                            ? `Your ROAS of ${roasValue.toFixed(2)}x exceeds the 3.0x target. Consider scaling budget by 20% to capture more revenue.`
                                            : roasValue >= 2
                                                ? `ROAS is ${(3 - roasValue).toFixed(2)}x below target. Review underperforming creatives and pause any with ROAS < 1.5x.`
                                                : `Critical: ROAS significantly below target. Pause campaign and review targeting, creative quality, and landing page.`
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Revenue Insight */}
                        {activeKPI === 'revenue' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                                        <div className="text-2xl font-bold text-emerald-600">{formatCurrency(rawRevenue)}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Revenue/Day</div>
                                        <div className="text-2xl font-bold text-gray-700">{formatCurrency(rawRevenue / 7)}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Profit Margin</div>
                                        <div className="text-2xl font-bold text-blue-600">{rawSpend > 0 ? ((rawRevenue - rawSpend) / rawRevenue * 100).toFixed(0) : 0}%</div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">💡 What to do next</h4>
                                    <p className="text-sm text-gray-600">
                                        {rawRevenue > rawSpend * 2
                                            ? `Strong performance. Campaign generates ${formatCurrency(rawRevenue - rawSpend)} profit. Consider increasing daily budget to scale.`
                                            : `Revenue is ${formatCurrency(rawRevenue)} against ${formatCurrency(rawSpend)} spend. Focus on conversion rate optimization.`
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Spend Insight */}
                        {activeKPI === 'spend' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Total Spend</div>
                                        <div className="text-2xl font-bold text-gray-700">{formatCurrency(rawSpend)}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Daily Avg</div>
                                        <div className="text-2xl font-bold text-gray-600">{formatCurrency(rawSpend / 7)}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                                        <div className={`text-2xl font-bold ${rawConversions > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {rawConversions > 0 ? `${rawConversions} conv` : '0 conv'}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">💡 What to do next</h4>
                                    <p className="text-sm text-gray-600">
                                        {rawRevenue === 0 && rawSpend > 500
                                            ? `⚠️ BURN ALERT: ${formatCurrency(rawSpend)} spent with zero revenue. Pause immediately.`
                                            : `Spend pacing at ${formatCurrency(rawSpend / 7)}/day with CPA of ${formatCurrency(cpaValue)}. ${cpaValue > 300 ? 'Consider reducing bids.' : 'Efficiency healthy.'}`
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* CPA Insight */}
                        {activeKPI === 'cpa' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Current CPA</div>
                                        <div className={`text-2xl font-bold ${cpaValue <= 300 ? 'text-emerald-600' : 'text-amber-600'}`}>{formatCurrency(cpaValue)}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Target CPA</div>
                                        <div className="text-2xl font-bold text-gray-400">{formatCurrency(300)}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Conversions</div>
                                        <div className="text-2xl font-bold text-blue-600">{rawConversions}</div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">💡 What to do next</h4>
                                    <p className="text-sm text-gray-600">
                                        {cpaValue <= 300
                                            ? `CPA of ${formatCurrency(cpaValue)} is below target. Campaign acquiring efficiently. Consider scaling budget.`
                                            : `CPA is ${formatCurrency(cpaValue - 300)} above target. Review: targeting, landing page, creative messaging.`
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Conversion Value Insight */}
                        {activeKPI === 'convValue' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Avg Conv. Value</div>
                                        <div className="text-2xl font-bold text-indigo-600">{formatCurrency(convValue)}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Total Conversions</div>
                                        <div className="text-2xl font-bold text-gray-700">{rawConversions}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-xs text-gray-500 mb-1">Value vs CPA</div>
                                        <div className={`text-2xl font-bold ${convValue > cpaValue ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {convValue > cpaValue ? '+' : ''}{formatCurrency(convValue - cpaValue)}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">💡 What to do next</h4>
                                    <p className="text-sm text-gray-600">
                                        {convValue > cpaValue
                                            ? `Each conversion generates ${formatCurrency(convValue - cpaValue)} profit. Profitable campaign - consider scaling.`
                                            : `Conversion value below CPA - each customer costs more than they're worth. Review pricing or upsells.`
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* ============================================ */}
                {/* 3. EFFICIENCY TIMELINE - Trends tell the story */}
                {/* ============================================ */}
                <section id="efficiency-timeline" className="bg-white rounded-xl border border-gray-200 p-6 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-gray-900">Efficiency Timeline</h2>
                            <p className="text-xs text-gray-500">ROAS vs CPA over last 7 days</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded"></span> ROAS</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-500 rounded"></span> CPA</span>
                        </div>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={efficiencyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                <YAxis yAxisId="left" orientation="left" stroke="#6366f1" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}x`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 10 }} tickFormatter={(v) => formatCurrency(v)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area yAxisId="left" type="monotone" dataKey="roas" stroke="#6366f1" fill="#e0e7ff" fillOpacity={0.4} strokeWidth={2} name="ROAS" />
                                <Line yAxisId="right" type="monotone" dataKey="cpa" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="CPA" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Two-column grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ============================================ */}
                    {/* 4. DELIVERY & FATIGUE - Is the audience tired? */}
                    {/* ============================================ */}
                    <section id="delivery-fatigue" className="bg-white rounded-xl border border-gray-200 p-6 transition-all">
                        <h2 className="font-bold text-gray-900 mb-4">Delivery & Fatigue</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-xs text-gray-500 mb-1">Frequency</div>
                                <div className={`text-xl font-bold ${frequency > 2.5 ? 'text-red-600' : frequency > 1.8 ? 'text-amber-600' : 'text-gray-900'}`}>
                                    {frequency.toFixed(1)}x
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1">
                                    {frequency > 2.5 ? '⚠️ Fatigue risk' : frequency > 1.8 ? 'Monitor closely' : 'Healthy range'}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-xs text-gray-500 mb-1">CPM</div>
                                <div className="text-xl font-bold text-gray-900">{formatCurrency(cpm)}</div>
                                <div className="text-[10px] text-gray-400 mt-1">Cost per 1,000 views</div>
                            </div>
                        </div>
                        {/* Frequency Bar */}
                        <div className="mt-3">
                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                <span>1x</span><span>2x (Safe)</span><span>3x+ (Fatigue)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${frequency > 2.5 ? 'bg-red-500' : frequency > 1.8 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(frequency / 3 * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </section>

                    {/* ============================================ */}
                    {/* 5. CLICK-TO-CONVERSION FLOW - Where's the leak? */}
                    {/* ============================================ */}
                    <section id="funnel-analysis" className="bg-white rounded-xl border border-gray-200 p-6 transition-all">
                        <h2 className="font-bold text-gray-900 mb-4">Click-to-Conversion Flow</h2>
                        <div className="flex items-center justify-between">
                            {/* Clicks */}
                            <div className="text-center flex-1">
                                <div className="text-2xl font-bold text-blue-600">{rawClicks.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">Clicks</div>
                            </div>
                            {/* Arrow 1 */}
                            <div className="flex flex-col items-center px-2">
                                <ArrowRight className="w-5 h-5 text-gray-300" />
                                <span className="text-[10px] text-red-500 font-bold">-{clickToLeadDrop}%</span>
                            </div>
                            {/* Leads */}
                            <div className="text-center flex-1">
                                <div className="text-2xl font-bold text-purple-600">{estimatedLeads.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">Est. Leads</div>
                            </div>
                            {/* Arrow 2 */}
                            <div className="flex flex-col items-center px-2">
                                <ArrowRight className="w-5 h-5 text-gray-300" />
                                <span className="text-[10px] text-red-500 font-bold">-{leadToConvDrop}%</span>
                            </div>
                            {/* Conversions */}
                            <div className="text-center flex-1">
                                <div className="text-2xl font-bold text-emerald-600">{rawConversions.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">Converts</div>
                            </div>
                        </div>
                        {/* Insight */}
                        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            <strong>Leak detected:</strong> {clickToLeadDrop}% drop from click to lead suggests landing page issues.
                        </div>
                    </section>
                </div>

                {/* ============================================ */}
                {/* 6. CREATIVE PERFORMANCE TABLE - Who's winning? */}
                {/* ============================================ */}
                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-900">Creative Performance</h2>
                        <p className="text-xs text-gray-500">Auto-tagged: 🏆 Winner (CVR ≥ 5%) • 🩸 Bleeder (CVR &lt; 2%)</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Creative</th>
                                    <th className="px-6 py-3 text-right">Spend</th>
                                    <th className="px-6 py-3 text-right">CTR</th>
                                    <th className="px-6 py-3 text-right">CVR</th>
                                    <th className="px-6 py-3 text-right">Conv.</th>
                                    <th className="px-6 py-3 text-right">CPA</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {creatives.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                                        <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(c.spend)}</td>
                                        <td className="px-6 py-4 text-right text-gray-600">{c.ctr}%</td>
                                        <td className={`px-6 py-4 text-right font-bold ${c.tag === 'winner' ? 'text-emerald-600' : c.tag === 'bleeder' ? 'text-red-600' : 'text-gray-600'}`}>{c.cvr}%</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">{c.conversions}</td>
                                        <td className={`px-6 py-4 text-right ${c.cpa > 500 ? 'text-red-600' : 'text-gray-600'}`}>{formatCurrency(c.cpa)}</td>
                                        <td className="px-6 py-4 text-center">
                                            {c.tag === 'winner' && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">🏆 Winner</span>}
                                            {c.tag === 'bleeder' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">🩸 Bleeder</span>}
                                            {c.tag === 'neutral' && <span className="text-gray-400 text-xs">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {c.tag === 'bleeder' && (
                                                <button className="text-xs text-red-600 font-bold hover:underline">Pause</button>
                                            )}
                                            {c.tag === 'winner' && (
                                                <button className="text-xs text-emerald-600 font-bold hover:underline">Scale</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ============================================ */}
                {/* 7. AUDIENCE & QUALITY SIGNALS */}
                {/* ============================================ */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Demographics */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Top Converting Demographics</h2>
                        <div className="space-y-3">
                            {[
                                { label: '25-34', type: 'Age', conversions: 24, cpa: 210 },
                                { label: '35-44', type: 'Age', conversions: 12, cpa: 280 },
                                { label: 'Male', type: 'Gender', conversions: 28, cpa: 235 },
                            ].map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">{d.label}</div>
                                        <div className="text-xs text-gray-400">{d.type}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">{d.conversions} conv.</div>
                                        <div className="text-xs text-gray-400">CPA: {formatCurrency(d.cpa)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform Quality */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Platform Quality Signals</h2>
                        <div className="space-y-3">
                            {platforms?.includes('Google') && (
                                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <Chrome className="w-4 h-4 text-[#EA4335]" />
                                        <span className="text-sm font-medium">Quality Score</span>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">8/10 Good</span>
                                </div>
                            )}
                            {(platforms?.some(p => p.includes('Meta') || p.includes('Facebook'))) && (
                                <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <Facebook className="w-4 h-4 text-[#1877F2]" />
                                        <span className="text-sm font-medium">Relevance Score</span>
                                    </div>
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">6/10 Average</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* 8. ADVANCED DIAGNOSTICS (Collapsed) */}
                {/* ============================================ */}
                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setShowDiagnostics(!showDiagnostics)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <h2 className="font-bold text-gray-900">Advanced Diagnostics</h2>
                        {showDiagnostics ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                    {showDiagnostics && (
                        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Device */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-3">Device Performance</div>
                                {[
                                    { icon: <Smartphone className="w-4 h-4" />, type: 'Mobile', conv: 32, cpa: 266 },
                                    { icon: <Monitor className="w-4 h-4" />, type: 'Desktop', conv: 12, cpa: 292 },
                                    { icon: <Tablet className="w-4 h-4" />, type: 'Tablet', conv: 1, cpa: 450 },
                                ].map((d, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-2 text-gray-600">{d.icon} {d.type}</div>
                                        <div className="text-xs text-gray-500">{d.conv} conv • {formatCurrency(d.cpa)} CPA</div>
                                    </div>
                                ))}
                            </div>

                            {/* Day-of-Week */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-3">Best Days</div>
                                <div className="text-gray-900">
                                    <span className="font-bold">Friday</span> and <span className="font-bold">Saturday</span>
                                    <span className="text-gray-500 text-xs block mt-1">Highest conversion rates</span>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-3">Additional Metrics</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">CTR</span><span className="font-medium">{ctr.toFixed(2)}%</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">CVR</span><span className="font-medium">{cvr.toFixed(2)}%</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">CPC</span><span className="font-medium">{formatCurrency(cpc)}</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
