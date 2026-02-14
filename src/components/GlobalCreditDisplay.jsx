import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Video, Phone, MessageSquare, Plus, AlertTriangle } from 'lucide-react';
import { useMarketing } from '../context/MarketingContext';

const CreditItem = ({ icon: Icon, label, count, usedToday, lowThreshold = 5, onClick }) => {
    const isLow = count <= lowThreshold;

    return (
        <div
            onClick={onClick}
            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
            {/* Icon & Count Display */}
            <div className={`flex items-center gap-2 ${isLow ? 'text-amber-600' : 'text-gray-600'}`}>
                <Icon className={`w-4 h-4 ${isLow ? 'text-amber-500' : 'text-gray-400 group-hover:text-primary transition-colors'}`} />
                <span className="hidden md:inline text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    {label}:
                </span>
                <span className={`text-sm font-bold ${isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                    {count}
                </span>
                {isLow && <AlertTriangle className="w-3 h-3 text-amber-500 animate-pulse hidden xl:block" />}
            </div>

            {/* Custom Tooltip */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl translate-y-2 group-hover:translate-y-0 duration-200 flex flex-col gap-1">
                <div className="font-semibold flex justify-between">
                    <span>{label} Credits</span>
                    <span className={isLow ? 'text-amber-400' : 'text-gray-300'}>{count} left</span>
                </div>
                <div className="text-gray-400 text-[10px] border-t border-gray-700 pt-1 mt-1">
                    Used {usedToday} today
                </div>
                {isLow && (
                    <div className="text-amber-400 text-[10px] mt-0.5 font-medium">
                        Low balance. Consider topping up.
                    </div>
                )}
                {/* Arrow */}
                <div className="absolute -top-1 right-6 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
        </div>
    );
};

const GlobalCreditDisplay = ({ onTopUpClick }) => {
    const navigate = useNavigate();

    const { creditState } = useMarketing();

    // Derived State
    const credits = {
        images: {
            count: (creditState?.baseLimits?.images || 0) + (creditState?.extraCredits?.images || 0),
            used: 0, // Not tracked yet
            label: 'Images'
        },
        videos: {
            count: (creditState?.baseLimits?.videos || 0) + (creditState?.extraCredits?.videos || 0),
            used: 0,
            label: 'Videos'
        },
        calls: { count: 550, used: 450, label: 'Calls' }, // Still Mocked
        whatsapp: { count: 380, used: 120, label: 'WhatsApp' } // Still Mocked
    };

    return (
        <div
            className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm hover:shadow-md transition-all group/container select-none"
        >
            <div className="flex items-center divide-x divide-gray-100">
                <CreditItem
                    icon={Image}
                    label="Images"
                    count={credits.images.count}
                    usedToday={credits.images.used}
                    onClick={() => navigate('/marketing/photos')}
                />
                <CreditItem
                    icon={Video}
                    label="Videos"
                    count={credits.videos.count}
                    usedToday={credits.videos.used}
                    lowThreshold={3}
                    onClick={() => navigate('/marketing/videos')}
                />
                <CreditItem
                    icon={Phone}
                    label="Calls"
                    count={credits.calls.count}
                    usedToday={credits.calls.used}
                    onClick={() => navigate('/marketing/calls')}
                />
                <CreditItem
                    icon={MessageSquare}
                    label="WhatsApp"
                    count={credits.whatsapp.count}
                    usedToday={credits.whatsapp.used}
                    onClick={() => navigate('/marketing/whatsapp')}
                />
            </div>

            <div
                onClick={() => onTopUpClick ? onTopUpClick() : navigate('/subscription')}
                className="pl-2 pr-2 ml-1 border-l border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg py-1.5 transition-colors"
                title="Top Up Credits"
            >
                <span className="text-xs font-semibold text-primary hidden xl:inline-block">
                    Top Up
                </span>
                <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover/container:bg-primary group-hover/container:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                </div>
            </div>
        </div>
    );
};

export default GlobalCreditDisplay;
