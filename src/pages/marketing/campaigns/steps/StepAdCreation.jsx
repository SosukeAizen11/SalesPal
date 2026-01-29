import React, { useState, useEffect, useMemo } from 'react';
import { Facebook, Layout, Image as ImageIcon, Video, Layers, Search, MousePointerClick, ExternalLink } from 'lucide-react';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';
import StepNavigation from '../components/StepNavigation';

// Mock Google Icon since lucide doesn't have it
const GoogleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
);

// Constants derived from strict requirement
const PLATFORM_CTAS = {
    meta: ['Learn More', 'Shop Now', 'Sign Up', 'Contact Us', 'WhatsApp', 'Book Now', 'Download'],
    google: ['Call Now', 'Visit Website', 'Get Quote', 'Buy Now', 'Apply Now', 'Sign Up'],
    youtube: ['Learn More', 'Visit Website', 'Subscribe']
};

const StepAdCreation = ({ onComplete, onBack, data }) => {
    // State
    const [platforms, setPlatforms] = useState({ meta: true, google: true });
    const [activeFormat, setActiveFormat] = useState('image'); // image, video, carousel
    const [copy, setCopy] = useState({
        headline: "Luxury Living in South Mumbai | Sea Facing Apartments",
        primaryText: "Experience the pinnacle of luxury with our new sea-facing apartments. World-class amenities, prime location, and exclusive community.",
        cta: "Sign Up" // Default safe for both Meta & Google
    });

    const activePlatforms = useMemo(() => Object.keys(platforms).filter(key => platforms[key]), [platforms]);

    // Derived CTA Options
    const ctaOptions = useMemo(() => {
        const allCTAs = new Set();

        // 1. Collect UNION of all CTAs from active platforms
        activePlatforms.forEach(p => {
            const list = PLATFORM_CTAS[p] || [];
            list.forEach(c => allCTAs.add(c));
        });

        return Array.from(allCTAs).map(cta => {
            // 2. Determine Validity (Must be supported on ALL selected platforms)
            const missingIn = activePlatforms.filter(p => !(PLATFORM_CTAS[p] || []).includes(cta));
            const isValid = missingIn.length === 0;

            return {
                value: cta,
                label: cta,
                isValid,
                missingIn
            };
        }).sort((a, b) => {
            // Valid options first, then alphabetical
            if (a.isValid && !b.isValid) return -1;
            if (!a.isValid && b.isValid) return 1;
            return a.value.localeCompare(b.value);
        });
    }, [activePlatforms]);

    // Auto-Reset CTA if current selection becomes invalid
    useEffect(() => {
        const currentOption = ctaOptions.find(o => o.value === copy.cta);
        if (!currentOption || !currentOption.isValid) {
            // Pick first valid option if available
            const firstValid = ctaOptions.find(o => o.isValid);
            if (firstValid) {
                setCopy(c => ({ ...c, cta: firstValid.value }));
            }
        }
    }, [ctaOptions, copy.cta]);

    const handleNext = () => {
        if (onComplete) {
            onComplete({
                adSettings: {
                    platforms,
                    format: activeFormat,
                    copy
                }
            });
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-12">

                {/* Left Column: Configuration */}
                <div className="space-y-8">

                    {/* 1. Platform Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-900 block">Select Platforms</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setPlatforms(prev => ({ ...prev, meta: !prev.meta }))}
                                className={`
                                    relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all
                                    ${platforms.meta ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}
                                `}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platforms.meta ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Facebook className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`font-semibold text-sm ${platforms.meta ? 'text-blue-900' : 'text-gray-700'}`}>Meta Ads</div>
                                    <div className="text-xs text-gray-500">Facebook & Instagram</div>
                                </div>
                                {platforms.meta && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />}
                            </button>

                            <button
                                onClick={() => setPlatforms(prev => ({ ...prev, google: !prev.google }))}
                                className={`
                                    relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all
                                    ${platforms.google ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}
                                `}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platforms.google ? 'bg-white border border-gray-100' : 'bg-gray-100 text-gray-400'}`}>
                                    <GoogleIcon className={platforms.google ? 'w-5 h-5 text-gray-900' : 'w-5 h-5 text-gray-400'} />
                                </div>
                                <div>
                                    <div className={`font-semibold text-sm ${platforms.google ? 'text-blue-900' : 'text-gray-700'}`}>Google Search</div>
                                    <div className="text-xs text-gray-500">Search & Display</div>
                                </div>
                                {platforms.google && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />}
                            </button>
                        </div>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                            <MousePointerClick className="w-3.5 h-3.5" />
                            Recommended by SalesPal AI based on "Real Estate" category
                        </p>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* 2. Ad Format */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-900 block">Ad Format</label>
                        <div className="flex bg-gray-100/80 p-1 rounded-lg w-max">
                            {[
                                { id: 'image', label: 'Single Image', icon: ImageIcon },
                                { id: 'video', label: 'Video', icon: Video },
                                { id: 'carousel', label: 'Carousel', icon: Layers },
                            ].map(format => {
                                const Icon = format.icon;
                                const isActive = activeFormat === format.id;
                                return (
                                    <button
                                        key={format.id}
                                        onClick={() => setActiveFormat(format.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                                            ${isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {format.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Copy Editor */}
                    <div className="space-y-5 pt-2">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-900">Primary Text</label>
                                <span className="text-xs text-gray-400">AI Generated</span>
                            </div>
                            <Textarea
                                value={copy.primaryText}
                                onChange={(e) => setCopy(curr => ({ ...curr, primaryText: e.target.value }))}
                                className="min-h-[100px] text-sm"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-900">Headline</label>
                                <span className="text-xs text-gray-400">AI Generated</span>
                            </div>
                            <Input
                                value={copy.headline}
                                onChange={(e) => setCopy(curr => ({ ...curr, headline: e.target.value }))}
                                className="text-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-900 block mb-2">Call to Action</label>
                            <select
                                value={copy.cta}
                                onChange={(e) => setCopy(curr => ({ ...curr, cta: e.target.value }))}
                                disabled={activePlatforms.length === 0}
                                className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {activePlatforms.length === 0 && <option>Select a platform first</option>}

                                {ctaOptions.map(opt => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={!opt.isValid}
                                    >
                                        {opt.value} {!opt.isValid ? `(Not supported on ${opt.missingIn.map(p => p === 'meta' ? 'Facebook' : p === 'google' ? 'Google' : p).join(', ')})` : ''}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1.5 text-xs text-gray-500">
                                Options are filtered based on your selected platforms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="lg:pl-8 lg:border-l border-gray-100">
                    <div className="sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-900">Ad Preview</h3>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                                {platforms.meta ? 'Facebook Feed' : 'Google Search'}
                            </span>
                        </div>

                        {/* Mock Phone Container */}
                        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden max-w-[340px] mx-auto">

                            {/* Header */}
                            <div className="p-3 border-b border-gray-50 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                <div>
                                    <div className="w-24 h-2.5 bg-gray-200 rounded-full mb-1" />
                                    <div className="w-12 h-2 bg-gray-100 rounded-full" />
                                </div>
                            </div>

                            {/* Main Content */}
                            <div>
                                <div className="p-3 pb-2 text-sm text-gray-800 leading-snug">
                                    {copy.primaryText || "Primary text will appear here..."}
                                </div>

                                {/* Media Placeholder */}
                                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center text-gray-400">
                                    {activeFormat === 'image' && <ImageAdSection size={32} />}
                                    {activeFormat === 'video' && <Video size={32} />}
                                    {activeFormat === 'carousel' && <Layers size={32} />}
                                    <span className="ml-2 text-sm font-medium opacity-50">
                                        {activeFormat === 'image' ? 'Ad Image' : activeFormat === 'video' ? 'Ad Video' : 'Carousel Media'}
                                    </span>
                                </div>

                                {/* Banner / CTA */}
                                <div className="bg-gray-50 p-3 flex justify-between items-center border-t border-gray-100">
                                    <div className="flex-1 mr-4">
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-0.5">WEBSITE.COM</p>
                                        <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{copy.headline}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded uppercase whitespace-nowrap">
                                        {copy.cta}
                                    </button>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-2 flex gap-1 border-t border-gray-50">
                                <div className="flex-1 h-8 bg-gray-50 rounded" />
                                <div className="flex-1 h-8 bg-gray-50 rounded" />
                                <div className="flex-1 h-8 bg-gray-50 rounded" />
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            This is an AI-generated preview. Final appearance may vary.
                        </p>
                    </div>
                </div>

            </div>

            {/* Footer Navigation */}
            <div className="pt-8 mt-12 border-t border-gray-100">
                <StepNavigation
                    onNext={handleNext}
                    onBack={onBack}
                    nextLabel="Continue to Budget →"
                />
            </div>
        </div>
    );
};

// Simple icon wrapper for preview
const ImageAdSection = ({ size }) => <ImageIcon size={size} />;

export default StepAdCreation;
