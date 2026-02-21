import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Video, Phone, MessageSquare, AlertTriangle, Zap, Plus } from 'lucide-react';
import { useMarketing } from '../context/MarketingContext';
import { useSubscription } from '../commerce/SubscriptionContext';

// ─── Utility: derive warning tier from usage percentage ───────────────────────
const getWarningTier = (used, total) => {
    if (!total || total === 0) return 'none';
    const pct = (used / total) * 100;
    if (pct >= 95) return 'critical';
    if (pct >= 85) return 'high';
    if (pct >= 70) return 'medium';
    return 'none';
};

// ─── Tier → visual config ─────────────────────────────────────────────────────
const TIER_STYLES = {
    none: {
        numColor: 'text-gray-900',
        labelColor: 'text-gray-400',
        bg: '',
        border: '',
        barColor: 'bg-blue-500',
        icon: null,
    },
    medium: {
        numColor: 'text-amber-600',
        labelColor: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'ring-1 ring-amber-200',
        barColor: 'bg-amber-400',
        icon: 'warn',
    },
    high: {
        numColor: 'text-orange-600',
        labelColor: 'text-orange-500',
        bg: 'bg-orange-50',
        border: 'ring-1 ring-orange-300',
        barColor: 'bg-orange-500',
        icon: 'warn',
    },
    critical: {
        numColor: 'text-red-600',
        labelColor: 'text-red-500',
        bg: 'bg-red-50',
        border: 'ring-1 ring-red-300',
        barColor: 'bg-red-500',
        icon: 'critical',
    },
};

// ─── Single credit pill (compact, fits inside h-16 header) ───────────────────
const CreditPill = ({ icon: Icon, label, remaining, total, onClick }) => {
    const used = total - remaining;
    const tier = getWarningTier(used, total);
    const styles = TIER_STYLES[tier];
    const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group relative flex flex-col items-center
                px-2.5 py-1 rounded-lg
                transition-all duration-200 cursor-pointer select-none
                hover:bg-gray-50
                ${styles.bg} ${styles.border}
            `}
            title={`${label}: ${remaining} remaining of ${total}`}
        >
            {/* Row 1: Icon + Number / Total */}
            <div className="flex items-center gap-1">
                <Icon
                    className={`w-3 h-3 shrink-0 ${tier === 'none' ? 'text-gray-400' : styles.labelColor}`}
                    strokeWidth={2}
                />
                <span className={`text-xs font-bold leading-none ${styles.numColor} whitespace-nowrap`}>
                    {remaining}
                </span>
                <span className="text-[9px] text-gray-400 leading-none">/</span>
                <span className="text-[9px] text-gray-400 leading-none">{total}</span>
                {tier !== 'none' && (
                    <AlertTriangle
                        className={`w-2.5 h-2.5 shrink-0 ${styles.labelColor} ${tier === 'critical' ? 'animate-pulse' : ''}`}
                        strokeWidth={2.5}
                    />
                )}
            </div>

            {/* Row 2: Label + mini bar */}
            <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
                <span className={`text-[9px] font-semibold uppercase tracking-wide leading-none ${styles.labelColor || 'text-gray-400'}`}>
                    {label}
                </span>
                <div className="w-full h-[2px] bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${styles.barColor}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* Hover tooltip — rendered below header so it appears downward */}
            <div className="
                absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44
                bg-gray-900 text-white text-xs rounded-lg py-2 px-3
                opacity-0 group-hover:opacity-100 pointer-events-none z-[200]
                shadow-xl transition-all duration-200
                -translate-y-1 group-hover:translate-y-0
                flex flex-col gap-1
            ">
                <div className="font-semibold text-white">{label} Credits</div>
                <div className="flex justify-between text-gray-300">
                    <span>Remaining</span>
                    <span className={tier !== 'none' ? styles.numColor : 'text-green-400'}>
                        {remaining}
                    </span>
                </div>
                <div className="flex justify-between text-gray-300">
                    <span>Plan Total</span>
                    <span>{total}</span>
                </div>
                <div className="border-t border-gray-700 mt-1 pt-1">
                    <div className="flex justify-between text-gray-400">
                        <span>Used</span>
                        <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${styles.barColor}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
                {tier !== 'none' && (
                    <div className={`text-[10px] font-medium mt-0.5 ${styles.numColor}`}>
                        {tier === 'critical' ? '⚠ Critical — top up now!' :
                            tier === 'high' ? '⚡ Running low — top up soon' :
                                '💡 Over 70% used'}
                    </div>
                )}
                {/* Tooltip arrow pointing UP */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 mb-[-4px]" />
            </div>
        </button>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const GlobalCreditDisplay = ({ onTopUpClick }) => {
    const navigate = useNavigate();
    const { creditState } = useMarketing();
    const { subscriptions } = useSubscription();

    // ── Derive plan totals from subscription context (no hardcoding) ──
    const planLimits = useMemo(() => {
        // Priority: salespal360 > marketing > creditState baseLimits > safe minimum
        const sub360 = subscriptions?.salespal360;
        const subMarketing = subscriptions?.marketing;

        const activeSub = sub360?.active ? sub360 : subMarketing?.active ? subMarketing : null;
        const subLimits = activeSub?.limits || {};

        return {
            images: subLimits.images ?? creditState?.baseLimits?.images ?? 20,
            videos: subLimits.videos ?? creditState?.baseLimits?.videos ?? 4,
            calls: subLimits.calls ?? 500,   // marketing plan default
            whatsapp: subLimits.whatsapp ?? 300,   // marketing plan default
        };
    }, [subscriptions, creditState?.baseLimits]);

    // ── Derive remaining credits ──────────────────────────────────────
    const credits = useMemo(() => {
        // Images & Videos — from MarketingContext (has real usage tracking)
        const imgExtra = creditState?.extraCredits?.images ?? 0;
        const imgBase = creditState?.baseLimits?.images ?? planLimits.images;
        const imagesRemaining = imgBase + imgExtra;

        const vidExtra = creditState?.extraCredits?.videos ?? 0;
        const vidBase = creditState?.baseLimits?.videos ?? planLimits.videos;
        const videosRemaining = vidBase + vidExtra;

        // Calls & WhatsApp from SubscriptionContext (usage tracking)
        const sub360 = subscriptions?.salespal360;
        const subMkt = subscriptions?.marketing;
        const activeSub = sub360?.active ? sub360 : subMkt?.active ? subMkt : null;

        // If sub exists and tracks usage, compute remaining; else use a mock
        const callsUsed = activeSub?.usage?.calls ?? 450;
        const callsRemaining = Math.max(0, planLimits.calls - callsUsed);

        const waUsed = activeSub?.usage?.whatsapp ?? 120;
        const waRemaining = Math.max(0, planLimits.whatsapp - waUsed);

        return {
            images: { remaining: imagesRemaining, total: planLimits.images },
            videos: { remaining: videosRemaining, total: planLimits.videos },
            calls: { remaining: callsRemaining, total: planLimits.calls },
            whatsapp: { remaining: waRemaining, total: planLimits.whatsapp },
        };
    }, [creditState, subscriptions, planLimits]);

    // ── Determine if ANY credit type is low (for top-up CTA) ─────────
    const hasLowCredit = useMemo(() => {
        return Object.values(credits).some(({ remaining, total }) => {
            if (!total) return false;
            return (remaining / total) <= 0.30; // 30% or less remaining = low
        });
    }, [credits]);

    const handleTopUp = () => {
        if (onTopUpClick) {
            onTopUpClick();
        } else {
            navigate('/subscription');
        }
    };

    return (
        <div className="flex items-center gap-1.5">
            {/* Credit pills container */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-1 py-0.5 shadow-sm gap-px">
                <CreditPill
                    icon={Image}
                    label="Images"
                    remaining={credits.images.remaining}
                    total={credits.images.total}
                    onClick={() => navigate('/marketing/photos')}
                />

                <div className="w-px h-6 bg-gray-100 mx-0.5" />

                <CreditPill
                    icon={Video}
                    label="Videos"
                    remaining={credits.videos.remaining}
                    total={credits.videos.total}
                    onClick={() => navigate('/marketing/videos')}
                />

                <div className="w-px h-6 bg-gray-100 mx-0.5" />

                <CreditPill
                    icon={Phone}
                    label="Calls"
                    remaining={credits.calls.remaining}
                    total={credits.calls.total}
                    onClick={() => navigate('/marketing/calls')}
                />

                <div className="w-px h-6 bg-gray-100 mx-0.5" />

                <CreditPill
                    icon={MessageSquare}
                    label="WhatsApp"
                    remaining={credits.whatsapp.remaining}
                    total={credits.whatsapp.total}
                    onClick={() => navigate('/marketing/whatsapp')}
                />
            </div>

            {/* Low credit CTA — only shows when any credit is ≤70% remaining */}
            {hasLowCredit && (
                <button
                    type="button"
                    onClick={handleTopUp}
                    className="flex items-center gap-2 pl-3 pr-1 py-1 bg-white hover:bg-gray-50 border border-amber-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap group"
                    title="Your credits are running low — top up now"
                >
                    <Zap className="w-3 h-3 text-amber-500" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-amber-600 hidden sm:inline">Top Up</span>
                    <span className="text-xs font-bold text-amber-600 sm:hidden">Top Up</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 group-hover:bg-gray-200 rounded-full transition-colors">
                        <Plus className="w-3.5 h-3.5 text-gray-600" strokeWidth={2.5} />
                    </span>
                </button>
            )}

            {/* Subtle top-up button when credits are healthy */}
            {!hasLowCredit && (
                <button
                    type="button"
                    onClick={handleTopUp}
                    className="flex items-center gap-2 pl-3 pr-1 py-1 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group"
                    title="Top Up Credits"
                >
                    <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Top Up</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 group-hover:bg-gray-200 rounded-full transition-colors">
                        <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" strokeWidth={2.5} />
                    </span>
                </button>
            )}
        </div>
    );
};

export default GlobalCreditDisplay;
