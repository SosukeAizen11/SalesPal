import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { marketingNav } from '../navigation/marketingNav';
import logo from '../assets/logo.webp';
import { LogOut, User } from 'lucide-react';
import ProjectSwitcher from '../components/ProjectSwitcher';
import Button from '../components/ui/Button';
import { TourProvider } from '../context/TourContext';
import TourOverlay from '../components/tour/TourOverlay';

const MarketingLayoutContent = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // const isWizardMode = location.pathname.includes('/campaigns/new'); // Unused for now

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-primary border-r border-white/5 flex flex-col shrink-0 transition-all duration-300">
                <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                    <img src={logo} alt="SalesPal" className="h-8 w-auto" />
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {marketingNav.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/marketing'}
                            id={`sidebar-nav-${item.name.toLowerCase()}`}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-secondary text-primary'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Demo User</p>
                            <p className="text-xs text-gray-400 truncate">demo@salespal.ai</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <ProjectSwitcher />
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Tour Global Overlay */}
            <TourOverlay />
        </div>
    );
};

const MarketingLayout = () => {
    return (
        <TourProvider>
            <MarketingLayoutContent />
        </TourProvider>
    );
};

export default MarketingLayout;
