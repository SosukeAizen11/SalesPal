/**
 * ARCHITECTURE GUARD: LAYER 1 - GLOBAL OVERVIEW
 * ---------------------------------------------
 * Scope: Global Financial & Health Metrics (Spend, ROAS, Revenue).
 * Rules:
 * 1. Must only display aggregated high-level KPIs.
 * 2. NO granular campaign or ad-set level data.
 * 3. NO deep diagnostic segmentation (Demographics, etc.).
 * 4. Links to Layer 2 (CampaignDetailView) for optimization context.
 *
 * DATA SOURCE: All metrics fetched from Supabase `campaign_metrics` table.
 * NO mock data, NO Math.random(), NO distribute().
 */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { useNavigate } from 'react-router-dom';
import { Filter, BarChart2, Globe, Loader2 } from 'lucide-react';
import { AnalyticsProvider, useAnalytics } from '../../context/AnalyticsContext';
import { useMarketing } from '../../context/MarketingContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Modal from '../../components/ui/Modal';

// Sections
import KPISummary from './analytics/sections/KPISummary';
import AIStrategicInsights from './analytics/sections/AIStrategicInsights';
import PerformanceStability from './analytics/sections/ROASTrend';
import ChannelPerformanceMix from './analytics/sections/ChannelPerformanceMix';
import ActionFeed from './analytics/sections/ActionFeed';
import AcquisitionIntelligence from './analytics/sections/AcquisitionIntelligence';
import CampaignDetailView from './analytics/sections/CampaignDetailView';

import {
    calculateCPL, calculateROAS
} from '../../utils/analyticsCalculations';

// --- MAIN CONTENT COMPONENT ---
const DashboardContent = ({ mode = 'page' }) => {
    const {
        isGlobal, selectedProjectId, timeRange, channelFilter,
        setTimeRange, setChannelFilter, setCompareMode, compareMode, setProject
    } = useAnalytics();
    const { projects, campaigns } = useMarketing();
    const { user } = useAuth();
    const { formatCurrency } = usePreferences();

    // UI State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState(null);
    const [metricsRows, setMetricsRows] = useState([]);
    const [metricsLoading, setMetricsLoading] = useState(true);

    // Scroll Refs
    const trendsRef = useRef(null);

    // --- FETCH METRICS FROM SUPABASE ---
    const fetchMetrics = useCallback(async () => {
        if (!user) {
            setMetricsRows([]);
            setMetricsLoading(false);
            return;
        }
        setMetricsLoading(true);
        try {
            const { data, error } = await supabase
                .from('campaign_metrics')
                .select('*, campaigns(name, platform, project_id)')
                .eq('user_id', user.id)
                .order('date', { ascending: true });

            if (error) {
                console.error('Failed to fetch campaign_metrics:', error);
                setMetricsRows([]);
            } else {
                setMetricsRows(data || []);
            }
        } catch (err) {
            console.error('Dashboard metrics fetch error:', err);
        } finally {
            setMetricsLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

    // --- DATA AGGREGATION FROM REAL METRICS ---
    const dashboardData = useMemo(() => {
        // Filter metrics by project and channel
        const filtered = metricsRows.filter(row => {
            const projectMatch = selectedProjectId === 'all' || (row.campaigns?.project_id === selectedProjectId);

            if (channelFilter === 'all') return projectMatch;

            const platformName = (row.campaigns?.platform || '').toLowerCase();
            const filterName = channelFilter.toLowerCase();

            let platformValid = false;
            if (filterName === 'meta') platformValid = platformName.includes('meta') || platformName.includes('facebook') || platformName.includes('instagram');
            else if (filterName === 'google') platformValid = platformName.includes('google') || platformName.includes('youtube');
            else if (filterName === 'linkedin') platformValid = platformName.includes('linkedin');
            else platformValid = platformName.includes(filterName);

            return projectMatch && platformValid;
        });

        // Aggregate Totals
        const totals = filtered.reduce((acc, row) => ({
            spend: acc.spend + parseFloat(row.spend || 0),
            revenue: acc.revenue + parseFloat(row.revenue || 0),
            conversions: acc.conversions + (row.conversions || 0),
            impressions: acc.impressions + (row.impressions || 0),
            clicks: acc.clicks + (row.clicks || 0),
        }), { spend: 0, revenue: 0, conversions: 0, impressions: 0, clicks: 0 });

        // Derived Metrics
        const roas = calculateROAS(totals.revenue, totals.spend);
        const cpa = calculateCPL(totals.spend, totals.conversions);

        // Build trend data from daily groups (real data, no distribute())
        const dateMap = {};
        filtered.forEach(row => {
            const d = row.date;
            if (!dateMap[d]) dateMap[d] = { date: d, spend: 0, revenue: 0, conversions: 0 };
            dateMap[d].spend += parseFloat(row.spend || 0);
            dateMap[d].revenue += parseFloat(row.revenue || 0);
            dateMap[d].conversions += (row.conversions || 0);
        });

        const sortedDates = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
        const labels = sortedDates.map(d => {
            const dt = new Date(d.date);
            return dt.toLocaleDateString(undefined, { weekday: 'short' });
        });
        const spendTrend = sortedDates.map(d => Math.round(d.spend));
        const revTrend = sortedDates.map(d => Math.round(d.revenue));
        const convTrend = sortedDates.map(d => d.conversions);
        const roasTrend = spendTrend.map((s, i) => s > 0 ? (revTrend[i] / s).toFixed(2) : 0);
        const cpaTrend = spendTrend.map((s, i) => {
            const c = convTrend[i];
            return c > 0 ? (s / c).toFixed(2) : 0;
        });

        // Channel Mix Data
        const channelAgg = {};
        filtered.forEach(row => {
            const platform = row.campaigns?.platform || 'unknown';
            const label = platform === 'meta' ? 'Meta Ads' : platform === 'google' ? 'Google Ads' : platform === 'linkedin' ? 'LinkedIn' : platform;
            if (!channelAgg[label]) channelAgg[label] = { spend: 0, revenue: 0, conversions: 0 };
            channelAgg[label].spend += parseFloat(row.spend || 0);
            channelAgg[label].revenue += parseFloat(row.revenue || 0);
            channelAgg[label].conversions += (row.conversions || 0);
        });

        const colorMap = { 'Meta Ads': '#8884d8', 'Google Ads': '#82ca9d', 'LinkedIn': '#ffc658' };
        const channelMix = Object.entries(channelAgg).map(([platform, data]) => ({
            platform,
            spend: data.spend,
            revenue: data.revenue,
            conversions: data.conversions,
            roas: calculateROAS(data.revenue, data.spend).toFixed(2),
            color: colorMap[platform] || '#94a3b8'
        })).filter(d => d.spend > 0);

        // Anomaly Detection (Rule-Based from real data)
        const anomalies = [];

        // Rule 1: Burn Alert — campaigns with spend > 500 and zero revenue
        const campaignTotals = {};
        filtered.forEach(row => {
            const cid = row.campaign_id;
            if (!campaignTotals[cid]) campaignTotals[cid] = { name: row.campaigns?.name || 'Unknown', spend: 0, revenue: 0 };
            campaignTotals[cid].spend += parseFloat(row.spend || 0);
            campaignTotals[cid].revenue += parseFloat(row.revenue || 0);
        });

        Object.entries(campaignTotals).forEach(([cid, c]) => {
            if (c.spend > 500 && c.revenue === 0) {
                anomalies.push({
                    type: 'burn',
                    severity: 'high',
                    title: `Burn Alert: ${c.name}`,
                    message: `Spent ${formatCurrency(c.spend)} with ${formatCurrency(0)} revenue. Pause immediately.`,
                    actionLabel: 'Pause Campaign',
                    campaignId: cid,
                    action: true,
                    onAction: () => handleActionPreview({ type: 'pause_campaign', campaignId: cid, name: c.name })
                });
            }
        });

        // Rule 2: CPA Spike
        const cpaTarget = 50;
        const cpaIncrease = ((cpa - cpaTarget) / cpaTarget) * 100;
        if (cpaIncrease > 40) {
            anomalies.push({
                type: 'spike',
                severity: 'medium',
                title: 'CPA Spike Detected',
                message: `CPA is ${formatCurrency(cpa)} (+${cpaIncrease.toFixed(0)}% vs ${formatCurrency(cpaTarget)} target).`,
                actionLabel: 'Investigate',
                action: true,
                onAction: () => handleActionPreview({ type: 'check_ad_groups', metric: 'cpa', value: cpa })
            });
        }

        // Rule 3: ROAS Opportunity
        const google = channelMix.find(c => c.platform === 'Google Ads');
        const meta = channelMix.find(c => c.platform === 'Meta Ads');
        if (google && meta && parseFloat(google.roas) > parseFloat(meta.roas) * 1.5 && meta.spend > google.spend) {
            anomalies.push({
                type: 'opportunity',
                severity: 'low',
                title: 'Budget Reallocation Opportunity',
                message: `Google ROAS (${google.roas}x) outperforms Meta (${meta.roas}x).`,
                actionLabel: 'Shift Budget',
                action: true,
                onAction: () => handleActionPreview({ type: 'shift_budget', from: 'Meta Ads', to: 'Google Ads' })
            });
        }

        // Sparkline / percentage change helpers
        const toSparkline = (dataArray) => dataArray.map((val) => ({ value: parseFloat(val) || 0 }));
        const getPctChange = (arr) => {
            if (arr.length < 2) return 0;
            const first = parseFloat(arr[0]) || 0;
            const last = parseFloat(arr[arr.length - 1]) || 0;
            if (first === 0) return 0;
            return ((last - first) / first * 100).toFixed(0);
        };

        const roasPct = getPctChange(roasTrend);
        const spendPct = getPctChange(spendTrend);
        const revPct = getPctChange(revTrend);
        const cpaPct = getPctChange(cpaTrend);

        return {
            kpis: {
                roas: {
                    value: roas.toFixed(2) + 'x',
                    trend: roasPct > 0 ? '+' + roasPct + '%' : roasPct + '%',
                    percentageChange: Math.abs(roasPct),
                    isPositive: roasPct >= 0,
                    sparkline: toSparkline(roasTrend)
                },
                totalSpend: {
                    value: formatCurrency(totals.spend),
                    trend: spendPct > 0 ? '+' + spendPct + '%' : spendPct + '%',
                    percentageChange: Math.abs(spendPct),
                    isPositive: spendPct >= 0,
                    sparkline: toSparkline(spendTrend)
                },
                totalRevenue: {
                    value: formatCurrency(totals.revenue),
                    trend: revPct > 0 ? '+' + revPct + '%' : revPct + '%',
                    percentageChange: Math.abs(revPct),
                    isPositive: revPct >= 0,
                    sparkline: toSparkline(revTrend)
                },
                cpa: {
                    value: formatCurrency(cpa),
                    trend: cpaPct > 0 ? '+' + cpaPct + '%' : cpaPct + '%',
                    percentageChange: Math.abs(cpaPct),
                    isPositive: cpaPct <= 0,
                    sparkline: toSparkline(cpaTrend),
                    invertColor: true
                },
            },
            trends: {
                dates: labels,
                spend: spendTrend,
                revenue: revTrend,
                roas: roasTrend,
                cpa: cpaTrend
            },
            channelMix,
            anomalies
        };
    }, [metricsRows, selectedProjectId, channelFilter, formatCurrency]);

    const navigate = useNavigate();

    // HANDLERS
    const handleKPIClick = (metric) => {
        const routes = {
            roas: '/marketing/insights/roas',
            totalRevenue: '/marketing/insights/revenue',
            totalSpend: '/marketing/insights/spend',
            cpa: '/marketing/insights/cpa',
        };
        if (routes[metric]) navigate(routes[metric]);
    };

    const handleCampaignClick = (campaign) => {
        setModalContext({ type: 'campaign', data: campaign, title: 'Campaign Details' });
        setDetailModalOpen(true);
    };

    const handleActionPreview = (action) => {
        setModalContext({ type: 'action', data: action, title: 'Preview Action' });
        setDetailModalOpen(true);
    };

    // Loading state
    if (metricsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
            {/* HEADER & CONTROLS */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Marketing Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time performance, spend, and AI intelligence</p>
                </div>

                {/* CONTROLS AREA */}
                <div className="flex flex-wrap items-center gap-3">

                    {/* 1. Scope Selector */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setProject(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-gray-900 border-none p-0 cursor-pointer focus:ring-0 w-32 md:w-auto"
                        >
                            <option value="all">Global (All Projects)</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Channel Filter */}
                    <div className="relative">
                        <select
                            value={channelFilter}
                            onChange={(e) => setChannelFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer hover:border-gray-300 transition-colors"
                        >
                            <option value="all">All Channels</option>
                            <option value="meta">Meta Ads</option>
                            <option value="google">Google Ads</option>
                            <option value="linkedin">LinkedIn</option>
                        </select>
                        <Filter className="w-3 h-3 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 3. Time Range */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['today', '7d', '30d', 'custom'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === range
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {range === '7d' ? '7D' : range === '30d' ? '30D' : range === 'today' ? 'Today' : 'Custom'}
                            </button>
                        ))}
                    </div>

                    {/* 4. Compare Toggle */}
                    <button
                        onClick={() => setCompareMode(!compareMode)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors shadow-sm ${compareMode
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <BarChart2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Compare</span>
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-[1600px] mx-auto space-y-6">

                {/* 1. Priority Alerts */}
                <section aria-label="Priority Alerts">
                    <ActionFeed alerts={dashboardData.anomalies} />
                </section>

                {/* 2. Acquisition Intelligence (Supabase-backed) */}
                <AcquisitionIntelligence />

                {/* 3. Financial Vitals (KPI Summary) */}
                <section aria-label="Financial Vitals">
                    <KPISummary data={dashboardData.kpis} onDetailClick={handleKPIClick} mode="pulse" />
                </section>

                {/* 4. AI Strategic Insights */}
                <AIStrategicInsights />

                {/* 5. Efficiency & Allocation Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Performance Stability (2/3 width) */}
                    <div ref={trendsRef} className="lg:col-span-2 scroll-mt-24 min-w-0">
                        <PerformanceStability data={dashboardData.trends} />
                    </div>

                    {/* Allocation Mix (1/3 width) */}
                    <div className="lg:col-span-1 min-w-0">
                        <ChannelPerformanceMix data={dashboardData.channelMix} />
                    </div>
                </div>

            </div>

            {/* DETAIL MODAL */}
            <Modal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                title={modalContext?.title || 'Details'}
            >
                {modalContext?.type === 'campaign' ? (
                    <CampaignDetailView campaign={modalContext.data} />
                ) : modalContext?.type === 'action' ? (
                    <ActionPreviewView action={modalContext.data} />
                ) : (
                    <div className="p-4">Detailed view placeholder for metric.</div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    {modalContext?.type === 'action' ? (
                        <>
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled
                                className="px-4 py-2 bg-blue-600 opacity-50 cursor-not-allowed text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                Apply Action
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setDetailModalOpen(false)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
};

// --- WRAPPER ---
const MarketingDashboard = (props) => {
    return (
        <AnalyticsProvider>
            <DashboardContent {...props} />
        </AnalyticsProvider>
    );
};

export default MarketingDashboard;
