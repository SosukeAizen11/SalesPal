import React, {
    createContext, useContext, useState,
    useEffect, useCallback, useRef, useMemo
} from 'react';

// ─── Channel constants ─────────────────────────────────────────────────────────
export const CHANNELS = {
    IN_APP: 'in_app',
    SMS: 'sms',
    RCS: 'rcs',
    WHATSAPP: 'whatsapp',
    BULK: 'bulk',
};

export const PRIORITY = {
    CRITICAL: 'critical',
    NORMAL: 'normal',
    LOW: 'low',
};

export const DELIVERY_STATUS = {
    PENDING: 'pending',
    DELIVERED: 'delivered',
    FAILED: 'failed',
    SKIPPED: 'skipped',
};

// ─── Notification schema ───────────────────────────────────────────────────────
// {
//   id, user_id, type (category), subtype,
//   channel_type: 'in_app' | 'whatsapp' | 'rcs' | 'sms' | 'bulk',
//   title, description, link,
//   priority: 'critical' | 'normal' | 'low',
//   delivery_status: 'delivered' | 'failed' | 'pending',
//   read, dismissed, timestamp, created_at,
// }

const STORAGE_KEY = 'salespal_notifications_v3';
const PREFS_STORAGE_KEY = 'salespal_notif_prefs_v2';

// ─── Default preferences ──────────────────────────────────────────────────────
export const DEFAULT_PREFS = {
    channels: {
        in_app: true,
        sms: false,
        rcs: false,
        whatsapp: false,
        bulk: false,
    },
    consent: {
        sms: false,
        rcs: false,
        whatsapp: false,
        bulk_whatsapp: false,
    },
    categories: {
        billing: { enabled: true, subtypes: { invoices: true, payment_reminders: true, credit_warnings: true } },
        campaign: { enabled: true, subtypes: { performance_alerts: true, budget_alerts: true, conversion_insights: false } },
        system: { enabled: true, subtypes: { feature_updates: true, maintenance_alerts: true } },
        marketing: { enabled: false, subtypes: { product_announcements: false, offers: false } },
        credit: { enabled: true, subtypes: { low_warning: true, exhausted: true } },
        support: { enabled: true, subtypes: { ticket_updates: true } },
    },
    frequency: {
        limit_critical_per_day: 5,
        quiet_hours_enabled: false,
        quiet_start: '22:00',
        quiet_end: '08:00',
        batch_normal: false,
    },
};

// ─── Rich seed notifications (per channel) ─────────────────────────────────────
const SEED_NOTIFICATIONS = [
    // ── IN-APP ──────────────────────────────────────────────────────────
    {
        id: 'notif_inapp_001',
        channel_type: CHANNELS.IN_APP,
        type: 'system',
        subtype: 'feature_updates',
        priority: PRIORITY.NORMAL,
        title: 'Welcome to SalesPal',
        description: 'Your dashboard is set up and ready. Explore marketing, sales, and analytics tools.',
        link: '/marketing',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: 'notif_inapp_002',
        channel_type: CHANNELS.IN_APP,
        type: 'campaign',
        subtype: 'performance_alerts',
        priority: PRIORITY.NORMAL,
        title: 'Campaign "Summer Sale" is live',
        description: 'Your campaign started running across 3 platforms. Monitor performance in the dashboard.',
        link: '/marketing',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: true,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: 'notif_inapp_003',
        channel_type: CHANNELS.IN_APP,
        type: 'billing',
        subtype: 'payment_reminders',
        priority: PRIORITY.NORMAL,
        title: 'Next billing on Mar 14, 2026',
        description: 'Your SalesPal 360 subscription renews in 22 days. Ensure your payment method is up to date.',
        link: '/settings/notifications',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: 'notif_inapp_004',
        channel_type: CHANNELS.IN_APP,
        type: 'credit',
        subtype: 'low_warning',
        priority: PRIORITY.CRITICAL,
        title: 'Image credits at 80% — top up soon',
        description: 'You have used 80% of your monthly image credits. Top up now to avoid campaign interruption.',
        link: '/settings/notifications',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        id: 'notif_inapp_005',
        channel_type: CHANNELS.IN_APP,
        type: 'support',
        subtype: 'ticket_updates',
        priority: PRIORITY.LOW,
        title: 'Support ticket #1042 resolved',
        description: 'The SalesPal support team has resolved your query about campaign analytics.',
        link: '/settings',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: true,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },

    // ── WHATSAPP ─────────────────────────────────────────────────────────
    {
        id: 'notif_wa_001',
        channel_type: CHANNELS.WHATSAPP,
        type: 'campaign',
        subtype: 'performance_alerts',
        priority: PRIORITY.NORMAL,
        title: 'WhatsApp Campaign "Diwali Offer" sent',
        description: '2,340 messages delivered successfully. 18% open rate so far.',
        link: '/marketing/campaigns',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
        id: 'notif_wa_002',
        channel_type: CHANNELS.WHATSAPP,
        type: 'billing',
        subtype: 'credit_warnings',
        priority: PRIORITY.CRITICAL,
        title: 'WhatsApp credits critically low',
        description: 'Only 120 WhatsApp messages remaining. Top up now to avoid campaign failure.',
        link: '/settings/notifications',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
        id: 'notif_wa_003',
        channel_type: CHANNELS.WHATSAPP,
        type: 'campaign',
        subtype: 'budget_alerts',
        priority: PRIORITY.NORMAL,
        title: 'Bulk WhatsApp batch completed',
        description: '"Summer Deals" broadcast: 5,000 sent, 4,812 delivered, 188 failed.',
        link: '/marketing/campaigns',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: true,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },

    // ── RCS ──────────────────────────────────────────────────────────────
    {
        id: 'notif_rcs_001',
        channel_type: CHANNELS.RCS,
        type: 'campaign',
        subtype: 'performance_alerts',
        priority: PRIORITY.NORMAL,
        title: 'RCS Campaign delivered — 94% success',
        description: '1,850 rich messages sent. 94% delivered, 62% opened. View detailed analytics.',
        link: '/marketing/campaigns',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
        id: 'notif_rcs_002',
        channel_type: CHANNELS.RCS,
        type: 'system',
        subtype: 'feature_updates',
        priority: PRIORITY.LOW,
        title: 'RCS Fallback to SMS activated',
        description: '43 devices did not support RCS. Messages automatically fell back to SMS.',
        link: '/marketing/campaigns',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: true,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },

    // ── SMS ───────────────────────────────────────────────────────────────
    {
        id: 'notif_sms_001',
        channel_type: CHANNELS.SMS,
        type: 'billing',
        subtype: 'invoices',
        priority: PRIORITY.NORMAL,
        title: 'Invoice #INV-004 sent via SMS',
        description: 'Payment reminder SMS dispatched to your registered mobile +91 98765 XXXXX.',
        link: '/settings/notifications',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
        id: 'notif_sms_002',
        channel_type: CHANNELS.SMS,
        type: 'system',
        subtype: 'maintenance_alerts',
        priority: PRIORITY.CRITICAL,
        title: 'Urgent: OTP sent for billing update',
        description: 'A one-time password was sent to verify your billing method update. Expires in 10 mins.',
        link: '/settings',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: true,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    },

    // ── BULK ──────────────────────────────────────────────────────────────
    {
        id: 'notif_bulk_001',
        channel_type: CHANNELS.BULK,
        type: 'campaign',
        subtype: 'budget_alerts',
        priority: PRIORITY.NORMAL,
        title: 'Bulk Campaign "Republic Day Sale" completed',
        description: '10,000 messages sent across WhatsApp + SMS. 87% delivery rate. Check report.',
        link: '/marketing/campaigns',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
        id: 'notif_bulk_002',
        channel_type: CHANNELS.BULK,
        type: 'campaign',
        subtype: 'conversion_insights',
        priority: PRIORITY.LOW,
        title: 'RCS Bulk campaign report ready',
        description: 'Your weekly RCS campaign performance summary is ready to view.',
        link: '/marketing/campaigns',
        delivery_status: DELIVERY_STATUS.DELIVERED,
        read: false,
        dismissed: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────
const loadNotifications = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /**/ }
    return null;
};
const saveNotifications = (n) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(n)); } catch { /**/ }
};

const loadPrefs = () => {
    try {
        const raw = localStorage.getItem(PREFS_STORAGE_KEY);
        if (raw) return deepMerge(DEFAULT_PREFS, JSON.parse(raw));
    } catch { /**/ }
    return DEFAULT_PREFS;
};
const savePrefs = (p) => {
    try { localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(p)); } catch { /**/ }
};

function deepMerge(defaults, override) {
    const result = { ...defaults };
    for (const key of Object.keys(override)) {
        if (override[key] !== null && typeof override[key] === 'object' && !Array.isArray(override[key]) && key in result) {
            result[key] = deepMerge(result[key], override[key]);
        } else {
            result[key] = override[key];
        }
    }
    return result;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        const stored = loadNotifications();
        if (stored && Array.isArray(stored) && stored.length > 0) {
            const storedIds = new Set(stored.map(n => n.id));
            const newSeeds = SEED_NOTIFICATIONS.filter(s => !storedIds.has(s.id));
            return [...newSeeds, ...stored];
        }
        return SEED_NOTIFICATIONS;
    });

    const [prefs, setPrefs] = useState(loadPrefs);

    useEffect(() => { saveNotifications(notifications); }, [notifications]);
    useEffect(() => { savePrefs(prefs); }, [prefs]);

    // ── Derived counts ────────────────────────────────────────────────────
    const visibleNotifications = useMemo(
        () => notifications.filter(n => !n.dismissed),
        [notifications]
    );

    const unreadCount = useMemo(
        () => visibleNotifications.filter(n => !n.read).length,
        [visibleNotifications]
    );

    // Per-channel unread count map
    const channelUnreadCounts = useMemo(() => {
        const counts = { in_app: 0, whatsapp: 0, rcs: 0, sms: 0, bulk: 0 };
        visibleNotifications.forEach(n => {
            if (!n.read && n.channel_type && n.channel_type in counts) {
                counts[n.channel_type]++;
            }
        });
        return counts;
    }, [visibleNotifications]);

    // ── Actions ───────────────────────────────────────────────────────────
    const markRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllRead = useCallback((channelFilter = null) => {
        setNotifications(prev => prev.map(n => {
            if (channelFilter && n.channel_type !== channelFilter) return n;
            return { ...n, read: true };
        }));
    }, []);

    const dismissNotification = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n));
    }, []);

    const addNotification = useCallback((notif) => {
        const newNotif = {
            id: `notif_${Date.now()}`,
            channel_type: CHANNELS.IN_APP,
            priority: PRIORITY.NORMAL,
            delivery_status: DELIVERY_STATUS.DELIVERED,
            read: false,
            dismissed: false,
            timestamp: new Date().toISOString(),
            ...notif,
        };
        setNotifications(prev => {
            if (prev.some(n => n.id === newNotif.id)) return prev;
            return [newNotif, ...prev];
        });
    }, []);

    const clearAll = useCallback((channelFilter = null) => {
        setNotifications(prev => prev.map(n => {
            if (channelFilter && n.channel_type !== channelFilter) return n;
            return { ...n, dismissed: true };
        }));
    }, []);

    // ── Preference helpers ────────────────────────────────────────────────
    const updateChannelPref = useCallback((ch, val) => setPrefs(p => ({ ...p, channels: { ...p.channels, [ch]: val } })), []);
    const updateConsent = useCallback((ch, val) => setPrefs(p => ({ ...p, consent: { ...p.consent, [ch]: val }, channels: val ? { ...p.channels, [ch]: true } : p.channels })), []);
    const updateCategoryPref = useCallback((cat, val) => setPrefs(p => ({ ...p, categories: { ...p.categories, [cat]: { ...p.categories[cat], enabled: val } } })), []);
    const updateSubtypePref = useCallback((cat, sub, val) => setPrefs(p => ({ ...p, categories: { ...p.categories, [cat]: { ...p.categories[cat], subtypes: { ...p.categories[cat].subtypes, [sub]: val } } } })), []);
    const updateFrequencyPref = useCallback((key, val) => setPrefs(p => ({ ...p, frequency: { ...p.frequency, [key]: val } })), []);
    const resetPrefs = useCallback(() => setPrefs(DEFAULT_PREFS), []);

    // ── Polling (simulated push, 60s) ─────────────────────────────────────
    const pollingRef = useRef(null);
    useEffect(() => {
        const incoming = [
            { id: 'poll_wa', channel_type: CHANNELS.WHATSAPP, type: 'campaign', title: 'WhatsApp: "Flash Sale" delivered', description: '3,200 messages delivered. 22% click rate.', link: '/marketing/campaigns', priority: PRIORITY.NORMAL },
            { id: 'poll_sms', channel_type: CHANNELS.SMS, type: 'billing', title: 'SMS: Payment reminder sent', description: 'Billing reminder dispatched to +91 98765 XXXXX.', link: '/settings', priority: PRIORITY.NORMAL },
            { id: 'poll_rcs', channel_type: CHANNELS.RCS, type: 'campaign', title: 'RCS: Analytics report ready', description: 'Weekly RCS campaign insights for Feb 2026 are ready.', link: '/marketing', priority: PRIORITY.LOW },
        ];
        let idx = 0;
        pollingRef.current = setInterval(() => {
            const c = incoming[idx % incoming.length]; idx++;
            setNotifications(prev => {
                if (prev.some(n => n.id === c.id)) return prev;
                return [{ ...c, delivery_status: DELIVERY_STATUS.DELIVERED, read: false, dismissed: false, timestamp: new Date().toISOString() }, ...prev];
            });
        }, 60_000);
        return () => clearInterval(pollingRef.current);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications: visibleNotifications,
            allNotifications: notifications,
            unreadCount,
            channelUnreadCounts,
            prefs,
            markRead,
            markAllRead,
            dismissNotification,
            addNotification,
            clearAll,
            updateChannelPref,
            updateConsent,
            updateCategoryPref,
            updateSubtypePref,
            updateFrequencyPref,
            resetPrefs,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
