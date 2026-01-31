import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useIntegrations } from '../../../context/IntegrationContext';

const MarketingSettingsIntegrations = () => {
    const navigate = useNavigate();
    const { integrations, initiateConnection } = useIntegrations();
    const [connectingId, setConnectingId] = useState(null);

    const integrationList = [
        {
            id: 'meta',
            name: 'Meta Ads',
            description: 'Connect Facebook & Instagram ad accounts for campaign management.',
            icon: Facebook,
            path: 'meta'
        },
        {
            id: 'google',
            name: 'Google Ads',
            description: 'Sync campaigns, keywords, and performance metrics from Google Ads.',
            icon: ({ className }) => <div className={`flex items-center justify-center font-bold text-lg text-blue-600 ${className}`}>G</div>,
            path: 'google'
        },
        {
            id: 'instagram',
            name: 'Instagram',
            description: 'Connect Instagram Business profiles for organic posts and analytics.',
            icon: Instagram,
            path: 'instagram'
        },
        {
            id: 'linkedin',
            name: 'LinkedIn Ads',
            description: 'Manage B2B campaigns and audiences on LinkedIn.',
            icon: Linkedin,
            path: 'linkedin'
        }
    ];

    const handleConnect = (id) => {
        setConnectingId(id);
        // Use Global OAuth Flow
        const path = initiateConnection(id, window.location.pathname);
        navigate(path);
    };

    const handleManage = (item) => {
        if (item.path === 'meta') {
            navigate(item.path);
        } else {
            alert(`Manage ${item.name} settings coming soon! Meta Ads is fully implemented.`);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <Card className="divide-y divide-gray-100 overflow-hidden shadow-sm border border-gray-200">
                {integrationList.map(item => {
                    const status = integrations[item.id];
                    const isConnected = status?.connected;

                    return (
                        <div
                            key={item.id}
                            className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50/60 transition-colors group"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 border border-gray-100 text-gray-700 shadow-sm group-hover:border-primary/20 group-hover:shadow-md transition-all">
                                <item.icon className="w-7 h-7" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                                    {isConnected ? (
                                        <Badge variant="success" className="h-5 px-2 text-[10px] uppercase tracking-wide font-bold">Connected</Badge>
                                    ) : (
                                        <Badge variant="default" className="bg-gray-100 text-gray-500 border-gray-200 h-5 px-2 text-[10px] uppercase tracking-wide font-medium">Not Connected</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>

                                {isConnected && (
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-green-700 font-medium bg-green-50 inline-flex px-2 py-0.5 rounded-full border border-green-100">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Synced
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                {isConnected ? (
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleManage(item)}
                                        className="text-gray-600 hover:text-primary hover:bg-primary/5 border border-gray-200 hover:border-primary/20 w-full md:w-auto"
                                    >
                                        Manage
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleConnect(item.id)}
                                        isLoading={connectingId === item.id}
                                        className="w-full md:w-auto justify-center"
                                    >
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </Card>
        </div>
    );
};

export default MarketingSettingsIntegrations;
