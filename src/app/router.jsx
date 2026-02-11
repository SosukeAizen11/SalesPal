import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProjectLayout from '../layout/ProjectLayout';
import App from './App';
import Dashboard from '../pages/dashboard/Dashboard';
import Marketing from '../pages/dashboard/modules/Marketing';
import Sales from '../pages/dashboard/modules/Sales';
import Support from '../pages/dashboard/modules/Support';
import Home from '../pages/home/Home';
import Cart from '../pages/Cart';
import ProjectsHub from '../pages/projects/ProjectsHub';
import ContactPage from '../pages/contact/ContactPage';
import SignIn from '../pages/auth/SignIn';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PurchaseSuccess from '../pages/PurchaseSuccess';
import MarketingProduct from '../pages/products/MarketingProduct';
import SalesProduct from '../pages/products/SalesProduct';
import PostSaleProduct from '../pages/products/PostSaleProduct';
import SupportProduct from '../pages/products/SupportProduct';
import SalesPal360Product from '../pages/products/SalesPal360Product';

// Marketing Shell Components
import MarketingLayout from '../layout/MarketingLayout';
import MarketingDashboard from '../pages/marketing/MarketingDashboard';
import Campaigns from '../pages/marketing/Campaigns';

import Settings from '../pages/marketing/Settings';
import NewCampaign from '../pages/marketing/campaigns/NewCampaign';
import CampaignDetails from '../pages/marketing/campaigns/CampaignDetails';
import EditCampaign from '../pages/marketing/campaigns/EditCampaign';
import Social from '../pages/marketing/Social';
import { MarketingProvider } from '../context/MarketingContext';
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

// Settings Pages
import SettingsLayout from '../pages/settings/SettingsLayout';
import SettingsIntegrations from '../pages/settings/SettingsIntegrations';
import {
    SettingsAccount,
    SettingsBilling,
    SettingsTeam,
    SettingsMarketing,
    SettingsNotifications,
    SettingsSecurity
} from '../pages/settings/SettingsPages';

import MarketingSettingsLayout from '../pages/marketing/settings/MarketingSettingsLayout';
import MarketingSettingsOverview from '../pages/marketing/settings/MarketingSettingsOverview';
import MarketingSettingsIntegrations from '../pages/marketing/settings/MarketingSettingsIntegrations';
import MetaIntegration from '../pages/marketing/settings/MetaIntegration';
import {
    MarketingSettingsDefaults,
    MarketingSettingsTracking,
    MarketingSettingsNotifications
} from '../pages/marketing/settings/MarketingSettingsPlaceholders';

import ConnectPlatform from '../pages/auth/ConnectPlatform';

import SubscriptionManagement from '../pages/subscription/SubscriptionManagement';
import PlaceholderPage from '../pages/marketing/PlaceholderPage';
import ModuleGateway from '../pages/app/ModuleGateway';

import ModuleAccessGuard from '../components/auth/ModuleAccessGuard';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/app",
                element: (
                    <ProtectedRoute>
                        <ModuleGateway />
                    </ProtectedRoute>
                )
            },
            {
                path: "/connect/:platformId",
                element: <ConnectPlatform />
            },
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <SignIn />,
            },
            {
                path: "/signin",
                element: <SignIn />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/purchase-success",
                element: <PurchaseSuccess />,
            },
            {
                path: "/contact",
                element: <ContactPage />,
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
            // Marketing App Shell
            {
                path: "/marketing",
                element: (
                    <ProtectedRoute>
                        <ModuleAccessGuard moduleName="marketing">
                            <MarketingProvider>
                                <MarketingLayout />
                            </MarketingProvider>
                        </ModuleAccessGuard>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
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
                        path: "campaigns/new",
                        element: <NewCampaign />
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
                    {
                        path: "settings",
                        element: <MarketingSettingsLayout />,
                        children: [
                            { index: true, element: <Navigate to="integrations" replace /> },
                            { path: "integrations", element: <MarketingSettingsIntegrations /> },
                            { path: "defaults", element: <MarketingSettingsDefaults /> },
                            { path: "tracking", element: <MarketingSettingsTracking /> },
                            { path: "notifications", element: <MarketingSettingsNotifications /> }
                        ]
                    },
                    {
                        path: "settings/integrations/meta",
                        element: <MetaIntegration />
                    },
                    { path: "photos", element: <PlaceholderPage title="My Photos" description="Manage your image assets and generated photos here." /> },
                    { path: "videos", element: <PlaceholderPage title="My Videos" description="Manage your video assets and generated content here." /> },
                    { path: "calls", element: <PlaceholderPage title="Call History" description="View call logs and manage communication credits." /> },
                    { path: "whatsapp", element: <PlaceholderPage title="WhatsApp" description="Manage WhatsApp campaigns and message history." /> },
                    { path: "subscription", element: <SubscriptionManagement /> },



                ]
            },

            {
                path: "/settings",
                element: (
                    <ProtectedRoute>
                        <MarketingProvider>
                            <SettingsLayout />
                        </MarketingProvider>
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <SettingsAccount /> },
                    { path: "billing", element: <SettingsBilling /> },
                    { path: "team", element: <SettingsTeam /> },
                    { path: "integrations", element: <SettingsIntegrations /> },
                    { path: "marketing", element: <SettingsMarketing /> },
                    { path: "notifications", element: <SettingsNotifications /> },
                    { path: "security", element: <SettingsSecurity /> }
                ]
            },

            {
                path: "/projects",
                element: (
                    <ProtectedRoute>
                        <ProjectsHub />
                    </ProtectedRoute>
                ),
            },
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
        ],
    },
]);
