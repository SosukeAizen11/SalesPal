import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, X, Facebook, Linkedin, Instagram } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useIntegrations } from '../../context/IntegrationContext';

// Integration definitions (UI config only, status comes from context)
const INTEGRATION_CONFIG = [
    {
        id: 'meta',
        name: 'Meta Ads Manager',
        icon: Facebook,
        description: 'Connect to manage Facebook and Instagram ad campaigns.',
        category: 'Advertising',
        path: '/marketing/settings/integrations/meta'
    },
    {
        id: 'google',
        name: 'Google Ads',
        icon: ({ className }) => <span className={`flex items-center justify-center font-bold text-lg text-blue-600 ${className}`}>G</span>,
        description: 'Sync campaigns and performance data from Google Ads.',
        category: 'Advertising',
        path: null
    },
    {
        id: 'linkedin',
        name: 'LinkedIn Ads',
        icon: Linkedin,
        description: 'Target professionals and track B2B campaign performance.',
        category: 'Advertising',
        path: null
    },
    {
        id: 'instagram',
        name: 'Instagram Business',
        icon: Instagram,
        description: 'Post updates and track organic social engagement.',
        category: 'Social',
        path: null
    }
];

const SettingsIntegrations = () => {
    const navigate = useNavigate();
    const { integrations, connectIntegration, disconnectIntegration } = useIntegrations();
    const [connectingId, setConnectingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const handleConnectClick = (service) => {
        if (service.path) {
            navigate(service.path);
            return;
        }

        setSelectedService(service);
        setConnectingId(service.id);
        // Simulate OAuth
        setTimeout(() => {
            setConnectingId(null);
            setShowModal(true);
        }, 800);
    };

    const handleConfirmConnect = () => {
        connectIntegration(selectedService.id, 'Connected Account');
        setShowModal(false);
        setSelectedService(null);
    };

    const handleDisconnect = (id) => {
        if (confirm('Are you sure you want to disconnect this account? Active campaigns may pause.')) {
            disconnectIntegration(id);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                    <p className="text-gray-500 mt-1">Manage external connections for ads, analytics, and social media.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {INTEGRATION_CONFIG.map(service => {
                    const status = integrations[service.id];
                    const isConnected = status?.connected;

                    return (
                        <Card key={service.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Icon */}
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                <service.icon className="w-8 h-8 text-gray-700" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                    {isConnected ? (
                                        <Badge variant="success" className="text-[10px] px-1.5 py-0.5 h-5">Connected</Badge>
                                    ) : (
                                        <Badge variant="default" className="text-[10px] px-1.5 py-0.5 h-5 bg-gray-100 text-gray-500">Not Connected</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{service.description}</p>

                                {isConnected && status.accountName && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {status.accountName}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                {isConnected ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500"
                                            onClick={() => {
                                                if (service.path) navigate(service.path);
                                            }}
                                        >
                                            Manage
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50 border-red-100"
                                            onClick={() => handleDisconnect(service.id)}
                                        >
                                            Disconnect
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => handleConnectClick(service)}
                                        isLoading={connectingId === service.id}
                                        className="w-full md:w-auto"
                                    >
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Mock Connection Modal */}
            {showModal && selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Connect {selectedService.name}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">Select the ad account you want to sync with SalesPal.</p>

                            <div className="space-y-2 mb-6">
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="account" defaultChecked className="text-primary focus:ring-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{selectedService.name} Account 1</p>
                                        <p className="text-xs text-gray-500">ID: 123-456-789</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="account" className="text-primary focus:ring-primary" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Personal Account</p>
                                        <p className="text-xs text-gray-500">ID: 987-654-321</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button className="flex-1" onClick={handleConfirmConnect}>Confirm Connection</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsIntegrations;
