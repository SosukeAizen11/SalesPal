import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';
import ReviewSection from '../components/review/ReviewSection';
import ReviewRow from '../components/review/ReviewRow';
import LaunchConfirmation from '../components/review/LaunchConfirmation';

const StepReviewLaunch = ({ onLaunch }) => {
    const navigate = useNavigate();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

    const handleLaunch = () => {
        if (!isConfirmed) return;

        setIsLaunching(true);

        // Simulate API call
        setTimeout(() => {
            if (onLaunch) {
                onLaunch();
            }
        }, 1500);
    };

    return (
        <div className="animate-fade-in-up space-y-8 pb-8">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Details */}
                <div className="space-y-6">
                    <ReviewSection title="Business & Goals" onEdit={() => { }}>
                        <ReviewRow label="Website" value="www.luxuryliving.com" />
                        <ReviewRow label="Industry" value="Real Estate" />
                        <ReviewRow label="Campaign Goal" value="Lead Generation" />
                    </ReviewSection>

                    <ReviewSection title="Platform & Budget" onEdit={() => { }}>
                        <ReviewRow label="Platforms" value="Meta Ads, Google Search" />
                        <ReviewRow label="Daily Budget" value="₹3,500" />
                        <ReviewRow label="Est. Monthly Spend" value="₹1,06,435" />
                        <ReviewRow label="Est. Results" value="45 - 60 Leads / Month" subtext="Based on current market trends" />
                    </ReviewSection>
                </div>

                {/* Right Column: Creative & Launch */}
                <div className="space-y-6">
                    <ReviewSection title="Ad Creative" onEdit={() => { }}>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide py-2">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 border border-gray-200">
                                <img src="https://source.unsplash.com/random/200x200?modern,architecture" className="w-full h-full object-cover rounded-lg" alt="Preview" />
                            </div>
                            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 border border-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-400">+3 more</span>
                            </div>
                        </div>
                        <ReviewRow label="Headline" value="Luxury Living in South Mumbai" />
                        <ReviewRow label="Primary Text" value="Experience the pinnacle of luxury..." subtext="Truncated for preview" />
                        <ReviewRow label="Call to Action" value="Request a Tour" />
                    </ReviewSection>

                    <LaunchConfirmation
                        isConfirmed={isConfirmed}
                        onToggle={setIsConfirmed}
                    />
                </div>
            </div>

            {/* Launch Action Bar */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4 mt-8 z-10 flex items-center justify-between md:justify-end gap-4">
                <div className="hidden md:block text-sm text-gray-500 mr-auto">
                    Grand Total: <span className="font-semibold text-gray-900">₹3,500 / day</span>
                </div>

                <button
                    onClick={handleLaunch}
                    disabled={!isConfirmed || isLaunching}
                    className={`
                        flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all transform active:scale-95
                        ${isConfirmed && !isLaunching
                            ? 'bg-secondary text-primary hover:shadow-xl hover:-translate-y-0.5'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {isLaunching ? (
                        <>
                            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <span>Launching...</span>
                        </>
                    ) : (
                        <>
                            <Rocket className="w-5 h-5" />
                            <span>Launch Campaign</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default StepReviewLaunch;
