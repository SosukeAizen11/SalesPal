import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, AlertTriangle, Layers, Zap, Moon, Clock, Trash2,
    ChevronDown, ChevronUp, RotateCcw, Info
} from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { useToast } from '../../../components/ui/Toast';
import Button from '../../../components/ui/Button';

const Toggle = ({ checked, onChange, disabled = false, size = 'md' }) => {
    const h = size === 'sm' ? 'h-4 w-8' : 'h-5 w-10';
    const thumb = size === 'sm'
        ? 'after:h-3 after:w-3 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-4'
        : 'after:h-4 after:w-4 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-5';
    return (
        <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" disabled={disabled} />
            <div className={`${h} ${thumb} bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all`} />
        </label>
    );
};

const AccordionSection = ({ icon: Icon, title, expanded, onToggle, children }) => (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white ${expanded ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'}`}>
        <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none group" onClick={onToggle}>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${expanded ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{title}</p>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" /> : <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />}
        </div>
        <AnimatePresence initial={false}>
            {expanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="border-t border-gray-100 bg-gray-50/50"
                >
                    <div className="p-5">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const NotificationsTab = () => {
    const { prefs, updateChannelPref, updateFrequencyPref, resetPrefs } = useNotifications();
    const { showToast } = useToast();
    const [openSection, setOpenSection] = useState('channels');

    // UI States for new fields that aren't in context
    const [creditThreshold, setCreditThreshold] = useState('80');
    const [customCreditObj, setCustomCreditObj] = useState('');
    const [digestMode, setDigestMode] = useState('Instant');
    const [criticalBypass, setCriticalBypass] = useState(true);
    const [digestTime, setDigestTime] = useState('09:00');
    const [digestDay, setDigestDay] = useState('Monday');
    const [autoDelete, setAutoDelete] = useState('30');
    const [archiveInstead, setArchiveInstead] = useState(false);

    // Priority per channel mock state string vs obj boolean
    const [priorityPrefs, setPriorityPrefs] = useState({
        in_app: 'Critical',
        email: 'High',
        sms: 'Critical',
        rcs: 'Normal',
        whatsapp: 'Critical',
        bulk: 'Low',
    });

    const [categoryToggles, setCategoryToggles] = useState({});

    const toggleCategoryItem = (item) => {
        setCategoryToggles(prev => ({ ...prev, [item]: prev[item] === false }));
        save('Category settings updated');
    };

    const toggleAccordion = (section) => setOpenSection(prev => prev === section ? null : section);

    const save = (msg = 'Settings saved') => {
        showToast({ title: msg, description: 'Preferences updated successfully.', variant: 'success', duration: 2500 });
    };

    const handleReset = () => {
        resetPrefs();
        save('Default settings restored');
    };

    const priorities = ['Critical', 'High', 'Normal', 'Low', 'Info'];
    const channelsList = [
        { id: 'in_app', label: 'In-App Notifications' },
        { id: 'email', label: 'Email Notifications' },
        { id: 'sms', label: 'SMS Notifications' },
        { id: 'rcs', label: 'RCS Notifications' },
        { id: 'whatsapp', label: 'WhatsApp Notifications' },
        { id: 'bulk', label: 'Bulk Campaign Notifications' }
    ];

    const categoryGroups = [
        {
            title: 'Campaign Notifications',
            items: ['Campaign Started', 'Campaign Paused', 'Budget 80% Used', 'Campaign Completed', 'Ad Rejected', 'Performance Alert']
        },
        {
            title: 'Billing & Credits',
            items: ['Payment Successful', 'Payment Failed', 'Invoice Generated', 'Low Credits', 'Subscription Expiry']
        },
        {
            title: 'Leads & Sales',
            items: ['New Lead', 'Lead Converted', 'New Sale']
        },
        {
            title: 'System & Security',
            items: ['New Login', 'Suspicious Activity', 'Integration Disconnected']
        }
    ];

    return (
        <div className="max-w-[1400px] mx-auto pb-10 w-full animate-fade-in-up">
            <div className="bg-gray-50/40 p-5 sm:p-6 lg:p-8 rounded-3xl border border-gray-100/60 space-y-6">
                <AccordionSection icon={Layers} title="Channels" expanded={openSection === 'channels'} onToggle={() => toggleAccordion('channels')}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {channelsList.map(ch => (
                            <div key={ch.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all h-full">
                                <div className="flex items-center gap-3">
                                    <Toggle checked={prefs.channels[ch.id] !== false} onChange={() => { updateChannelPref(ch.id, prefs.channels[ch.id] === false); save(); }} />
                                    <span className="font-medium text-gray-900 text-sm">{ch.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Frequency:</span>
                                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-blue-500 outline-none text-gray-700 bg-gray-50 focus:border-blue-500 transition-colors w-full sm:w-auto">
                                        <option>Instant</option>
                                        <option>Daily Summary</option>
                                        <option>Weekly Summary</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                <AccordionSection icon={AlertTriangle} title="Priority" expanded={openSection === 'priority'} onToggle={() => toggleAccordion('priority')}>
                    <div className="space-y-6">
                        <p className="text-sm text-gray-500 pb-3 border-b border-gray-100">Select ONLY ONE priority level you want to receive for each channel.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {channelsList.map(ch => (
                                <div key={ch.id} className="p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">{ch.label}</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {priorities.map(p => (
                                            <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name={`priority-${ch.id}`}
                                                    checked={priorityPrefs[ch.id] === p}
                                                    onChange={() => {
                                                        setPriorityPrefs(prev => ({ ...prev, [ch.id]: p }));
                                                    }}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{p}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionSection>

                <AccordionSection icon={Settings} title="Categories" expanded={openSection === 'categories'} onToggle={() => toggleAccordion('categories')}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {categoryGroups.map((group, i) => (
                            <div key={i} className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all">
                                <h4 className="font-semibold text-gray-900 mb-4">{group.title}</h4>
                                <div className="space-y-3">
                                    {group.items.map((item, idx) => (
                                        <React.Fragment key={item}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700 font-medium">{item}</span>
                                                <Toggle checked={categoryToggles[item] !== false} onChange={() => toggleCategoryItem(item)} size="sm" />
                                            </div>
                                            {idx < group.items.length - 1 && <div className="border-t border-gray-50" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                <AccordionSection icon={Zap} title="Credit Alerts" expanded={openSection === 'credit'} onToggle={() => toggleAccordion('credit')}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all flex flex-col gap-4 h-full">
                            <label className="text-sm font-medium text-gray-900">Low-credit alert trigger threshold</label>
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={creditThreshold}
                                    onChange={(e) => setCreditThreshold(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-1 sm:flex-none p-2.5 outline-none transition-colors min-w-[120px]"
                                >
                                    <option value="50">50%</option>
                                    <option value="70">70%</option>
                                    <option value="80">80%</option>
                                    <option value="90">90%</option>
                                    <option value="custom">Custom %</option>
                                </select>
                                {creditThreshold === 'custom' && (
                                    <input
                                        type="number"
                                        placeholder="e.g. 75"
                                        value={customCreditObj}
                                        onChange={(e) => setCustomCreditObj(e.target.value)}
                                        className="bg-gray-50 border border-gray-200 text-gray-900 flex-1 sm:flex-none min-w-[100px] text-sm rounded-lg block p-2.5 w-24 outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="p-5 rounded-xl border border-blue-50 bg-blue-50/50 shadow-sm h-full flex gap-4">
                            <div className="mt-0.5"><Info className="w-5 h-5 text-blue-500" strokeWidth={2} /></div>
                            <div>
                                <p className="text-sm font-semibold text-blue-900">Get notified before campaigns pause</p>
                                <p className="text-sm text-blue-800/80 mt-1">You will be notified instantly when credits fall below the selected threshold across Image, SMS, and WhatsApp balances.</p>
                            </div>
                        </div>
                    </div>
                </AccordionSection>

                <AccordionSection icon={Moon} title="Quiet Hours" expanded={openSection === 'quiet'} onToggle={() => toggleAccordion('quiet')}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all h-full w-full">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Start Time</label>
                                <input type="time" value={prefs.frequency.quiet_start} onChange={e => { updateFrequencyPref('quiet_start', e.target.value); save('Time updated'); }} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-gray-200" />
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">End Time</label>
                                <input type="time" value={prefs.frequency.quiet_end} onChange={e => { updateFrequencyPref('quiet_end', e.target.value); save('Time updated'); }} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 h-full">
                            <div className="flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all flex-1">
                                <div className="pr-4">
                                    <p className="text-sm font-semibold text-gray-900">Allow Critical Notifications</p>
                                    <p className="text-xs text-gray-500 mt-1.5">Non-critical messages will be delayed until morning.</p>
                                </div>
                                <Toggle checked={prefs.frequency.quiet_hours_enabled} onChange={() => { updateFrequencyPref('quiet_hours_enabled', !prefs.frequency.quiet_hours_enabled); save('Quiet hours updated'); }} />
                            </div>
                            <p className="text-xs font-semibold text-blue-600 bg-blue-50/80 px-3.5 py-2.5 rounded-lg inline-block self-start border border-blue-100 uppercase tracking-wide">Timezone auto-detected</p>
                        </div>
                    </div>
                </AccordionSection>

                <AccordionSection icon={Clock} title="Digest Mode" expanded={openSection === 'digest'} onToggle={() => toggleAccordion('digest')}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <div className="flex flex-col gap-4 h-full">
                            <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all h-full">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-3 block border-b border-gray-100 pb-2">Frequency Selection</p>
                                <div className="space-y-4 pt-1">
                                    {['Instant', 'Hourly Digest', 'Daily Digest', 'Weekly Digest'].map(mode => (
                                        <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="digestMode"
                                                checked={digestMode === mode}
                                                onChange={() => setDigestMode(mode)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{mode}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 h-full">
                            <AnimatePresence>
                                {['Daily Digest', 'Weekly Digest'].includes(digestMode) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-all flex flex-col sm:flex-row items-center gap-4"
                                    >
                                        {digestMode === 'Weekly Digest' && (
                                            <div className="flex-1 w-full">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Day</label>
                                                <select value={digestDay} onChange={(e) => setDigestDay(e.target.value)} className="w-full text-sm border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d}>{d}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Time</label>
                                            <input type="time" value={digestTime} onChange={(e) => setDigestTime(e.target.value)} className="w-full text-sm border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={`flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all flex-1`}>
                                <div className="pr-4">
                                    <span className="text-sm font-semibold text-gray-900 block">Always send Critical instantly</span>
                                    <span className="text-xs text-gray-500 mt-1.5 block">Bypass digest holding area for critical incidents</span>
                                </div>
                                <Toggle checked={criticalBypass} onChange={() => setCriticalBypass(!criticalBypass)} />
                            </div>
                        </div>
                    </div>
                </AccordionSection>

                <AccordionSection icon={Trash2} title="History & Controls" expanded={openSection === 'history'} onToggle={() => toggleAccordion('history')}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <div className="flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all h-full min-h-[96px]">
                            <div>
                                <span className="text-sm font-semibold text-gray-900 block">Auto-delete after</span>
                                <span className="text-xs text-gray-500 mt-1.5 block">Automatically erase old history</span>
                            </div>
                            <select value={autoDelete} onChange={(e) => setAutoDelete(e.target.value)} className="text-sm border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all min-h-[96px]">
                                <div className="pr-4">
                                    <span className="text-sm font-semibold text-gray-900 block">Archive instead of delete</span>
                                    <span className="text-xs text-gray-500 mt-1.5 block">Retain permanently in an offline archive DB</span>
                                </div>
                                <Toggle checked={archiveInstead} onChange={() => setArchiveInstead(!archiveInstead)} />
                            </div>

                            <button className="flex items-center justify-center gap-2.5 w-full p-3.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all font-semibold text-sm shadow-sm group">
                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Clear all notification history
                            </button>
                        </div>
                    </div>
                </AccordionSection>
            </div>

            <div className="mt-8 flex justify-end">
                <Button variant="secondary" onClick={handleReset} className="flex items-center justify-center gap-2 w-full lg:w-auto transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Restore Recommended Settings
                </Button>
            </div>
        </div>
    );
};

export default NotificationsTab;
