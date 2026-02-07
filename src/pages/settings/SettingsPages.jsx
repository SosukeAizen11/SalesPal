import React from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export const SettingsAccount = () => (
    <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="w-full border-gray-300 rounded-lg" defaultValue="Sumit Mandaliya" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border-gray-300 rounded-lg" defaultValue="sumit@salespal.com" disabled />
                </div>
            </div>
            <Button>Save Changes</Button>
        </Card>
    </div>
);

export const SettingsBilling = () => (
    <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                    <p className="text-sm text-gray-500">$29/month, billed annually</p>
                    <p className="text-xs text-gray-400 mt-0.5">(Exclusive of GST & convenience fee)</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Active</span>
            </div>
            <Button variant="secondary">Manage Subscription</Button>
        </Card>
    </div>
);

export const SettingsTeam = () => (
    <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <Button>Invite Member</Button>
        </div>
        <Card className="divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium">UM</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">User Member {i}</p>
                            <p className="text-xs text-gray-500">user{i}@example.com</p>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">Editor</span>
                </div>
            ))}
        </Card>
    </div>
);

export const SettingsMarketing = () => (
    <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-gray-900">Marketing Defaults</h1>
        <Card className="p-6">
            <p className="text-gray-500 text-sm">Set default branding, logos, and tracking parameters here.</p>
        </Card>
    </div>
);

export const SettingsNotifications = () => (
    <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <Card className="divide-y divide-gray-100">
            {['Email Digest', 'New Leads Alert', 'Campaign Status Updates'].map(item => (
                <div key={item} className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            ))}
        </Card>
    </div>
);

export const SettingsSecurity = () => (
    <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account.</p>
            <Button variant="secondary">Enable 2FA</Button>
        </Card>
    </div>
);
