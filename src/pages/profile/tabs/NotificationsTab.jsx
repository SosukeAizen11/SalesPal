import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, MessageSquare, Phone, Radio,
    CreditCard, Megaphone, Zap, Settings, Headphones,
    Shield, Clock, ChevronDown, ChevronUp,
    AlertTriangle, CheckCircle, RotateCcw, Info,
    Moon, Layers
} from 'lucide-react';
import { useNotifications, CHANNELS, PRIORITY, DEFAULT_PREFS } from '../../../context/NotificationContext';
import { useToast } from '../../../components/ui/Toast';
import Card from '../../../components/ui/Card';

// ─── Reusable toggle ─────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, disabled = false, size = 'md' }) => {
    const h = size === 'sm' ? 'h-4 w-8' : 'h-5 w-10';
    const thumb = size === 'sm'
        ? 'after:h-3 after:w-3 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-4'
        : 'after:h-4 after:w-4 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-5';
    return (
        <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
                disabled={disabled}
            />
            <div className={`
                ${h} ${thumb}
                bg-gray-200 rounded-full peer transition-colors
                peer-checked:bg-blue-600
                peer-focus:ring-2 peer-focus:ring-blue-300
                after:content-[''] after:absolute after:bg-white
                after:border-gray-300 after:border after:rounded-full
                after:transition-all
            `} />
        </label>
    );
};

// ─── Section title ───────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, subtitle, accent = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        violet: 'bg-violet-100 text-violet-600',
        amber: 'bg-amber-100 text-amber-600',
        red: 'bg-red-100 text-red-600',
        green: 'bg-green-100 text-green-600',
        gray: 'bg-gray-100 text-gray-500',
    };
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[accent]}`}>
                <Icon className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
};

// ─── Channel card ─────────────────────────────────────────────────────────────
const ChannelCard = ({
    channel, icon: Icon, label, description,
    enabled, consented, onEnable, onConsent,
    requiresConsent = false, accentColor
}) => {
    const isActive = enabled && (!requiresConsent || consented);
    const accentBorder = isActive ? `border-${accentColor}-200 bg-${accentColor}-50/30` : 'border-gray-200 bg-white';

    return (
        <div className={`rounded-xl border p-4 transition-all duration-200 ${isActive ? accentBorder : 'border-gray-200 bg-white'}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? `bg-${accentColor}-100` : 'bg-gray-100'}`}>
                        <Icon className={`w-4.5 h-4.5 ${isActive ? `text-${accentColor}-600` : 'text-gray-400'}`} strokeWidth={1.8} style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{label}</p>
                            {isActive && (
                                <span className="text-[9px] font-bold uppercase tracking-wide bg-green-50 text-green-600 ring-1 ring-green-200 px-1.5 py-0.5 rounded-full">
                                    Active
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                    </div>
                </div>
                <Toggle checked={enabled} onChange={onEnable} />
            </div>

            {/* Consent banner */}
            {requiresConsent && enabled && !consented && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2"
                >
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-amber-800 font-medium">Consent required</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            You must explicitly consent to receive {label} messages per privacy regulations.
                        </p>
                    </div>
                    <button
                        onClick={onConsent}
                        className="shrink-0 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg transition-colors"
                    >
                        I Consent
                    </button>
                </motion.div>
            )}

            {requiresConsent && consented && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    Consent granted — you can opt out anytime
                </div>
            )}
        </div>
    );
};

// ─── Sub-toggle row ───────────────────────────────────────────────────────────
const SubToggleRow = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div>
            <p className="text-xs font-medium text-gray-700">{label}</p>
            {description && <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>}
        </div>
        <Toggle checked={checked} onChange={onChange} size="sm" />
    </div>
);

// ─── Collapsible category card ────────────────────────────────────────────────
const CategoryCard = ({ icon: Icon, title, color, enabled, onToggle, children }) => {
    const [open, setOpen] = useState(false);
    const colors = {
        violet: 'bg-violet-100 text-violet-600',
        blue: 'bg-blue-100 text-blue-600',
        amber: 'bg-amber-100 text-amber-600',
        gray: 'bg-gray-100 text-gray-500',
        green: 'bg-green-100 text-green-600',
        pink: 'bg-pink-100 text-pink-600',
    };

    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${enabled ? 'border-gray-200' : 'border-gray-150 opacity-70'}`}>
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => enabled && setOpen(o => !o)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors[color]}`}>
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </div>
                    <p className={`text-sm font-semibold ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>{title}</p>
                </div>
                <div className="flex items-center gap-3">
                    {enabled && (
                        open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                    <div onClick={e => e.stopPropagation()}>
                        <Toggle checked={enabled} onChange={onToggle} size="sm" />
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {open && enabled && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 bg-gray-50/50 px-4 py-2 space-y-0.5"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Priority routing visual ──────────────────────────────────────────────────
const PriorityRouting = () => (
    <Card className="p-5">
        <SectionTitle icon={Layers} title="Priority-Based Delivery Routing" subtitle="How notifications are dispatched based on urgency" accent="blue" />
        <div className="space-y-3">
            {[
                {
                    priority: 'Critical',
                    badge: 'bg-red-50 text-red-600 ring-red-200',
                    channels: ['In-App', 'SMS', 'WhatsApp'],
                    desc: 'Sent across all consented channels immediately. Cannot be batched.',
                    icon: AlertTriangle,
                    iconColor: 'text-red-500',
                },
                {
                    priority: 'Normal',
                    badge: 'bg-blue-50 text-blue-600 ring-blue-200',
                    channels: ['In-App'],
                    desc: 'Delivered in-app in real-time. Can optionally be batched into digest.',
                    icon: Info,
                    iconColor: 'text-blue-500',
                },
                {
                    priority: 'Low',
                    badge: 'bg-gray-50 text-gray-600 ring-gray-200',
                    channels: ['In-App (optional)'],
                    desc: 'Informational only. Respects quiet hours and category opt-outs.',
                    icon: Bell,
                    iconColor: 'text-gray-400',
                },
            ].map(row => (
                <div key={row.priority} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <row.icon className={`w-4 h-4 mt-0.5 shrink-0 ${row.iconColor}`} strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                            <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ring-1 ${row.badge}`}>{row.priority}</span>
                            <span className="text-[10px] text-gray-400">→ delivered via:</span>
                            {row.channels.map(ch => (
                                <span key={ch} className="text-[9px] font-semibold bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                    {ch}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">{row.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

// ─── Main component ───────────────────────────────────────────────────────────
const NotificationsTab = () => {
    const {
        prefs,
        updateChannelPref,
        updateConsent,
        updateCategoryPref,
        updateSubtypePref,
        updateFrequencyPref,
        resetPrefs,
    } = useNotifications();
    const { showToast } = useToast();

    const save = useCallback((label = 'Preferences saved') => {
        showToast({ title: label, description: 'Your notification settings have been updated.', variant: 'success', duration: 2500 });
    }, [showToast]);

    const handleChannel = (channel, val) => {
        updateChannelPref(channel, val);
        save(`${channel === 'in_app' ? 'In-App' : channel.toUpperCase()} ${val ? 'enabled' : 'disabled'}`);
    };

    const handleConsent = (channel) => {
        updateConsent(channel, true);
        save(`Consent granted for ${channel.toUpperCase()}`);
    };

    const handleCategory = (cat, val) => {
        updateCategoryPref(cat, val);
        save();
    };

    const handleSubtype = (cat, sub, val) => {
        updateSubtypePref(cat, sub, val);
        save();
    };

    const handleFrequency = (key, val) => {
        updateFrequencyPref(key, val);
        save();
    };

    const handleReset = () => {
        resetPrefs();
        showToast({ title: 'Settings reset', description: 'All preferences restored to defaults.', variant: 'info', duration: 2500 });
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* ── SECTION 1: CHANNEL SETTINGS ── */}
            <Card className="p-6">
                <SectionTitle
                    icon={Bell}
                    title="Notification Channels"
                    subtitle="Choose how you receive alerts across different platforms"
                    accent="blue"
                />

                <div className="space-y-4">
                    {/* In-App */}
                    <ChannelCard
                        channel="in_app"
                        icon={Bell}
                        label="In-App Notifications"
                        description="Dashboard alerts, campaign updates, system messages — always visible in the notification bell."
                        enabled={prefs.channels.in_app}
                        consented={true}
                        requiresConsent={false}
                        accentColor="blue"
                        onEnable={() => { handleChannel('in_app', !prefs.channels.in_app); }}
                    />

                    {/* SMS */}
                    <ChannelCard
                        channel="sms"
                        icon={Phone}
                        label="SMS Alerts"
                        description="Critical billing reminders, OTP/urgent notifications sent via SMS to your registered mobile."
                        enabled={prefs.channels.sms}
                        consented={prefs.consent.sms}
                        requiresConsent={true}
                        accentColor="green"
                        onEnable={() => handleChannel('sms', !prefs.channels.sms)}
                        onConsent={() => handleConsent('sms')}
                    />

                    {/* RCS */}
                    <ChannelCard
                        channel="rcs"
                        icon={Radio}
                        label="RCS Messaging"
                        description="Rich Business Messages with images and action buttons — campaign insights and performance summaries."
                        enabled={prefs.channels.rcs}
                        consented={prefs.consent.rcs}
                        requiresConsent={true}
                        accentColor="violet"
                        onEnable={() => handleChannel('rcs', !prefs.channels.rcs)}
                        onConsent={() => handleConsent('rcs')}
                    />

                    {/* WhatsApp */}
                    <ChannelCard
                        channel="whatsapp"
                        icon={MessageSquare}
                        label="WhatsApp Notifications"
                        description="Campaign alerts, credit warnings, billing updates, and bulk notification broadcasts via WhatsApp Business API."
                        enabled={prefs.channels.whatsapp}
                        consented={prefs.consent.whatsapp}
                        requiresConsent={true}
                        accentColor="emerald"
                        onEnable={() => handleChannel('whatsapp', !prefs.channels.whatsapp)}
                        onConsent={() => handleConsent('whatsapp')}
                    />

                    {/* Bulk WhatsApp */}
                    {prefs.channels.whatsapp && prefs.consent.whatsapp && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-4 pl-4 border-l-2 border-emerald-200"
                        >
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Bulk WhatsApp Broadcasts</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Subscribe to campaign performance summaries and bulk alerts sent to your WhatsApp.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!prefs.consent.bulk_whatsapp && (
                                        <button
                                            onClick={() => { updateConsent('bulk_whatsapp', true); save(); }}
                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                                        >
                                            Opt In
                                        </button>
                                    )}
                                    {prefs.consent.bulk_whatsapp && (
                                        <button
                                            onClick={() => { updateConsent('bulk_whatsapp', false); save(); }}
                                            className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            Opt out
                                        </button>
                                    )}
                                    <Toggle
                                        checked={prefs.consent.bulk_whatsapp}
                                        onChange={() => { updateConsent('bulk_whatsapp', !prefs.consent.bulk_whatsapp); save(); }}
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Privacy note */}
                <div className="mt-5 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                        External channels (SMS, RCS, WhatsApp) require explicit consent per TRAI and GDPR regulations.
                        You can withdraw consent and opt out at any time. Data is never shared with third parties.
                    </p>
                </div>
            </Card>

            {/* ── SECTION 2: CATEGORY CONTROLS ── */}
            <Card className="p-6">
                <SectionTitle
                    icon={Layers}
                    title="Category Preferences"
                    subtitle="Control exactly which events notify you — toggle entire categories or individual alert types"
                    accent="violet"
                />

                <div className="space-y-3">
                    {/* Billing */}
                    <CategoryCard
                        icon={CreditCard}
                        title="Billing & Payments"
                        color="violet"
                        enabled={prefs.categories.billing.enabled}
                        onToggle={() => handleCategory('billing', !prefs.categories.billing.enabled)}
                    >
                        <SubToggleRow
                            label="Invoice generated"
                            description="New invoice is ready to download"
                            checked={prefs.categories.billing.subtypes.invoices}
                            onChange={() => handleSubtype('billing', 'invoices', !prefs.categories.billing.subtypes.invoices)}
                        />
                        <SubToggleRow
                            label="Payment reminders"
                            description="Upcoming renewal and overdue payment alerts"
                            checked={prefs.categories.billing.subtypes.payment_reminders}
                            onChange={() => handleSubtype('billing', 'payment_reminders', !prefs.categories.billing.subtypes.payment_reminders)}
                        />
                        <SubToggleRow
                            label="Credit warnings"
                            description="When plan credits are running low (80%+ used)"
                            checked={prefs.categories.billing.subtypes.credit_warnings}
                            onChange={() => handleSubtype('billing', 'credit_warnings', !prefs.categories.billing.subtypes.credit_warnings)}
                        />
                    </CategoryCard>

                    {/* Campaigns */}
                    <CategoryCard
                        icon={Megaphone}
                        title="Campaign Alerts"
                        color="blue"
                        enabled={prefs.categories.campaign.enabled}
                        onToggle={() => handleCategory('campaign', !prefs.categories.campaign.enabled)}
                    >
                        <SubToggleRow
                            label="Performance alerts"
                            description="Spend milestones, reach targets, and engagement changes"
                            checked={prefs.categories.campaign.subtypes.performance_alerts}
                            onChange={() => handleSubtype('campaign', 'performance_alerts', !prefs.categories.campaign.subtypes.performance_alerts)}
                        />
                        <SubToggleRow
                            label="Budget alerts"
                            description="When a campaign exceeds budget thresholds"
                            checked={prefs.categories.campaign.subtypes.budget_alerts}
                            onChange={() => handleSubtype('campaign', 'budget_alerts', !prefs.categories.campaign.subtypes.budget_alerts)}
                        />
                        <SubToggleRow
                            label="Conversion insights"
                            description="Weekly summary of conversion rates and ROI"
                            checked={prefs.categories.campaign.subtypes.conversion_insights}
                            onChange={() => handleSubtype('campaign', 'conversion_insights', !prefs.categories.campaign.subtypes.conversion_insights)}
                        />
                    </CategoryCard>

                    {/* Credits */}
                    <CategoryCard
                        icon={Zap}
                        title="Credit Usage"
                        color="amber"
                        enabled={prefs.categories.credit.enabled}
                        onToggle={() => handleCategory('credit', !prefs.categories.credit.enabled)}
                    >
                        <SubToggleRow
                            label="Low credit warning"
                            description="Alert when any credit type drops below 30%"
                            checked={prefs.categories.credit.subtypes.low_warning}
                            onChange={() => handleSubtype('credit', 'low_warning', !prefs.categories.credit.subtypes.low_warning)}
                        />
                        <SubToggleRow
                            label="Credits exhausted"
                            description="Immediate alert when all credits are used"
                            checked={prefs.categories.credit.subtypes.exhausted}
                            onChange={() => handleSubtype('credit', 'exhausted', !prefs.categories.credit.subtypes.exhausted)}
                        />
                    </CategoryCard>

                    {/* System */}
                    <CategoryCard
                        icon={Settings}
                        title="System & Platform"
                        color="gray"
                        enabled={prefs.categories.system.enabled}
                        onToggle={() => handleCategory('system', !prefs.categories.system.enabled)}
                    >
                        <SubToggleRow
                            label="Feature updates"
                            description="New features, product announcements, and releases"
                            checked={prefs.categories.system.subtypes.feature_updates}
                            onChange={() => handleSubtype('system', 'feature_updates', !prefs.categories.system.subtypes.feature_updates)}
                        />
                        <SubToggleRow
                            label="Maintenance alerts"
                            description="Scheduled downtime and maintenance windows"
                            checked={prefs.categories.system.subtypes.maintenance_alerts}
                            onChange={() => handleSubtype('system', 'maintenance_alerts', !prefs.categories.system.subtypes.maintenance_alerts)}
                        />
                    </CategoryCard>

                    {/* Support */}
                    <CategoryCard
                        icon={Headphones}
                        title="Support"
                        color="green"
                        enabled={prefs.categories.support.enabled}
                        onToggle={() => handleCategory('support', !prefs.categories.support.enabled)}
                    >
                        <SubToggleRow
                            label="Ticket updates"
                            description="Status changes and replies on your support tickets"
                            checked={prefs.categories.support.subtypes.ticket_updates}
                            onChange={() => handleSubtype('support', 'ticket_updates', !prefs.categories.support.subtypes.ticket_updates)}
                        />
                    </CategoryCard>

                    {/* Marketing / Offers */}
                    <CategoryCard
                        icon={Megaphone}
                        title="Product & Offers"
                        color="pink"
                        enabled={prefs.categories.marketing.enabled}
                        onToggle={() => handleCategory('marketing', !prefs.categories.marketing.enabled)}
                    >
                        <SubToggleRow
                            label="Product announcements"
                            description="New product launches and major updates"
                            checked={prefs.categories.marketing.subtypes.product_announcements}
                            onChange={() => handleSubtype('marketing', 'product_announcements', !prefs.categories.marketing.subtypes.product_announcements)}
                        />
                        <SubToggleRow
                            label="Special offers"
                            description="Promotional deals and limited-time discounts"
                            checked={prefs.categories.marketing.subtypes.offers}
                            onChange={() => handleSubtype('marketing', 'offers', !prefs.categories.marketing.subtypes.offers)}
                        />
                    </CategoryCard>
                </div>
            </Card>

            {/* ── SECTION 3: DELIVERY BEHAVIOUR ── */}
            <Card className="p-6">
                <SectionTitle
                    icon={Clock}
                    title="Delivery Behaviour"
                    subtitle="Control when and how often you receive notifications"
                    accent="amber"
                />

                <div className="space-y-5">
                    {/* Quiet hours */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                <Moon className="w-4 h-4 text-indigo-600" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Quiet Hours</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Suppress non-critical notifications during these hours.
                                    Critical alerts still go through regardless.
                                </p>
                                {prefs.frequency.quiet_hours_enabled && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Start</label>
                                            <input
                                                type="time"
                                                value={prefs.frequency.quiet_start}
                                                onChange={e => handleFrequency('quiet_start', e.target.value)}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                                            />
                                        </div>
                                        <span className="text-gray-400 text-xs">→</span>
                                        <div className="flex items-center gap-1.5">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">End</label>
                                            <input
                                                type="time"
                                                value={prefs.frequency.quiet_end}
                                                onChange={e => handleFrequency('quiet_end', e.target.value)}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Toggle
                            checked={prefs.frequency.quiet_hours_enabled}
                            onChange={() => handleFrequency('quiet_hours_enabled', !prefs.frequency.quiet_hours_enabled)}
                        />
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Daily limit */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Critical Alerts Daily Limit</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Maximum critical notifications per day to avoid alert fatigue.
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    {[3, 5, 10, 'Unlimited'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => handleFrequency('limit_critical_per_day', v === 'Unlimited' ? 999 : v)}
                                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${(v === 'Unlimited' ? 999 : v) === prefs.frequency.limit_critical_per_day
                                                    ? 'bg-amber-600 text-white border-amber-600'
                                                    : 'border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                                                }`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Batch digests */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <Layers className="w-4 h-4 text-blue-600" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Batch Normal Notifications</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Group non-critical notifications and deliver them as a daily digest instead of real-time.
                                </p>
                            </div>
                        </div>
                        <Toggle
                            checked={prefs.frequency.batch_normal}
                            onChange={() => handleFrequency('batch_normal', !prefs.frequency.batch_normal)}
                        />
                    </div>
                </div>
            </Card>

            {/* ── SECTION 4: PRIORITY ROUTING ── */}
            <PriorityRouting />

            {/* ── SECTION 5: PRIVACY & COMPLIANCE ── */}
            <Card className="p-6">
                <SectionTitle
                    icon={Shield}
                    title="Privacy & Compliance"
                    subtitle="Manage your consent, data usage, and opt-out rights"
                    accent="green"
                />

                <div className="space-y-3">
                    {[
                        { channel: 'sms', label: 'SMS', consented: prefs.consent.sms },
                        { channel: 'rcs', label: 'RCS', consented: prefs.consent.rcs },
                        { channel: 'whatsapp', label: 'WhatsApp', consented: prefs.consent.whatsapp },
                        { channel: 'bulk_whatsapp', label: 'Bulk WhatsApp', consented: prefs.consent.bulk_whatsapp },
                    ].map(item => (
                        <div key={item.channel} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                                {item.consented
                                    ? <CheckCircle className="w-4 h-4 text-green-500" />
                                    : <AlertTriangle className="w-4 h-4 text-gray-300" />
                                }
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                                    <p className="text-[10px] text-gray-400">
                                        {item.consented ? 'Consent granted — messages may be sent' : 'No consent — channel blocked'}
                                    </p>
                                </div>
                            </div>
                            {item.consented ? (
                                <button
                                    onClick={() => { updateConsent(item.channel, false); save('Consent withdrawn'); }}
                                    className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Withdraw
                                </button>
                            ) : (
                                <button
                                    onClick={() => { updateConsent(item.channel, true); save('Consent granted'); }}
                                    className="text-xs font-semibold text-green-600 hover:text-green-700 border border-green-200 px-2.5 py-1 rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    Grant Consent
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* ── RESET ── */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                    <RotateCcw className="w-4 h-4 text-gray-500" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Reset to defaults</p>
                        <p className="text-xs text-gray-500">Restore all notification preferences to system defaults.</p>
                    </div>
                </div>
                <button
                    onClick={handleReset}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default NotificationsTab;
