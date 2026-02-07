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
import { Calendar, Filter, BarChart2, Globe, ChevronDown, HelpCircle } from 'lucide-react';
import { useWalkthrough } from '../../walkthrough/WalkthroughProvider';
import { AnalyticsProvider, useAnalytics } from '../../context/AnalyticsContext';
import { useMarketing } from '../../context/MarketingContext';
import Modal from '../../components/ui/Modal';

// Sections
import KPISummary from './analytics/sections/KPISummary';
import PerformanceTrends from './analytics/sections/PerformanceTrends';
import ROASTrend from './analytics/sections/ROASTrend';
import ConversionFunnel from './analytics/sections/ConversionFunnel';

// Components (AI Layer)
import AIInsightsStream from './analytics/components/AIInsightsStream';
import RecommendedActions from './analytics/components/RecommendedActions';
import ActionPreviewView from './analytics/components/ActionPreviewView';

import { getMockAnalyticsData } from './analytics/utils/mockData';

// --- MAIN CONTENT COMPONENT ---
const DashboardContent = ({ mode = 'page' }) => {
    const {
        isGlobal, selectedProjectId, timeRange, channelFilter,
        setTimeRange, setChannelFilter, setCompareMode, compareMode, setProject
    } = useAnalytics();
    const { projects } = useMarketing();

    // Walkthrough restart functionality
    const { restartWalkthrough } = useWalkthrough();

    // UI State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState(null);

    // Scroll Refs
    const trendsRef = useRef(null);
    const spendRef = useRef(null);
    const funnelRef = useRef(null);
    const campaignsRef = useRef(null);

    // Generate responsive mock data
    const dashboardData = useMemo(() =>
        getMockAnalyticsData(timeRange, selectedProjectId, channelFilter),
        [timeRange, selectedProjectId, channelFilter]);

    // HANDLERS
    const handleKPIClick = (metric, title) => {
        // Map metrics to sections for smooth scrolling
        const sectionMap = {
            'spend': spendRef,
            'leads': funnelRef,
            'conversion_rate': funnelRef,
            'cpl': spendRef,
            'projects': campaignsRef
        };

        const targetRef = sectionMap[metric];
        if (targetRef && targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
            <div id="tour-header" className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Marketing Dashboard
                        <button
                            onClick={restartWalkthrough}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                            title="Restart Tour"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
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

                {/* A. Top KPI Cards */}
                <div id="tour-kpi">
                    <KPISummary data={dashboardData.kpis} onDetailClick={handleKPIClick} />
                </div>

                {/* B. Efficiency Charts Row */}
                <div id="tour-performance" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div ref={trendsRef} className="lg:col-span-2 scroll-mt-24 min-w-0">
                        <PerformanceTrends data={dashboardData.trends} timeRange={timeRange} />
                    </div>
                    <div className="lg:col-span-1 min-w-0">
                        <ROASTrend data={dashboardData.trends} />
                    </div>
                </div>

                {/* C. Conversion Funnel */}
                <div id="tour-funnel" ref={funnelRef} className="scroll-mt-24">
                    <ConversionFunnel data={dashboardData.funnel} />
                </div>

                {/* D. AI Insights Stream */}
                <div id="tour-insights">
                    <AIInsightsStream
                        insights={dashboardData.insights}
                        onAction={(insight) => console.log('View details', insight)}
                    />
                </div>

                {/* E. Recommended Actions */}
                <div id="tour-actions">
                    <RecommendedActions
                        actions={dashboardData.recommendations}
                        onPreviewAction={handleActionPreview}
                    />
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
