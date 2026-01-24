import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import CampaignListPlaceholder from './components/CampaignListPlaceholder';
import CampaignCard from './components/CampaignCard';
import RunningCampaignNotice from './components/RunningCampaignNotice';

const Campaigns = () => {
    const navigate = useNavigate();
    const [hasActiveCampaign, setHasActiveCampaign] = useState(false);

    useEffect(() => {
        // Check for mock campaign state
        const isLaunched = localStorage.getItem('salespal_campaign_launched') === 'true';
        setHasActiveCampaign(isLaunched);
    }, []);

    const handleCreateCampaign = () => {
        navigate('/marketing/campaigns/new');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
                <button
                    onClick={handleCreateCampaign}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Campaign
                </button>
            </div>

            {hasActiveCampaign ? (
                <div className="space-y-6">
                    <RunningCampaignNotice />
                    <CampaignCard />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <CampaignListPlaceholder onCreate={handleCreateCampaign} />
                </div>
            )}
        </div>
    );
};

export default Campaigns;
