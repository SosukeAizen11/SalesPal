import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, CreditCard, Users, Link as LinkIcon, Megaphone, Bell, Shield, Lock } from 'lucide-react';

const SettingsLayout = () => {
    const navItems = [
        { path: '/settings', label: 'Account', icon: User, end: true },
        { path: '/settings/billing', label: 'Billing & Plans', icon: CreditCard },
        { path: '/settings/team', label: 'Team Members', icon: Users },
        { path: '/settings/integrations', label: 'Integrations', icon: LinkIcon },
        { path: '/settings/marketing', label: 'Marketing Defaults', icon: Megaphone },
        { path: '/settings/notifications', label: 'Notifications', icon: Bell },
        { path: '/settings/security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-8 bg-gray-50/50">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage your workspace</p>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                            `}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs font-medium text-blue-800 mb-1">Need help?</p>
                        <p className="text-xs text-blue-600">Contact support or read our documentation.</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
