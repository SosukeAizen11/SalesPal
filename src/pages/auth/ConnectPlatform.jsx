import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntegrations } from '../../context/IntegrationContext';
import { Loader2, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * ConnectPlatform — directly connects the platform via Supabase.
 * No OAuth, no external redirect, no simulated delay.
 */
const ConnectPlatform = () => {
    const { platformId } = useParams();
    const navigate = useNavigate();
    const { connectIntegration } = useIntegrations();
    const [status, setStatus] = useState('connecting');

    const platformNames = {
        meta: 'Meta Ads (Facebook & Instagram)',
        google: 'Google Ads',
        linkedin: 'LinkedIn Ads',
        instagram: 'Instagram Professional'
    };

    useEffect(() => {
        const connect = async () => {
            await connectIntegration(platformId);
            setStatus('success');
            // Navigate back to settings after a brief confirmation
            setTimeout(() => {
                navigate('/settings/integrations');
            }, 1000);
        };
        connect();
    }, [platformId, connectIntegration, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 text-center space-y-6">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        {status === 'connecting' ? (
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        ) : (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        )}
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                        {status === 'success' ? 'Connected!' : `Connecting ${platformNames[platformId] || 'Platform'}...`}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        {status === 'success'
                            ? 'Redirecting back to settings...'
                            : 'Saving integration to your account...'
                        }
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ConnectPlatform;
