import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import CampaignListPlaceholder from './components/CampaignListPlaceholder';
import CampaignCard from './components/CampaignCard';
import RunningCampaignNotice from './components/RunningCampaignNotice';

import { useMarketing } from '../../context/MarketingContext';

const Campaigns = () => {
    const navigate = useNavigate();
    const { campaigns } = useMarketing();

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

            {campaigns.length > 0 ? (
                <div className="space-y-6">
                    <RunningCampaignNotice />
                    {campaigns.map(campaign => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
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
