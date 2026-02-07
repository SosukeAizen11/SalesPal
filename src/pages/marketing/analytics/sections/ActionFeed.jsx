import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Pause,
    Search,
    ArrowUpRight
} from 'lucide-react';

/**
 * Decision-First Action Feed
 * 
 * Displays only Critical Risks, Warnings, or Opportunities.
 * Max 3 cards. Each action is numerically justified and actionable.
 */

const SEVERITY_CONFIG = {
    critical: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
        label: 'CRITICAL'
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-700',
        label: 'WARNING'
    },
    opportunity: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
        label: 'OPPORTUNITY'
    }
};

const ACTION_ICONS = {
    burn: TrendingDown,
    spike: AlertTriangle,
    opportunity: TrendingUp
};

const ActionCard = ({ alert, navigate }) => {
    const severity = alert.type === 'burn' ? 'critical' :
        alert.type === 'spike' ? 'warning' : 'opportunity';
    const config = SEVERITY_CONFIG[severity];
    const Icon = ACTION_ICONS[alert.type] || AlertTriangle;

    // CTA routing logic
    const handleCTA = () => {
        if (alert.actionLabel === 'Pause Campaign' && alert.campaignId) {
            navigate(`/marketing/campaigns/${alert.campaignId}`);
        } else if (alert.actionLabel === 'Investigate' || alert.actionLabel === 'Check Ad Groups') {
            navigate('/marketing/campaigns');
        } else if (alert.actionLabel === 'Increase Budget' && alert.campaignId) {
            navigate(`/marketing/campaigns/${alert.campaignId}`);
        } else if (alert.onAction) {
            alert.onAction();
        }
    };

    return (
        <div className={`p-4 rounded-xl border-2 ${config.bg} ${config.border} flex items-start gap-4 transition-all hover:shadow-md`}>
            {/* Icon */}
            <div className={`p-2 rounded-lg bg-white shadow-sm shrink-0`}>
                <Icon className={`w-5 h-5 ${config.icon}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${config.badge}`}>
                        {config.label}
                    </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{alert.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {alert.message}
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleCTA}
                    className={`text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm
                        ${severity === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' : ''}
                        ${severity === 'warning' ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}
                        ${severity === 'opportunity' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
                    `}
                >
                    {alert.actionLabel === 'Pause Campaign' && <Pause className="w-3.5 h-3.5" />}
                    {(alert.actionLabel === 'Investigate' || alert.actionLabel === 'Check Ad Groups') && <Search className="w-3.5 h-3.5" />}
                    {alert.actionLabel === 'Shift Budget' && <ArrowUpRight className="w-3.5 h-3.5" />}
                    {alert.actionLabel || 'Take Action'}
                </button>
            </div>
        </div>
    );
};

const ActionFeed = ({ alerts = [] }) => {
    const navigate = useNavigate();

    // If no alerts, show calm state
    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-emerald-900 font-bold text-lg">All Systems Normal</h3>
                <p className="text-emerald-700 text-sm">No critical actions required right now.</p>
            </div>
        );
    }

    // Priority sort: Critical > Warning > Opportunity
    const priorityOrder = { burn: 0, spike: 1, opportunity: 2 };
    const sortedAlerts = [...alerts]
        .sort((a, b) => (priorityOrder[a.type] ?? 99) - (priorityOrder[b.type] ?? 99))
        .slice(0, 3); // Max 3 cards

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Actions Required
                </h3>
                <span className="text-xs text-gray-400">
                    {sortedAlerts.length} of {alerts.length} shown
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedAlerts.map((alert, index) => (
                    <ActionCard key={index} alert={alert} navigate={navigate} />
                ))}
            </div>
        </div>
    );
};

export default ActionFeed;
