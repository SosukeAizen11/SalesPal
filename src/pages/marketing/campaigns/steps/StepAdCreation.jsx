import React, { useState } from 'react';
import AdTypeSelector from '../components/ad-creation/AdTypeSelector';
import ImageAdSection from '../components/ad-creation/ImageAdSection';
import VideoAdSection from '../components/ad-creation/VideoAdSection';
import CarouselAdSection from '../components/ad-creation/CarouselAdSection';
import CopyEditor from '../components/ad-creation/CopyEditor';

const StepAdCreation = () => {
    const [selectedTypes, setSelectedTypes] = useState(['image']);
    const [adCopy, setAdCopy] = useState({
        headline: "Luxury Living in South Mumbai",
        primaryText: "Experience the pinnacle of luxury with our new sea-facing apartments. World-class amenities, prime location, and exclusive community.",
        cta: "Request a Tour"
    });

    return (
        <div className="animate-fade-in-up space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Ad Formats</h3>
                <AdTypeSelector
                    selectedTypes={selectedTypes}
                    onToggle={setSelectedTypes}
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Creatives */}
                <div className="space-y-8">
                    {selectedTypes.includes('image') && <ImageAdSection />}
                    {selectedTypes.includes('video') && <VideoAdSection />}
                    {selectedTypes.includes('carousel') && <CarouselAdSection />}

                    {selectedTypes.length === 0 && (
                        <div className="p-8 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                            Select an ad format to configure creatives
                        </div>
                    )}
                </div>

                {/* Right Column: Copy */}
                <div>
                    <CopyEditor
                        copyData={adCopy}
                        onChange={setAdCopy}
                    />
                </div>
            </div>
        </div>
    );
};

export default StepAdCreation;
