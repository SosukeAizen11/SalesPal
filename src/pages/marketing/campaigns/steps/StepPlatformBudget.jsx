import React, { useState } from 'react';
import { IndianRupee, PieChart, TrendingUp, Wallet, CheckCircle2, Facebook } from 'lucide-react';
import StepNavigation from '../components/StepNavigation';

// Mock Google Icon
const GoogleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
);

const StepPlatformBudget = ({ onComplete, onBack, data }) => {
    // State
    const [dailyBudget, setDailyBudget] = useState(data?.budget?.daily || 3500);
    const [metaSplit, setMetaSplit] = useState(data?.budget?.split?.meta || 60);

    const googleSplit = 100 - metaSplit;

    const handleNext = () => {
        if (onComplete) {
            onComplete({
                budget: {
                    daily: Number(dailyBudget),
                    currency: 'INR',
                    split: {
                        meta: metaSplit,
                        google: googleSplit
                    }
                }
            });
        }
    };

    // Calculations
    const monthlyBudget = dailyBudget * 30;
    const metaSpend = Math.round(dailyBudget * (metaSplit / 100));
    const googleSpend = Math.round(dailyBudget * (googleSplit / 100));

    return (
        <div className="animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-12">

                {/* Left Column: Controls */}
                <div className="space-y-10">

                    {/* 1. Daily Budget */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Wallet className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Daily Budget</h3>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-lg font-medium">₹</span>
                            </div>
                            <input
                                type="number"
                                value={dailyBudget}
                                onChange={(e) => setDailyBudget(e.target.value)}
                                className="block w-full pl-10 pr-4 py-4 text-2xl font-bold text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="3500"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-sm font-medium">/ day</span>
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            You can edit this amount anytime.
                        </p>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* 2. Platform Split */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Platform Split</h3>
                            </div>
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium border border-green-100">
                                AI Recommended Split
                            </span>
                        </div>

                        {/* Slider Control */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">

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

                            {/* Inputs */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Meta */}
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Facebook className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-900">Meta Ads</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{metaSplit}%</div>
                                    <div className="text-xs text-gray-500">₹{metaSpend}/day</div>
                                </div>

                                {/* Slider Input */}
                                <input
                                    type="range"
                                    min="20"
                                    max="80"
                                    value={metaSplit}
                                    onChange={(e) => setMetaSplit(Number(e.target.value))}
                                    className="flex-1 max-w-[120px] accent-gray-900"
                                />

                                {/* Google */}
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900">Google Search</span>
                                        <GoogleIcon className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{googleSplit}%</div>
                                    <div className="text-xs text-gray-500">₹{googleSpend}/day</div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <div className="bg-white p-2 rounded-full h-fit shadow-sm text-xl">💡</div>
                            <div className="text-sm text-blue-900 leading-relaxed">
                                <strong>AI Tip:</strong> A 60/40 split favors Meta for visual discovery (Real Estate) while keeping Google active for high-intent search traffic.
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
