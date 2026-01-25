import React, { useEffect, useState } from 'react';
import { Building2, Globe2, Target, Wallet, ShieldCheck, CheckCircle2, AlertTriangle, MapPin, Tag, Sparkles } from 'lucide-react';
import StepNavigation from '../components/StepNavigation';

const StepAIAnalysis = ({ onComplete, onBack, data, ai }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(!ai?.analysisDone);
    const [progress, setProgress] = useState(0);

    // Mock Analysis Process
    useEffect(() => {
        if (!ai?.analysisDone) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsAnalyzing(false);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 40);
            return () => clearInterval(interval);
        } else {
            setProgress(100);
        }
    }, [ai?.analysisDone]);

    const handleNext = () => {
        if (onComplete) {
            onComplete({
                analysisTimestamp: new Date().toISOString()
            });
        }
    };

    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in py-12">
                <div className="mb-8 relative">
                    <div className="w-24 h-24 border-4 border-gray-100 rounded-full"></div>
                    <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700 text-lg">
                        {progress}%
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing your Business</h3>
                <p className="text-gray-500 max-w-md text-center">
                    Our AI is scanning your inputs, identifying your ideal customer profile, and generating key selling points...
                </p>

                <div className="mt-8 space-y-3 w-full max-w-xs mx-auto pl-8">
                    <div className={`flex items-center gap-3 text-sm transition-colors ${progress > 20 ? 'text-green-600' : 'text-gray-300'}`}>
                        <CheckCircle2 className="w-4 h-4" /> <span> Analyzing Business Type</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm transition-colors ${progress > 50 ? 'text-green-600' : 'text-gray-300'}`}>
                        <CheckCircle2 className="w-4 h-4" /> <span> Identifying Target Audience</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm transition-colors ${progress > 80 ? 'text-green-600' : 'text-gray-300'}`}>
                        <CheckCircle2 className="w-4 h-4" /> <span> Detecting Currency & Location</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">

            {/* Top Grid: Business & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 1. Business Summary */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Business Summary</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-gray-500">Industry</span>
                            <span className="col-span-2 font-medium text-gray-900">E-Commerce / Food & Beverage</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-gray-500">Business Type</span>
                            <span className="col-span-2 font-medium text-gray-900">D2C Subscription Brand</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-gray-500">Key Offering</span>
                            <span className="col-span-2 font-medium text-gray-900">Premium Arabica Coffee Beans</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-gray-500">Brand Tone</span>
                            <span className="col-span-2 font-medium text-gray-900">Premium, Ethical, Artisanal</span>
                        </div>
                    </div>
                </div>

                {/* 2. Target Audience */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Target Audience</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">Age: 25 - 45</span>
                            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">White-collar Professionals</span>
                            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">Coffee Enthusiasts</span>
                            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">High Disposable Income</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Primary personas include urban professionals and home baristas who value sustainability and origin transparency.
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Middle: USPs and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 3. Key Selling Points */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Key Selling Points</h3>
                    </div>
                    <ul className="space-y-3">
                        {[
                            'Ethically sourced from single-estate farms',
                            'Freshly roasted less than 48 hours before delivery',
                            'Subscription model saves 20% vs retail',
                            'Combines convenience with cafe-quality taste'
                        ].map((point, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 4. Location & Compliance */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Location Settings</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-100">
                                🇮🇳 Mumbai, India
                            </div>
                            <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                INR (₹)
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Compliance Check</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Business category eligible for Meta & Google Ads.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-8 mt-8 border-t border-gray-100">
                <StepNavigation
                    onNext={handleNext}
                    onBack={onBack}
                    nextLabel="Continue to Ad Creation →"
                />
            </div>
        </div>
    );
};

export default StepAIAnalysis;

