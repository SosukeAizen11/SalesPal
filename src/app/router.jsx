import { createBrowserRouter } from 'react-router-dom';
import ProjectLayout from '../layout/ProjectLayout';
import App from './App';
import Dashboard from '../pages/dashboard/Dashboard';
import Marketing from '../pages/dashboard/modules/Marketing';
import Sales from '../pages/dashboard/modules/Sales';
import Support from '../pages/dashboard/modules/Support';
import Home from '../pages/home/Home';
import ProjectsHub from '../pages/projects/ProjectsHub';
import SignIn from '../pages/auth/SignIn';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Marketing Shell Components
import MarketingLayout from '../layout/MarketingLayout';
import MarketingDashboard from '../pages/marketing/MarketingDashboard';
import Campaigns from '../pages/marketing/Campaigns';
import Analytics from '../pages/marketing/Analytics';
import Settings from '../pages/marketing/Settings';
import NewCampaign from '../pages/marketing/campaigns/NewCampaign';
import CampaignDetails from '../pages/marketing/campaigns/CampaignDetails';
import Social from '../pages/marketing/Social';
import { MarketingProvider } from '../context/MarketingContext';
import Projects from '../pages/marketing/projects/Projects';
import CreateProject from '../pages/marketing/projects/CreateProject';
import ProjectDetails from '../pages/marketing/projects/ProjectDetails';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/signin",
                element: <SignIn />,
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
                        path: "social",
                        element: <Social />
                    },
                    {
                        path: "analytics",
                        element: <Analytics />
                    },
                    {
                        path: "settings",
                        element: <Settings />
                    }
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
