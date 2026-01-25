import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Link as LinkIcon, Megaphone, Target, Bell } from 'lucide-react';

const MarketingSettingsLayout = () => {
    const navItems = [
        { path: 'integrations', label: 'Integrations', icon: LinkIcon },
        { path: 'defaults', label: 'Campaign Defaults', icon: Megaphone },
        { path: 'tracking', label: 'Tracking & Attribution', icon: Target },
        { path: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketing Settings</h1>
                <p className="text-gray-500 text-sm">Configure your marketing workspace, integrations, and preferences.</p>
            </div>

            <div className="border-b border-gray-200 mb-8 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 -mx-6 px-6 md:-mx-8 md:px-8">
                <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                                ${isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            `}
                        >
                            <item.icon className={`
                                -ml-0.5 mr-2 h-4 w-4
                                ${item.path === 'integrations' /* Highlight if active logic matches parent? NavLink handles it */ ? '' : ''}
                            `} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="min-h-[400px]">
                <Outlet />
            </div>
        </div>
    );
};

export default MarketingSettingsLayout;
