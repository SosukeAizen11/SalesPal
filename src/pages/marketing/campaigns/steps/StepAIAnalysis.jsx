import React from 'react';
import { Building2, Globe2, Target, Wallet, ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import AnalysisCard from '../components/AnalysisCard';
import InsightRow from '../components/InsightRow';
import ConfidenceBadge from '../components/ConfidenceBadge';

const StepAIAnalysis = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Section 1: Business Overview */}
                <AnalysisCard title="Business Profile" icon={Building2}>
                    <div className="space-y-1">
                        <InsightRow label="Business Type" value="Real Estate" />
                        <InsightRow label="Industry" value="Construction & Property" />
                        <InsightRow label="Core Offering" value="Luxury Apartments" />
                        <InsightRow label="Primary Objective" value="Lead Generation" subtext="High intent buyers" />
                    </div>
                </AnalysisCard>

                {/* Section 2: Market & Audience */}
                <AnalysisCard title="Market & Audience" icon={Globe2}>
                    <div className="mb-4">
                        <ConfidenceBadge score={92} />
                    </div>
                    <div className="space-y-1">
                        <InsightRow label="Target Region" value="South Mumbai, India" />
                        <InsightRow label="Timezone" value="IST (GMT+5:30)" />
                        <InsightRow label="Audience Segment" value="HNI & Investors" subtext="Age 35-55, High Net Worth" />
                        <InsightRow label="Market Competition" value="High" subtext="Lodha, Godrej, Piramal active" />
                    </div>
                </AnalysisCard>
            </div>

            {/* Section 3: Platform Recommendations */}
            <AnalysisCard title="Platform Strategy" icon={Target}>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-green-900">Recommended: Meta (Facebook & Instagram)</h4>
                            <p className="text-sm text-green-800 mt-1">High engagement for visual real estate listings. Best for lead forms.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-green-900">Recommended: Google Search</h4>
                            <p className="text-sm text-green-800 mt-1">Capture high intent searches for "luxury flats in Mumbai".</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 opacity-60">
                        <XCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-gray-700">Not Recommended: LinkedIn</h4>
                            <p className="text-sm text-gray-600 mt-1">Lower CVR for residential real estate compared to Meta/Google.</p>
                        </div>
                    </div>
                </div>
            </AnalysisCard>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Section 4: Budget Insights */}
                <AnalysisCard title="Budget Estimation" icon={Wallet}>
                    <div className="text-center py-4 bg-secondary/10 rounded-xl mb-4 border border-secondary/20">
                        <p className="text-sm text-gray-600 mb-1">Recommended Daily Budget</p>
                        <p className="text-3xl font-bold text-gray-900">₹3,500 - ₹5,000</p>
                    </div>
                    <InsightRow label="Estimated Monthly Spend" value="₹1.05L - ₹1.50L" />
                    <InsightRow label="Projected Leads/Mo" value="45 - 60" subtext="@ ₹2,500 CPL" />
                </AnalysisCard>

                {/* Section 5: Compliance Check */}
                <AnalysisCard title="Compliance Check" icon={ShieldCheck}>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Ad Content Policy Safe</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>RERA Registration Detected</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Landing Page SSL Valid</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm bg-yellow-50 text-yellow-800 p-2 rounded-lg mt-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Housing category ads require special declaration on Meta.</span>
                        </div>
                    </div>
                </AnalysisCard>
            </div>
        </div>
    );
};

export default StepAIAnalysis;
