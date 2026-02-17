import React from 'react';
import { TrendingUp, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InsightCard = ({ type, title, description, badgeStart, badgeColor, icon: Icon, buttonText, onClick }) => {

    // Theme configuration based on type
    const themes = {
        growth: {
            bg: 'bg-white',
            border: 'border-emerald-100',
            badgeBg: 'bg-emerald-50',
            badgeText: 'text-emerald-700',
            iconColor: 'text-emerald-600',
            buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
            shadow: 'shadow-sm hover:shadow-md hover:border-emerald-200'
        },
        efficiency: {
            bg: 'bg-white',
            border: 'border-blue-100',
            badgeBg: 'bg-blue-50',
            badgeText: 'text-blue-700',
            iconColor: 'text-blue-600',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
            shadow: 'shadow-sm hover:shadow-md hover:border-blue-200'
        },
        risk: {
            bg: 'bg-white',
            border: 'border-rose-100',
            badgeBg: 'bg-rose-50',
            badgeText: 'text-rose-700',
            iconColor: 'text-rose-600',
            buttonBg: 'bg-rose-600 hover:bg-rose-700',
            shadow: 'shadow-sm hover:shadow-md hover:border-rose-200'
        }
    };

    const theme = themes[type] || themes.growth;

    return (
        <div className={`
            flex flex-col p-5 rounded-xl border transition-all duration-300
            ${theme.bg} ${theme.border} ${theme.shadow}
        `}>
            {/* Header: Badge & Icon */}
            <div className="flex items-start justify-between mb-3">
                <span className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${theme.badgeBg} ${theme.badgeText}
                `}>
                    <Icon className="w-3.5 h-3.5" />
                    {badgeStart}
                </span>
            </div>

            {/* Content */}
            <div className="mb-6 grow">
                <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                    {title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Footer: CTA */}
            <button
                onClick={onClick}
                className={`
                    w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white 
                    flex items-center justify-center gap-2 transition-colors
                    ${theme.buttonBg}
                `}
            >
                {buttonText}
                <ArrowRight className="w-4 h-4 opacity-80" />
            </button>
        </div>
    );
};

const AIStrategicInsights = () => {
    const navigate = useNavigate();

    // Mock Data for Phase 1
    const insights = [
        {
            id: 1,
            type: 'growth',
            badgeStart: 'Growth Opportunity',
            icon: TrendingUp,
            title: 'Scale High-Performing Brand Campaign',
            description: 'Google Ads Brand Campaign is showing consistent 5.2x ROAS. Increasing budget by 15% may increase revenue without impacting CPA.',
            buttonText: 'Increase Budget',
            route: '/marketing/campaigns'
        },
        {
            id: 2,
            type: 'efficiency',
            badgeStart: 'Efficiency Insight',
            icon: Zap,
            title: 'Improved Spend Efficiency',
            description: 'ROAS increased 172% due to a 66% reduction in spend. Revenue decline was minimal, indicating improved efficiency.',
            buttonText: 'View Campaigns',
            route: '/marketing/campaigns'
        },
        {
            id: 3,
            type: 'risk',
            badgeStart: 'Risk Warning',
            icon: AlertTriangle,
            title: 'CPA Spike Detected',
            description: 'Meta Prospecting CPA has increased 18% over the last 3 days. Consider revising audience targeting or creative.',
            buttonText: 'Review Campaign',
            route: '/marketing/campaigns'
        }
    ];

    const handleNavigate = (route) => {
        navigate(route);
    };

    return (
        <section className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Your AI Strategic Insights</h2>
                    <p className="text-xs text-gray-500 font-medium">Real-time growth opportunities & risk detection</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {insights.map(insight => (
                    <InsightCard
                        key={insight.id}
                        {...insight}
                        onClick={() => handleNavigate(insight.route)}
                    />
                ))}
            </div>
        </section>
    );
};

export default AIStrategicInsights;
