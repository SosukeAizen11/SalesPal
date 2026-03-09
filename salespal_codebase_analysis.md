# Sales-Pal Codebase Analysis — Comprehensive Context Document

## Executive Summary

**Sales-Pal** is a multi-module SaaS platform built with **React 19 + Vite 7 + Tailwind CSS 4** on a **Supabase** backend, deployed to **Vercel**. The codebase (~155+ files, ~260 `src/` children) is organized into a marketing-first architecture where the **Marketing module** is fully implemented (campaigns, social posts, projects, AI-driven analytics, ad creation wizard) while Sales, Post-Sale, and Support modules are placeholder stubs behind `ModuleAccessWrapper` gates. The application uses 10 React Context providers (nested 9 levels deep in `App.jsx`), a `createBrowserRouter` routing configuration with ~50 routes, and a commerce layer handling subscription activation, credit management, and a shopping cart — all backed by Supabase RLS-protected tables. The design system uses a dark theme (`#0D1F2D` primary, `#76F7C5` secondary accent, blue `#1D7CFF` accent), Inter font, and `framer-motion` for animations. Key architectural patterns include a centralized `MarketingContext` composer layer, Supabase-backed CRUD hooks (`useProjects`, `useCampaignContext`, `useSocialContext`), and a campaign creation wizard state machine (`useWizard`).

---

## SECTION 1 — File Dependency Map

### `src/lib/`

```
src/lib/supabase.js
  → imports: @supabase/supabase-js
  → imported by: AuthContext, OrgContext, CampaignContext, SocialContext,
                  IntegrationContext, SubscriptionContext, useProjects, useWizard
  → role: CORE (9 dependents) — single Supabase client instance
```

---

### `src/context/`

```
src/context/AuthContext.jsx
  → imports: react, src/lib/supabase
  → imported by: App.jsx, OrgContext, CampaignContext, SocialContext,
                  IntegrationContext, MarketingContext, SubscriptionContext,
                  ProtectedRoute, AuthModal, Navbar, NavbarUserMenu,
                  SidebarUserMenu, ProjectLayout, SignIn, ProjectsHub,
                  ProfileTab, MarketingDashboard, MetaIntegration,
                  NewCampaign, PurchaseSuccess, CartPage,
                  AIStrategicInsights, AcquisitionIntelligence
  → role: CORE (22+ dependents) — session management, login/signup/logout

src/context/OrgContext.jsx
  → imports: react, src/lib/supabase, AuthContext
  → imported by: App.jsx, MarketingContext, CampaignContext, SocialContext,
                  useProjects, SubscriptionContext
  → role: CORE (6 dependents) — org membership bootstrap + org_id

src/context/MarketingContext.jsx
  → imports: react, OrgContext, AuthContext, useProjects, CampaignContext,
             SocialContext, useWizard
  → imported by: App.jsx, ProjectContext, ProjectSwitcher, Campaigns,
                  MarketingDashboard, Social, CampaignDetails, EditCampaign,
                  NewCampaign, Projects, ProjectDetails, CreateProject,
                  SocialOverview, SocialCreate, SocialList, SocialLayout,
                  SocialPostDetails, Dashboard, MarketingKPIDrilldown,
                  StepReviewLaunch
  → role: CORE (19+ dependents) — composer layer for campaigns, social, projects, wizard

src/context/CampaignContext.jsx
  → imports: react, src/lib/supabase, OrgContext, AuthContext
  → imported by: MarketingContext (internal hook — useCampaignContext)
  → role: INTERNAL — campaign CRUD + AI action stubs

src/context/SocialContext.jsx
  → imports: react, src/lib/supabase, OrgContext, AuthContext
  → imported by: MarketingContext (internal hook — useSocialContext)
  → role: INTERNAL — social posts CRUD with optimistic updates

src/context/IntegrationContext.jsx
  → imports: react, src/lib/supabase, AuthContext
  → imported by: App.jsx, CampaignCard, CampaignDetails, ConnectPlatform,
                  MarketingSettingsIntegrations, MarketingSettings,
                  MetaIntegration, SocialCreate, SocialLayout, SocialOverview,
                  SocialSidebar, StepReviewLaunch
  → role: CORE (12 dependents) — platform connection state (Meta, Google, LinkedIn)

src/context/PreferencesContext.jsx
  → imports: react (localStorage-only, no Supabase)
  → imported by: App.jsx, useTranslation, formatCurrency, Dashboard,
                  MarketingDashboard, Projects, CampaignCard, CampaignDetails,
                  StepReviewLaunch, StepPlatformBudget, PricingSection,
                  PricingCard, CartPage, TopUpDrawer, CurrencyIcon, PlanCard,
                  ComparisonTable, ProductHero, SalesProductHero,
                  SalesPal360Hero, SupportProductHero, PostSaleProductHero,
                  MiniCartDrawer, MarketingKPIDrilldown, RevenueAnalytics,
                  SpendOverTimeChart, PerformanceSection, PerformanceTrends,
                  PlatformROI, RevenueImpact, ROASTrend, SpendAnalysis,
                  CampaignDetailView, CampaignOverview, BudgetCard,
                  BudgetBreakdown, AIReasoningBox, AIStrategicInsights,
                  AcquisitionIntelligence, SalesComparisonTable,
                  SalesPal360Comparison, SupportComparisonTable
  → role: CORE (40+ dependents) — i18n language, timezone, currency with formatCurrency

src/context/ProjectContext.jsx
  → imports: react, MarketingContext
  → imported by: App.jsx, ProjectLayout, Sidebar, ProjectsHub,
                  CreateProjectFlow, wizard/CreateProject
  → role: THIN WRAPPER — selector over MarketingContext.projects

src/context/NotificationContext.jsx
  → imports: react (localStorage-only)
  → imported by: App.jsx, NotificationBell, NotificationCenter, NotificationsTab
  → role: LEAF (4 dependents) — in-app notification management + preferences

src/context/AnalyticsContext.jsx
  → imports: react, react-router-dom (useSearchParams)
  → imported by: MarketingDashboard, MarketingKPIDrilldown
  → role: LEAF (2 dependents) — analytics filter state (time range, channel, compare mode)
  ⚠ NOT mounted in App.jsx provider tree — only used locally via AnalyticsProvider
```

---

### `src/commerce/`

```
src/commerce/SubscriptionContext.jsx
  → imports: react, src/lib/supabase, OrgContext, AuthContext, commerce.config
  → imported by: App.jsx, MarketingLayout, CartContext, CartPage,
                  PricingSection, PlanCard, ActionModals, GlobalCreditDisplay,
                  TopUpDrawer, ModuleAccessWrapper, ModuleAccessGuard,
                  StepAdCreation, ImageAdSection, VideoAdSection,
                  SubscriptionPage
  → role: CORE (16 dependents) — subscription activation/deactivation, credit consume/add

src/commerce/CartContext.jsx
  → imports: react, SubscriptionContext, commerce.config
  → imported by: App.jsx, MiniCartDrawer, Navbar, CartPage, PricingSection,
                  TopUpDrawer
  → role: STANDARD (6 dependents) — shopping cart with localStorage persistence

src/commerce/commerce.config.js
  → imports: (none)
  → imported by: CartContext, SubscriptionContext
  → role: CORE — module pricing config (marketing: ₹5,999; sales/postSale/support: ₹9,999; salespal360: ₹29,999)
```

---

### `src/hooks/`

```
src/hooks/useProjects.js
  → imports: react, src/lib/supabase, OrgContext
  → imported by: MarketingContext
  → role: INTERNAL — Supabase-backed projects CRUD (single source of truth)

src/hooks/useWizard.js
  → imports: react, src/lib/supabase
  → imported by: MarketingContext
  → role: INTERNAL — campaign draft wizard state machine (5-step: business → analysis → ads → budget → review)

src/hooks/useReducedMotion.js
  → imports: react
  → imported by: animation components (FadeInUp, FloatingElement, etc.)
  → role: LEAF — detects prefers-reduced-motion

src/hooks/useScrollReveal.js
  → imports: react
  → imported by: ScrollReveal component
  → role: LEAF — IntersectionObserver-based scroll reveal
```

---

### `src/utils/`

```
src/utils/analyticsCalculations.js
  → imports: (none — pure functions)
  → imported by: RevenueAnalytics, various analytics sections
  → role: LEAF — pure metric calculators (CTR, CPC, CPM, ROAS, CPL, Frequency, Landing Page CVR)

src/utils/campaignGuard.js
  → imports: (none — pure functions)
  → imported by: CampaignDetails, StepReviewLaunch
  → role: LEAF — validates integration requirements before campaign launch

src/utils/formatCurrency.js
  → imports: (none — standalone)
  → imported by: various analytics + pricing components as static fallback
  → role: STANDARD — static currency formatter (INR-centric), formatPercent, formatROAS, formatNumber

src/utils/i18n.js
  → imports: (none)
  → imported by: useTranslation
  → role: STANDARD — 39KB translation dictionary (en, hi, es, fr, de, pt, ar, zh, ja)

src/utils/navigationUtils.js
  → imports: (none — pure functions)
  → imported by: campaign pages (project-aware route building)
  → role: LEAF — safe route generators to prevent "undefined" in URLs

src/utils/storage.js
  → imports: (none)
  → imported by: (likely none — deprecated)
  → role: DEAD CODE CANDIDATE — deprecated no-op stubs for localStorage

src/utils/useTranslation.js
  → imports: PreferencesContext, i18n
  → imported by: (unclear — few consumers found in grep)
  → role: LEAF — React hook wrapping i18n.t() with current language preference
```

---

### `src/layouts/`

```
src/layouts/MainLayout.jsx
  → imports: react, react-router-dom, Navbar, Footer
  → imported by: router.jsx
  → role: STANDARD — public pages shell (Navbar + Footer)

src/layouts/MarketingLayout.jsx
  → imports: react, react-router-dom, SubscriptionContext, ProjectSwitcher,
             GlobalCreditDisplay, TopUpDrawer, NotificationBell
  → imported by: router.jsx (marketing module + settings)
  → role: STANDARD — marketing module shell (project switcher + credits + notifications)

src/layouts/ProjectLayout.jsx
  → imports: react, react-router-dom, ProjectContext, AuthContext, Sidebar, logo asset
  → imported by: router.jsx (console routes)
  → role: STANDARD — project console shell (Sidebar + dark header + route guard)
```

---

### `src/components/`

```
src/components/layout/AppLayout.jsx          → imported by: router.jsx → Sidebar + content area for authenticated shell
src/components/layout/Navbar.jsx             → imported by: MainLayout → public navigation bar, uses useAuth + useCart
src/components/layout/Footer.jsx             → imported by: MainLayout → site footer
src/components/layout/NavbarUserMenu.jsx     → imported by: Navbar → user dropdown, uses useAuth
src/components/layout/SidebarUserMenu.jsx    → imported by: AppLayout → sidebar user menu, uses useAuth
src/components/layout/Sidebar.jsx            → imported by: ProjectLayout → project console sidebar, uses useProject
src/components/layout/SectionWrapper.jsx     → imported by: home section components → reusable page section container

src/components/auth/AuthModal.jsx            → imported by: Navbar → sign-in/sign-up modal, uses useAuth
src/components/auth/ProtectedRoute.jsx       → imported by: router.jsx → auth route guard, uses useAuth
src/components/auth/ModuleAccessGuard.jsx    → imported by: (likely unused — replaced by ModuleAccessWrapper)

src/components/access/ModuleAccessWrapper.jsx→ imported by: router.jsx → subscription access gate, uses useSubscription

src/components/ui/AnimatedButton.jsx         → Shared UI primitive
src/components/ui/Badge.jsx                  → Shared UI primitive
src/components/ui/Button.jsx                 → Shared UI primitive
src/components/ui/Card.jsx                   → Shared UI primitive
src/components/ui/ConfirmationModal.jsx      → Shared UI primitive
src/components/ui/CurrencyIcon.jsx           → Shared UI primitive (uses usePreferences)
src/components/ui/Dropdown.jsx               → Shared UI primitive
src/components/ui/Input.jsx                  → Shared UI primitive
src/components/ui/Modal.jsx                  → Shared UI primitive
src/components/ui/Select.jsx                 → Shared UI primitive
src/components/ui/Textarea.jsx               → Shared UI primitive
src/components/ui/Toast.jsx                  → Shared UI primitive (ToastProvider in App.jsx)

src/components/animations/FadeInUp.jsx       → framer-motion fade-in-up animation wrapper
src/components/animations/FloatingElement.jsx→ framer-motion floating animation
src/components/animations/ScrollReveal.jsx   → IntersectionObserver animation (uses useScrollReveal)
src/components/animations/StaggerContainer.jsx → framer-motion stagger children container

src/components/cart/MiniCartDrawer.jsx       → imported by: App.jsx → slide-over cart preview, uses useCart + usePreferences
src/components/credits/TopUpDrawer.jsx       → imported by: MarketingLayout → credit top-up, uses useSubscription + useCart + usePreferences
src/components/notifications/NotificationBell.jsx → imported by: MarketingLayout → bell icon + dropdown, uses useNotifications

src/components/GlobalCreditDisplay.jsx       → imported by: MarketingLayout → credit balance bar, uses useSubscription
src/components/ProjectSwitcher.jsx           → imported by: MarketingLayout → project picker dropdown, uses useMarketing
src/components/IntegrationAlert.jsx          → integration warning banner

src/components/products/[25 files]           → Product landing page sections (Hero, FeaturesGrid, ComparisonTable,
                                               TargetAudience, CTA) for each module (Marketing, Sales, PostSale,
                                               Support, SalesPal360). Uses usePreferences for currency formatting.

src/components/subscription/PlanCard.jsx     → plan display card, uses useSubscription + usePreferences
src/components/subscription/ActionModals.jsx → pause/cancel/resume modals, uses useSubscription
src/components/subscription/UsageProgress.jsx→ credit usage progress bars

src/components/common/ScrollToTop.jsx        → imported by: App.jsx → scroll-to-top on route change
```

---

### `src/pages/` (grouped by module)

```
── auth/
   SignIn.jsx                                → login/signup page, uses useAuth
   ConnectPlatform.jsx                       → OAuth landing page, uses useIntegrations

── home/
   Home.jsx                                  → landing page, composes 11 section components
   sections/HeroSection.jsx                  → hero with animated text
   sections/ModulesSection.jsx               → module overview cards
   sections/WhySalesPal.jsx                  → value proposition
   sections/HowItWorks.jsx                   → step-by-step flow
   sections/StepCard.jsx                     → individual step card
   sections/ModularApproach.jsx              → modular architecture explainer
   sections/TrustSection.jsx                 → social proof / trust badges
   sections/PricingSection.jsx               → pricing plans, uses usePreferences + useSubscription + useCart
   sections/PricingCard.jsx                  → individual plan card, uses usePreferences
   sections/ValueProposition.jsx             → core value messaging
   sections/FinalCTA.jsx                     → bottom call-to-action

── contact/
   ContactPage.jsx                           → contact form page

── cart/
   CartPage.jsx                              → full cart view, uses useCart + useSubscription + usePreferences + useAuth

── purchase/
   PurchaseSuccess.jsx                       → post-purchase confirmation, uses useAuth + useSubscription

── subscription/
   SubscriptionPage.jsx                      → subscription management, uses useSubscription

── notifications/
   NotificationCenter.jsx                    → full notification view, uses useNotifications

── profile/
   ProfilePage.jsx                           → profile page with tabbed layout
   tabs/ProfileTab.jsx                       → profile info, uses useAuth
   tabs/NotificationsTab.jsx                 → notification preferences, uses useNotifications
   tabs/[3 more tab files]                   → additional profile tabs

── products/
   MarketingProduct.jsx                      → marketing product landing page
   SalesProduct.jsx                          → sales product landing page
   PostSaleProduct.jsx                       → post-sale product landing page
   SupportProduct.jsx                        → support product landing page
   SalesPal360Product.jsx                    → SalesPal 360 product landing page

── projects/
   ProjectsHub.jsx                           → project list + selection, uses useProject + useAuth
   ProjectCard.jsx                           → project display card
   CreateProjectFlow.jsx                     → project creation flow, uses useProject
   wizard/CreateProject.jsx                  → wizard-based project creation, uses useProject
   wizard/[10 more wizard step files]        → industry selection, details, etc.

── dashboard/
   Dashboard.jsx                             → project console overview, uses useMarketing + usePreferences + useAuth
   ModulePage.jsx                            → reusable module page template
   modules/Marketing.jsx                     → marketing module console view
   modules/Sales.jsx                         → sales module console view (likely placeholder)
   modules/Support.jsx                       → support module console view (likely placeholder)

── marketing/ (107 files — largest module)
   MarketingDashboard.jsx (21KB — GOD FILE) → main marketing dashboard, uses useMarketing + usePreferences + useAnalytics + useAuth
   Campaigns.jsx                             → campaign list, uses useMarketing
   Social.jsx                                → legacy social redirect, uses useMarketing
   PlaceholderPage.jsx                       → stub page for unbuilt features
   Settings.jsx                              → legacy settings (redirects to /settings)

   campaigns/
     NewCampaign.jsx                         → campaign creation wizard entry, uses useMarketing + useAuth
     CampaignDetails.jsx                     → campaign detail view, uses useMarketing + useIntegrations + usePreferences
     EditCampaign.jsx                        → campaign editing, uses useMarketing
     steps/StepBusinessInfo.jsx              → wizard step 1: business info
     steps/StepAIAnalysis.jsx                → wizard step 2: AI analysis
     steps/StepAdCreation.jsx                → wizard step 3: ad creation, uses useSubscription
     steps/StepPlatformBudget.jsx            → wizard step 4: budget allocation, uses usePreferences
     steps/StepReviewLaunch.jsx              → wizard step 5: review + launch, uses useMarketing + useIntegrations + usePreferences
     components/ad-creation/ImageAdSection.jsx → image ad builder, uses useSubscription
     components/ad-creation/VideoAdSection.jsx → video ad builder, uses useSubscription
     components/budget/BudgetCard.jsx        → budget display, uses usePreferences
     components/budget/BudgetBreakdown.jsx   → budget breakdown, uses usePreferences
     components/budget/AIReasoningBox.jsx    → AI reasoning display, uses usePreferences
     components/CampaignOverview.jsx         → campaign overview, uses usePreferences
     [20+ more campaign sub-components]

   analytics/ (30 files)
     AnalyticsSection.jsx                    → analytics tab wrapper
     RevenueAnalytics.jsx                    → revenue analytics, uses usePreferences
     components/AIInsightsBanner.jsx         → AI insights banner
     components/AIInsightsStream.jsx         → streaming AI insights
     components/ActionHistory.jsx            → action log
     components/LeadsOverTimeChart.jsx       → leads chart (recharts)
     components/PlatformSplitChart.jsx       → platform pie chart (recharts)
     components/SpendOverTimeChart.jsx       → spend chart, uses usePreferences
     sections/AIFinancialInsights.jsx        → AI financial insights panel
     sections/AIInsights.jsx                 → AI insights panel
     sections/AIStrategicInsights.jsx        → AI strategic panel, uses usePreferences + useAuth
     sections/AcquisitionIntelligence.jsx    → acquisition panel, uses usePreferences + useAuth
     sections/CampaignPerformance.jsx        → campaign performance grid
     sections/ConversionFunnel.jsx           → conversion funnel visualization
     sections/CreditTrends.jsx              → credit usage trends
     sections/FinancialKPIs.jsx             → financial KPI cards
     sections/PerformanceTrends.jsx          → performance trend charts, uses usePreferences
     sections/PlatformROI.jsx               → platform ROI comparison, uses usePreferences
     sections/RevenueImpact.jsx             → revenue impact, uses usePreferences
     sections/ROASTrend.jsx                 → ROAS trend chart, uses usePreferences
     sections/SpendAnalysis.jsx             → spend analysis, uses usePreferences
     [10+ more analytics sections]

   social/
     SocialLayout.jsx                        → social module layout, uses useMarketing + useIntegrations
     SocialOverview.jsx                      → social overview, uses useMarketing + useIntegrations
     SocialCreate.jsx                        → social post creation, uses useMarketing + useIntegrations + useSubscription
     SocialList.jsx                          → social posts list by status, uses useMarketing
     SocialAnalytics.jsx                     → social analytics
     SocialPostDetails.jsx                   → social post detail, uses useMarketing

   projects/
     Projects.jsx                            → marketing projects list, uses useMarketing + usePreferences
     ProjectDetails.jsx                      → project detail, uses useMarketing
     CreateProject.jsx                       → project creation, uses useMarketing

   settings/
     MarketingSettingsLayout.jsx             → settings shell with tabs
     MarketingSettingsIntegrations.jsx       → integrations settings, uses useIntegrations
     MetaIntegration.jsx                     → Meta integration config, uses useIntegrations + useAuth
     MarketingSettingsPlaceholders.jsx       → placeholder settings tabs
     MarketingSettings.jsx                   → legacy settings (uses useIntegrations)

   analysis/
     MarketingKPIDrilldown.jsx               → KPI detail view, uses useMarketing + useAnalytics + usePreferences

   components/ (19 files)
     CampaignCard.jsx                        → campaign card, uses useIntegrations + usePreferences
     SocialSidebar.jsx                       → social sidebar nav, uses useIntegrations
     analytics/PerformanceSection.jsx        → performance analytics, uses usePreferences
     [16 more marketing sub-components]
```

---

### Circular Dependency Analysis

**No true circular imports detected.** However, there is a **tight conceptual coupling**:

- `ProjectContext → MarketingContext → useProjects hook` — ProjectContext is a thin wrapper over MarketingContext, which itself delegates to `useProjects`. This creates a dependency inversion: ProjectContext (which wraps inside MarketingContext) reads from MarketingContext (which wraps outside ProjectContext). This works because React Context nesting order in `App.jsx` places MarketingContext outside ProjectContext.
- `AnalyticsContext` is imported by MarketingDashboard and MarketingKPIDrilldown but is **NOT mounted in App.jsx**. It must be mounted locally by its consumers via `<AnalyticsProvider>`, which means it cannot access URL search params consistently.

---

## SECTION 2 — Data Flow

### 1. Authentication Flow

```
index.html → main.jsx → RouterProvider → App.jsx → AuthProvider
  ↓
AuthProvider (mount):
  1. supabase.auth.getSession() → sets session/user/isAuthenticated
  2. supabase.auth.onAuthStateChange() → listens for session changes
  ↓
Consumer components call useAuth():
  - login(email, password) → supabase.auth.signInWithPassword()
  - signup(email, password, fullName) → supabase.auth.signUp({data: {full_name}})
  - logout() → supabase.auth.signOut()
  ↓
Session propagation:
  - ProtectedRoute checks isAuthenticated + loading
  - OrgProvider watches user changes → bootstraps org membership
  - SubscriptionProvider watches user + orgId → fetches subscriptions + credits
```

### 2. Supabase Data Flow

| Module        | Supabase Table(s)                          | Context/Hook                          | Key Operations                                     |
| ------------- | ------------------------------------------ | ------------------------------------- | -------------------------------------------------- |
| Auth          | `auth.users`                               | AuthContext                           | signIn, signUp, signOut, getSession                |
| Org           | `organizations`, `org_members`             | OrgContext                            | bootstrap_user_org RPC, membership lookup          |
| Projects      | `projects`                                 | useProjects → MarketingContext        | CRUD, archive (soft-delete via status)             |
| Campaigns     | `campaigns`                                | useCampaignContext → MarketingContext | CRUD, filter by project                            |
| Social        | `social_posts`                             | useSocialContext → MarketingContext   | CRUD with optimistic updates                       |
| Wizard        | `campaign_drafts`                          | useWizard → MarketingContext          | draft lifecycle + launch_campaign RPC              |
| Integrations  | `integrations`                             | IntegrationContext                    | connect/disconnect via upsert/delete               |
| Subscriptions | `subscriptions`                            | SubscriptionContext                   | activate/deactivate/pause/resume via upsert/update |
| Credits       | `marketing_credits`, `credit_transactions` | SubscriptionContext                   | consume_credit RPC, add_credit RPC                 |

### 3. Context → Component Flow

```
PreferencesProvider (outermost — no deps)
  └─ AuthProvider (supabase.auth)
      └─ OrgProvider (depends on useAuth)
          └─ SubscriptionProvider (depends on useAuth + useOrg)
              └─ CartProvider (depends on useSubscription)
                  └─ IntegrationProvider (depends on useAuth)
                      └─ MarketingProvider (depends on useOrg + useAuth)
                          └─ ProjectProvider (depends on useMarketing)
                              └─ NotificationProvider (independent — localStorage)
                                  └─ ToastProvider (independent)
                                      └─ <Outlet /> (rendered routes)
```

### 4. Representative User Action Flows

**Flow A: Creating a Campaign (Wizard)**

```
User clicks "New Campaign" in Campaigns.jsx
  → navigates to /marketing/campaigns/new (NewCampaign)
  → calls marketing.startNewDraft(projectId) from useMarketing()
    → useWizard.startNewDraft() inserts into campaign_drafts table
    → sets activeDraft state
  → User progresses through 5 steps:
    Step 1 (StepBusinessInfo): updates draft_data in campaign_drafts
    Step 2 (StepAIAnalysis): AI analysis (stub — marks analysisDone: true)
    Step 3 (StepAdCreation): ad creative + media, checks useSubscription credits
    Step 4 (StepPlatformBudget): budget allocation across platforms
    Step 5 (StepReviewLaunch): validates integrations via campaignGuard
  → User clicks "Launch"
    → useWizard.launchCampaign() calls launch_campaign RPC
    → RPC creates campaign row, deletes draft, returns campaign ID
    → refetchCampaigns() fires → campaigns state updated
  → User redirected to Campaigns list
```

**Flow B: Connecting Meta Integration**

```
User visits /settings/integrations (MarketingSettingsIntegrations)
  → sees platform list, clicks "Connect" on Meta
  → navigates to /settings/integrations/meta (MetaIntegration)
  → clicks connect button
    → calls integration.connectIntegration('meta') from useIntegrations()
    → optimistic update: sets meta.connected = true in local state
    → supabase.from('integrations').upsert({platform: 'meta', status: 'connected'})
    → on error: rollback via fetchIntegrations()
  → Meta card shows "Connected" status
```

**Flow C: Purchasing a Subscription from Product Page**

```
User visits /products/marketing (MarketingProduct)
  → ProductCTA component renders "Add to Cart" button
  → clicks button → calls useCart().addProductToCart({id:'marketing', price:5999, type:'subscription'})
  → MiniCartDrawer opens with item
  → User navigates to /cart (CartPage)
  → clicks "Complete Purchase"
    → PurchaseSuccess page calls useSubscription().activateSubscription(item)
    → supabase.from('subscriptions').upsert({module:'marketing', status:'active'})
    → If marketing: calls add_credit RPC for base credits (24 credits)
    → refetch all → subscriptions map updated
  → User redirected to /marketing with full access
```

### 5. Analytics Data Flow

```
MarketingDashboard mounts
  → wraps itself in <AnalyticsProvider> (NOT from App.jsx)
  → reads timeRange, channelFilter, selectedProjectId from useAnalytics()
  → fetches campaigns via useMarketing()
  → Renders dashboard sections:
    - RevenueAnalytics calls analyticsCalculations (CTR, CPC, ROAS, etc.)
    - Chart components (recharts) render with campaign data
    - usePreferences().formatCurrency() formats all monetary values
    - KPIs are computed client-side from campaign objects
    ⚠ No dedicated Supabase analytics/metrics table — all computed from campaigns data
```

---

## SECTION 3 — Component & Module Roles

### `src/config/`

- **aiPrompt.js** — System prompt for SalesPal AI chatbot; defines recommendation logic, pricing source of truth, and conversation style rules
- **products.js** — Product catalog constant mapping module IDs to names, prices, and types (subscription/bundle)

### `src/data/`

- **billing.js** — Billing page data: PLANS array with icons, pricing, features; TOP_UPS array with credit packs; FEATURES array with add-ons
- **homepageData.js** — Homepage content data (section text, testimonials, stats)

### `src/styles/`

- **theme.js** — Design token constants (colors, gradients, effects, fonts). **Not imported by CSS** — only used in JS components that need programmatic style values

### `src/components/ui/` — **Shared UI Primitives** (12 files)

All 12 files are generic, reusable atoms:

- **Button.jsx**, **AnimatedButton.jsx** — Button components with variants
- **Card.jsx** — Card container
- **Badge.jsx** — Status/label badge
- **Input.jsx**, **Select.jsx**, **Textarea.jsx**, **Dropdown.jsx** — Form inputs
- **Modal.jsx**, **ConfirmationModal.jsx** — Dialog overlays
- **Toast.jsx** — Toast notification system (ToastProvider + useToast)
- **CurrencyIcon.jsx** — Currency symbol renderer using usePreferences

### Identified Patterns

**God Files (high complexity, many responsibilities):**

- `MarketingDashboard.jsx` (21KB, 500+ lines) — renders KPIs, charts, campaign stats, AI insights, handles analytics filters. Should be broken into smaller section components.
- `PreferencesContext.jsx` (11KB) — manages language, timezone, AND currency. Contains all supported language/timezone/currency constants inline instead of in separate data files.
- `NotificationContext.jsx` (10KB) — manages notifications, preferences, deep-merge logic, localStorage persistence, channel constants all in one file.

**Dead Code Candidates:**

- `src/utils/storage.js` — explicitly marked as deprecated, functions are no-ops
- `src/App.css` — contains default Vite scaffolding CSS (#root max-width, logo-spin animation) that conflicts with the actual app layout
- `src/pages/marketing/Settings.jsx` — legacy settings page, router redirects `/marketing/settings/*` to `/settings`
- `src/pages/marketing/Social.jsx` — legacy social page that may conflict with the social/ subdirectory routes
- `src/components/auth/ModuleAccessGuard.jsx` — potentially replaced by `ModuleAccessWrapper.jsx`

**Thin Wrappers:**

- `src/context/ProjectContext.jsx` — thin selector over MarketingContext.projects
- `src/utils/useTranslation.js` — 17 lines wrapping `i18n.t()` with current language

---

## SECTION 4 — Entry Points & Execution Order

### 1. Vite Entry

```
index.html
  └─ <script type="module" src="/src/main.jsx">
      └─ main.jsx
          └─ createRoot(#root).render(
              <StrictMode>
                <RouterProvider router={router} />
              </StrictMode>
            )
```

### 2. Provider Wrapping Order (9 levels deep)

```
1. PreferencesProvider    ← localStorage (language/timezone/currency)
2. AuthProvider           ← Supabase auth (session/user)
3. OrgProvider            ← Supabase org_members (depends on AuthProvider)
4. SubscriptionProvider   ← Supabase subscriptions (depends on Auth + Org)
5. CartProvider           ← localStorage cart (depends on SubscriptionProvider)
6. IntegrationProvider    ← Supabase integrations (depends on AuthProvider)
7. MarketingProvider      ← Supabase campaigns/social/projects (depends on Auth + Org)
8. ProjectProvider        ← Thin wrapper over MarketingProvider
9. NotificationProvider   ← localStorage notifications
10. ToastProvider         ← In-app toast system
```

### 3. Router Structure

| Path                                          | Component                      | Auth      | Access Control                   |
| --------------------------------------------- | ------------------------------ | --------- | -------------------------------- |
| `/`                                           | Home                           | Public    | —                                |
| `/contact`                                    | ContactPage                    | Public    | —                                |
| `/products/marketing`                         | MarketingProduct               | Public    | —                                |
| `/products/sales`                             | SalesProduct                   | Public    | —                                |
| `/products/post-sale`                         | PostSaleProduct                | Public    | —                                |
| `/products/support`                           | SupportProduct                 | Public    | —                                |
| `/products/salespal-360`                      | SalesPal360Product             | Public    | —                                |
| `/connect/:platformId`                        | ConnectPlatform                | Public    | —                                |
| `/cart`                                       | CartPage                       | Protected | ProtectedRoute                   |
| `/purchase-success`                           | PurchaseSuccess                | Protected | ProtectedRoute                   |
| `/marketing`                                  | MarketingDashboard             | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/campaigns`                        | Campaigns                      | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/campaigns/new`                    | NewCampaign                    | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/campaigns/:id`                    | CampaignDetails                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects`                         | Projects                       | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects/new`                     | CreateProject                  | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects/:id`                     | ProjectDetails                 | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects/:id/campaigns/new`       | NewCampaign                    | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects/:id/campaigns/:cId`      | CampaignDetails                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects/:id/campaigns/:cId/edit` | EditCampaign                   | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/social`                           | SocialLayout (children)        | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/social/create`                    | SocialCreate                   | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/social/drafts`                    | SocialList(drafts)             | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/social/scheduled`                 | SocialList(scheduled)          | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/social/published`                 | SocialList(published)          | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/social/analytics`                 | SocialAnalytics                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/social/posts/:id`                 | SocialPostDetails              | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/photos`                           | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/videos`                           | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/calls`                            | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/whatsapp`                         | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/insights/:kpiType`                | MarketingKPIDrilldown          | Protected | ModuleAccessWrapper("marketing") |
| `/sales`                                      | PlaceholderPage                | Protected | ModuleAccessWrapper("sales")     |
| `/post-sales`                                 | PlaceholderPage                | Protected | ModuleAccessWrapper("postSale")  |
| `/support`                                    | PlaceholderPage                | Protected | ModuleAccessWrapper("support")   |
| `/subscription`                               | SubscriptionPage               | Protected | —                                |
| `/profile`                                    | ProfilePage                    | Protected | —                                |
| `/notifications`                              | NotificationCenter             | Protected | —                                |
| `/settings` → `/settings/integrations`        | MarketingSettingsIntegrations  | Protected | —                                |
| `/settings/integrations/meta`                 | MetaIntegration                | Protected | —                                |
| `/settings/integrations/linkedin`             | MetaIntegration                | Protected | —                                |
| `/settings/defaults`                          | MarketingSettingsDefaults      | Protected | —                                |
| `/settings/tracking`                          | MarketingSettingsTracking      | Protected | —                                |
| `/settings/notifications`                     | MarketingSettingsNotifications | Protected | —                                |
| `/projects`                                   | ProjectsHub                    | Protected | —                                |
| `/console/dashboard`                          | Dashboard                      | Protected | ProjectLayout guard              |
| `/console/marketing`                          | Marketing                      | Protected | ProjectLayout guard              |
| `/console/sales`                              | Sales                          | Protected | ProjectLayout guard              |
| `/console/support`                            | Support                        | Protected | ProjectLayout guard              |

### 4. Lazy Loading

**No lazy loading is implemented.** All route components are eagerly imported at the top of `router.jsx`. With 60+ imports, this creates a large initial bundle.

### 5. Initialization Side Effects (on app mount)

1. **AuthProvider**: `supabase.auth.getSession()` → restores session, `onAuthStateChange()` → listens for auth events
2. **OrgProvider**: watches `isAuthenticated` → calls `bootstrap()` → queries `org_members` → if no org found, calls `bootstrap_user_org` RPC to auto-create workspace
3. **SubscriptionProvider**: watches `user` + `orgId` → fetches subscriptions from `subscriptions` table + credits from `marketing_credits`
4. **IntegrationProvider**: watches `user` → fetches all integrations from `integrations` table
5. **CartProvider**: reads `salespal_cart` from localStorage
6. **PreferencesProvider**: reads `salespal_preferences` from localStorage
7. **NotificationProvider**: reads `salespal_notifications_v3` from localStorage
8. **MarketingProvider** → composites:
   - `useProjects`: fetches projects from `projects` table (org-scoped)
   - `useCampaignContext`: fetches campaigns from `campaigns` table (org-scoped)
   - `useSocialContext`: fetches social_posts from `social_posts` table (org-scoped)

---

## SECTION 5 — Architectural Observations & Recommendations

### ✅ What Is Working Well

- **Clean context composition pattern**: `MarketingContext` as a composer layer that delegates to `useCampaignContext`, `useSocialContext`, `useProjects`, and `useWizard` is well-structured and maintains stable API for consumers
- **Optimistic updates**: Social posts use optimistic insert/delete with rollback on failure — good UX pattern
- **Safe navigation utils**: `navigationUtils.js` prevents "undefined" from appearing in URLs — defensive and practical
- **Pure analytics functions**: `analyticsCalculations.js` follows functional programming principles with safe division guards
- **Campaign guard separation**: `campaignGuard.js` isolates integration validation logic from UI code
- **RLS-aware multi-tenancy**: Use of `org_id` scoping across all Supabase queries is consistent
- **Currency abstraction**: `PreferencesContext` provides a single `formatCurrency()` function that handles conversion from INR base, used across 40+ files

### ⚠ What Is Fragile or Inconsistent

- **`AnalyticsContext` is not in the provider tree**: It's imported by `MarketingDashboard` and `MarketingKPIDrilldown` but never mounted in `App.jsx`. Consumers must wrap themselves in `<AnalyticsProvider>`, which means the context state is not shared across route navigations
- **`App.css` conflicts with actual layout**: Default Vite scaffold CSS (`#root { max-width: 1280px; padding: 2rem; text-align: center; }`) actively constrains the app and will cause layout issues if not overridden by Tailwind
- **Inconsistent product ID naming**: `commerce.config.js` uses `postSale`, `config/products.js` uses `post-sales`, `data/billing.js` uses `postsale`, router uses `post-sales`. This creates confusion and potential mismatches in subscription activation
- **Mixed camelCase/snake_case in campaign data**: `CampaignContext` has dual-key mapping (`dailyBudget` AND `daily_budget`) — fragile and indicates missing normalization layer
- **No error boundaries**: No React error boundaries found anywhere in the component tree
- **Notification context is localStorage-only**: Despite TODO comments about Supabase Realtime, notifications have no server persistence, meaning data is lost on cache clear

### 🔗 Where Coupling Is Too Tight

- **`MarketingDashboard.jsx` (21KB)** knows about campaigns, projects, analytics, credits, AI insights, and integrations — it's a god component. Should be decomposed into separate dashboard section components
- **`PreferencesContext`** contains all supported languages, timezones, and currencies inline. These 200+ lines of static data should be in separate data files under `src/data/`
- **`router.jsx`** eagerly imports 60+ components with no code-splitting — the entire application is in a single bundle
- **Product pages** (`MarketingProduct`, `SalesProduct`, etc.) are nearly identical compositions of Hero + Features + Comparison + TargetAudience + CTA. Should use a data-driven approach with a single `ProductPage` component

### 🧱 Where Abstraction Is Missing

- **No centralized API/service layer**: Every context directly calls `supabase.from().select()`. A service layer (e.g., `campaignService.js`) would reduce duplication and make it easier to add caching, error handling, or switch backends
- **No shared form validation**: Campaign wizard steps, project creation, and profile editing all have inline validation. A shared validation utility or hook would reduce duplication
- **No data normalization**: camelCase ↔ snake_case conversion is done ad-hoc in each context. A shared `normalizeRow` / `denormalizeRow` utility would eliminate the dual-key patterns in CampaignContext
- **Repeated product page structure**: 5 product landing pages follow identical patterns but with duplicated code. Should be a single parametric component

### 📛 Naming/Structure Inconsistencies

- `src/context/CampaignContext.jsx` exports a **hook** (`useCampaignContext`), not a Context — filename is misleading
- `src/context/SocialContext.jsx` same issue — exports `useSocialContext` hook, not a context provider
- `src/utils/useTranslation.js` is a **hook** placed in `utils/` instead of `hooks/`
- `src/pages/marketing/social/` vs. `src/pages/marketing/Social.jsx` — both exist, creating confusion about which is the actual social module
- `src/commerce/` is a top-level directory alongside `src/context/` — inconsistent with the pattern of keeping state management together
- `src/pages/marketing/components/` has 19 files that are specific to the marketing module pages — these are not reusable components and should be co-located with their pages or in a `marketing/_components/` directory

### 📈 Scalability Concerns

1. **No lazy loading**: All 155+ files are in a single bundle. As modules like Sales and Support are built out, initial load time will degrade significantly
2. **Provider nesting depth (9 levels)**: Adding more contexts will make the tree unwieldy. Consider using a state management library (Zustand/Jotai) or context composition patterns
3. **Client-side analytics computation**: All metrics are computed from raw campaign objects in the browser. As campaign volume grows, this will become slow — should be computed server-side or via Supabase views/functions
4. **No pagination**: `fetchCampaigns()`, `fetchSocialPosts()`, and `fetchProjects()` all call `.select('*')` without `.limit()` — will degrade as data grows
5. **localStorage for notifications, cart, preferences**: These don't sync across devices or tabs. Should migrate to Supabase-backed storage
6. **Single Supabase client instance**: `src/lib/supabase.js` hardcodes URL and anon key directly in source code — these should be environment variables

---

## Quick-Reference Table

| File                       | Directory                         | Type      | Role (5 words max)                   |
| -------------------------- | --------------------------------- | --------- | ------------------------------------ |
| `index.html`               | `/`                               | config    | Vite HTML entry point                |
| `package.json`             | `/`                               | config    | Dependency manifest                  |
| `vite.config.js`           | `/`                               | config    | Vite + React + Tailwind              |
| `eslint.config.js`         | `/`                               | config    | ESLint flat config                   |
| `vercel.json`              | `/`                               | config    | SPA rewrite rules                    |
| `main.jsx`                 | `src/`                            | entry     | React root + RouterProvider          |
| `App.css`                  | `src/`                            | style     | Default Vite scaffolding (dead)      |
| `index.css`                | `src/`                            | style     | Tailwind theme tokens + animations   |
| `App.jsx`                  | `src/app/`                        | entry     | Provider tree + Outlet               |
| `router.jsx`               | `src/app/`                        | config    | Route definitions (~50 routes)       |
| `supabase.js`              | `src/lib/`                        | config    | Supabase client singleton            |
| `AuthContext.jsx`          | `src/context/`                    | context   | Auth session management              |
| `OrgContext.jsx`           | `src/context/`                    | context   | Organization membership bootstrap    |
| `MarketingContext.jsx`     | `src/context/`                    | context   | Marketing composer layer             |
| `CampaignContext.jsx`      | `src/context/`                    | hook      | Campaign CRUD + AI                   |
| `SocialContext.jsx`        | `src/context/`                    | hook      | Social posts CRUD optimistic         |
| `IntegrationContext.jsx`   | `src/context/`                    | context   | Platform integration state           |
| `NotificationContext.jsx`  | `src/context/`                    | context   | Notification management localStorage |
| `PreferencesContext.jsx`   | `src/context/`                    | context   | i18n currency timezone prefs         |
| `ProjectContext.jsx`       | `src/context/`                    | context   | Thin selector over Marketing         |
| `AnalyticsContext.jsx`     | `src/context/`                    | context   | Analytics filter state               |
| `SubscriptionContext.jsx`  | `src/commerce/`                   | context   | Subscription + credit management     |
| `CartContext.jsx`          | `src/commerce/`                   | context   | Shopping cart localStorage           |
| `commerce.config.js`       | `src/commerce/`                   | config    | Module pricing constants             |
| `useProjects.js`           | `src/hooks/`                      | hook      | Projects CRUD Supabase               |
| `useWizard.js`             | `src/hooks/`                      | hook      | Campaign wizard state machine        |
| `useReducedMotion.js`      | `src/hooks/`                      | hook      | Reduced motion detection             |
| `useScrollReveal.js`       | `src/hooks/`                      | hook      | Scroll IntersectionObserver reveal   |
| `analyticsCalculations.js` | `src/utils/`                      | util      | Pure metric calculators              |
| `campaignGuard.js`         | `src/utils/`                      | util      | Integration validation guard         |
| `formatCurrency.js`        | `src/utils/`                      | util      | Static currency formatter            |
| `i18n.js`                  | `src/utils/`                      | util      | Translation dictionary (9 langs)     |
| `navigationUtils.js`       | `src/utils/`                      | util      | Safe route URL builders              |
| `storage.js`               | `src/utils/`                      | util      | Deprecated no-op stubs               |
| `useTranslation.js`        | `src/utils/`                      | hook      | Translation React hook               |
| `theme.js`                 | `src/styles/`                     | config    | Design token constants               |
| `aiPrompt.js`              | `src/config/`                     | config    | AI chatbot system prompt             |
| `products.js`              | `src/config/`                     | config    | Product catalog constants            |
| `billing.js`               | `src/data/`                       | data      | Plans + top-ups + add-ons            |
| `homepageData.js`          | `src/data/`                       | data      | Homepage section content             |
| `marketingNav.js`          | `src/navigation/`                 | config    | Marketing sidebar nav items          |
| `sidebarConfig.js`         | `src/navigation/`                 | config    | Console sidebar nav items            |
| `MainLayout.jsx`           | `src/layouts/`                    | layout    | Public pages Navbar + Footer         |
| `MarketingLayout.jsx`      | `src/layouts/`                    | layout    | Authenticated marketing shell        |
| `ProjectLayout.jsx`        | `src/layouts/`                    | layout    | Project console dark shell           |
| `AppLayout.jsx`            | `src/components/layout/`          | layout    | Authenticated app shell              |
| `Navbar.jsx`               | `src/components/layout/`          | component | Public navigation bar                |
| `Footer.jsx`               | `src/components/layout/`          | component | Site footer                          |
| `NavbarUserMenu.jsx`       | `src/components/layout/`          | component | Navbar user dropdown                 |
| `SidebarUserMenu.jsx`      | `src/components/layout/`          | component | Sidebar user dropdown                |
| `Sidebar.jsx`              | `src/components/layout/`          | component | Project console sidebar              |
| `SectionWrapper.jsx`       | `src/components/layout/`          | component | Reusable section container           |
| `AuthModal.jsx`            | `src/components/auth/`            | component | Sign-in/up modal                     |
| `ProtectedRoute.jsx`       | `src/components/auth/`            | component | Auth route guard                     |
| `ModuleAccessGuard.jsx`    | `src/components/auth/`            | component | Module access guard (legacy)         |
| `ModuleAccessWrapper.jsx`  | `src/components/access/`          | component | Subscription access gate             |
| `Button.jsx`               | `src/components/ui/`              | ui        | Base button component                |
| `AnimatedButton.jsx`       | `src/components/ui/`              | ui        | Animated button variant              |
| `Card.jsx`                 | `src/components/ui/`              | ui        | Card container                       |
| `Badge.jsx`                | `src/components/ui/`              | ui        | Status label badge                   |
| `Input.jsx`                | `src/components/ui/`              | ui        | Form text input                      |
| `Select.jsx`               | `src/components/ui/`              | ui        | Form select dropdown                 |
| `Textarea.jsx`             | `src/components/ui/`              | ui        | Form textarea                        |
| `Dropdown.jsx`             | `src/components/ui/`              | ui        | Generic dropdown                     |
| `Modal.jsx`                | `src/components/ui/`              | ui        | Dialog modal overlay                 |
| `ConfirmationModal.jsx`    | `src/components/ui/`              | ui        | Confirm action modal                 |
| `Toast.jsx`                | `src/components/ui/`              | ui        | Toast notification system            |
| `CurrencyIcon.jsx`         | `src/components/ui/`              | ui        | Currency symbol renderer             |
| `FadeInUp.jsx`             | `src/components/animations/`      | component | Fade-in-up animation wrapper         |
| `FloatingElement.jsx`      | `src/components/animations/`      | component | Floating animation                   |
| `ScrollReveal.jsx`         | `src/components/animations/`      | component | Scroll-triggered reveal              |
| `StaggerContainer.jsx`     | `src/components/animations/`      | component | Staggered children animation         |
| `MiniCartDrawer.jsx`       | `src/components/cart/`            | component | Cart slide-over drawer               |
| `TopUpDrawer.jsx`          | `src/components/credits/`         | component | Credit top-up drawer                 |
| `NotificationBell.jsx`     | `src/components/notifications/`   | component | Notification bell dropdown           |
| `GlobalCreditDisplay.jsx`  | `src/components/`                 | component | Credit balance display bar           |
| `ProjectSwitcher.jsx`      | `src/components/`                 | component | Project picker dropdown              |
| `IntegrationAlert.jsx`     | `src/components/`                 | component | Integration warning banner           |
| `ScrollToTop.jsx`          | `src/components/common/`          | component | Auto scroll-to-top on nav            |
| `PlanCard.jsx`             | `src/components/subscription/`    | component | Subscription plan card               |
| `ActionModals.jsx`         | `src/components/subscription/`    | component | Subscription action modals           |
| `UsageProgress.jsx`        | `src/components/subscription/`    | component | Credit usage progress bars           |
| 25 product components      | `src/components/products/`        | component | Product landing page sections        |
| `SignIn.jsx`               | `src/pages/auth/`                 | page      | Login/signup page                    |
| `ConnectPlatform.jsx`      | `src/pages/auth/`                 | page      | OAuth callback handler               |
| `Home.jsx`                 | `src/pages/home/`                 | page      | Landing page composer                |
| 11 home sections           | `src/pages/home/sections/`        | page      | Landing page sections                |
| `ContactPage.jsx`          | `src/pages/contact/`              | page      | Contact form                         |
| `CartPage.jsx`             | `src/pages/cart/`                 | page      | Full cart view                       |
| `PurchaseSuccess.jsx`      | `src/pages/purchase/`             | page      | Purchase confirmation                |
| `SubscriptionPage.jsx`     | `src/pages/subscription/`         | page      | Subscription management              |
| `NotificationCenter.jsx`   | `src/pages/notifications/`        | page      | Notification center                  |
| `ProfilePage.jsx`          | `src/pages/profile/`              | page      | User profile + tabs                  |
| 5 profile tabs             | `src/pages/profile/tabs/`         | page      | Profile sub-pages                    |
| 5 product pages            | `src/pages/products/`             | page      | Product landing pages                |
| `ProjectsHub.jsx`          | `src/pages/projects/`             | page      | Project list + selection             |
| `ProjectCard.jsx`          | `src/pages/projects/`             | component | Project display card                 |
| `CreateProjectFlow.jsx`    | `src/pages/projects/`             | page      | Project creation flow                |
| 11 wizard files            | `src/pages/projects/wizard/`      | page      | Project creation wizard steps        |
| `Dashboard.jsx`            | `src/pages/dashboard/`            | page      | Console overview dashboard           |
| `ModulePage.jsx`           | `src/pages/dashboard/`            | page      | Module page template                 |
| 3 module pages             | `src/pages/dashboard/modules/`    | page      | Console module views                 |
| `MarketingDashboard.jsx`   | `src/pages/marketing/`            | page      | Marketing main dashboard (GOD)       |
| `Campaigns.jsx`            | `src/pages/marketing/`            | page      | Campaign list                        |
| `Social.jsx`               | `src/pages/marketing/`            | page      | Legacy social redirect               |
| `PlaceholderPage.jsx`      | `src/pages/marketing/`            | page      | Generic stub page                    |
| `Settings.jsx`             | `src/pages/marketing/`            | page      | Legacy settings (dead)               |
| 37 campaign files          | `src/pages/marketing/campaigns/`  | page      | Campaign wizard + details            |
| 30 analytics files         | `src/pages/marketing/analytics/`  | page      | Analytics sections + charts          |
| 6 social files             | `src/pages/marketing/social/`     | page      | Social module pages                  |
| 3 project files            | `src/pages/marketing/projects/`   | page      | Marketing projects CRUD              |
| 6 settings files           | `src/pages/marketing/settings/`   | page      | Settings + integrations              |
| 1 analysis file            | `src/pages/marketing/analysis/`   | page      | KPI drilldown                        |
| 19 component files         | `src/pages/marketing/components/` | component | Marketing-specific sub-components    |
