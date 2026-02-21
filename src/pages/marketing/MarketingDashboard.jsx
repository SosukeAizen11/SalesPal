/**
 * ARCHITECTURE GUARD: LAYER 1 - GLOBAL OVERVIEW
 * ---------------------------------------------
 * Scope: Global Financial & Health Metrics (Spend, ROAS, Revenue).
 * Rules:
 * 1. Must only display aggregated high-level KPIs.
 * 2. NO granular campaign or ad-set level data.
 * 3. NO deep diagnostic segmentation (Demographics, etc.).
 * 4. Links to Layer 2 (CampaignDetailView) for optimization context.
 */
import React, { useState, useMemo, useRef } from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, BarChart2, Globe, ChevronDown, HelpCircle } from 'lucide-react';
import { AnalyticsProvider, useAnalytics } from '../../context/AnalyticsContext';
import { useMarketing } from '../../context/MarketingContext';
import Modal from '../../components/ui/Modal';

// Sections
// Sections
import KPISummary from './analytics/sections/KPISummary';
import AIStrategicInsights from './analytics/sections/AIStrategicInsights';
import PerformanceStability from './analytics/sections/ROASTrend';
import ChannelPerformanceMix from './analytics/sections/ChannelPerformanceMix';
import ActionFeed from './analytics/sections/ActionFeed';
import AcquisitionIntelligence from './analytics/sections/AcquisitionIntelligence';
import CampaignDetailView from './analytics/sections/CampaignDetailView';

import {
    calculateCPL, calculateFrequency, calculateLandingPageCVR, calculateCPM,
    calculateROAS, calculateCPC, calculateCTR, distribute
} from '../../utils/analyticsCalculations';

// --- MAIN CONTENT COMPONENT ---
const DashboardContent = ({ mode = 'page' }) => {
    const {
        isGlobal, selectedProjectId, timeRange, channelFilter,
        setTimeRange, setChannelFilter, setCompareMode, compareMode, setProject
    } = useAnalytics();
    const { projects } = useMarketing();
    const { formatCurrency } = usePreferences();


    // UI State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState(null);

    // Scroll Refs
    const trendsRef = useRef(null);
    const spendRef = useRef(null);
    const funnelRef = useRef(null);
    const campaignsRef = useRef(null);

    // --- DATA AGGREGATION & ANALYTICS ---
    const { campaigns } = useMarketing();


    const dashboardData = useMemo(() => {
        // 1. Filter Campaigns
        const filtered = campaigns.filter(c => {
            const projectMatch = selectedProjectId === 'all' || (c.projectId && c.projectId === selectedProjectId);

            if (channelFilter === 'all') return projectMatch;

            const platformName = (c.platform || '').toLowerCase();
            const filterName = channelFilter.toLowerCase();

            let platformValid = false;
            if (filterName === 'meta') platformValid = platformName.includes('meta') || platformName.includes('facebook') || platformName.includes('instagram');
            else if (filterName === 'google') platformValid = platformName.includes('google') || platformName.includes('youtube');
            else if (filterName === 'linkedin') platformValid = platformName.includes('linkedin');
            else platformValid = platformName.includes(filterName);

            return projectMatch && platformValid;
        });

        // 2. Aggregate Totals
        const totals = filtered.reduce((acc, c) => ({
            spend: acc.spend + (Number(c.spend) || 0),
            revenue: acc.revenue + (Number(c.revenue) || 0),
            conversions: acc.conversions + (Number(c.conversions) || 0),
        }), { spend: 0, revenue: 0, conversions: 0 });

        // 3. Derived Metrics (Using Pure Utils)
        const roas = calculateROAS(totals.revenue, totals.spend);
        const cpa = calculateCPL(totals.spend, totals.conversions);

        // 4. Trend Generation (Distribute totals for visualization)
        const dayCount = timeRange === '30d' ? 30 : 7;
        const labels = Array.from({ length: dayCount }, (_, i) => `Day ${i + 1}`);

        // Helper to distribute total into array (Mock distribution)
        const spendTrend = distribute(totals.spend, dayCount, 'spend-seed');
        const revTrend = distribute(totals.revenue, dayCount, 'revenue-seed');
        const convTrend = distribute(totals.conversions, dayCount, 'conversions-seed');

        // Recalculate ROAS trend point-by-point
        const roasTrend = spendTrend.map((s, i) => s > 0 ? (revTrend[i] / s).toFixed(2) : 0);

        // Recalculate CPA trend point-by-point
        const cpaTrend = spendTrend.map((s, i) => {
            const c = convTrend[i];
            return c > 0 ? (s / c).toFixed(2) : 0;
        });

        // 5. Channel Mix Data
        const channelMix = ['Meta Ads', 'Google Ads', 'LinkedIn'].map(platform => {
            const platformCampaigns = filtered.filter(c => (c.platform || '').toLowerCase().includes(platform.toLowerCase().split(' ')[0]));
            const pSpend = platformCampaigns.reduce((a, c) => a + (Number(c.spend) || 0), 0);
            const pRev = platformCampaigns.reduce((a, c) => a + (Number(c.revenue) || 0), 0);
            const pConv = platformCampaigns.reduce((a, c) => a + (Number(c.conversions) || 0), 0);
            return {
                platform,
                spend: pSpend,
                revenue: pRev,
                conversions: pConv,
                roas: calculateROAS(pRev, pSpend).toFixed(2),
                color: platform === 'Meta Ads' ? '#8884d8' : platform === 'Google Ads' ? '#82ca9d' : '#ffc658'
            };
        }).filter(d => d.spend > 0);

        // 6. Anomaly Detection (Rule-Based)
        const anomalies = [];

        // Rule 1: Burn Alert (Campaign Level)
        filtered.forEach(c => {
            const cSpend = Number(c.spend) || 0;
            const cRev = Number(c.revenue) || 0;
            if (cSpend > 500 && cRev === 0) {
                anomalies.push({
                    type: 'burn',
                    severity: 'high',
                    title: `Burn Alert: ${c.name}`,
                    message: `Spent ${formatCurrency(cSpend)} with ${formatCurrency(0)} revenue. Pause immediately to stop losses.`,
                    actionLabel: 'Pause Campaign',
                    campaignId: c.id,
                    action: true,
                    onAction: () => handleActionPreview({ type: 'pause_campaign', campaignId: c.id, name: c.name })
                });
            }
        });

        // Rule 2: CPA Spike (CPA increase > 40% vs target)
        const cpaTarget = 50; // Example target
        const cpaIncrease = ((cpa - cpaTarget) / cpaTarget) * 100;
        if (cpaIncrease > 40) {
            anomalies.push({
                type: 'spike',
                severity: 'medium',
                title: 'CPA Spike Detected',
                message: `CPA is ${formatCurrency(cpa)} (+${cpaIncrease.toFixed(0)}% vs ${formatCurrency(cpaTarget)} target). Investigate underperforming campaigns.`,
                actionLabel: 'Investigate',
                action: true,
                onAction: () => handleActionPreview({ type: 'check_ad_groups', metric: 'cpa', value: cpa })
            });
        }

        // Rule 3: ROAS Opportunity (High ROAS + Budget > 90% utilization)
        const google = channelMix.find(c => c.platform === 'Google Ads');
        const meta = channelMix.find(c => c.platform === 'Meta Ads');
        if (google && meta && parseFloat(google.roas) > parseFloat(meta.roas) * 1.5 && meta.spend > google.spend) {
            anomalies.push({
                type: 'opportunity',
                severity: 'low',
                title: 'Budget Reallocation Opportunity',
                message: `Google ROAS (${google.roas}x) outperforms Meta (${meta.roas}x) by 50%+. Shift budget to maximize returns.`,
                actionLabel: 'Shift Budget',
                action: true,
                onAction: () => handleActionPreview({ type: 'shift_budget', from: 'Meta Ads', to: 'Google Ads' })
            });
        }

        // Helper to get formatted sparkline data
        const toSparkline = (dataArray) => dataArray.map((val, i) => ({ value: parseFloat(val) || 0 }));

        // Helper for percentage change (mocking based on first vs last for demo, or random)
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
            // High-Level KPIs (Financial Health Focus)
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
                    isPositive: spendPct <= 0, // Lower spend trend might be considered good or neutral, but usually for spend we just show direction. Let's say higher spend is strictly "more scale" so neutral? 
                    // User requirement: "Green upward arrow if positive improvement."
                    // For Spend: usually increasing spend is neutral/good if ROAS holds. 
                    // Let's treat "increase" as green for Spend (scaling) unless user specified otherwise. 
                    // Actually, usually lower spend is "saving money" but in growth, higher spend is "scaling".
                    // Let's stick to Green = Up for Revenue/ROAS/Spend, Red = Down.
                    // EXCEPT CPA: Lower is good (Green).
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
                    isPositive: cpaPct <= 0, // Lower CPA is good (Green)
                    sparkline: toSparkline(cpaTrend),
                    invertColor: true // Special flag for CPA
                },
            },
            // Charts
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
    }, [campaigns, selectedProjectId, timeRange, channelFilter]);

    const navigate = useNavigate();

    // HANDLERS
    const handleKPIClick = (metric, title) => {
        let route = '';

        switch (metric) {
            case 'roas':
                route = '/marketing/insights/roas';
                break;
            case 'totalRevenue':
                route = '/marketing/insights/revenue';
                break;
            case 'totalSpend':
                route = '/marketing/insights/spend';
                break;
            case 'cpa':
                route = '/marketing/insights/cpa';
                break;
            default:
                // Fallback for other cards if any
                return;
        }

        navigate(route);
    };

    const handleCampaignClick = (campaign) => {
        setModalContext({
            type: 'campaign',
            data: campaign,
            title: 'Campaign Details'
        });
        setDetailModalOpen(true);
    };

    const handleActionPreview = (action) => {
        setModalContext({
            type: 'action',
            data: action,
            title: 'Preview Action'
        });
        setDetailModalOpen(true);
    };

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

                {/* A. THE PULSE (Financial Vitals) */}
                <section aria-label="Financial Vitals">
                    <KPISummary data={dashboardData.kpis} onDetailClick={handleKPIClick} mode="pulse" />
                </section>

                {/* B. Priority Alerts — Immediately below KPIs */}
                <section aria-label="Priority Alerts">
                    <ActionFeed alerts={dashboardData.anomalies} />
                </section>

                {/* Acquisition Intelligence */}
                <AcquisitionIntelligence />

                {/* C. AI Strategic Insights */}
                <AIStrategicInsights />

                {/* C. Efficiency & Allocation Grid */}
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
