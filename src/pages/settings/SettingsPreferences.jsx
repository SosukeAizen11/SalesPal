import React, { useState, useCallback } from 'react';
import { Globe, Clock, DollarSign, CheckCircle2, Info, ChevronDown } from 'lucide-react';
import CurrencyIcon from '../../components/ui/CurrencyIcon';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
    usePreferences,
    SUPPORTED_LANGUAGES,
    SUPPORTED_TIMEZONES,
    SUPPORTED_CURRENCIES,
} from '../../context/PreferencesContext';

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, description, color }) => (
    <div className="flex items-start gap-4 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
    </div>
);

// ─── Option Card (for language / currency selection) ─────────────────────────
const OptionCard = ({ selected, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`
            relative w-full text-left rounded-xl border-2 p-3 transition-all duration-200
            ${selected
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }
        `}
    >
        {selected && (
            <span className="absolute top-2 right-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </span>
        )}
        {children}
    </button>
);

// ─── Custom Select ────────────────────────────────────────────────────────────
const StyledSelect = ({ value, onChange, children, label }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="flex h-11 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
        </div>
    </div>
);

// ─── Live Preview Card ────────────────────────────────────────────────────────
const LivePreview = ({ preferences, formatCurrency, formatDateTime, currentLanguage, currentCurrency, currentTimezone }) => {
    const sampleAmount = 9999; // INR base
    const sampleDate = new Date();

    return (
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Live Preview</span>
            </div>

            <div className="space-y-4">
                {/* Language */}
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">Language</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{currentLanguage.flag}</span>
                        <span className="text-sm font-medium text-white">{currentLanguage.label}</span>
                        <span className="text-xs text-slate-400">({currentLanguage.nativeName})</span>
                    </div>
                </div>

                {/* Timezone */}
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Current Time</span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatDateTime(sampleDate, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                        <p className="text-xs text-slate-400">{currentTimezone.offset}</p>
                    </div>
                </div>

                {/* Currency */}
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                        <CurrencyIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">Sample Price</span>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-white">{formatCurrency(sampleAmount)}</p>
                        {preferences.currency !== 'INR' && (
                            <p className="text-xs text-amber-400">≈ from ₹{sampleAmount.toLocaleString('en-IN')} INR</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sample date */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-1">Sample billing timestamp</p>
                <p className="text-sm font-mono text-slate-200">{formatDateTime(sampleDate)}</p>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SettingsPreferences = () => {
    const { preferences, updatePreferences, formatCurrency, formatDateTime, currentLanguage, currentCurrency, currentTimezone, isApproximateConversion } = usePreferences();
    const { showToast } = useToast();

    // Local draft state — only committed on Save
    const [draft, setDraft] = useState({ ...preferences });
    const [saving, setSaving] = useState(false);

    const handleSave = useCallback(async () => {
        setSaving(true);
        // Simulate async save (e.g., API call)
        await new Promise(r => setTimeout(r, 600));
        updatePreferences(draft);
        setSaving(false);
        showToast({
            title: 'Preferences updated successfully.',
            description: 'Your changes have been applied across the platform.',
            variant: 'success',
            duration: 4000,
        });
    }, [draft, updatePreferences, showToast]);

    // Live preview uses draft values
    const draftCurrency = SUPPORTED_CURRENCIES.find(c => c.code === draft.currency) || SUPPORTED_CURRENCIES[0];
    const draftLanguage = SUPPORTED_LANGUAGES.find(l => l.code === draft.language) || SUPPORTED_LANGUAGES[0];
    const draftTimezone = SUPPORTED_TIMEZONES.find(t => t.value === draft.timezone) || SUPPORTED_TIMEZONES[0];

    const draftFormatCurrency = (amountInINR) => {
        const converted = amountInINR * draftCurrency.rate;
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: draftCurrency.code,
                minimumFractionDigits: draftCurrency.code === 'JPY' ? 0 : 2,
                maximumFractionDigits: draftCurrency.code === 'JPY' ? 0 : 2,
            }).format(converted);
        } catch (_) {
            return `${draftCurrency.symbol}${converted.toFixed(2)}`;
        }
    };

    const draftFormatDateTime = (date, options = {}) => {
        const d = date instanceof Date ? date : new Date(date);
        try {
            return new Intl.DateTimeFormat(undefined, {
                timeZone: draft.timezone,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                ...options,
            }).format(d);
        } catch (_) {
            return d.toLocaleString();
        }
    };

    const hasChanges = JSON.stringify(draft) !== JSON.stringify(preferences);

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">Customize your platform experience. Changes apply instantly across the platform.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ── Left Column: Settings ── */}
                <div className="xl:col-span-2 space-y-6">

                    {/* ── Language ── */}
                    <Card noPadding>
                        <div className="p-6">
                            <SectionHeader
                                icon={Globe}
                                title="Language"
                                description="Choose your preferred display language. Navigation, labels, and notifications will update instantly."
                                color="bg-blue-500"
                            />
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {SUPPORTED_LANGUAGES.map(lang => (
                                    <OptionCard
                                        key={lang.code}
                                        selected={draft.language === lang.code}
                                        onClick={() => setDraft(d => ({ ...d, language: lang.code }))}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{lang.flag}</span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{lang.label}</p>
                                                <p className="text-xs text-gray-500 truncate">{lang.nativeName}</p>
                                            </div>
                                        </div>
                                    </OptionCard>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* ── Timezone ── */}
                    <Card noPadding>
                        <div className="p-6">
                            <SectionHeader
                                icon={Clock}
                                title="Timezone"
                                description="All billing timestamps, campaign schedules, analytics reports, and activity logs will display in this timezone."
                                color="bg-purple-500"
                            />
                            <StyledSelect
                                value={draft.timezone}
                                onChange={e => setDraft(d => ({ ...d, timezone: e.target.value }))}
                                label="Select Timezone"
                            >
                                {SUPPORTED_TIMEZONES.map(tz => (
                                    <option key={tz.value} value={tz.value}>
                                        {tz.label} ({tz.offset})
                                    </option>
                                ))}
                            </StyledSelect>

                            {/* Current time preview */}
                            <div className="mt-4 flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-purple-600 font-medium">Current time in selected timezone</p>
                                    <p className="text-sm font-semibold text-purple-900 mt-0.5">
                                        {draftFormatDateTime(new Date(), { hour: '2-digit', minute: '2-digit', second: '2-digit', year: undefined, month: undefined, day: undefined })}
                                        <span className="text-xs font-normal text-purple-600 ml-2">({draftTimezone.offset})</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* ── Currency ── */}
                    <Card noPadding>
                        <div className="p-6">
                            <SectionHeader
                                icon={DollarSign}
                                title="Currency"
                                description="Display prices across the platform in your preferred currency. Amounts are converted from INR using stored exchange rates."
                                color="bg-emerald-500"
                            />
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {SUPPORTED_CURRENCIES.map(curr => (
                                    <OptionCard
                                        key={curr.code}
                                        selected={draft.currency === curr.code}
                                        onClick={() => setDraft(d => ({ ...d, currency: curr.code }))}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{curr.flag}</span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900">{curr.symbol}</p>
                                                <p className="text-xs text-gray-500 truncate">{curr.code}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 truncate">{curr.label}</p>
                                    </OptionCard>
                                ))}
                            </div>

                            {/* Approximate conversion note */}
                            {draft.currency !== 'INR' && (
                                <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                    <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700">
                                        <strong>Approximate conversion for display.</strong> Actual billing calculations remain in INR. Exchange rates are stored estimates and may vary from live market rates.
                                    </p>
                                </div>
                            )}

                            {/* Sample conversion */}
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-xs text-gray-500 mb-2 font-medium">Sample price conversion</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-sm text-gray-600">₹9,999 INR</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="text-lg font-bold text-gray-900">{draftFormatCurrency(9999)}</span>
                                    {draft.currency !== 'INR' && (
                                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                            ≈ estimated
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* ── Save Button ── */}
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            {hasChanges && (
                                <p className="text-sm text-amber-600 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                                    You have unsaved changes
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {hasChanges && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setDraft({ ...preferences })}
                                    disabled={saving}
                                >
                                    Discard
                                </Button>
                            )}
                            <Button
                                onClick={handleSave}
                                isLoading={saving}
                                disabled={!hasChanges || saving}
                            >
                                {saving ? 'Saving…' : 'Save Preferences'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Live Preview ── */}
                <div className="xl:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        <LivePreview
                            preferences={draft}
                            formatCurrency={draftFormatCurrency}
                            formatDateTime={draftFormatDateTime}
                            currentLanguage={draftLanguage}
                            currentCurrency={draftCurrency}
                            currentTimezone={draftTimezone}
                        />

                        {/* Info card */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-900 mb-1">Platform-wide effect</p>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>✓ Navigation & labels</li>
                                        <li>✓ Billing & invoices</li>
                                        <li>✓ Campaign timestamps</li>
                                        <li>✓ Analytics reports</li>
                                        <li>✓ Activity logs</li>
                                        <li>✓ Notifications</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Current active preferences */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Preferences</p>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Language</span>
                                    <span className="text-xs font-medium text-gray-900 flex items-center gap-1">
                                        {currentLanguage.flag} {currentLanguage.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Timezone</span>
                                    <span className="text-xs font-medium text-gray-900">{currentTimezone.offset}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Currency</span>
                                    <span className="text-xs font-medium text-gray-900 flex items-center gap-1">
                                        {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPreferences;
