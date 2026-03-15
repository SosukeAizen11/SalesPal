import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import ProjectLayout from '../layouts/ProjectLayout';
import App from './App';
import Dashboard from '../pages/dashboard/Dashboard';
import Marketing from '../pages/dashboard/modules/Marketing';
import Sales from '../pages/dashboard/modules/Sales';
import Support from '../pages/dashboard/modules/Support';
import Home from '../pages/home/Home';

import ProjectsHub from '../pages/projects/ProjectsHub';
import ContactPage from '../pages/contact/ContactPage';
import SignIn from '../pages/auth/SignIn';
import ConnectPlatform from '../pages/auth/ConnectPlatform';
import MainLayout from '../layouts/MainLayout';
import DashboardRedirect from '../components/routing/DashboardRedirect';
import CartPage from '../pages/cart/CartPage';
import PurchaseSuccess from '../pages/purchase/PurchaseSuccess';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import MarketingProduct from '../pages/products/MarketingProduct';
import SalesProduct from '../pages/products/SalesProduct';
import PostSaleProduct from '../pages/products/PostSaleProduct';
import SupportProduct from '../pages/products/SupportProduct';
import SalesPal360Product from '../pages/products/SalesPal360Product';
import AppLayout from '../components/layout/AppLayout';

// Marketing Shell Components
import MarketingLayout from '../layouts/MarketingLayout';
import MarketingDashboard from '../pages/marketing/MarketingDashboard';
import Campaigns from '../pages/marketing/Campaigns';

// Settings import removed — settings now at /settings using MarketingSettingsLayout
import NewCampaign from '../pages/marketing/campaigns/NewCampaign';
import CampaignDetails from '../pages/marketing/campaigns/CampaignDetails';
import EditCampaign from '../pages/marketing/campaigns/EditCampaign';
import Social from '../pages/marketing/Social';
import Projects from '../pages/marketing/projects/Projects';
import CreateProject from '../pages/marketing/projects/CreateProject';
import ProjectDetails from '../pages/marketing/projects/ProjectDetails';
import MarketingKPIDrilldown from '../pages/marketing/analysis/MarketingKPIDrilldown';

// Social Pages
import SocialLayout from '../pages/marketing/social/SocialLayout';
import SocialOverview from '../pages/marketing/social/SocialOverview';
import SocialCreate from '../pages/marketing/social/SocialCreate';
import SocialList from '../pages/marketing/social/SocialList';
import SocialAnalytics from '../pages/marketing/social/SocialAnalytics';
import SocialPostDetails from '../pages/marketing/social/SocialPostDetails';

// Old global settings removed — unified under /settings using MarketingSettingsLayout
import SubscriptionPage from '../pages/subscription/SubscriptionPage';
import PlaceholderPage from '../pages/marketing/PlaceholderPage';

import ModuleAccessWrapper from '../components/access/ModuleAccessWrapper';
import SalesLayout from '../layouts/SalesLayout';
import SalesDashboard from '../pages/sales/SalesDashboard';
import SalesLeads from '../pages/sales/SalesLeads';
import SalesSettings from '../pages/sales/SalesSettings';
import SalesLeadWorkspace from '../pages/sales/SalesLeadWorkspace';
import SalesCallLogs from '../pages/sales/SalesCallLogs';
import SalesWhatsAppHistory from '../pages/sales/SalesWhatsAppHistory';

import PostSalesLayout from '../layouts/PostSalesLayout';
import PostSalesDashboard from '../pages/post-sales/PostSalesDashboard';
import AddCustomer from '../pages/post-sales/AddCustomer';
import Customers from '../pages/post-sales/Customers';
import CustomerDetails from '../pages/post-sales/CustomerDetails';
import Onboarding from '../pages/post-sales/Onboarding';
import Documents from '../pages/post-sales/Documents';
import Payments from '../pages/post-sales/Payments';
import Automations from '../pages/post-sales/Automations';
import Analytics from '../pages/post-sales/Analytics';
import PostSalesCustomers from '../pages/post-sales/PostSalesCustomers';
import PostSalesAutomations from '../pages/post-sales/PostSalesAutomations';
// Support Module
import SupportLayout from '../pages/support/SupportLayout';
import SupportDashboard from '../pages/support/SupportDashboard';
import SupportTickets from '../pages/support/SupportTickets';
import SupportTicketDetails from '../pages/support/SupportTicketDetails';
import SupportAnalytics from '../pages/support/SupportAnalytics';

import MarketingSettingsLayout from '../pages/marketing/settings/MarketingSettingsLayout';
import MarketingSettingsIntegrations from '../pages/marketing/settings/MarketingSettingsIntegrations';
import MetaIntegration from '../pages/marketing/settings/MetaIntegration';
import {
    MarketingSettingsDefaults,
    MarketingSettingsTracking,
    MarketingSettingsNotifications
} from '../pages/marketing/settings/MarketingSettingsPlaceholders';
import ProfilePage from '../pages/profile/ProfilePage';
import NotificationCenter from '../pages/notifications/NotificationCenter';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/connect/:platformId",
                element: <ConnectPlatform />
            },

            {
                element: <MainLayout />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    },
                    {
                        path: "/contact",
                        element: <ContactPage />,
                    },
                    {
                        path: "/cart",
                        element: (
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "/purchase-success",
                        element: (
                            <ProtectedRoute>
                                <PurchaseSuccess />
                            </ProtectedRoute>
                        ),
                    },
                ]
            },

            {
                path: "/products/marketing",
                element: <MarketingProduct />,
            },
            {
                path: "/products/sales",
                element: <SalesProduct />,
            },
            {
                path: "/products/post-sale",
                element: <PostSaleProduct />,
            },
            {
                path: "/products/support",
                element: <SupportProduct />,
            },
            {
                path: "/products/salespal-360",
                element: <SalesPal360Product />,
            },


            // Authenticated App Routes (Unified Shell)
            {
                element: (
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                ),
                children: [
                    // ─── Global Dashboard Redirect (hierarchy-based) ───────────────
                    {
                        path: "/dashboard",
                        element: <DashboardRedirect />
                    },

                    // ─── Marketing Module ──────────────────────────────────────────
                    {
                        path: "/marketing",
                        element: (
                            <ModuleAccessWrapper moduleName="marketing">
                                <MarketingLayout />
                            </ModuleAccessWrapper>
                        ),
                        children: [
                            {
                                index: true,
                                element: <Navigate to="dashboard" replace />
                            },
                            {
                                path: "dashboard",
                                element: <MarketingDashboard />
                            },
                            {
                                path: "insights/:kpiType",
                                element: <MarketingKPIDrilldown />
                            },
                            {
                                path: "campaigns",
                                element: <Campaigns />
                            },
                            {
                                path: "campaigns/:campaignId",
                                element: <CampaignDetails />
                            },
                            {
                                path: "projects",
                                element: <Projects />
                            },
                            {
                                path: "projects/new",
                                element: <CreateProject />
                            },
                            {
                                path: "projects/:projectId",
                                element: <ProjectDetails />
                            },
                            {
                                path: "projects/:projectId/campaigns/new",
                                element: <NewCampaign />
                            },
                            {
                                path: "projects/:projectId/campaigns/:campaignId",
                                element: <CampaignDetails />
                            },
                            {
                                path: "projects/:projectId/campaigns/:campaignId/edit",
                                element: <EditCampaign />
                            },
                            {
                                path: "social",
                                element: <SocialLayout />,
                                children: [
                                    { index: true, element: <SocialOverview /> },
                                    { path: "create", element: <SocialCreate /> },
                                    { path: "drafts", element: <SocialList status="drafts" /> },
                                    { path: "scheduled", element: <SocialList status="scheduled" /> },
                                    { path: "published", element: <SocialList status="published" /> },
                                    { path: "analytics", element: <SocialAnalytics /> },
                                    { path: "posts/:id", element: <SocialPostDetails /> }
                                ]
                            },
                            // Redirect old /marketing/settings → /settings
                            {
                                path: "settings/*",
                                element: <Navigate to="/settings" replace />
                            },
                            { path: "photos", element: <PlaceholderPage title="My Photos" description="Manage your image assets and generated photos here." /> },
                            { path: "videos", element: <PlaceholderPage title="My Videos" description="Manage your video assets and generated content here." /> },
                            { path: "calls", element: <PlaceholderPage title="Call History" description="View call logs and manage communication credits." /> },
                            { path: "whatsapp", element: <PlaceholderPage title="WhatsApp" description="Manage WhatsApp campaigns and message history." /> },
                        ]
                    },

                    // ─── Sales Module ──────────────────────────────────────────────
                    {
                        path: "/sales",
                        element: (
                            <ModuleAccessWrapper moduleName="sales">
                                <SalesLayout />
                            </ModuleAccessWrapper>
                        ),
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            { path: "dashboard", element: <SalesDashboard /> },
                            { path: "leads", element: <SalesLeads /> },
                            { path: "leads/:id", element: <SalesLeadWorkspace /> },
                            { path: "calls", element: <SalesCallLogs /> },
                            { path: "interactions", element: <SalesCallLogs /> },
                            { path: "whatsapp", element: <SalesWhatsAppHistory /> },
                            { path: "settings", element: <SalesSettings /> }
                        ]
                    },

                    // ─── Post-Sales Module ─────────────────────────────────────────
                    {
                        path: "/post-sales",
                        element: (
                            <ModuleAccessWrapper moduleName="postSale">
                                <Outlet />
                            </ModuleAccessWrapper>
                        ),
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            {
                                path: "dashboard",
                                element: <PlaceholderPage title="Post-Sales Module" description="Manage customer onboarding and retention." />
                            }
                        ]
                    },

                    // ─── Support Module ────────────────────────────────────────────
                    {
                        path: "/support",
                        element: (
                            <ModuleAccessWrapper moduleName="support">
                                <Outlet />
                            </ModuleAccessWrapper>
                        ),
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            {
                                path: "dashboard",
                                element: <PlaceholderPage title="Support Module" description="Manage tickets and customer support." />
                            }
                        ]
                    },

                    {
                        path: "/subscription",
                        element: <SubscriptionPage />
                    },
                    {
                        path: "/profile",
                        element: <ProfilePage />
                    },
                    {
                        path: "/notifications",
                        element: <NotificationCenter />
                    },

                    // Unified Settings (powered by MarketingLayout + MarketingSettingsLayout)
                    {
                        path: "/settings",
                        element: (
                            <MarketingLayout />
                        ),
                        children: [
                            {
                                element: <MarketingSettingsLayout />,
                                children: [
                                    { index: true, element: <Navigate to="integrations" replace /> },
                                    { path: "integrations", element: <MarketingSettingsIntegrations /> },
                                    { path: "integrations/meta", element: <MetaIntegration /> },
                                    { path: "integrations/linkedin", element: <MetaIntegration /> },
                                    { path: "defaults", element: <MarketingSettingsDefaults /> },
                                    { path: "tracking", element: <MarketingSettingsTracking /> },
                                    { path: "notifications", element: <MarketingSettingsNotifications /> },
                                    { path: "sales", element: <SalesSettings /> }
                                ]
                            }
                        ]
                    },

                    // Projects Hub
                    {
                        path: "/projects",
                        element: <ProjectsHub />,
                    },

                    // Project Console
                    {
                        element: <ProjectLayout />,
                        children: [
                            {
                                path: "/console/dashboard",
                                element: <Dashboard />,
                            },
                            {
                                path: "/console/marketing",
                                element: <Marketing />,
                            },
                            {
                                path: "/console/sales",
                                element: <Sales />,
                            },
                            {
                                path: "/console/support",
                                element: <Support />,
                            },
                        ]
                    }
                ]
            }
        ],
    },
]);
