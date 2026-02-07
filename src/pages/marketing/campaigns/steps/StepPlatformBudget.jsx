import React, { useState, useEffect } from 'react';
import { IndianRupee, PieChart, TrendingUp, Wallet, CheckCircle2, Facebook, Linkedin, Instagram, Twitter, Check, Info, AlertCircle } from 'lucide-react';
import StepNavigation from '../components/StepNavigation';

// Mock Google Icon
const GoogleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
);

const PLATFORMS = [
    { id: 'meta', name: 'Meta Ads', icon: Facebook, recommended: true, reason: 'Best for visual discovery & reach' },
    { id: 'google', name: 'Google Ads', icon: GoogleIcon, recommended: true, reason: 'High intent search traffic' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, recommended: false },
    { id: 'instagram', name: 'Instagram', icon: Instagram, recommended: false },
    { id: 'twitter', name: 'X / Twitter', icon: Twitter, recommended: false }
];

const StepPlatformBudget = ({ onComplete, onBack, data }) => {
    // State
    const [dailyBudget, setDailyBudget] = useState(data?.budget?.daily || 3500);
    const [metaSplit, setMetaSplit] = useState(data?.budget?.split?.meta || 60);
    const [showError, setShowError] = useState(false);

    // Initialize selected platforms from data or default to recommended
    const [selectedPlatforms, setSelectedPlatforms] = useState(() => {
        if (data?.platforms?.length > 0) return data.platforms;
        if (data?.budget?.split) {
            const legacy = [];
            if (data.budget.split.meta > 0) legacy.push('meta');
            if (data.budget.split.google > 0) legacy.push('google');
            if (legacy.length > 0) return legacy;
        }
        return ['meta', 'google'];
    });

    const googleSplit = 100 - metaSplit;

    const togglePlatform = (id) => {
        if (selectedPlatforms.includes(id)) {
            setSelectedPlatforms(prev => prev.filter(p => p !== id));
        } else {
            setSelectedPlatforms(prev => [...prev, id]);
        }
    };

    // Handle manual percentage input for Meta
    const handleMetaPercentChange = (value) => {
        const numValue = Math.min(80, Math.max(20, Number(value) || 20));
        setMetaSplit(numValue);
    };

    // Handle manual percentage input for Google
    const handleGooglePercentChange = (value) => {
        const numValue = Math.min(80, Math.max(20, Number(value) || 20));
        setMetaSplit(100 - numValue);
    };

    // Handle manual budget amount input for Meta
    const handleMetaBudgetChange = (value) => {
        const numValue = Number(value) || 0;
        const newPercent = Math.min(80, Math.max(20, Math.round((numValue / dailyBudget) * 100)));
        setMetaSplit(newPercent);
    };

    // Handle manual budget amount input for Google
    const handleGoogleBudgetChange = (value) => {
        const numValue = Number(value) || 0;
        const newPercent = Math.min(80, Math.max(20, Math.round((numValue / dailyBudget) * 100)));
        setMetaSplit(100 - newPercent);
    };

    const handleNext = () => {
        if (selectedPlatforms.length === 0) {
            alert('Please select at least one platform.');
            return;
        }

        if (!dailyBudget || Number(dailyBudget) < 100) {
            setShowError(true);
            alert('Please enter a valid daily budget (minimum ₹100).');
            return;
        }

        let finalMetaSplit = 0;
        let finalGoogleSplit = 0;

        const isStandardPair = selectedPlatforms.length === 2 &&
            selectedPlatforms.includes('meta') &&
            selectedPlatforms.includes('google');

        if (isStandardPair) {
            finalMetaSplit = metaSplit;
            finalGoogleSplit = 100 - metaSplit;
        } else {
            if (selectedPlatforms.includes('meta')) finalMetaSplit = Math.floor(100 / selectedPlatforms.length);
            if (selectedPlatforms.includes('google')) finalGoogleSplit = Math.floor(100 / selectedPlatforms.length);
        }

        if (onComplete) {
            onComplete({
                budget: {
                    daily: Number(dailyBudget),
                    currency: 'INR',
                    split: {
                        meta: finalMetaSplit,
                        google: finalGoogleSplit
                    }
                },
                platforms: selectedPlatforms
            });
        }
    };

    // Calculations
    const monthlyBudget = dailyBudget * 30;
    const metaSpend = Math.round(dailyBudget * (metaSplit / 100));
    const googleSpend = Math.round(dailyBudget * (googleSplit / 100));

    // Check if we show the standard split slider
    const isStandardSplit = selectedPlatforms.length === 2 &&
        selectedPlatforms.includes('meta') &&
        selectedPlatforms.includes('google');

    return (
        <div className="animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-12">

                {/* Left Column: Controls */}
                <div className="space-y-10">

                    {/* 1. Daily Budget */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Wallet className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Daily Budget <span className="text-red-500">*</span>
                            </h3>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-lg font-medium">₹</span>
                            </div>
                            <input
                                type="number"
                                value={dailyBudget}
                                onChange={(e) => setDailyBudget(e.target.value)}
                                className={`block w-full pl-10 pr-4 py-4 text-2xl font-bold text-gray-900 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${showError && (!dailyBudget || Number(dailyBudget) < 100) ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200'}`}
                                placeholder="3500"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-sm font-medium">/ day</span>
                            </div>
                        </div>

                        {/* PART 2: Recommended Budget Helper Text */}
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-blue-500" />
                            Recommended daily budget based on industry benchmarks and AI analysis.
                        </p>

                        <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            You can edit this amount anytime.
                        </p>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* 2. Platform Selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Platform Selection & Budget</h3>
                        </div>

                        {/* AI Recommended Platforms */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">AI Recommended Platforms</h4>
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium border border-green-100">
                                    Based on your business
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {PLATFORMS.filter(p => p.recommended).map(platform => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    return (
                                        <div
                                            key={platform.id}
                                            onClick={() => togglePlatform(platform.id)}
                                            className={`
                                                relative p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 group
                                                ${isSelected
                                                    ? 'bg-blue-50/50 border-blue-500 shadow-sm'
                                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h5 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        {platform.name}
                                                    </h5>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                                                        Recommended
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                    <Info className="w-3 h-3 text-green-600" />
                                                    {platform.reason}
                                                </p>
                                            </div>
                                            <div className={`
                                                w-6 h-6 rounded-full border flex items-center justify-center transition-all
                                                ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}
                                            `}>
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Other Available Platforms */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Other Available Platforms</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {PLATFORMS.filter(p => !p.recommended).map(platform => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    return (
                                        <div
                                            key={platform.id}
                                            onClick={() => togglePlatform(platform.id)}
                                            className={`
                                                relative p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 group
                                                ${isSelected
                                                    ? 'bg-blue-50/50 border-blue-500 shadow-sm'
                                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {platform.name}
                                                </h5>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Optional additional channel
                                                </p>
                                            </div>
                                            <div className={`
                                                w-6 h-6 rounded-full border flex items-center justify-center transition-all
                                                ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}
                                            `}>
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* PART 1: Enhanced Platform Split with Manual Inputs */}
                    {isStandardSplit && (
                        <div className="animate-fade-in-up">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900">Budget Allocation</h4>
                                    <span className="text-xs text-gray-500">Multiple adjustment methods</span>
                                </div>

                                {/* Visual Bar */}
                                <div className="h-4 w-full bg-white rounded-full overflow-hidden flex shadow-inner border border-gray-100">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${metaSplit}%` }}
                                    />
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-300"
                                        style={{ width: `${googleSplit}%` }}
                                    />
                                </div>

                                {/* Manual Inputs Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Meta Column */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Facebook className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-semibold text-gray-900">Meta Ads</span>
                                        </div>

                                        {/* Percentage Input */}
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Percentage %</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="20"
                                                    max="80"
                                                    value={metaSplit}
                                                    onChange={(e) => handleMetaPercentChange(e.target.value)}
                                                    className="w-full px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                                            </div>
                                        </div>

                                        {/* Amount Input */}
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Daily Amount</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                                                <input
                                                    type="number"
                                                    value={metaSpend}
                                                    onChange={(e) => handleMetaBudgetChange(e.target.value)}
                                                    className="w-full pl-6 pr-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Google Column */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <GoogleIcon className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-semibold text-gray-900">Google Ads</span>
                                        </div>

                                        {/* Percentage Input */}
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Percentage %</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="20"
                                                    max="80"
                                                    value={googleSplit}
                                                    onChange={(e) => handleGooglePercentChange(e.target.value)}
                                                    className="w-full px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                                            </div>
                                        </div>

                                        {/* Amount Input */}
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Daily Amount</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                                                <input
                                                    type="number"
                                                    value={googleSpend}
                                                    onChange={(e) => handleGoogleBudgetChange(e.target.value)}
                                                    className="w-full pl-6 pr-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Slider - Optional Method */}
                                <div className="pt-2 border-t border-gray-200">
                                    <label className="text-xs text-gray-600 mb-2 block">Or use slider for quick adjustment</label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="80"
                                        value={metaSplit}
                                        onChange={(e) => setMetaSplit(Number(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Summary */}
                <div className="lg:pl-8 lg:border-l border-gray-100">
                    <div className="sticky top-6 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Estimated Reach
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-600">Daily Spend</span>
                                    <span className="text-xl font-bold text-gray-900">₹{dailyBudget}</span>
                                </div>
                                <div className="flex justify-between items-baseline pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-600">Monthly Estimate</span>
                                    <span className="text-xl font-bold text-gray-500">₹{monthlyBudget.toLocaleString()}</span>
                                </div>

                                <div className="pt-2">
                                    <p className="text-xs text-center text-gray-400 uppercase tracking-widest font-medium mb-3">Est. Results Per Month</p>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-lg font-bold text-gray-900">12k - 18k</div>
                                            <div className="text-xs text-gray-500">Impressions</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-lg font-bold text-gray-900">45 - 60</div>
                                            <div className="text-xs text-gray-500">Leads</div>
                                        </div>
                                    </div>
                                </div>

                                {/* PART 3: AI Estimation Disclaimer */}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                                        <p>
                                            These estimates are based on historical data, industry benchmarks, and AI insights.
                                            Actual performance may vary and results are not guaranteed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <div className="bg-white p-2 rounded-full h-fit shadow-sm text-xl">💡</div>
                            <div className="text-sm text-blue-900 leading-relaxed">
                                {isStandardSplit ? (
                                    <span>
                                        <strong>AI Tip:</strong> A 60/40 split favors Meta for visual discovery (Real Estate) while keeping Google active for high-intent search traffic.
                                    </span>
                                ) : (
                                    <span>
                                        <strong>AI Optimization:</strong> SalesPal will dynamically allocate your daily budget across your {selectedPlatforms.length} selected platforms to maximize lead generation.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-8 mt-12 border-t border-gray-100">
                <StepNavigation
                    onNext={handleNext}
                    onBack={onBack}
                    nextLabel="Continue to Review →"
                />
            </div>
        </div>
    );
};

export default StepPlatformBudget;
