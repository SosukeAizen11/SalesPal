import React, { useState, useEffect, useMemo } from 'react';
import { Facebook, Linkedin, Instagram, Video, Layers, Search, MousePointerClick, ExternalLink, Sparkles, TrendingUp, CheckCircle2, Info, CreditCard, Image as ImageIcon } from 'lucide-react';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';
import StepNavigation from '../components/StepNavigation';

// Mock Google Icon
const GoogleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
);

// YouTube Icon
const YouTubeIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

// Twitter/X Icon
const XIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// All Available Platforms
const ALL_PLATFORMS = [
    {
        id: 'meta',
        name: 'Meta Ads',
        subtext: 'Facebook & Instagram',
        icon: Facebook,
        recommended: true,
        reasoning: 'Best for visual discovery & reach in Real Estate'
    },
    {
        id: 'google',
        name: 'Google Ads',
        subtext: 'Search & Display',
        icon: GoogleIcon,
        recommended: true,
        reasoning: 'High intent search traffic for property seekers'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn Ads',
        subtext: 'Professional Network',
        icon: Linkedin,
        recommended: false
    },
    {
        id: 'youtube',
        name: 'YouTube Ads',
        subtext: 'Video Platform',
        icon: YouTubeIcon,
        recommended: false
    },
    {
        id: 'twitter',
        name: 'X (Twitter)',
        subtext: 'Social Media',
        icon: XIcon,
        recommended: false
    },
    {
        id: 'instagram',
        name: 'Instagram',
        subtext: 'Visual Stories',
        icon: Instagram,
        recommended: false
    }
];

// Platform CTA mappings
const PLATFORM_CTAS = {
    meta: ['Learn More', 'Shop Now', 'Sign Up', 'Contact Us', 'WhatsApp', 'Book Now', 'Download'],
    google: ['Call Now', 'Visit Website', 'Get Quote', 'Buy Now', 'Apply Now', 'Sign Up'],
    linkedin: ['Learn More', 'Sign Up', 'Download', 'Register'],
    youtube: ['Learn More', 'Visit Website', 'Subscribe'],
    twitter: ['Learn More', 'Sign Up', 'Download'],
    instagram: ['Learn More', 'Shop Now', 'Sign Up', 'Contact Us']
};

// Ad Format Recommendations
const AD_FORMAT_RECOMMENDATIONS = {
    carousel: {
        title: 'Carousel Ads',
        icon: Layers,
        stat: '~42% more leads',
        description: 'Based on similar Real Estate audience data, carousel ads generate approximately 42% more leads compared to single image or video ads.',
        credits: { used: 2, total: 4 }
    },
    video: {
        title: 'Video Ads',
        icon: Video,
        stat: '~35% higher engagement',
        description: 'Video ads show 35% higher engagement rates for property showcases with virtual tours.',
        credits: { used: 3, total: 10 }
    },
    image: {
        title: 'Single Image Ads',
        icon: ImageIcon,
        stat: 'Cost effective',
        description: 'Single image ads offer the best cost-per-click for broad awareness campaigns.',
        credits: { used: 8, total: 20 }
    }
};

const StepAdCreation = ({ onComplete, onBack, data }) => {
    // State
    const [selectedPlatforms, setSelectedPlatforms] = useState(['meta', 'google']);
    const [activeFormat, setActiveFormat] = useState('carousel'); // AI recommended default
    const [copy, setCopy] = useState({
        headline: "Luxury Living in South Mumbai | Sea Facing Apartments",
        primaryText: "Experience the pinnacle of luxury with our new sea-facing apartments. World-class amenities, prime location, and exclusive community.",
        cta: "Sign Up"
    });

    const recommendedPlatforms = useMemo(() => ALL_PLATFORMS.filter(p => p.recommended), []);
    const otherPlatforms = useMemo(() => ALL_PLATFORMS.filter(p => !p.recommended), []);

    const togglePlatform = (platformId) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        );
    };

    // Derived CTA Options
    const ctaOptions = useMemo(() => {
        const allCTAs = new Set();

        selectedPlatforms.forEach(p => {
            const list = PLATFORM_CTAS[p] || [];
            list.forEach(c => allCTAs.add(c));
        });

        return Array.from(allCTAs).map(cta => {
            const missingIn = selectedPlatforms.filter(p => !(PLATFORM_CTAS[p] || []).includes(cta));
            const isValid = missingIn.length === 0;

            return {
                value: cta,
                label: cta,
                isValid,
                missingIn
            };
        }).sort((a, b) => {
            if (a.isValid && !b.isValid) return -1;
            if (!a.isValid && b.isValid) return 1;
            return a.value.localeCompare(b.value);
        });
    }, [selectedPlatforms]);

    // Auto-Reset CTA if current selection becomes invalid
    useEffect(() => {
        const currentOption = ctaOptions.find(o => o.value === copy.cta);
        if (!currentOption || !currentOption.isValid) {
            const firstValid = ctaOptions.find(o => o.isValid);
            if (firstValid) {
                setCopy(c => ({ ...c, cta: firstValid.value }));
            }
        }
    }, [ctaOptions, copy.cta]);

    // Validation State
    const [showError, setShowError] = useState(false);

    const handleNext = () => {
        // Validation
        let errorMsg = "";
        if (selectedPlatforms.length === 0) errorMsg = "Please select at least one platform.";
        else if (!copy.primaryText.trim()) errorMsg = "Primary text is required.";
        else if (!copy.headline.trim()) errorMsg = "Headline is required.";

        if (errorMsg) {
            setShowError(true);
            alert(errorMsg); // Pop up as requested
            return;
        }

        if (onComplete) {
            onComplete({
                adSettings: {
                    platforms: selectedPlatforms,
                    format: activeFormat,
                    copy
                }
            });
        }
    };

    const currentFormatRec = AD_FORMAT_RECOMMENDATIONS[activeFormat];

    return (
        <div className="animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-12">

                {/* Left Column: Configuration */}
                <div className="space-y-8">

                    {/* PART 1: Platform Selection */}
                    <div className="space-y-4">

                        {/* AI Recommended Platforms */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className={`text-sm font-semibold uppercase tracking-wide ${showError && selectedPlatforms.length === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                    AI Recommended Platforms {showError && selectedPlatforms.length === 0 && <span className="text-red-500 normal-case ml-2">- Please select at least one</span>}
                                </label>
                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-medium border border-purple-100 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    AI Powered
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {recommendedPlatforms.map(platform => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => togglePlatform(platform.id)}
                                            className={`
                                                relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all group
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h5 className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        {platform.name}
                                                    </h5>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                                                        Recommended
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">{platform.subtext}</p>
                                                <p className="text-xs text-green-700 flex items-start gap-1.5">
                                                    <Info className="w-3 h-3 shrink-0 mt-0.5" />
                                                    <span>{platform.reasoning}</span>
                                                </p>
                                            </div>
                                            <div className={`
                                                w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0
                                                ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}
                                            `}>
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Other Available Platforms */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium text-gray-700">
                                Other Available Platforms
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                {otherPlatforms.map(platform => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => togglePlatform(platform.id)}
                                            className={`
                                                relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all group
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                            `}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className={`font-semibold text-xs ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {platform.name}
                                                </h5>
                                                <p className="text-[10px] text-gray-500">{platform.subtext}</p>
                                            </div>
                                            <div className={`
                                                w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0
                                                ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}
                                            `}>
                                                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            💡 <strong>Tip:</strong> You can select any combination of platforms. AI recommendations are based on your industry and target audience.
                        </p>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* PART 2: AI Recommended Ad Format */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                AI Recommended Ad Format
                            </label>
                        </div>

                        {/* Format Selector */}
                        <div className="flex bg-gray-100/80 p-1 rounded-lg w-max">
                            {Object.entries(AD_FORMAT_RECOMMENDATIONS).map(([id, format]) => {
                                const Icon = format.icon;
                                const isActive = activeFormat === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActiveFormat(id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all
                                            ${isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {format.title}
                                        {id === 'carousel' && (
                                            <span className="text-[9px] font-bold uppercase bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                                Best
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Format Recommendation Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-purple-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-purple-900 text-sm mb-1">
                                        Performance Insight
                                    </h4>
                                    <p className="text-lg font-bold text-purple-700 mb-2">
                                        {currentFormatRec.stat}
                                    </p>
                                    <p className="text-xs text-purple-800 leading-relaxed">
                                        {currentFormatRec.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PART 3: Credit Balance Display */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white shadow-sm border border-blue-100 flex items-center justify-center shrink-0">
                                    <CreditCard className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-blue-900 text-sm mb-1">
                                        Your Credit Balance
                                    </h4>
                                    <p className="text-xs text-blue-700 mb-3">
                                        You have <strong>{currentFormatRec.credits.total - currentFormatRec.credits.used} of {currentFormatRec.credits.total}</strong> {currentFormatRec.title.toLowerCase()} credits remaining this month.
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs text-blue-600">
                                            <span>Used: {currentFormatRec.credits.used}</span>
                                            <span>Remaining: {currentFormatRec.credits.total - currentFormatRec.credits.used}</span>
                                        </div>
                                        <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                                style={{ width: `${(currentFormatRec.credits.used / currentFormatRec.credits.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Copy Editor */}
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-900">Primary Text</label>
                                <span className="text-xs text-gray-400">AI Generated</span>
                            </div>
                            <Textarea
                                value={copy.primaryText}
                                onChange={(e) => setCopy(curr => ({ ...curr, primaryText: e.target.value }))}
                                className="min-h-[100px] text-sm"
                                error={showError && !copy.primaryText.trim() ? "Primary text is required" : undefined}
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
                                error={showError && !copy.headline.trim() ? "Headline is required" : undefined}
                            />
                        </div>

                        <div className="relative z-10">
                            <label className="text-sm font-medium text-gray-900 block mb-2">Call to Action</label>
                            <select
                                value={copy.cta}
                                onChange={(e) => setCopy(curr => ({ ...curr, cta: e.target.value }))}
                                disabled={selectedPlatforms.length === 0}
                                className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                            >
                                {selectedPlatforms.length === 0 && <option>Select a platform first</option>}

                                {ctaOptions.map(opt => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={!opt.isValid}
                                    >
                                        {opt.value} {!opt.isValid ? `(Not supported on ${opt.missingIn.join(', ')})` : ''}
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
                                {selectedPlatforms.includes('meta') ? 'Facebook Feed' : 'Google Search'}
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
                                    {activeFormat === 'image' && <ImageIcon size={32} />}
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

export default StepAdCreation;
