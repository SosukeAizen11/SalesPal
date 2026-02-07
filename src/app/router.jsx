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
                path: "/",
                element: <Home />,
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
                path: "/contact",
                element: <ContactPage />,
            },
            // Marketing App Shell
            {
                path: "/marketing",
                element: (
                    <ProtectedRoute>
                        <MarketingProvider>
                            <MarketingLayout />
                        </MarketingProvider>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <MarketingDashboard />
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
