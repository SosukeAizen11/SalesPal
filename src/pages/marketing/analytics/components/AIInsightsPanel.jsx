import React from 'react';
import { AlertCircle, ArrowDown, TrendingUp, TrendingDown, Info } from 'lucide-react';

const InsightCard = ({ insight }) => {
    const borderColor =
        insight.severity === 'high' ? 'border-l-red-500' :
            insight.severity === 'medium' ? 'border-l-amber-500' :
                'border-l-blue-500';

    const iconColor =
        insight.severity === 'high' ? 'text-red-500' :
            insight.severity === 'medium' ? 'text-amber-500' :
                'text-blue-500';

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 border-l-4 ${borderColor} mb-3`}>
            <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${iconColor}`} />
                    {insight.title}
                </h4>
                <div className="flex items-center text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {insight.scope.name}
                </div>
            </div>

            <p className="text-xs text-gray-600 mt-1 mb-3 leading-relaxed">
                {insight.desc}
            </p>

            <div className="flex items-center gap-3 text-xs border-t border-gray-50 pt-2">
                <span className="font-bold text-gray-700">{insight.metric}</span>
                <span className={`font-bold flex items-center ${insight.trend.includes('-') ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {insight.trend}
                    {insight.trend.includes('-') ? <TrendingDown className="w-3 h-3 ml-1" /> : <TrendingUp className="w-3 h-3 ml-1" />}
                </span>
            </div>
        </div>
    );
};

const AIInsightsPanel = ({ insights }) => {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                AI Insights
            </h3>

            {insights && insights.length > 0 ? (
                <div>
                    {insights.map(item => (
                        <InsightCard key={item.id} insight={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                    No critical insights detected.
                </div>
            )}
        </div>
    );
};

export default AIInsightsPanel;
