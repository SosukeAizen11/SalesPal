import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

const InsightItem = ({ icon: Icon, color, title, description }) => (
    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-secondary/20 hover:bg-secondary/5 transition-all group">
        <div className={`w-10 h-10 rounded-lg ${color} bg-opacity-10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);

const AIInsightsPanel = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold text-gray-900">AI Daily Insights</h3>
            </div>

            <div className="space-y-4">
                <InsightItem
                    icon={TrendingUp}
                    color="bg-green-600"
                    title="Meta Ads Outperforming Google"
                    description="Facebook leads are coming in at 15% lower cost today. AI has shifted slightly more budget to Meta to capitalize on this."
                />
                <InsightItem
                    icon={Lightbulb}
                    color="bg-amber-500"
                    title="Creative Optimization"
                    description="Carousel card #2 is generating 40% of clicks. Consider moving it to the first position."
                />
                <InsightItem
                    icon={AlertCircle}
                    color="bg-blue-600"
                    title="Audience Reach"
                    description="You've reached 80% of the 'Luxury Investors' segment. AI suggests expanding to 'High Net Worth Individuals' next week."
                />
            </div>
        </div>
    );
};

export default AIInsightsPanel;
