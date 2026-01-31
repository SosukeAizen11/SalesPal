import React from 'react';
import AnalyticsSection from '../AnalyticsSection';

const PlatformSplit = ({ data }) => {
    return (
        <AnalyticsSection
            title="Platform Split"
            subtitle="Spend across channels"
        >
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-full w-48 h-48 mx-auto border-8 border-gray-100 relative mb-6">
                <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold mb-1">Top Channel</p>
                    <p className="text-lg font-bold text-blue-600">Meta Ads</p>
                </div>
            </div>

            <div className="space-y-3">
                {data.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                            <span className="text-gray-600">{platform.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">{platform.value}%</span>
                    </div>
                ))}
            </div>
        </AnalyticsSection>
    );
};

export default PlatformSplit;
