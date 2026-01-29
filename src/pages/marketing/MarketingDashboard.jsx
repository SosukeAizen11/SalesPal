import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketing } from '../../context/MarketingContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FolderOpen, TrendingUp } from 'lucide-react';

const MarketingDashboard = () => {
    const navigate = useNavigate();
    const { projects, selectedProjectId, campaigns } = useMarketing();

    // Get the active project - ALWAYS calculate before any returns
    const activeProject = useMemo(() => {
        return projects.find(p => p.id === selectedProjectId);
    }, [projects, selectedProjectId]);

    // Calculate campaign metrics for the active project - ALWAYS calculate
    const projectMetrics = useMemo(() => {
        if (!activeProject) return { runningCampaigns: 0, totalDailySpend: 0 };

        const projectCampaigns = campaigns.filter(c => c.projectId === activeProject.id);
        const runningCampaigns = projectCampaigns.filter(c =>
            c.status === 'running' || c.status === 'active'
        );

        const totalDailySpend = runningCampaigns.reduce((sum, campaign) => {
            const budgetVal = campaign.dailyBudget || campaign.budget?.daily || 0;
            const numericValue = parseInt(String(budgetVal).replace(/[^0-9]/g, '')) || 0;
            return sum + numericValue;
        }, 0);

        return {
            runningCampaigns: runningCampaigns.length,
            totalDailySpend
        };
    }, [activeProject, campaigns]);

    // Calculate aggregate metrics across all projects - ALWAYS calculate
    const allProjectsMetrics = useMemo(() => {
        const totalProjects = projects.length;
        const allCampaigns = campaigns.filter(c =>
            c.status === 'running' || c.status === 'active'
        );
        const totalRunningCampaigns = allCampaigns.length;

        const totalDailySpend = allCampaigns.reduce((sum, campaign) => {
            const budgetVal = campaign.dailyBudget || campaign.budget?.daily || 0;
            const numericValue = parseInt(String(budgetVal).replace(/[^0-9]/g, '')) || 0;
            return sum + numericValue;
        }, 0);

        return { totalProjects, totalRunningCampaigns, totalDailySpend };
    }, [projects, campaigns]);

    // Calculate metrics for each project - ALWAYS calculate
    const projectsWithMetrics = useMemo(() => {
        return projects.map(project => {
            const projectCampaigns = campaigns.filter(c => c.projectId === project.id);
            const runningCampaigns = projectCampaigns.filter(c =>
                c.status === 'running' || c.status === 'active'
            );
            const dailySpend = runningCampaigns.reduce((sum, campaign) => {
                const budgetVal = campaign.dailyBudget || campaign.budget?.daily || 0;
                const numericValue = parseInt(String(budgetVal).replace(/[^0-9]/g, '')) || 0;
                return sum + numericValue;
            }, 0);

            return {
                ...project,
                campaignCount: runningCampaigns.length,
                dailySpend
            };
        });
    }, [projects, campaigns]);

    // All Projects Overview when no specific project is selected
    if (!activeProject) {
        return (
            <div className="max-w-7xl space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Projects Overview</h1>
                    <p className="text-gray-500">Aggregate view of all your marketing projects</p>
                </div>

                {/* Aggregate Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card
                        className="p-6 bg-white cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
                        onClick={() => navigate('/marketing/projects')}
                    >
                        <h3 className="text-sm font-medium text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">
                            Total Projects
                        </h3>
                        <p className="text-3xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {allProjectsMetrics.totalProjects}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 group-hover:text-blue-500 transition-colors">
                            Click to view all projects →
                        </p>
                    </Card>

                    <Card
                        className="p-6 bg-white cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
                        onClick={() => navigate('/marketing/campaigns')}
                    >
                        <h3 className="text-sm font-medium text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">
                            Running Campaigns
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {allProjectsMetrics.totalRunningCampaigns}
                            </p>
                            <span className="text-sm text-gray-400">active</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 group-hover:text-blue-500 transition-colors">
                            Click to view all campaigns →
                        </p>
                    </Card>

                    <Card
                        className="p-6 bg-white cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
                        onClick={() => navigate('/marketing/analytics')}
                    >
                        <h3 className="text-sm font-medium text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">
                            Total Daily Spend
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                ₹{allProjectsMetrics.totalDailySpend.toLocaleString()}
                            </p>
                            <span className="text-sm text-gray-400">/day</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 group-hover:text-blue-500 transition-colors">
                            Click to view analytics →
                        </p>
                    </Card>
                </div>

                {/* Projects Comparison */}
                {projectsWithMetrics.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/marketing/projects/new')}
                            >
                                Create New Project
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectsWithMetrics.map(project => (
                                <Card
                                    key={project.id}
                                    className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/marketing/projects/${project.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{project.industry || 'Industry not set'}</p>
                                        </div>
                                        <Badge variant="success" className="text-xs">Active</Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Campaigns</span>
                                            <span className="font-medium text-gray-900">{project.campaignCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Daily Spend</span>
                                            <span className="font-medium text-gray-900">₹{project.dailySpend.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/marketing/projects/${project.id}`);
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Card className="p-12 bg-white text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
                        <p className="text-gray-500 mb-6">
                            Create your first project to start managing marketing campaigns.
                        </p>
                        <Button onClick={() => navigate('/marketing/projects/new')}>
                            Create Your First Project
                        </Button>
                    </Card>
                )}
            </div>
        );
    }

    // Single project view
    return (
        <div className="max-w-5xl space-y-8">
            {/* Project Header */}
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{activeProject.name}</h1>
                        <p className="text-gray-500">Your AI-powered marketing dashboard</p>
                    </div>
                    <Badge variant="success" className="capitalize">
                        Active
                    </Badge>
                </div>
            </div>

            {/* Project Overview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Industry */}
                <Card className="p-6 bg-white">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Industry</h3>
                    <p className="text-xl font-semibold text-gray-900 capitalize">
                        {activeProject.industry || 'Not specified'}
                    </p>
                </Card>

                {/* Status */}
                <Card className="p-6 bg-white">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xl font-semibold text-green-600">Active</span>
                    </div>
                </Card>

                {/* Running Campaigns - Clickable */}
                <Card
                    className="p-6 bg-white cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
                    onClick={() => navigate(`/marketing/projects/${activeProject.id}`)}
                >
                    <h3 className="text-sm font-medium text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">
                        Running Campaigns
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {projectMetrics.runningCampaigns}
                        </p>
                        <span className="text-sm text-gray-400">active</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 group-hover:text-blue-500 transition-colors">
                        Click to view campaigns →
                    </p>
                </Card>

                {/* Total Daily Spend - Clickable */}
                <Card
                    className="p-6 bg-white cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
                    onClick={() => navigate('/marketing/analytics')}
                >
                    <h3 className="text-sm font-medium text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">
                        Total Daily Spend
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            ₹{projectMetrics.totalDailySpend.toLocaleString()}
                        </p>
                        <span className="text-sm text-gray-400">/day</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 group-hover:text-blue-500 transition-colors">
                        Click to view analytics →
                    </p>
                </Card>
            </div>

            {activeProject.modules && activeProject.modules.length > 0 && (
                <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Modules</h3>
                    <div className="flex flex-wrap gap-2">
                        {activeProject.modules.map(mod => (
                            <Badge key={mod} variant="secondary" className="capitalize">
                                {mod}
                            </Badge>
                        ))}
                    </div>
                </Card>
            )}

            {/* Active Campaigns Section */}
            {(() => {
                const activeCampaigns = campaigns.filter(c =>
                    c.projectId === activeProject.id &&
                    (c.status === 'running' || c.status === 'active')
                );

                const getPlatformIcon = (platform) => {
                    const platformLower = platform.toLowerCase();
                    if (platformLower.includes('facebook') || platformLower.includes('meta')) {
                        return '📘'; // Facebook icon
                    }
                    if (platformLower.includes('google')) {
                        return '🔍'; // Google icon
                    }
                    if (platformLower.includes('linkedin')) {
                        return '💼'; // LinkedIn icon
                    }
                    if (platformLower.includes('instagram')) {
                        return '📸'; // Instagram icon
                    }
                    return '📢'; // Default campaign icon
                };

                if (activeCampaigns.length === 0) return null;

                return (
                    <Card className="p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
                            <span className="text-sm text-gray-500">{activeCampaigns.length} running</span>
                        </div>

                        <div className="space-y-3">
                            {activeCampaigns.map(campaign => (
                                <div
                                    key={campaign.id}
                                    onClick={() => navigate(`/marketing/projects/${activeProject.id}/campaigns/${campaign.id}`)}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {campaign.name || 'Untitled Campaign'}
                                            </h4>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-500">Budget:</span>
                                                    <span className="font-medium">
                                                        {campaign.dailyBudget || campaign.budget?.daily || '₹0'}/day
                                                    </span>
                                                </div>
                                                {campaign.leads && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-500">Est. Leads:</span>
                                                        <span className="font-medium">{campaign.leads}/mo</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="success" className="text-xs">
                                            Running
                                        </Badge>
                                    </div>

                                    {campaign.platforms && campaign.platforms.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Platforms:</span>
                                            <div className="flex gap-1">
                                                {campaign.platforms.map((platform, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-lg"
                                                        title={platform}
                                                    >
                                                        {getPlatformIcon(platform)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                );
            })()}

            {/* Quick Actions */}
            <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate(`/marketing/projects/${activeProject.id}/campaigns/new`)}
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left group"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Create Campaign</p>
                            <p className="text-sm text-gray-500">Launch a new marketing campaign</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/marketing/analytics')}
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
                    >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">View Analytics</p>
                            <p className="text-sm text-gray-500">Track campaign performance</p>
                        </div>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default MarketingDashboard;
