import React from 'react';
import { Megaphone, Activity, BarChart2 } from 'lucide-react';

const CampaignDetailView = ({ campaign }) => {
    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm text-blue-600">
                    <Megaphone className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-500">{campaign.platform} • {campaign.status}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Total Spend</p>
                    <p className="text-xl font-bold text-gray-900">{campaign.spend}</p>
                </div>
            </div>

            {/* Mini Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Leads</p>
                    <p className="text-xl font-bold text-gray-900">{campaign.leads}</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">CPL</p>
                    <p className="text-xl font-bold text-gray-900">{campaign.cpl}</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">CTR</p>
                    <p className="text-xl font-bold text-gray-900">{campaign.ctr}</p>
                </div>
            </div>

            {/* Mini Performance Chart Placeholder */}
            <div className="h-32 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <Activity className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-xs font-medium">Performance History Chart</span>
            </div>

            {/* AI Notes */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4" /> AI Analysis
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                    This campaign is performing in the top 10% for your account.
                    The CPL is <strong>15% lower</strong> than average.
                    Recommendation: Increase daily budget by 20% to scale volume.
                </p>
            </div>
        </div>
    );
};

export default CampaignDetailView;
