import React from 'react';
import { MoreHorizontal, ExternalLink, Facebook, Chrome } from 'lucide-react';
import CampaignStatusBadge from './CampaignStatusBadge';

const CampaignCard = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 animate-fade-in-up">
            <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 text-lg">AI Lead Generation Campaign</h3>
                        <CampaignStatusBadge status="running" />
                    </div>
                    <p className="text-sm text-gray-500">Created just now • South Mumbai Real Estate</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Daily Spend</span>
                    <span className="text-base font-semibold text-gray-900">₹3,500</span>
                </div>
                <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Est. Leads</span>
                    <span className="text-base font-semibold text-gray-900">45 - 60 / mo</span>
                </div>
                <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Platforms</span>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Facebook className="w-4 h-4 text-[#1877F2]" />
                        <Chrome className="w-4 h-4 text-[#EA4335]" />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                    disabled
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 rounded-lg border border-gray-200 cursor-not-allowed"
                    title="Available after 24 hours"
                >
                    Pause Campaign
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    View Details
                </button>
            </div>
        </div>
    );
};

export default CampaignCard;
