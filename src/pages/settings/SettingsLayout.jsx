import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Users, Link as LinkIcon, Megaphone, Bell, Shield } from 'lucide-react';

const SettingsLayout = () => {
    const navItems = [
        { path: '/settings', label: 'Account', icon: User, end: true },
        { path: '/settings/team', label: 'Team Members', icon: Users },
        { path: '/settings/integrations', label: 'Integrations', icon: LinkIcon },
        { path: '/settings/marketing', label: 'Marketing Defaults', icon: Megaphone },
        { path: '/settings/notifications', label: 'Notifications', icon: Bell },
        { path: '/settings/security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-[1100px] mx-auto w-full px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your workspace preferences</p>
                </div>

                {/* Horizontal Tabs */}
                <div className="border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
                    <nav className="flex space-x-8 min-w-max" aria-label="Tabs">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => `
                                    flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors
                                    ${isActive
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
