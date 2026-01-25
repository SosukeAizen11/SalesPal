import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RefreshCw, Facebook, Instagram, Target } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useIntegrations } from '../../../context/IntegrationContext';

// Mock Data
const MOCK_ACCOUNTS = [
    { id: 'act_123', name: 'SalesPal Marketing (Pro)' },
    { id: 'act_456', name: 'SalesPal Sandbox' },
];

const MOCK_PAGES = [
    { id: 'page_1', name: 'SalesPal Official', followers: '12K' },
    { id: 'page_2', name: 'SalesPal Community', followers: '2.5K' },
];

const MOCK_IG_ACCOUNTS = [
    { id: 'ig_1', name: '@salespal_tech' },
    { id: 'ig_2', name: '@salespal_life' },
];

const MOCK_PIXELS = [
    { id: 'pix_1', name: 'Main Website Pixel (Primary)' },
    { id: 'pix_2', name: 'Blog Pixel' },
];

const MetaSettings = () => {
    const navigate = useNavigate();
    const { integrations, connectIntegration, disconnectIntegration } = useIntegrations();
    const isConnected = integrations.meta?.connected;

    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        adAccount: '',
        page: '',
        instagram: '',
        pixel: ''
    });

    const handleConnect = () => {
        setLoading(true);
        // Simulate OAuth
        setTimeout(() => {
            connectIntegration('meta', 'Sumit Mandaliya (sumit@salespal.com)');
            setLoading(false);
            setConfig({
                adAccount: 'act_123',
                page: 'page_1',
                instagram: 'ig_1',
                pixel: 'pix_1'
            });
        }, 1500);
    };

    const handleDisconnect = () => {
        if (confirm('Disconnecting Meta Ads will pause all active campaigns synced from this account. Continue?')) {
            disconnectIntegration('meta');
            setConfig({ adAccount: '', page: '', instagram: '', pixel: '' });
        }
    };

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    if (!isConnected) {
        return (
            <div className="max-w-3xl mx-auto animate-fade-in-up">
                <button onClick={() => navigate('/settings/integrations')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Integrations
                </button>

                <Card className="p-12 text-center">
                    <div className="w-20 h-20 bg-[#1877F2]/10 mx-auto rounded-2xl flex items-center justify-center mb-6">
                        <Facebook className="w-10 h-10 text-[#1877F2]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Meta Ads</h1>
                    <p className="text-gray-500 max-w-lg mx-auto mb-8">
                        Link your Facebook and Instagram ad accounts to create campaigns, manage audiences, and track pixel conversions directly from SalesPal.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <Button
                            onClick={handleConnect}
                            isLoading={loading}
                            className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 h-12 text-base"
                        >
                            {loading ? 'Connecting...' : 'Continue with Facebook'}
                        </Button>
                        <p className="text-xs text-gray-400">
                            By connecting, you agree to grant SalesPal access to manage ads and read insights.
                        </p>
                    </div>

                    <div className="mt-12 grid md:grid-cols-3 gap-6 text-left border-t border-gray-100 pt-8">
                        <div>
                            <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                                <Target className="w-4 h-4 text-gray-400" /> Smart Targeting
                            </div>
                            <p className="text-xs text-gray-500">Sync your CRM lists to create custom audiences automatically.</p>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-gray-400" /> Auto-Sync
                            </div>
                            <p className="text-xs text-gray-500">Campaign performance data updates every 15 minutes.</p>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-gray-400" /> Lead Gen
                            </div>
                            <p className="text-xs text-gray-500">Capture leads from Instant Forms directly into SalesPal.</p>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up pb-12">
            <button onClick={() => navigate('/settings/integrations')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Integrations
            </button>

            {/* Header Status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#1877F2] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                        <Facebook className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Meta Ads</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                <CheckCircle2 className="w-4 h-4" /> Connected
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{integrations.meta?.accountName || 'Connected Account'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 hidden md:inline-block">Last synced: Just now</span>
                    <Button variant="ghost" size="sm" onClick={() => window.location.reload()} title="Refresh Data">
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Configuration Form */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Asset Configuration</h3>
                            <p className="text-xs text-gray-500 mt-1">Select the default assets to use for new campaigns.</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Ad Account</label>
                                <select
                                    value={config.adAccount}
                                    onChange={(e) => handleChange('adAccount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="" disabled>Select Ad Account</option>
                                    {MOCK_ACCOUNTS.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.id})</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">Campaigns will be billed to this account.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Meta Pixel</label>
                                <select
                                    value={config.pixel}
                                    onChange={(e) => handleChange('pixel', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="" disabled>Select Pixel</option>
                                    {MOCK_PIXELS.map(pix => (
                                        <option key={pix.id} value={pix.id}>{pix.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">Used for tracking conversions and retargeting.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Facebook Page</label>
                                <div className="relative">
                                    <select
                                        value={config.page}
                                        onChange={(e) => handleChange('page', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Select Page</option>
                                        {MOCK_PAGES.map(page => (
                                            <option key={page.id} value={page.id}>{page.name}</option>
                                        ))}
                                    </select>
                                    <Facebook className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Instagram Account</label>
                                <div className="relative">
                                    <select
                                        value={config.instagram}
                                        onChange={(e) => handleChange('instagram', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Select Account</option>
                                        {MOCK_IG_ACCOUNTS.map(ig => (
                                            <option key={ig.id} value={ig.id}>{ig.name}</option>
                                        ))}
                                    </select>
                                    <Instagram className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <Button>Save Configuration</Button>
                    </div>
                </Card>

                {/* Danger Zone */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-red-600 mb-4">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl bg-red-50/50">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">Disconnect Integration</h4>
                            <p className="text-xs text-gray-500">Revoke permissions to manage your Meta Ads accounts.</p>
                        </div>
                        <Button variant="danger" size="sm" onClick={handleDisconnect}>Disconnect</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetaSettings;
