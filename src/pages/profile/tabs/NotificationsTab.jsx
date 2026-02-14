import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import { useToast } from '../../../components/ui/Toast';

const NotificationsTab = () => {
    const { showToast } = useToast();
    const [preferences, setPreferences] = useState({
        emailUpdates: true,
        billingAlerts: true,
        productUpdates: false
    });

    const handleToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
        showToast({ title: 'Saved', description: 'Preferences updated successfully', variant: 'success', duration: 2000 });
    };

    const notificationOptions = [
        {
            key: 'emailUpdates',
            title: 'Email Updates',
            description: 'Receive updates about your account activity and important changes'
        },
        {
            key: 'billingAlerts',
            title: 'Billing Alerts',
            description: 'Get notified about upcoming payments and billing changes'
        },
        {
            key: 'productUpdates',
            title: 'Product Updates',
            description: 'Stay informed about new features and product improvements'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Notification Preferences Card */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                    {notificationOptions.map((option) => (
                        <div key={option.key} className="flex items-start justify-between pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="flex-1 pr-4">
                                <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                                <p className="text-sm text-gray-500">{option.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences[option.key]}
                                    onChange={() => handleToggle(option.key)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Email Frequency Card */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Frequency</h2>

                <div className="space-y-3">
                    {['Daily digest', 'Weekly summary', 'Monthly report', 'Real-time (as it happens)'].map((option, index) => (
                        <label key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="frequency"
                                defaultChecked={index === 3}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default NotificationsTab;
