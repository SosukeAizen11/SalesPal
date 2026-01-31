import React, { useEffect } from 'react';
import { Megaphone, Users, DollarSign, TrendingUp, Zap, ArrowRight, Activity, AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMarketing } from '../../context/MarketingContext';
import { useTour } from '../../context/TourContext';

// --- CONSTANTS ---
const TOUR_STEPS = [
    // Step 0: Welcome Modal
    {
        id: 'welcome',
        selector: null, // Indicates a centered modal
        title: 'Welcome to SalesPal',
        description: 'Let’s take a quick tour to help you understand how SalesPal works.'
    },
    // Steps 1-5: Sidebar
    {
        id: 'sidebar-dashboard',
        selector: '#sidebar-nav-dashboard',
        title: 'Dashboard',
        description: 'Dashboard gives you a real-time overview of campaigns, spend, leads, and AI insights.'
    },
    {
        id: 'sidebar-projects',
        selector: '#sidebar-nav-projects',
        title: 'Projects',
        description: 'Projects help you manage campaigns separately for each business or brand.'
    },
    {
        id: 'sidebar-social',
        selector: '#sidebar-nav-social',
        title: 'Social',
        description: 'Create, schedule, and manage organic social posts across connected platforms.'
    },
    {
        id: 'sidebar-analytics',
        selector: '#sidebar-nav-analytics',
        title: 'Analytics',
        description: 'View detailed performance metrics, trends, and AI-driven insights.'
    },
    {
        id: 'sidebar-settings',
        selector: '#sidebar-nav-settings',
        title: 'Settings',
        description: 'Connect ad platforms, configure defaults, tracking, and notifications.'
    },
    // Steps 6-8: Content
    {
        id: 'metrics',
        selector: '#metrics-grid',
        title: 'Key Performance Metrics',
        description: 'Track your campaigns, leads, and spend at a glance. These numbers update in real-time as your campaigns run.'
    },
    {
        id: 'active-campaigns',
        selector: '#card-active-campaigns',
        title: 'Manage Campaigns',
        description: 'Click this card to dive into your active projects. You can manage budgets, creatives, and AI settings from there.'
    },
    {
        id: 'activity-feed',
        selector: '#activity-feed',
        title: 'Activity & AI Insights',
        description: 'This feed shows live updates. Our AI analyzes your data 24/7 and will post optimization suggestions here.'
    },
    {
        id: 'quick-actions',
        selector: '#quick-actions',
        title: 'Quick Actions',
        description: 'Need to move fast? Use these shortcuts to launch new campaigns or create social posts instantly.'
    }
];

// --- COMPONENTS ---

const StatCard = ({ title, value, change, icon: Icon, color, onClick, delay = 0 }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-200 group relative overflow-hidden"
        style={{ animation: `fadeInUp 0.5s ease-out ${delay}s backwards` }}
    >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm font-medium">{title}</span>
            <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-gray-700" />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className={`text-sm mt-1 font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {change} <span className="text-gray-400 font-normal">vs last month</span>
                </p>
            </div>
        </div>
    </div>
);

const ActivityFeed = ({ campaigns }) => {
    // Mock Data Generator for Insights
    const getMockInsights = (runningCampaigns) => {
        if (!runningCampaigns || runningCampaigns.length === 0) return [];

        const insights = [
            { type: 'AI', icon: Zap, color: 'text-amber-500 bg-amber-50', title: 'Budget Optimized', desc: 'AI shifted 15% budget to high-performing ad sets.', time: '2h ago' },
            { type: 'Alert', icon: AlertCircle, color: 'text-red-500 bg-red-50', title: 'CTR Alert', desc: 'CTR dropped below 1% on "Summer Sale" campaign.', time: '4h ago' },
            { type: 'Campaign', icon: Megaphone, color: 'text-blue-500 bg-blue-50', title: 'Campaign Launched', desc: 'New retargeting campaign is now live.', time: '5h ago' },
            { type: 'AI', icon: Activity, color: 'text-green-500 bg-green-50', title: 'Performance Spike', desc: 'Conversions up 24% after headline optimization.', time: '1d ago' }
        ];

        // Randomly assign a campaign name to the insight for context
        return insights.map((insight, index) => {
            const campaign = runningCampaigns[index % runningCampaigns.length];
            return { ...insight, campaignName: campaign.name, campaignId: campaign.id };
        });
    };

    const runningCampaigns = campaigns.filter(c => c.status === 'RUNNING' || c.status === 'running');
    const displayInsights = getMockInsights(runningCampaigns);

    if (runningCampaigns.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center" id="activity-feed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Campaigns</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    Launch a campaign to see AI insights and real-time activity updates here.
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center justify-center gap-2 mx-auto">
                    Create Campaign <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" id="activity-feed">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-900">Activity & AI Insights</h3>
                    <p className="text-sm text-gray-500">Real-time updates from your running campaigns</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {runningCampaigns.length} Active
                </span>
            </div>
            <div className="divide-y divide-gray-50">
                {displayInsights.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                        <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900 text-sm truncate">{item.title}</h4>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{item.desc}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    {item.campaignName}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <button className="text-xs font-medium text-gray-500 hover:text-gray-700">View All Activity</button>
            </div>
        </div>
    );
};

const MarketingDashboard = () => {
    const navigate = useNavigate();
    const { campaigns, projects } = useMarketing();
    const { startTour, restartTour } = useTour();

    // --- EFFECTS ---
    useEffect(() => {
        // Attempt to start tour on mount (context handles persistence check)
        startTour('marketing_dashboard', TOUR_STEPS);
    }, [startTour]);

    const getActiveProjectUrl = () => {
        if (projects && projects.length > 0) {
            return `/marketing/projects/${projects[0].id}`;
        }
        return '/marketing/projects';
    };

    return (
        <div className="space-y-8 relative">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* HEADERS */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marketing Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your AI marketing activity</p>
                </div>
                <button
                    onClick={() => restartTour('marketing_dashboard', TOUR_STEPS)}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-sm font-medium group"
                    title="Restart Walkthrough"
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 overflow-hidden w-0 group-hover:w-auto">Walkthrough</span>
                </button>
            </div>

            {/* METRICS GRID */}
            <div id="metrics-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div id="card-active-campaigns">
                    <StatCard
                        title="Active Campaigns"
                        value={campaigns.filter(c => c.status === 'RUNNING' || c.status === 'running').length || "0"}
                        change="+2"
                        icon={Megaphone}
                        color="bg-blue-100"
                        onClick={() => navigate(getActiveProjectUrl())}
                        delay={0.1}
                    />
                </div>
                <StatCard
                    title="Leads Generated"
                    value="1,420"
                    change="+15.3%"
                    icon={Users}
                    color="bg-purple-100"
                    onClick={() => navigate('/marketing/analytics?tab=leads')}
                    delay={0.2}
                />
                <StatCard
                    title="Ad Spend"
                    value="$12,450"
                    change="-4.2%"
                    icon={DollarSign}
                    color="bg-green-100"
                    onClick={() => navigate('/marketing/analytics')}
                    delay={0.3}
                />
                <StatCard
                    title="AI Efficiency"
                    value="94%"
                    change="+5.1%"
                    icon={TrendingUp}
                    color="bg-orange-100"
                    onClick={() => navigate('/marketing/analytics')}
                    delay={0.4}
                />
            </div>

            {/* CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2">
                    <ActivityFeed campaigns={campaigns} />
                </div>

                {/* Side Panel (Mock Quick Actions) */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white text-center">
                        <h3 className="font-bold text-lg mb-2">Boost Performance</h3>
                        <p className="text-indigo-100 text-sm mb-4">AI detected a 12% opportunity in your Instagram campaigns.</p>
                        <button className="bg-white text-indigo-600 w-full py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-lg">
                            Review Suggestion
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200" id="quick-actions">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button onClick={() => navigate('/marketing/projects/new')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors">
                                <Megaphone className="w-4 h-4 text-blue-500" /> Create Campaign
                            </button>
                            <button onClick={() => navigate('/marketing/social/create')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors">
                                <Users className="w-4 h-4 text-purple-500" /> New Social Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingDashboard;
