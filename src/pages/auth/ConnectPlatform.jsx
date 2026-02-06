import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntegrations } from '../../context/IntegrationContext';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ConnectPlatform = () => {
    const { platformId } = useParams();
    const navigate = useNavigate();
    const { completeConnection } = useIntegrations();
    const [status, setStatus] = useState('idle'); // idle, connecting, success, error

    const platformNames = {
        meta: 'Meta Ads (Facebook & Instagram)',
        google: 'Google Ads',
        linkedin: 'LinkedIn Ads',
        instagram: 'Instagram Professional'
    };

    const handleConnect = () => {
        setStatus('connecting');

        // Simulate network delay
        setTimeout(() => {
            setStatus('success');

            // Redirect after success
            setTimeout(() => {
                const returnPath = completeConnection(platformId);
                navigate(returnPath);
            }, 1000);

        }, 1500);
    };

    const handleCancel = () => {
        navigate(-1); // Go back
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 text-center space-y-6">

                {/* Header */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        {status === 'connecting' ? (
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        ) : status === 'success' ? (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : (
                            <div className="w-8 h-8 bg-blue-600 rounded-full" />
                        )}
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Connect {platformNames[platformId] || 'Platform'}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        SalesPal is requesting access to manage your campaigns and ads.
                    </p>
                </div>

                {/* Permissions List */}
                <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2 border border-gray-100">
                    <h4 className="font-semibold text-gray-700">Permissions Requested:</h4>
                    <ul className="space-y-1 text-gray-600 list-disc list-inside">
                        <li>View and manage ad accounts</li>
                        <li>Create and edit campaigns</li>
                        <li>Access performance insights</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={handleCancel}
                        disabled={status !== 'idle'}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleConnect}
                        disabled={status !== 'idle'}
                    >
                        {status === 'connecting' ? 'Authorizing...' :
                            status === 'success' ? 'Connected!' : 'Authorize'}
                    </Button>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                    This is a secure connection simulation. No real data is shared.
                </p>
            </Card>
        </div>
    );
};

export default ConnectPlatform;
