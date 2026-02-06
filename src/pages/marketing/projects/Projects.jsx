import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Folder, Filter, X, Megaphone, DollarSign, Users, ChevronRight } from 'lucide-react';
import { useMarketing } from '../../../context/MarketingContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export default function Projects() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { projects, campaigns } = useMarketing();

    const filterMode = searchParams.get('filter');
    const isFiltered = filterMode === 'active';

    const clearFilter = () => {
        setSearchParams({});
    };

    // Calculate metrics for each project
    const getProjectMetrics = (projectId) => {
        const projectCampaigns = campaigns.filter(c => c.projectId === projectId);
        const activeCount = projectCampaigns.filter(c => c.status === 'RUNNING' || c.status === 'running' || c.status === 'active').length;

        // Mock aggregation - in real app would sum from campaign.metrics
        const totalSpend = '₹' + (projectCampaigns.length * 5400).toLocaleString();
        const totalLeads = projectCampaigns.length * 124;

        return { activeCount, totalSpend, totalLeads, campaignCount: projectCampaigns.length };
    };

    // Filter projects based on "Active" criteria (having at least 1 active campaign)
    const displayedProjects = isFiltered
        ? projects.filter(p => getProjectMetrics(p.id).activeCount > 0)
        : projects;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                    {isFiltered && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-blue-100 animate-fade-in">
                                <Filter className="w-3 h-3 text-blue-600" />
                                <span className="font-medium text-blue-900">Showing Active Projects</span>
                                <button onClick={clearFilter} className="hover:bg-blue-100 rounded-full p-0.5 transition-colors ml-1"><X className="w-3 h-3 text-blue-600" /></button>
                            </span>
                        </div>
                    )}
                </div>
                <Button onClick={() => navigate('/marketing/projects/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                </Button>
            </div>

            {displayedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProjects.map(project => {
                        const metrics = getProjectMetrics(project.id);

                        return (
                            <Card
                                key={project.id}
                                onClick={() => navigate(`/marketing/projects/${project.id}`)}
                                className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-500"
                                noPadding
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                            <Folder className="w-6 h-6 text-blue-600" />
                                        </div>
                                        {metrics.activeCount > 0 ? (
                                            <Badge variant="success" className="shadow-sm">
                                                {metrics.activeCount} Active Campaigns
                                            </Badge>
                                        ) : (
                                            <Badge variant="neutral">Inactive</Badge>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                        {project.name}
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0 text-blue-500" />
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6">{project.industry} • {project.website || 'No website'}</p>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" /> Spend
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">{metrics.totalSpend}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                                                <Users className="w-3 h-3" /> Leads
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">{metrics.totalLeads}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card noPadding className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Folder className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 max-w-sm mb-6">Create your first project to start organizing your marketing campaigns.</p>
                    <Button onClick={() => navigate('/marketing/projects/new')}>
                        Create Project
                    </Button>
                </Card>
            )}
        </div>
    );
}
