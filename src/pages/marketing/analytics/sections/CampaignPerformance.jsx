import React from 'react';
import AnalyticsSection from '../AnalyticsSection';
import Badge from '../../../../components/ui/Badge';

const CampaignPerformance = ({ campaigns, onCampaignClick, showProject = false }) => {
    return (
        <AnalyticsSection
            title="Campaign Performance"
            subtitle="Granular breakdown by campaign"
        >
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                            <th className="pb-3 pl-2">Campaign Name</th>
                            {showProject && <th className="pb-3">Project</th>}
                            <th className="pb-3">Platform</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Spend</th>
                            <th className="pb-3 text-right">Leads</th>
                            <th className="pb-3 text-right">CPL</th>
                            <th className="pb-3 text-right pr-2">CTR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {campaigns && campaigns.length > 0 ? (
                            campaigns.map((campaign) => (
                                <tr
                                    key={campaign.id}
                                    onClick={() => onCampaignClick(campaign)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <td className="py-3 pl-2 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{campaign.name}</td>
                                    {showProject && (
                                        <td className="py-3 text-gray-500 text-xs">{campaign.projectName}</td>
                                    )}
                                    <td className="py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${campaign.platform === 'Meta' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                campaign.platform === 'Google' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-sky-50 text-sky-700 border-sky-100'
                                            }`}>
                                            {campaign.platform}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <Badge variant={campaign.status === 'Running' ? 'success' : 'neutral'} size="sm">
                                            {campaign.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-right font-medium text-gray-600">{campaign.spend}</td>
                                    <td className="py-3 text-right font-medium text-gray-600">{campaign.leads}</td>
                                    <td className="py-3 text-right font-medium text-gray-600">{campaign.cpl}</td>
                                    <td className="py-3 text-right pr-2 font-medium text-gray-600">{campaign.ctr}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={showProject ? "8" : "7"} className="py-8 text-center text-gray-400">
                                    No campaigns found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">View All Campaigns</button>
            </div>
        </AnalyticsSection>
    );
};

export default CampaignPerformance;
