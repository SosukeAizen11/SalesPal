import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Facebook, ArrowLeft, Instagram, Shield, CreditCard, Globe } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { useIntegrations } from '../../../context/IntegrationContext';

// Mock Data
const MOCK_BUSINESS_MANAGERS = [
    { id: 'bm_1', name: 'SalesPal Inc.' },
    { id: 'bm_2', name: 'SalesPal Agency' },
];

const MOCK_ACCOUNTS = [
    { id: 'act_123', name: 'SalesPal Marketing (Pro)' },
    { id: 'act_456', name: 'SalesPal Sandbox' },
];

const MOCK_PAGES = [
    { id: 'page_1', name: 'SalesPal Official' },
    { id: 'page_2', name: 'SalesPal Community' },
];

const MOCK_IG_ACCOUNTS = [
    { id: '', name: '— None —' },
    { id: 'ig_1', name: '@salespal_tech' },
    { id: 'ig_2', name: '@salespal_life' },
];

const MOCK_PIXELS = [
    { id: '', name: '— None —' },
    { id: 'pix_1', name: 'Main Website Pixel' },
    { id: 'pix_2', name: 'Blog Pixel' },
];

const INITIAL_CONFIG = {
    businessManager: 'bm_1',
    adAccount: 'act_123',
    page: 'page_1',
    instagram: '',
    pixel: 'pix_1'
};

const MetaIntegration = () => {
    const navigate = useNavigate();
    const { integrations, connectIntegration, disconnectIntegration } = useIntegrations();
    const isConnected = integrations.meta?.connected;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState(INITIAL_CONFIG);
    const [savedConfig, setSavedConfig] = useState(INITIAL_CONFIG);

    // Health Checklist (mock)
    const healthChecks = [
        { id: 'permissions', label: 'Permissions granted', icon: Shield, status: 'ok' },
        { id: 'billing', label: 'Billing active', icon: CreditCard, status: 'ok' },
        { id: 'domain', label: 'Domain verified', icon: Globe, status: 'warning' },
    ];

    // Dirty state detection
    const isDirty = useMemo(() => {
        return JSON.stringify(config) !== JSON.stringify(savedConfig);
    }, [config, savedConfig]);

    const handleConnect = () => {
        setLoading(true);
        setTimeout(() => {
            connectIntegration('meta');
            setLoading(false);
            setConfig(INITIAL_CONFIG);
            setSavedConfig(INITIAL_CONFIG);
        }, 1500);
    };

    const handleDisconnect = () => {
        if (confirm('Disconnecting Meta Ads will pause all active campaigns. This action cannot be undone. Continue?')) {
            disconnectIntegration('meta');
            setConfig(INITIAL_CONFIG);
            setSavedConfig(INITIAL_CONFIG);
        }
    };

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSavedConfig({ ...config });
            setSaving(false);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
            {/* Header */}
            <div>
                <button onClick={() => navigate('/marketing/settings/integrations')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 text-sm">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Integrations
                </button>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 text-white">
                                <Facebook className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Meta Ads</h1>
                                <p className="text-sm text-gray-500">Facebook & Instagram Advertising</p>
                            </div>
                        </div>
                    </div>
                    {isConnected ? (
                        <Badge variant="success" className="mt-1">Connected</Badge>
                    ) : (
                        <Badge className="mt-1 bg-gray-100 text-gray-500">Not Connected</Badge>
                    )}
                </div>
            </div>

            {/* Disconnected State */}
            {!isConnected ? (
                <Card className="p-12 text-center border-dashed border-2 bg-gray-50/50">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">Connect to Meta</h3>
                            <p className="text-sm text-gray-500">
                                Grant SalesPal permission to manage your Ad Accounts and Pages. No credentials are stored—authentication is handled securely via OAuth.
                            </p>
                        </div>
                        <Button
                            onClick={handleConnect}
                            isLoading={loading}
                            className="bg-[#1877F2] hover:bg-[#166fe5] text-white w-full h-12 text-base justify-center"
                        >
                            <Facebook className="w-5 h-5 mr-2" />
                            Continue with Facebook
                        </Button>
                        <p className="text-xs text-gray-400">
                            By connecting, you agree to Meta's Terms of Service and SalesPal's Privacy Policy.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Connected Account Info */}
                    <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                SM
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Sumit Mandaliya</h3>
                                <p className="text-sm text-gray-500">sumit@salespal.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button variant="ghost" onClick={handleConnect} className="text-gray-500">Change Account</Button>
                            <Button variant="secondary" onClick={handleDisconnect} className="text-red-600 hover:bg-red-50 border-red-200">Disconnect</Button>
                        </div>
                    </Card>

                    {/* Health Checklist */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Integration Health</h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {healthChecks.map(check => (
                                <div key={check.id} className={`flex items-center gap-3 p-3 rounded-lg border ${check.status === 'ok' ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                                    <check.icon className={`w-5 h-5 ${check.status === 'ok' ? 'text-green-600' : 'text-yellow-600'}`} />
                                    <span className={`text-sm font-medium ${check.status === 'ok' ? 'text-green-700' : 'text-yellow-700'}`}>{check.label}</span>
                                    {check.status === 'ok' ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-yellow-500 ml-auto" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Asset Configuration */}
                    <Card className="overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Asset Configuration</h3>
                            <p className="text-sm text-gray-500 mt-1">Select the default assets to use for campaigns. This integration is shared across all projects.</p>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Business Manager */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Business Manager</label>
                                <select
                                    value={config.businessManager}
                                    onChange={(e) => handleChange('businessManager', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                                >
                                    {MOCK_BUSINESS_MANAGERS.map(bm => (
                                        <option key={bm.id} value={bm.id}>{bm.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ad Account */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Ad Account</label>
                                <select
                                    value={config.adAccount}
                                    onChange={(e) => handleChange('adAccount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                                >
                                    {MOCK_ACCOUNTS.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">Primary account for billing.</p>
                            </div>

                            {/* Facebook Page */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Facebook Page</label>
                                <div className="relative">
                                    <select
                                        value={config.page}
                                        onChange={(e) => handleChange('page', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                                    >
                                        {MOCK_PAGES.map(page => (
                                            <option key={page.id} value={page.id}>{page.name}</option>
                                        ))}
                                    </select>
                                    <Facebook className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Instagram Account (Optional) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Instagram Account <span className="text-gray-400 font-normal">(optional)</span></label>
                                <div className="relative">
                                    <select
                                        value={config.instagram}
                                        onChange={(e) => handleChange('instagram', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                                    >
                                        {MOCK_IG_ACCOUNTS.map(ig => (
                                            <option key={ig.id} value={ig.id}>{ig.name}</option>
                                        ))}
                                    </select>
                                    <Instagram className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Pixel (Optional) */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Meta Pixel <span className="text-gray-400 font-normal">(optional)</span></label>
                                <select
                                    value={config.pixel}
                                    onChange={(e) => handleChange('pixel', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                                >
                                    {MOCK_PIXELS.map(pix => (
                                        <option key={pix.id} value={pix.id}>{pix.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">Used for conversion tracking and retargeting.</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/30">
                            <Button onClick={handleSave} disabled={!isDirty} isLoading={saving}>
                                Save Configuration
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MetaIntegration;
