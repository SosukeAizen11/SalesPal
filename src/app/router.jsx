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
import Social from '../pages/marketing/Social';

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
                        <MarketingLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <MarketingDashboard />
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
