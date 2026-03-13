# Sales-Pal Codebase Analysis — Comprehensive Context Document

**Last Updated: 2026-03-13** — Major revision: Auth backend migrated from Supabase to Express REST API; Sales, Post-Sales, and Support modules fully implemented (no longer stubs); 2 new context providers; 12-level provider tree; `src/lib/api.js` added as REST client.

## Executive Summary

**Sales-Pal** is a multi-module SaaS platform built with **React 19 + Vite 7 + Tailwind CSS 4** on a **dual-backend architecture**: marketing/auth data flows through a custom **Express REST API** (Cloud Run: `https://salespal-backend-990900909753.us-central1.run.app`) while Supabase is still used for campaigns, social posts, projects, integrations, and subscriptions. The codebase (~195+ files, ~300+ `src/` children) has grown from a marketing-first platform with stubs into a **four-module platform** where Sales, Post-Sales, and Support are now fully implemented. The application uses **12 React Context providers** (nested 12 levels deep in `App.jsx`), a `createBrowserRouter` routing configuration with ~70+ routes, and a commerce layer for subscription + credit management. The design system uses a dark theme (`#0D1F2D` primary, `#76F7C5` secondary accent, blue `#1D7CFF` accent), Inter font, and `framer-motion` for animations.

Key architectural changes since last revision:
- **Auth rewritten**: `AuthContext` now calls `POST /auth/login`, `POST /auth/register`, `POST /auth/google`, `POST /auth/logout` via `src/lib/api.js`. JWT tokens stored in localStorage (`sp_access_token`, `sp_refresh_token`).
- **Sales module**: Backed by Express REST API (`GET/POST /sales`). `SalesContext` fetches deals from backend, maps to lead UI model with rich mock fallback.
- **Post-Sales module**: Fully localStorage-backed (`PostSalesContext`). No backend persistence yet.
- **Support module**: Mock-data-only (`mockSupportData.js`). UI complete, no live data.

---

## SECTION 1 — File Dependency Map

### `src/lib/`

```
src/lib/supabase.js
  → imports: @supabase/supabase-js
  → imported by: OrgContext, CampaignContext, SocialContext,
                  IntegrationContext, MarketingContext, SubscriptionContext, useProjects, useWizard
  → role: CORE (8 dependents) — single Supabase client instance
  ⚠ No longer imported by AuthContext (migrated to api.js)

src/lib/api.js   [NEW FILE]
  → imports: (none — uses native fetch)
  → imported by: AuthContext, SalesContext
  → role: CORE — JWT REST client for Express backend; handles token storage,
                  auto-refresh on 401, error normalization
  → exports: api (default), getAccessToken, getRefreshToken, setTokens, clearTokens
  → target: VITE_API_URL || https://salespal-backend-990900909753.us-central1.run.app
```

---

### `src/context/`

```
src/context/AuthContext.jsx   [MODIFIED — complete rewrite]
  → imports: react, src/lib/api (NOT supabase anymore)
  → imported by: App.jsx, OrgContext, CampaignContext, SocialContext,
                  IntegrationContext, MarketingContext, SubscriptionContext,
                  ProtectedRoute, AuthModal, Navbar, NavbarUserMenu,
                  SidebarUserMenu, ProjectLayout, SignIn, ProjectsHub,
                  ProfileTab, MarketingDashboard, MetaIntegration,
                  NewCampaign, PurchaseSuccess, CartPage,
                  AIStrategicInsights, AcquisitionIntelligence, SalesContext
  → role: CORE (23+ dependents) — REST-based auth; login/signup/logout/loginWithGoogle
  → shape: { isAuthenticated, user, session, login, loginWithGoogle, signup, logout, loading }
  → session is now { access_token: string } (not a Supabase session object)

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

src/context/SalesContext.jsx   [NEW FILE]
  → imports: react, src/lib/api, AuthContext
  → imported by: App.jsx, SalesDashboard, SalesLeads, SalesLeadWorkspace,
                  SalesCallLogs, SalesWhatsAppHistory, SalesPipeline, SalesActivity
  → role: CORE (8 dependents) — lead/deal management via REST API with mock fallback
  → shape: { leads, loading, addLead, updateLeadStatus, addActionToLead, assignLead }
  → data model: maps backend `deals` → frontend `lead` model with timeline/communications/followups

src/context/PostSalesContext.jsx   [NEW FILE]
  → imports: react (localStorage-only, no backend)
  → imported by: App.jsx, PostSalesDashboard, PostSalesCustomers, CustomerDetails,
                  AddCustomer, Onboarding, Documents, Payments, PostSalesAutomations, Analytics
  → role: CORE (10 dependents) — customer lifecycle management (localStorage-only)
  → shape: { customers, automations, payments, followUps, documents, onboardingFlows,
             addCustomer, updateCustomer, deleteCustomer, getCustomer,
             toggleAutomation, addAutomation, updateAutomation, getCustomerAutomations,
             addPayment, addFollowUp }
  → localStorage keys: salespal_postsales_customers, _automations, _payments,
                        _followups, _documents, _onboarding

src/context/PreferencesContext.jsx
  → imports: react (localStorage-only, no Supabase)
  → imported by: 40+ files (unchanged)
  → role: CORE — i18n language, timezone, currency with formatCurrency

src/context/ProjectContext.jsx
  → imports: react, MarketingContext
  → imported by: App.jsx, ProjectLayout, Sidebar, ProjectsHub, CreateProjectFlow, wizard/CreateProject
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
  → imported by: App.jsx, MarketingLayout, SalesLayout, CartContext, CartPage,
                  PricingSection, PlanCard, ActionModals, GlobalCreditDisplay,
                  TopUpDrawer, ModuleAccessWrapper, ModuleAccessGuard,
                  StepAdCreation, ImageAdSection, VideoAdSection, SubscriptionPage
  → role: CORE (17 dependents) — subscription activation/deactivation, credit consume/add

src/commerce/CartContext.jsx
  → imports: react, SubscriptionContext, commerce.config
  → imported by: App.jsx, MiniCartDrawer, Navbar, CartPage, PricingSection, TopUpDrawer
  → role: STANDARD (6 dependents) — shopping cart with localStorage persistence

src/commerce/commerce.config.js
  → imports: (none)
  → imported by: CartContext, SubscriptionContext
  → role: CORE — module pricing config (marketing: ₹5,999; sales/postSale/support: ₹9,999; salespal360: ₹29,999)
```

---

### `src/hooks/`

```
src/hooks/useProjects.js     → INTERNAL — Supabase projects CRUD
src/hooks/useWizard.js       → INTERNAL — campaign draft wizard state machine (5-step)
src/hooks/useReducedMotion.js → LEAF — detects prefers-reduced-motion
src/hooks/useScrollReveal.js  → LEAF — IntersectionObserver-based scroll reveal
```

---

### `src/utils/`

```
src/utils/analyticsCalculations.js → LEAF — pure metric calculators (CTR, CPC, CPM, ROAS, etc.)
src/utils/campaignGuard.js          → LEAF — validates integration requirements before campaign launch
src/utils/formatCurrency.js         → STANDARD — static currency formatter (INR-centric)
src/utils/i18n.js                   → STANDARD — 39KB translation dictionary (9 languages)
src/utils/navigationUtils.js        → LEAF — safe route generators
src/utils/storage.js                → DEAD CODE CANDIDATE — deprecated no-op stubs
src/utils/useTranslation.js         → LEAF — React hook wrapping i18n.t()
```

---

### `src/navigation/`

```
src/navigation/marketingNav.js  → LEAF — marketing sidebar nav item definitions
src/navigation/sidebarConfig.js → LEAF — console sidebar nav item definitions
```

---

### `src/layouts/`

```
src/layouts/MainLayout.jsx        → STANDARD — public pages shell (Navbar + Footer)
src/layouts/MarketingLayout.jsx   → STANDARD — marketing module shell
src/layouts/ProjectLayout.jsx     → STANDARD — project console shell (Sidebar + dark header)

src/layouts/SalesLayout.jsx   [NEW FILE]
  → imports: react, react-router-dom, SubscriptionContext, ProjectSwitcher,
             GlobalCreditDisplay, TopUpDrawer, NotificationBell
  → role: STANDARD — sales module shell; mirrors MarketingLayout pattern

src/layouts/PostSalesLayout.jsx   [NEW FILE]
  → role: STANDARD — post-sales module shell
```

---

### `src/pages/` (grouped by module)

```
── auth/
   SignIn.jsx        → login/signup page, uses useAuth (now calls REST API)
   ConnectPlatform.jsx → OAuth landing, uses useIntegrations

── home/
   Home.jsx + 11 section components (unchanged)

── contact/ → ContactPage.jsx (unchanged)
── cart/    → CartPage.jsx (unchanged)
── purchase/ → PurchaseSuccess.jsx (unchanged)
── subscription/ → SubscriptionPage.jsx (unchanged)
── notifications/ → NotificationCenter.jsx (unchanged)
── profile/ → ProfilePage.jsx + tabs (unchanged)
── products/ → 5 product landing pages (unchanged)

── projects/
   ProjectsHub.jsx, ProjectCard.jsx, CreateProjectFlow.jsx
   wizard/ → 11 wizard step files (unchanged)

── dashboard/
   Dashboard.jsx, ModulePage.jsx
   modules/Marketing.jsx, Sales.jsx, Support.jsx (unchanged)

── marketing/ (107 files — unchanged structure)
   MarketingDashboard.jsx (21KB GOD FILE), Campaigns.jsx, Social.jsx,
   PlaceholderPage.jsx, Settings.jsx
   campaigns/, analytics/, social/, projects/, settings/, analysis/, components/

── sales/ (8 files)   [NEW MODULE]
   SalesDashboard.jsx (39KB — GOD FILE candidate)
   SalesLeads.jsx (31KB)
   SalesLeadWorkspace.jsx (53KB — LARGEST FILE in codebase)
   SalesCallLogs.jsx (20KB)
   SalesWhatsAppHistory.jsx (10KB)
   SalesPipeline.jsx (7KB)
   SalesSettings.jsx (35KB — GOD FILE candidate)
   SalesActivity.jsx (4KB)

── post-sales/ (11 files + 2 subdirs)   [NEW MODULE]
   PostSalesDashboard.jsx   → uses usePostSales()
   PostSalesCustomers.jsx (21KB) → full customer list with search/filter
   PostSalesAutomations.jsx → automation rules manager
   CustomerDetails.jsx      → customer detail + timeline
   AddCustomer.jsx          → add customer form
   Customers.jsx            → ⚠ Unverified — may overlap with PostSalesCustomers
   Onboarding.jsx           → onboarding hub
   Documents.jsx            → document management
   Payments.jsx             → payment tracking
   Automations.jsx          → ⚠ Unverified — may overlap with PostSalesAutomations
   Analytics.jsx (9KB)      → post-sales analytics charts
   components/ (9 sub-components):
     CustomerCard, CustomerTimeline, DocumentUploader, ExtractedDetailsView,
     HealthScoreBadge, OnboardingProgress, PaymentReminderCard, PlainTextParser,
     AddCustomerOptionCard
   onboarding/ (6 files):
     OnboardingFlow.jsx + steps: StepWelcome, StepAgreement,
     StepDocumentCollection, StepPaymentSetup, StepActivation

── support/ (6 files)   [NEW MODULE]
   SupportLayout.jsx (2KB) → support module shell with sidebar nav
   SupportDashboard.jsx (12KB) → support overview with mock metrics
   SupportTickets.jsx (12KB) → ticket list with filters
   SupportTicketDetails.jsx (25KB) → ticket detail + reply thread
   SupportAnalytics.jsx (10KB) → support analytics charts
   mockSupportData.js (4KB) → static fixture data

── components/postSales/ (7 shared components)   [NEW]
   AIInsightBanner.jsx, AutomationForm.jsx, AutomationRow.jsx,
   AutomationTable.jsx, CustomerRow.jsx, CustomersTable.jsx, MetricCard.jsx
```

---

### Circular Dependency Analysis

**No true circular imports detected.** Existing coupling observations unchanged:

- `ProjectContext → MarketingContext → useProjects` — thin wrapper inversion still works due to App.jsx nesting order
- `AnalyticsContext` still NOT mounted in App.jsx — must be mounted locally by consumers
- **New**: `AuthContext` → `api.js` → Express backend (no circular issue, but creates external dependency not present in Supabase path)

---

## SECTION 2 — Data Flow

### 1. Authentication Flow

```
index.html → main.jsx → RouterProvider → App.jsx → AuthProvider
  ↓
AuthProvider (mount):
  1. localStorage.getItem('sp_access_token') → if present, call GET /users/me
  2. On success: setUser(data.user), setIsAuthenticated(true)
  3. On failure: clearTokens() → stays unauthenticated
  ↓
Consumer components call useAuth():
  - login(email, password)       → POST /auth/login → setTokens(access, refresh)
  - loginWithGoogle(credential)  → POST /auth/google → setTokens(access, refresh)
  - signup(email, password, name)→ POST /auth/register → returns message (no auto-login)
  - logout()                     → POST /auth/logout → clearTokens()
  ↓
Token management (api.js):
  - Access token sent as Authorization: Bearer <token>
  - On 401: auto-refresh via POST /auth/refresh with refreshToken
  - On refresh failure: clearTokens() + redirect to /login
  ↓
Session propagation:
  - ProtectedRoute checks isAuthenticated + loading
  - OrgProvider watches user changes → bootstraps org membership (still via Supabase)
  - SubscriptionProvider watches user + orgId → fetches subscriptions (still via Supabase)
```

### 2. Supabase Data Flow

| Module        | Supabase Table(s)                          | Context/Hook                          | Key Operations                                     |
| ------------- | ------------------------------------------ | ------------------------------------- | -------------------------------------------------- |
| Auth          | ~~`auth.users`~~ → **Express REST API**    | AuthContext → api.js                  | login, loginWithGoogle, signup, logout, /users/me  |
| Org           | `organizations`, `org_members`             | OrgContext                            | bootstrap_user_org RPC, membership lookup          |
| Projects      | `projects`                                 | useProjects → MarketingContext        | CRUD, archive (soft-delete via status)             |
| Campaigns     | `campaigns`                                | useCampaignContext → MarketingContext | CRUD, filter by project                            |
| Social        | `social_posts`                             | useSocialContext → MarketingContext   | CRUD with optimistic updates                       |
| Wizard        | `campaign_drafts`                          | useWizard → MarketingContext          | draft lifecycle + launch_campaign RPC              |
| Integrations  | `integrations`                             | IntegrationContext                    | connect/disconnect via upsert/delete               |
| Subscriptions | `subscriptions`                            | SubscriptionContext                   | activate/deactivate/pause/resume via upsert/update |
| Credits       | `marketing_credits`, `credit_transactions` | SubscriptionContext                   | consume_credit RPC, add_credit RPC                 |
| **Sales**     | **→ Express REST API** (`/sales`)          | **SalesContext → api.js**             | **GET /sales (fetch deals), POST /sales (create)** |
| **Post-Sales**| **localStorage only**                      | **PostSalesContext**                  | **localStorage CRUD (no backend)**                 |
| **Support**   | **mockSupportData.js only**                | —                                     | **Static mock data (no backend)**                  |

### 3. Context → Component Flow (Updated — 12 levels)

```
1.  PreferencesProvider    ← localStorage (language/timezone/currency)
2.  AuthProvider           ← Express REST API (JWT tokens in localStorage)
3.  OrgProvider            ← Supabase org_members (depends on AuthProvider)
4.  SubscriptionProvider   ← Supabase subscriptions (depends on Auth + Org)
5.  CartProvider           ← localStorage cart (depends on SubscriptionProvider)
6.  IntegrationProvider    ← Supabase integrations (depends on AuthProvider)
7.  SalesProvider          ← Express REST API /sales (depends on AuthContext)   [NEW]
8.  MarketingProvider      ← Supabase campaigns/social/projects (depends on Auth + Org)
9.  ProjectProvider        ← Thin wrapper over MarketingProvider
10. PostSalesProvider      ← localStorage only (no deps required)   [NEW]
11. NotificationProvider   ← localStorage notifications
12. ToastProvider          ← In-app toast system
                               └─ <Outlet /> (rendered routes)
```

### 4. Representative User Action Flows

**Flow A: Creating a Campaign (Wizard)** — unchanged from prior revision.

**Flow B: Connecting Meta Integration** — unchanged from prior revision.

**Flow C: Purchasing a Subscription** — unchanged from prior revision.

**Flow D: Sales Lead Management (NEW)**

```
SalesProvider mounts (user authenticated)
  → fetchLeads() → api.get('/sales') → GET /sales on Express backend
  → Maps deals[] to lead UI model (name, phone, source, status, aiScore, timeline...)
  → On API error: falls back to initialLeads mock array
  ↓
User opens /sales/leads (SalesLeads)
  → reads leads[] from useSales()
  → displays lead cards with AI score badges
  ↓
User opens /sales/leads/:id (SalesLeadWorkspace)
  → finds lead by id from leads[]
  → renders timeline, communications (calls + WhatsApp), followups
  → User logs call: addActionToLead(id, 'call', ...) → updates state in-memory only
  → User sends WhatsApp: addActionToLead(id, 'whatsapp', ...) → appends to comm history
  → User assigns lead: assignLead(id, agentName) → updates state in-memory only
  ⚠ All mutations are in-memory only — no write-back to backend except addLead (POST /sales)
```

**Flow E: Post-Sales Customer Onboarding (NEW)**

```
User opens /post-sales/customers → reads customers[] from usePostSales()
User clicks "Add Customer" → navigates to /post-sales/customers/add (AddCustomer)
  → fills form → addCustomer(data) → saves to localStorage['salespal_postsales_customers']
User opens customer onboarding at /post-sales/onboarding
  → OnboardingFlow component renders 5 steps:
    StepWelcome → StepAgreement → StepDocumentCollection → StepPaymentSetup → StepActivation
  → Each step updates onboardingFlows{} in PostSalesContext → persists to localStorage
```

### 5. Analytics Data Flow — unchanged from prior revision.

### 6. Backend / Database Impact

#### New Tables Required
- `deals` / `leads` table — Sales module currently reads from `/sales` REST endpoint (Express backend). Backend must expose this as its data store. Suggested columns: `id`, `user_id`, `org_id`, `title`, `stage`, `priority`, `value`, `contact_first_name`, `contact_last_name`, `contact_email`, `assigned_to`, `metadata (jsonb)`, `created_at`, `updated_at`
- `customers` table — Post-Sales module is localStorage-only. When backend is built, needs: `id`, `org_id`, `name`, `email`, `phone`, `health_score`, `onboarding_status`, `last_contact`, `created_at`
- `automations` table — Needed for Post-Sales automations backend. Columns: `id`, `org_id`, `customer_id`, `name`, `trigger`, `action`, `active`, `created_at`
- `support_tickets` table — Support module uses mock data. Needs: `id`, `org_id`, `title`, `status`, `priority`, `customer_id`, `messages (jsonb)`, `created_at`, `updated_at`

#### New API Routes Required (Express backend)
- `GET /sales` — fetch deals for authenticated user — consumed by `SalesContext.fetchLeads()`
- `POST /sales` — create new deal — consumed by `SalesContext.addLead()`
- `PUT /sales/:id` — update deal status/details — needed for `updateLeadStatus` write-back
- `GET /users/me` — fetch authenticated user profile — consumed by `AuthContext` on mount
- `POST /auth/login` — email/password login — consumed by `AuthContext.login()`
- `POST /auth/register` — registration — consumed by `AuthContext.signup()`
- `POST /auth/logout` — logout + token invalidation — consumed by `AuthContext.logout()`
- `POST /auth/google` — Google OAuth token exchange — consumed by `AuthContext.loginWithGoogle()`
- `POST /auth/refresh` — access token refresh — consumed by `api.js` auto-refresh logic

#### Modified Tables
- None (Supabase tables unchanged)

#### New RPCs Required
- None (new modules use REST API, not Supabase RPCs)

#### No Backend Changes Required
- `PostSalesContext` — pure localStorage, no backend needed yet
- `SupportLayout`, `SupportDashboard`, `SupportTickets`, `SupportTicketDetails`, `SupportAnalytics` — all use `mockSupportData.js`; no live backend
- All new layout files (`SalesLayout.jsx`, `PostSalesLayout.jsx`) — purely frontend shell

---

## SECTION 3 — Component & Module Roles

### `src/config/` — unchanged
- **aiPrompt.js** — AI chatbot system prompt
- **products.js** — Product catalog constants

### `src/data/` — unchanged
- **billing.js** — Billing plans + top-ups + add-ons
- **homepageData.js** — Homepage content data

### `src/styles/` — unchanged
- **theme.js** — Design token constants (JS-only, not imported by CSS)

### `src/components/ui/` — Shared UI Primitives (12 files, unchanged)

Button, AnimatedButton, Card, Badge, Input, Select, Textarea, Dropdown, Modal, ConfirmationModal, Toast, CurrencyIcon

### `src/components/postSales/` — NEW Shared Components (7 files)

- **AIInsightBanner.jsx** — AI insight banner card for post-sales views
- **AutomationForm.jsx** — Form for creating/editing automations
- **AutomationRow.jsx** — Single automation row with toggle + actions
- **AutomationTable.jsx** — Table shell wrapping AutomationRow list
- **CustomerRow.jsx** — Single customer row for list display
- **CustomersTable.jsx** — Table shell wrapping CustomerRow list
- **MetricCard.jsx** — Reusable KPI metric card

### Identified Patterns

**God Files (high complexity, many responsibilities):**

- `MarketingDashboard.jsx` (21KB, 500+ lines) — **unchanged**
- `SalesLeadWorkspace.jsx` (53KB) — **[NEW GOD FILE]**: renders call logs, WhatsApp history, timeline, follow-up scheduler, AI insights, assignment panel, deal notes — all in a single file. Largest file in the codebase.
- `SalesDashboard.jsx` (39KB) — **[NEW GOD FILE]**: renders KPIs, pipeline summary, lead heatmap, activity feed, AI recommendations
- `SalesSettings.jsx` (35KB) — **[NEW GOD FILE]**: manages AI agent configuration, team rosters, pipeline stages, notification preferences all in one file
- `PreferencesContext.jsx` (11KB) — **unchanged**
- `NotificationContext.jsx` (10KB) — **unchanged**

**Dead Code Candidates:**

- `src/utils/storage.js` — deprecated no-ops (unchanged)
- `src/App.css` — default Vite scaffolding CSS (unchanged)
- `src/pages/marketing/Settings.jsx` — legacy settings redirect (unchanged)
- `src/pages/marketing/Social.jsx` — legacy social redirect (unchanged)
- `src/components/auth/ModuleAccessGuard.jsx` — possibly replaced by ModuleAccessWrapper
- `src/pages/post-sales/Customers.jsx` — may duplicate `PostSalesCustomers.jsx` ⚠ Unverified
- `src/pages/post-sales/Automations.jsx` — may duplicate `PostSalesAutomations.jsx` ⚠ Unverified

**Thin Wrappers:**

- `src/context/ProjectContext.jsx` — thin selector over MarketingContext.projects
- `src/utils/useTranslation.js` — 17 lines wrapping `i18n.t()`

---

## SECTION 4 — Entry Points & Execution Order

### 1. Vite Entry — unchanged

```
index.html → src/main.jsx → createRoot(#root).render(<RouterProvider router={router} />)
```

### 2. Provider Wrapping Order (12 levels deep)

```
1.  PreferencesProvider    ← localStorage
2.  AuthProvider           ← Express REST API (JWT in localStorage)
3.  OrgProvider            ← Supabase org_members
4.  SubscriptionProvider   ← Supabase subscriptions
5.  CartProvider           ← localStorage cart
6.  IntegrationProvider    ← Supabase integrations
7.  SalesProvider          ← Express REST API /sales   [NEW]
8.  MarketingProvider      ← Supabase campaigns/social/projects
9.  ProjectProvider        ← Thin wrapper over MarketingProvider
10. PostSalesProvider      ← localStorage only   [NEW]
11. NotificationProvider   ← localStorage notifications
12. ToastProvider          ← In-app toast system
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
| `/marketing/campaigns/:campaignId`            | CampaignDetails                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects`                         | Projects                       | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects/new`                     | CreateProject                  | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/projects/:projectId`              | ProjectDetails                 | Protected | ModuleAccessWrapper("marketing") |
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
| `/marketing/insights/:kpiType`                | MarketingKPIDrilldown          | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/photos`                           | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/videos`                           | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/calls`                            | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/marketing/whatsapp`                         | PlaceholderPage                | Protected | ModuleAccessWrapper("marketing") |
| `/sales`                                      | SalesDashboard                 | Protected | ModuleAccessWrapper("sales")     |
| `/sales/leads`                                | SalesLeads                     | Protected | ModuleAccessWrapper("sales")     |
| `/sales/leads/:id`                            | SalesLeadWorkspace             | Protected | ModuleAccessWrapper("sales")     |
| `/sales/calls`                                | SalesCallLogs                  | Protected | ModuleAccessWrapper("sales")     |
| `/sales/interactions`                         | SalesCallLogs                  | Protected | ModuleAccessWrapper("sales")     |
| `/sales/whatsapp`                             | SalesWhatsAppHistory           | Protected | ModuleAccessWrapper("sales")     |
| `/sales/settings`                             | SalesSettings                  | Protected | ModuleAccessWrapper("sales")     |
| `/post-sales`                                 | PostSalesDashboard             | Protected | ModuleAccessWrapper("postSale")  |
| `/post-sales/customers`                       | PostSalesCustomers             | Protected | ModuleAccessWrapper("postSale")  |
| `/post-sales/customers/:id`                   | CustomerDetails                | Protected | ModuleAccessWrapper("postSale")  |
| `/post-sales/onboarding`                      | Onboarding                     | Protected | ModuleAccessWrapper("postSale")  |
| `/post-sales/documents`                       | Documents                      | Protected | ModuleAccessWrapper("postSale")  |
| `/post-sales/payments`                        | Payments                       | Protected | ModuleAccessWrapper("postSale")  |
| `/post-sales/automations`                     | PostSalesAutomations           | Protected | ModuleAccessWrapper("postSale")  |
| `/post-sales/analytics`                       | Analytics                      | Protected | ModuleAccessWrapper("postSale")  |
| `/support`                                    | SupportDashboard               | Protected | ModuleAccessWrapper("support")   |
| `/support/tickets`                            | SupportTickets                 | Protected | ModuleAccessWrapper("support")   |
| `/support/tickets/:id`                        | SupportTicketDetails           | Protected | ModuleAccessWrapper("support")   |
| `/support/analytics`                          | SupportAnalytics               | Protected | ModuleAccessWrapper("support")   |
| `/subscription`                               | SubscriptionPage               | Protected | —                                |
| `/profile`                                    | ProfilePage                    | Protected | —                                |
| `/notifications`                              | NotificationCenter             | Protected | —                                |
| `/settings` → `/settings/integrations`        | MarketingSettingsIntegrations  | Protected | —                                |
| `/settings/integrations/meta`                 | MetaIntegration                | Protected | —                                |
| `/settings/integrations/linkedin`             | MetaIntegration                | Protected | —                                |
| `/settings/defaults`                          | MarketingSettingsDefaults      | Protected | —                                |
| `/settings/tracking`                          | MarketingSettingsTracking      | Protected | —                                |
| `/settings/notifications`                     | MarketingSettingsNotifications | Protected | —                                |
| `/settings/sales`                             | SalesSettings                  | Protected | —                                |
| `/projects`                                   | ProjectsHub                    | Protected | —                                |
| `/console/dashboard`                          | Dashboard                      | Protected | ProjectLayout guard              |
| `/console/marketing`                          | Marketing                      | Protected | ProjectLayout guard              |
| `/console/sales`                              | Sales                          | Protected | ProjectLayout guard              |
| `/console/support`                            | Support                        | Protected | ProjectLayout guard              |

### 4. Lazy Loading

**No lazy loading implemented.** All ~80 route components eagerly imported in `router.jsx`.

### 5. Initialization Side Effects (on app mount)

1. **AuthProvider**: `getAccessToken()` from localStorage → if present: `GET /users/me` → restore session; listens for no Supabase events (REST-only)
2. **OrgProvider**: watches `isAuthenticated` → calls `bootstrap()` → queries Supabase `org_members` → if no org: calls `bootstrap_user_org` RPC
3. **SubscriptionProvider**: watches `user` + `orgId` → fetches from `subscriptions` + `marketing_credits` tables (Supabase)
4. **IntegrationProvider**: watches `user` → fetches from `integrations` table (Supabase)
5. **SalesProvider**: watches `user` → calls `GET /sales` (Express REST) → maps deals to leads → falls back to mock data on error **[NEW]**
6. **MarketingProvider** → composites: `useProjects`, `useCampaignContext`, `useSocialContext` (all Supabase)
7. **PostSalesProvider**: reads 6 localStorage keys on mount **[NEW]**
8. **CartProvider**: reads `salespal_cart` from localStorage
9. **PreferencesProvider**: reads `salespal_preferences` from localStorage
10. **NotificationProvider**: reads `salespal_notifications_v3` from localStorage

---

## SECTION 5 — Architectural Observations & Recommendations

### ✅ What Is Working Well

- **Clean context composition pattern**: `MarketingContext` as a composer layer remains well-structured
- **Optimistic updates**: Social posts use optimistic insert/delete with rollback
- **Safe navigation utils**: `navigationUtils.js` prevents "undefined" in URLs
- **Pure analytics functions**: `analyticsCalculations.js` with safe division guards
- **Campaign guard separation**: `campaignGuard.js` isolates integration validation from UI
- **RLS-aware multi-tenancy**: `org_id` scoping consistent across Supabase queries
- **Currency abstraction**: `formatCurrency()` used across 40+ files
- **api.js token auto-refresh**: 401 auto-refresh with single-flight mutex pattern (`isRefreshing` flag prevents parallel refresh calls) — good resilience pattern

### ⚠ What Is Fragile or Inconsistent

- **Dual-backend architecture creates inconsistency**: Auth + Sales use Express REST with JWT in localStorage; Org + Marketing + Subscriptions still use Supabase. A developer must know which system each module uses. Auth state from Express is not validated by Supabase RLS policies.
- **`AnalyticsContext` is not in the provider tree**: Unchanged from prior revision — still must be mounted locally by consumers.
- **`App.css` conflicts with actual layout**: Default Vite scaffold CSS still present.
- **Inconsistent product ID naming**: `postSale` vs `post-sales` vs `postsale` still exists across config files.
- **Mixed camelCase/snake_case in campaign data**: Unchanged — `CampaignContext` still has dual-key mapping.
- **No error boundaries**: No React error boundaries anywhere in the component tree.
- **PostSalesContext is localStorage-only**: Customers, automations, documents, payments are not persisted to any backend — data lost on cache clear.
- **Support module is entirely mock data**: `mockSupportData.js` has no live data path. All support UI is non-functional from a data perspective.
- **SalesContext mutations are in-memory only**: `updateLeadStatus`, `addActionToLead`, `assignLead` update local state but never write to the backend. Only `addLead` calls `POST /sales`.
- **SalesLeadWorkspace.jsx (53KB) is the largest file in the codebase** — a god component with zero abstraction.
- **Possible duplicate pages**: `Customers.jsx` may duplicate `PostSalesCustomers.jsx`; `Automations.jsx` may duplicate `PostSalesAutomations.jsx` — unverified.

### 🔗 Where Coupling Is Too Tight

- **`SalesLeadWorkspace.jsx` (53KB)** manages timeline, call logs, WhatsApp, scheduling, assignment, and notes in a single component — must be decomposed
- **`SalesDashboard.jsx` (39KB)** and **`SalesSettings.jsx` (35KB)** are new god files matching the pattern of `MarketingDashboard.jsx`
- **`MarketingDashboard.jsx` (21KB)** — unchanged god file problem
- **`PreferencesContext`** — 200+ lines of static locale data still inline
- **`router.jsx`** — eagerly imports ~80+ components with no code-splitting

### 🧱 Where Abstraction Is Missing

- **No centralized API/service layer for Sales**: `SalesContext` directly calls `api.get('/sales')` — should be a `salesService.js`
- **No shared form validation**: Unchanged from prior revision
- **No data normalization**: Unchanged — camelCase ↔ snake_case done ad-hoc
- **No backend write-back for Sales mutations**: Lead status updates, call logs, and assignments are in-memory only — fragile data model
- **Post-Sales has no Supabase/API integration**: Entire module needs a backend before it can be production-ready

### 📛 Naming/Structure Inconsistencies

- `src/context/CampaignContext.jsx` exports a **hook** (`useCampaignContext`) — unchanged
- `src/context/SocialContext.jsx` exports a **hook** (`useSocialContext`) — unchanged
- `src/utils/useTranslation.js` is a **hook** placed in `utils/` — unchanged
- `src/pages/post-sales/Customers.jsx` vs `PostSalesCustomers.jsx` — naming collision
- `src/pages/post-sales/Automations.jsx` vs `PostSalesAutomations.jsx` — naming collision
- `src/commerce/` top-level alongside `src/context/` — unchanged inconsistency

### 📈 Scalability Concerns

1. **No lazy loading**: All ~195+ files in a single bundle — now significantly worse with 3 fully-built modules added
2. **Provider nesting depth (12 levels)**: Increased from 10 to 12. Severely limits testability and performance
3. **Client-side analytics computation**: Unchanged — all metrics computed from raw data in browser
4. **No pagination**: `fetchCampaigns()`, `fetchSocialPosts()`, `fetchProjects()` all `.select('*')` without limits
5. **localStorage for PostSales, Notifications, Cart, Preferences**: No cross-device sync
6. **Single Supabase client instance**: URL and anon key hardcoded in `supabase.js` (not env vars) — unchanged
7. **SalesContext mock fallback**: If backend is down, UI silently shows mock data — users cannot distinguish real from mock data
8. **Support module will need full backend build**: Currently 100% UI-only; no data persistence path defined

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
| `App.jsx`                  | `src/app/`                        | entry     | Provider tree + Outlet (12 levels)   |
| `router.jsx`               | `src/app/`                        | config    | Route definitions (70+ routes)       |
| `supabase.js`              | `src/lib/`                        | config    | Supabase client singleton            |
| `api.js`                   | `src/lib/`                        | config    | JWT REST client for Express backend  |
| `AuthContext.jsx`          | `src/context/`                    | context   | REST-based auth session              |
| `OrgContext.jsx`           | `src/context/`                    | context   | Organization membership bootstrap    |
| `MarketingContext.jsx`     | `src/context/`                    | context   | Marketing composer layer             |
| `CampaignContext.jsx`      | `src/context/`                    | hook      | Campaign CRUD + AI                   |
| `SocialContext.jsx`        | `src/context/`                    | hook      | Social posts CRUD optimistic         |
| `IntegrationContext.jsx`   | `src/context/`                    | context   | Platform integration state           |
| `SalesContext.jsx`         | `src/context/`                    | context   | Lead/deal management REST API        |
| `PostSalesContext.jsx`     | `src/context/`                    | context   | Customer lifecycle localStorage      |
| `NotificationContext.jsx`  | `src/context/`                    | context   | Notification management localStorage |
| `PreferencesContext.jsx`   | `src/context/`                    | context   | i18n currency timezone prefs         |
| `ProjectContext.jsx`       | `src/context/`                    | context   | Thin selector over Marketing         |
| `AnalyticsContext.jsx`     | `src/context/`                    | context   | Analytics filter state (not in tree) |
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
| `SalesLayout.jsx`          | `src/layouts/`                    | layout    | Authenticated sales shell            |
| `PostSalesLayout.jsx`      | `src/layouts/`                    | layout    | Authenticated post-sales shell       |
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
| 7 postSales components     | `src/components/postSales/`       | component | Post-sales shared UI components      |
| `SignIn.jsx`               | `src/pages/auth/`                 | page      | Login/signup + Google OAuth          |
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
| `SalesDashboard.jsx`       | `src/pages/sales/`                | page      | Sales main dashboard (GOD)           |
| `SalesLeads.jsx`           | `src/pages/sales/`                | page      | Lead list management                 |
| `SalesLeadWorkspace.jsx`   | `src/pages/sales/`                | page      | Individual lead workspace (GOD)      |
| `SalesCallLogs.jsx`        | `src/pages/sales/`                | page      | Call log viewer                      |
| `SalesWhatsAppHistory.jsx` | `src/pages/sales/`                | page      | WhatsApp conversation history        |
| `SalesPipeline.jsx`        | `src/pages/sales/`                | page      | Pipeline kanban view                 |
| `SalesSettings.jsx`        | `src/pages/sales/`                | page      | Sales settings (GOD)                 |
| `SalesActivity.jsx`        | `src/pages/sales/`                | page      | Sales activity feed                  |
| `PostSalesDashboard.jsx`   | `src/pages/post-sales/`           | page      | Post-sales overview                  |
| `PostSalesCustomers.jsx`   | `src/pages/post-sales/`           | page      | Customer list with filters           |
| `PostSalesAutomations.jsx` | `src/pages/post-sales/`           | page      | Automation rules manager             |
| `CustomerDetails.jsx`      | `src/pages/post-sales/`           | page      | Customer detail + timeline           |
| `AddCustomer.jsx`          | `src/pages/post-sales/`           | page      | Add customer form                    |
| `Customers.jsx`            | `src/pages/post-sales/`           | page      | ⚠ Possible duplicate of PostSalesCustomers |
| `Onboarding.jsx`           | `src/pages/post-sales/`           | page      | Onboarding hub page                  |
| `Documents.jsx`            | `src/pages/post-sales/`           | page      | Document management                  |
| `Payments.jsx`             | `src/pages/post-sales/`           | page      | Payment tracking                     |
| `Automations.jsx`          | `src/pages/post-sales/`           | page      | ⚠ Possible duplicate of PostSalesAutomations |
| `Analytics.jsx`            | `src/pages/post-sales/`           | page      | Post-sales analytics                 |
| 9 post-sales sub-components| `src/pages/post-sales/components/`| component | Post-sales UI sub-components         |
| 6 onboarding step files    | `src/pages/post-sales/onboarding/`| page      | 5-step onboarding wizard             |
| `SupportLayout.jsx`        | `src/pages/support/`              | layout    | Support module shell                 |
| `SupportDashboard.jsx`     | `src/pages/support/`              | page      | Support overview (mock data)         |
| `SupportTickets.jsx`       | `src/pages/support/`              | page      | Ticket list (mock data)              |
| `SupportTicketDetails.jsx` | `src/pages/support/`              | page      | Ticket detail view (mock data)       |
| `SupportAnalytics.jsx`     | `src/pages/support/`              | page      | Support analytics (mock data)        |
| `mockSupportData.js`       | `src/pages/support/`              | data      | Static fixture data for support UI   |
