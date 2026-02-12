import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { marketingNav } from '../navigation/marketingNav';
import { LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectSwitcher from '../components/ProjectSwitcher';
import { TourProvider } from '../context/TourContext';
import TourOverlay from '../components/tour/TourOverlay';
import GlobalCreditDisplay from '../components/GlobalCreditDisplay';

const MarketingLayoutContent = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Resize State
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const saved = localStorage.getItem('sidebarWidth');
        return saved ? parseInt(saved, 10) : 240;
    });
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef(null);

    const isCollapsed = sidebarWidth <= 90;
    const hasMoved = useRef(false);

    const startResizing = useCallback((e) => {
        // e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        hasMoved.current = false;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.body.classList.add('resizing');
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.body.classList.remove('resizing');
    }, []);

    const resize = useCallback((mouseMoveEvent) => {
        if (isResizing) {
            hasMoved.current = true;
            const newWidth = mouseMoveEvent.clientX;
            if (newWidth >= 72 && newWidth <= 280) {
                setSidebarWidth(newWidth);
                localStorage.setItem('sidebarWidth', newWidth);
            }
        }
    }, [isResizing]);

    const toggleSidebar = useCallback(() => {
        setSidebarWidth(prev => {
            const newWidth = prev <= 90 ? 240 : 72;
            localStorage.setItem('sidebarWidth', newWidth);
            return newWidth;
        });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                id="tour-sidebar"
                ref={sidebarRef}
                style={{ width: sidebarWidth, transition: isResizing ? 'none' : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                className="bg-[#0E2434] border-r border-[#0E2434] flex flex-col shrink-0 relative group"
            >
                {/* Visual Resizer Handle */}
                <div
                    onMouseDown={startResizing}
                    className={`absolute right-0 top-0 bottom-0 w-[6px] cursor-col-resize hover:bg-blue-500/50 transition-colors z-50 translate-x-1/2 ${isResizing ? 'bg-blue-500/50' : ''}`}
                />

                {/* Toggle Button */}
                <button
                    onMouseDown={startResizing}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Only toggle if sidebar wasn't dragged
                        if (!hasMoved.current) {
                            toggleSidebar();
                        }
                    }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 cursor-col-resize"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <div className="h-16 flex items-center justify-center px-6 border-b border-white/10 shrink-0 select-none overflow-hidden">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="block h-full py-0 flex items-center opacity-100 hover:opacity-90 transition-opacity duration-200"
                    >
                        <img
                            src="/SalesPal Logo Footer.jpeg"
                            alt="SalesPal"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 overflow-x-hidden">
                    {marketingNav.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/marketing'}
                            id={`sidebar-nav-${item.name.toLowerCase()}`}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive
                                    ? 'bg-secondary text-primary'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                } ${isCollapsed ? 'justify-center px-0' : ''}`
                            }
                            title={isCollapsed ? item.name : ''}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span className="opacity-100 transition-opacity duration-200">{item.name}</span>}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10 shrink-0 overflow-hidden">
                    <div className={`flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 mb-3 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                            <User className="w-4 h-4" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 transition-opacity duration-200">
                                <p className="text-sm font-medium text-white truncate">Demo User</p>
                                <p className="text-xs text-gray-400 truncate">demo@salespal.ai</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar - Now visible for Project Switcher & Credits */}
                <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
                    <div className="w-64">
                        <ProjectSwitcher />
                    </div>
                    <div className="flex items-center gap-4">
                        <GlobalCreditDisplay />
                    </div>
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
