import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your marketing preferences</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center py-32">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SettingsIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Settings</h3>
                    <p className="text-gray-500">
                        Configure your AI agents, budget limits, and notification preferences.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
