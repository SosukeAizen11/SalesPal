import React, {
    createContext, useContext, useState,
    useEffect, useCallback, useMemo
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

// ─── NOTE: Notification data will be fetched from Supabase (notifications table).
// ─── The seed data that was here has been removed. Use addNotification() from
// ─── NotificationContext to push real in-app notifications from other contexts.
// ─── Supabase Realtime subscription will replace the localStorage persistence.

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
    // Initialise from localStorage; starts empty on first load.
    // TODO: Wire to Supabase notifications table via Realtime subscription.
    const [notifications, setNotifications] = useState(() => {
        const stored = loadNotifications();
        if (stored && Array.isArray(stored) && stored.length > 0) return stored;
        return [];
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

    // ── TODO: Replace localStorage persistence with Supabase Realtime ──────────
    // When ready:
    //   1. Connect to supabase.channel('notifications').on('INSERT', ...) here
    //   2. On INSERT, call addNotification() with the new row
    //   3. Remove loadNotifications / saveNotifications localStorage helpers
    //   4. Mark this TODO complete and remove STORAGE_KEY constant


    return (
        <NotificationContext.Provider value={useMemo(() => ({
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
        }), [visibleNotifications, notifications, unreadCount, channelUnreadCounts, prefs,
            markRead, markAllRead, dismissNotification, addNotification, clearAll,
            updateChannelPref, updateConsent, updateCategoryPref, updateSubtypePref,
            updateFrequencyPref, resetPrefs])}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
