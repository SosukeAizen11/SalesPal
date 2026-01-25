import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, Calendar, Send, BarChart2 } from 'lucide-react';

const SocialLayout = () => {
    const location = useLocation();

    const tabs = [
        { path: '', label: 'Overview', icon: LayoutDashboard, end: true },
        { path: 'create', label: 'Create Post', icon: PlusCircle },
        { path: 'drafts', label: 'Drafts', icon: FileText },
        { path: 'scheduled', label: 'Scheduled', icon: Calendar },
        { path: 'published', label: 'Published', icon: Send },
        { path: 'analytics', label: 'Analytics', icon: BarChart2 },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-8 bg-gray-50/50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center gap-8 shadow-sm z-10">
                <h1 className="text-xl font-bold text-gray-900 border-r border-gray-200 pr-6 mr-2">Social Studio</h1>
                <nav className="flex items-center gap-1">
                    {tabs.map((tab) => {
                        const isActive = tab.end
                            ? location.pathname === `/marketing/social` || location.pathname === `/marketing/social/`
                            : location.pathname.includes(`/marketing/social/${tab.path}`);

                        return (
                            <NavLink
                                key={tab.path}
                                to={tab.path}
                                end={tab.end}
                                className={({ isActive: linkActive }) => `
                                    group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                                    ${isActive || linkActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                                `}
                            >
                                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                    <tab.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium leading-5">{tab.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-8 relative">
                <div className="max-w-7xl mx-auto h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SocialLayout;
