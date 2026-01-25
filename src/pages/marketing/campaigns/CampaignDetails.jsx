import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pause, Play, Rocket, Edit, BarChart3, TrendingUp, Users, MousePointerClick, Calendar, DollarSign, Facebook, Chrome, Linkedin, AlertCircle, ArrowRight } from 'lucide-react';
import { useMarketing } from '../../../context/MarketingContext';
import { useIntegrations } from '../../../context/IntegrationContext';
import { canLaunchCampaign } from '../../../utils/campaignGuard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

// Mock Chart Component (Visual only)
const MockChart = ({ color = "blue" }) => (
    <div className="flex items-end gap-1 h-32 w-full mt-4">
        {[40, 65, 45, 70, 55, 80, 60, 85, 95, 75, 60, 90].map((h, i) => (
            <div
                key={i}
                className={`flex-1 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity ${color === 'blue' ? 'bg-blue-100' : 'bg-green-100'}`}
                style={{ height: `${h}%` }}
            >
                <div className={`h-full w-full opacity-60 ${color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`} style={{ height: `${h * 0.6}%` }}></div>
            </div>
        ))}
    </div>
);

export default function CampaignDetails() {
    const { projectId, campaignId } = useParams();
    const navigate = useNavigate();
    const { getCampaignById, updateCampaign } = useMarketing();
    const { integrations } = useIntegrations();

    // Local State
    const [campaign, setCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [launchError, setLaunchError] = useState(null);

    useEffect(() => {
        const data = getCampaignById(campaignId);
        setCampaign(data);
        setIsLoading(false);
    }, [campaignId, getCampaignById]);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading campaign details...</div>;

    if (!campaign) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">
                    Campaign not found
                </div>
                <Button onClick={() => navigate(`/marketing/projects/${projectId}`)}>Back to Project</Button>
            </div>
        );
    }

    const { status, name, dailyBudget, platforms, metrics } = campaign;
    const isRunning = status === 'active';
    const isPaused = status === 'paused';
    const isDraft = status === 'draft';

    // Build campaign object for guard check
    const campaignForGuard = {
        platforms: platforms || ['facebook', 'google']
    };
    const launchCheck = canLaunchCampaign(campaignForGuard, integrations);

    const handleAction = (action) => {
        // Only pause doesn't need guard
        if (action === 'pause') {
            updateCampaign(campaignId, { status: 'paused' });
            setCampaign(prev => ({ ...prev, status: 'paused' }));
            return;
        }

        // STRICT GUARD: Resume and Launch require integration check
        if (action === 'resume' || action === 'launch') {
            const check = canLaunchCampaign(campaignForGuard, integrations);

            if (!check.allowed) {
                setLaunchError({
                    message: `Connect ${check.missing.join(', ')} in Settings to ${action} this campaign`,
                    missing: check.missing
                });
                return;
            }
        }

        // Clear error and proceed
        setLaunchError(null);
        let newStatus = status;
        if (action === 'resume') newStatus = 'active';
        if (action === 'launch') newStatus = 'active';

        updateCampaign(campaignId, { status: newStatus });
        setCampaign(prev => ({ ...prev, status: newStatus }));
    };

    const handleEdit = () => {
        navigate(`/marketing/projects/${projectId}/campaigns/${campaignId}/edit`);
    };

    const getPlatformIcon = (p) => {
        if (p.includes('Facebook') || p.includes('Meta')) return <Facebook className="w-4 h-4 text-[#1877F2]" />;
        if (p.includes('Google')) return <Chrome className="w-4 h-4 text-[#EA4335]" />;
        if (p.includes('LinkedIn')) return <Linkedin className="w-4 h-4 text-[#0077B5]" />;
        return null;
    };

    // Formatted Data (Mocked if missing)
    const totalSpend = metrics?.spend || '₹12,450';
    const todaySpend = '₹1,500';
    const leads = metrics?.conversions || 45;
    const ctr = metrics?.ctr || '1.8%';
    const impressions = metrics?.impressions || '12.5k';

    return (
        <div className="animate-fade-in-up space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(`/marketing/projects/${projectId}`)}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Project
                </button>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                            <Badge variant={isRunning ? 'success' : isPaused ? 'warning' : 'default'} className="capitalize">
                                {status === 'active' ? 'Running' : status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Daily Budget: <span className="font-medium text-gray-900">{dailyBudget}</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Created: Oct 24, 2024
                            </span>
                            <span className="flex items-center gap-2">
                                {platforms && platforms.map(p => (
                                    <span key={p} className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                        {getPlatformIcon(p)} {p}
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {isRunning && (
                            <Button variant="secondary" onClick={() => handleAction('pause')}>
                                <Pause className="w-4 h-4 mr-2" /> Pause
                            </Button>
                        )}
                        {isPaused && (
                            <Button
                                variant="secondary"
                                onClick={() => handleAction('resume')}
                                disabled={!launchCheck.allowed}
                                className={!launchCheck.allowed ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                <Play className="w-4 h-4 mr-2" /> Resume
                            </Button>
                        )}
                        {isDraft && (
                            <Button
                                onClick={() => handleAction('launch')}
                                disabled={!launchCheck.allowed}
                                className={!launchCheck.allowed ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none pointer-events-none' : ''}
                            >
                                <Rocket className="w-4 h-4 mr-2" /> Launch
                            </Button>
                        )}

                        <Button variant="outline" onClick={handleEdit}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                    </div>
                </div>
            </div>

            {/* Integration Warning for paused/draft campaigns */}
            {(isPaused || isDraft) && !launchCheck.allowed && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-red-800 mb-2">
                                Missing Required Integrations
                            </h4>
                            <p className="text-sm text-red-700 mb-3">
                                Connect {launchCheck.missing.join(', ')} in Settings to {isDraft ? 'launch' : 'resume'} this campaign.
                            </p>
                            <Link
                                to="/marketing/settings/integrations"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Go to Marketing Settings → Integrations <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Launch Error (if user tries to launch/resume) */}
            {launchError && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-amber-800 mb-2">
                                Cannot {launchError.message.includes('resume') ? 'Resume' : 'Launch'} Campaign
                            </h4>
                            <p className="text-sm text-amber-700 mb-4">
                                {launchError.message}
                            </p>
                            <Link
                                to="/marketing/settings/integrations"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                Go to Integrations <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                        <DollarSign className="w-4 h-4" /> Total Spend
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalSpend}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        <span className="text-emerald-600 font-medium">+15%</span> vs last week
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                        <Users className="w-4 h-4" /> Leads Generated
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{leads}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Cost per Lead: <span className="font-medium">₹250</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                        <MousePointerClick className="w-4 h-4" /> Click-Through Rate
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{ctr}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {impressions} Impressions
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" /> Today's Pacing
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{todaySpend}</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        45% of daily budget
                    </div>
                </Card>
            </div>

            {/* Performance Chart & Breakdown */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-500" />
                            Performance Trends
                        </h3>
                        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <MockChart color="blue" />
                    <div className="grid grid-cols-6 gap-2 mt-4 text-xs text-gray-400 text-center uppercase font-medium">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Split</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Facebook className="w-4 h-4 text-[#1877F2]" /> Meta Ads
                                </span>
                                <span className="font-semibold text-gray-900">₹7,450</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#1877F2] h-2 rounded-full ring-1 ring-white" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Chrome className="w-4 h-4 text-[#EA4335]" /> Google Ads
                                </span>
                                <span className="font-semibold text-gray-900">₹5,000</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#EA4335] h-2 rounded-full ring-1 ring-white" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">AI Insights</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg text-xs leading-relaxed text-green-800 border border-green-100">
                                <strong>🚀 Opportunity:</strong> Meta Ads are driving 20% cheaper leads than average. Consider increasing budget allocation.
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
