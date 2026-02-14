import React from 'react';
import { Upload, PlayCircle, Sparkles } from 'lucide-react';
import { useSubscription } from '../../../../../commerce/SubscriptionContext';

const VideoAdSection = () => {
    const { canConsume, consume } = useSubscription();

    const handleGenerateVideo = () => {
        if (!canConsume('marketing', 'videos')) {
            alert('You have reached your monthly video limit.');
            return;
        }

        consume('marketing', 'videos');
        // Existing video generation logic would run here
    };

    return (
        <div className="space-y-4 animate-fade-in-up">
            <h4 className="text-sm font-semibold text-gray-900">Video Creatives</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Mock Video Preview */}
                <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden group border border-gray-200 flex items-center justify-center sm:col-span-2">
                    <PlayCircle className="w-12 h-12 text-white/80" />
                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white font-medium">
                        0:15
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 hover:border-secondary hover:bg-secondary/5 transition-all text-gray-500 hover:text-secondary">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-medium">Upload Video</span>
                    </button>
                    <button
                        className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 hover:border-secondary hover:bg-secondary/5 transition-all text-gray-500 hover:text-secondary"
                        onClick={handleGenerateVideo}
                    >
                        <Sparkles className="w-6 h-6" />
                        <span className="text-xs font-medium">Generate Video</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoAdSection;
