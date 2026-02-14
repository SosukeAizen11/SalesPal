import React, { useState } from 'react';
import { User, Shield, CreditCard, Bell, Users } from 'lucide-react';
import ProfileTab from './tabs/ProfileTab';
import SecurityTab from './tabs/SecurityTab';
import BillingTab from './tabs/BillingTab';
import NotificationsTab from './tabs/NotificationsTab';
import WorkspaceTab from './tabs/WorkspaceTab';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'workspace', label: 'Team / Workspace', icon: Users }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab />;
            case 'security':
                return <SecurityTab />;
            case 'billing':
                return <BillingTab />;
            case 'notifications':
                return <NotificationsTab />;
            case 'workspace':
                return <WorkspaceTab />;
            default:
                return <ProfileTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 mt-2">Manage your account settings and preferences</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${isActive
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon size={18} strokeWidth={1.5} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in-up">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
