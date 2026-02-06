import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft, Building2, Layout, Edit2, CheckSquare, Square, AlertCircle, ArrowRight } from 'lucide-react';
import { useIntegrations } from '../../../../context/IntegrationContext';
import { canLaunchCampaign, getIntegrationErrors } from '../../../../utils/campaignGuard';

const StepReviewLaunch = ({ onLaunch, onBack, data }) => {
    const navigate = useNavigate();
    const [isConfirmed, setIsConfirmed] = useState(true);
    const [isLaunching, setIsLaunching] = useState(false);
    const { integrations, initiateConnection } = useIntegrations();

    // Derive platforms from budget split data
    // StepPlatformBudget stores: budget.split.meta (%) and budget.split.google (%)
    const derivePlatforms = () => {
        const platforms = [];
        const budgetSplit = data?.budget?.split;

        if (budgetSplit?.meta > 0) {
            platforms.push('facebook'); // Meta Ads = Facebook/Instagram
        }
        if (budgetSplit?.google > 0) {
            platforms.push('google');
        }

        // If no budget data yet, default to both platforms
        if (platforms.length === 0) {
            return ['facebook', 'google'];
        }

        return platforms;
    };

    // Build campaign object for validation
    // Use data.platforms if it has values, otherwise derive from budget split
    const detectedPlatforms = (data?.platforms?.length > 0)
        ? data.platforms
        : derivePlatforms();

    const campaign = {
        platforms: detectedPlatforms
    };

    // Use the SINGLE AUTHORITY guard function
    const launchCheck = canLaunchCampaign(campaign, integrations);
    const integrationErrors = getIntegrationErrors(campaign, integrations);
    const hasIntegrationErrors = integrationErrors.length > 0;
    const canLaunch = isConfirmed && launchCheck.allowed;
    const [launchError, setLaunchError] = useState(null);

    // DEBUG: Remove after testing
    console.log('[StepReviewLaunch] Guard Debug:', {
        platforms: campaign.platforms,
        integrations: {
            meta: integrations?.meta?.connected,
            google: integrations?.google?.connected,
            linkedin: integrations?.linkedin?.connected
        },
        launchCheck,
        canLaunch
    });

    const handleLaunch = () => {
        // STRICT GUARD: Re-check at launch time
        const check = canLaunchCampaign(campaign, integrations);

        if (!check.allowed) {
            // DO NOT navigate, DO NOT change status
            setLaunchError({
                message: `Connect ${check.missing.join(', ')} to launch this campaign`,
                missing: check.missing
            });
            return;
        }

        if (!isConfirmed) {
            return;
        }

        // Clear any previous error
        setLaunchError(null);
        setIsLaunching(true);

        setTimeout(() => {
            if (onLaunch) {
                onLaunch(); // This sets campaign.status = 'running' in parent
            }
        }, 1500);
    };

    const handleConnectTrigger = (platformId) => {
        const path = initiateConnection(platformId, location.pathname); // Current wizard URL
        navigate(path);
    };

    const SectionHeader = ({ title }) => (
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {title}
            </h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                <Edit2 className="w-3 h-3" /> Edit
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in-up space-y-8 pb-4">

            <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">

                {/* 1. Business Info */}
                <div>
                    <SectionHeader title="Business Summary" />
                    <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-medium text-gray-900">Premium Coffee Co.</h4>
                            <p className="text-sm text-gray-600">e-Commerce • Food & Beverage</p>
                            <p className="text-sm text-gray-600">Mumbai, India</p>
                            <a href="#" className="text-xs text-blue-600 hover:underline">premiumcoffee.com</a>
                        </div>
                    </div>
                </div>

                {/* 2. Target Audience */}
                <div>
                    <SectionHeader title="Target Audience" />
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Age: 25 - 45</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Urban Professionals</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Coffee Lovers</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">High Intent</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                        AI has identified this segment as high-potential based on your product offering.
                    </p>
                </div>

                <div className="lg:col-span-2 h-px bg-gray-100" />

                {/* 3. Ads Summary */}
                <div>
                    <SectionHeader title="Ad Creative" />
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex gap-4">
                        <div className="w-20 h-24 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
                            <Layout className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="space-y-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Meta & Google</span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm truncate">Luxury Living in South Mumbai</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">Experience the pinnacle of luxury with our new sea-facing apartments. World-class amenities and...</p>
                            <p className="text-xs font-medium text-gray-700 mt-1">CTA: Request a Tour</p>
                        </div>
                    </div>
                </div>

                {/* 4. Budget Summary */}
                <div>
                    <SectionHeader title="Budget & Spend" />
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Daily Budget</span>
                            <span className="font-semibold text-gray-900">₹{data?.budget?.daily || 3500}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Monthly Estimate</span>
                            <span className="font-semibold text-gray-900">₹{((data?.budget?.daily || 3500) * 30).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-2 flex">
                            <div className="bg-blue-600 h-full w-[60%]" title="Meta 60%" />
                            <div className="bg-orange-500 h-full w-[40%]" title="Google 40%" />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600" /> Meta Ads 60%</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500" /> Google 40%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Integration Warning */}
            {hasIntegrationErrors && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-red-800 mb-2">
                                Missing Required Integrations
                            </h4>
                            <ul className="space-y-2 mb-3">
                                {integrationErrors.map((error) => (
                                    <li key={error.id} className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-red-700">{error.message}</span>
                                        <button
                                            onClick={() => handleConnectTrigger(error.id)}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 whitespace-nowrap"
                                        >
                                            Connect <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-red-600">
                                You must connect these platforms to launch your campaign. You will be redirected back here.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Launch Error */}
            {launchError && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-amber-800 mb-2">
                                Cannot Launch Campaign
                            </h4>
                            <p className="text-sm text-amber-700 mb-4">
                                {launchError.message}
                            </p>
                            <div className="flex gap-2">
                                {launchError.missing && launchError.missing.map(platform => {
                                    // Map platform name back to ID (simple logic)
                                    const id = platform.toLowerCase().includes('google') ? 'google' :
                                        platform.toLowerCase().includes('linkedin') ? 'linkedin' : 'meta';
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => handleConnectTrigger(id)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors"
                                        >
                                            Connect {platform}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Final Confirmation & Actions */}
            <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 mb-8 cursor-pointer" onClick={() => setIsConfirmed(!isConfirmed)}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 transition-colors ${isConfirmed ? 'text-green-600' : 'text-gray-300'}`}>
                            {isConfirmed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 select-none">
                                I understand that SalesPal AI will optimize this campaign automatically.
                            </p>
                            <p className="text-xs text-gray-500 mt-1 select-none">
                                You can pause, edit, or cancel this campaign at any time from your dashboard.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-900 font-medium px-4 py-2 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                        onClick={handleLaunch}
                        disabled={!canLaunch || isLaunching}
                        className={`
                            group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                            ${canLaunch && !isLaunching
                                ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 shadow-primary/20'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none pointer-events-none'
                            }
                        `}
                    >
                        {isLaunching ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Launching...</span>
                            </>
                        ) : (
                            <>
                                <Rocket className="w-5 h-5" />
                                <span>Launch Campaign</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepReviewLaunch;
