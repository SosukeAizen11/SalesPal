/**
 * WALKTHROUGH STEP DEFINITIONS
 * Production-grade onboarding steps for Marketing Dashboard
 */

export const WALKTHROUGH_STEPS = [
    // Step 0: Intro Modal (No target)
    {
        id: 'intro',
        title: "Welcome to your Marketing Dashboard",
        description: "Track performance, spot issues early, and let AI guide optimization across all projects. Let's take a quick tour!",
        targetSelector: null,
        placement: 'center',
        isIntro: true
    },
    // Step 1: Sidebar - Dashboard
    {
        id: 'sidebar-dashboard',
        title: "Navigation Sidebar",
        description: "Use the sidebar to navigate between Dashboard, Projects, Social, and Settings. This is your main navigation hub.",
        targetSelector: "#tour-sidebar",
        placement: 'right',
        scrollOffset: 0,
        allowInteraction: false
    },
    // Step 2: Dashboard Header/Controls
    {
        id: 'header-controls',
        title: "Dashboard Controls",
        description: "Filters here control what data you see across projects, channels, and time ranges.",
        targetSelector: "#tour-header",
        placement: 'bottom',
        scrollOffset: 100,
        allowInteraction: false
    },
    // Step 3: KPI Cards
    {
        id: 'kpi-cards',
        title: "Key Metrics",
        description: "These key metrics give you a quick pulse of scale, cost, and efficiency across all your campaigns.",
        targetSelector: "#tour-kpi",
        placement: 'bottom',
        scrollOffset: 80,
        allowInteraction: false
    },
    // Step 4: AI Insights Stream
    {
        id: 'ai-insights',
        title: "AI Intelligence",
        description: "SalesPal AI monitors campaigns in real time and flags issues or opportunities that need attention.",
        targetSelector: "#tour-insights",
        placement: 'bottom',
        scrollOffset: 80,
        allowInteraction: false
    },
    // Step 5: Performance Trends & Funnel
    {
        id: 'performance',
        title: "Trends & Funnel",
        description: "Track trends over time and see where users drop off before converting.",
        targetSelector: "#tour-performance",
        placement: 'top',
        scrollOffset: 100,
        allowInteraction: false
    },
    // Step 6: Recommended Actions
    {
        id: 'actions',
        title: "Recommended Actions",
        description: "AI-recommended optimizations you can preview and apply safely to improve performance.",
        targetSelector: "#tour-actions",
        placement: 'top',
        scrollOffset: 100,
        allowInteraction: false
    },
    // Step 7: Final
    {
        id: 'complete',
        title: "You're all set! 🎉",
        description: "You're ready to start optimizing your marketing campaigns. Create your first campaign or explore the dashboard.",
        targetSelector: null,
        placement: 'center',
        isFinal: true
    }
];

export const STORAGE_KEYS = {
    ACTIVE: 'walkthrough_active',
    STEP: 'walkthrough_step',
    COMPLETED: 'walkthrough_completed',
    SKIPPED: 'walkthrough_skipped'
};
