import React, { useState, useEffect, useMemo } from 'react';
import { Facebook, Linkedin, Instagram, Video, Layers, Search, MousePointerClick, ExternalLink, Sparkles, TrendingUp, CheckCircle2, Info, CreditCard, Image as ImageIcon, Wand2, Eye } from 'lucide-react';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';
import StepNavigation from '../components/StepNavigation';
import Button from '../../../../components/ui/Button';

// New Components
import CreditWarningModal from '../components/ad-creation/CreditWarningModal';
import MediaUploadSection from '../components/ad-creation/MediaUploadSection';
import PromotePostSection from '../components/ad-creation/PromotePostSection';
import AdPreviewPanel from './components/AdPreviewPanel';

// Context
import { useSubscription } from '../../../../commerce/SubscriptionContext';

// --- Brand Icons ---

const MetaIcon = ({ className }) => (
    <img
        src="/meta-company-logo.avif"
        alt="Meta"
        className={`${className} object-contain`}
    />
);

const GoogleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const LinkedInIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const InstagramIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
        <defs>
            <linearGradient id="igGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f09433', stopOpacity: 1 }} />
                <stop offset="25%" style={{ stopColor: '#e6683c', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#dc2743', stopOpacity: 1 }} />
                <stop offset="75%" style={{ stopColor: '#cc2366', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#bc1888', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path fill="url(#igGradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const YouTubeIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
        <path d="M10 8l6 4-6 4V8z" fill="#FFFFFF" />
    </svg>
);

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
        icon: MetaIcon,
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
        icon: LinkedInIcon,
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
        icon: InstagramIcon,
        recommended: false
    }
];

// Platform CTA mappings
const PLATFORM_CTAS = {
    meta: ['Learn More', 'Shop Now', 'Sign Up', 'Contact Us', 'WhatsApp', 'Book Now', 'Download'],
    google: ['Learn More', 'Call Now', 'Visit Website', 'Get Quote', 'Buy Now', 'Apply Now', 'Sign Up'],
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
        cost: 2,
        resource: 'images',
        totalLimit: 20 // Fallback
    },
    video: {
        title: 'Video Ads',
        icon: Video,
        stat: '~35% higher engagement',
        description: 'Video ads show 35% higher engagement rates for property showcases with virtual tours.',
        cost: 1,
        resource: 'videos',
        totalLimit: 4 // Fallback
    },
    image: {
        title: 'Single Image Ads',
        icon: ImageIcon,
        stat: 'Cost effective',
        description: 'Single image ads offer the best cost-per-click for broad awareness campaigns.',
        cost: 1,
        resource: 'images',
        totalLimit: 20 // Fallback
    }
};

const StepAdCreation = ({ onComplete, onBack, data }) => {
    // Context
    const { getRemaining, consume } = useSubscription();

    // State
    const [selectedPlatforms, setSelectedPlatforms] = useState(['meta', 'google']);
    const [activeFormat, setActiveFormat] = useState('carousel'); // AI recommended default
    const [copy, setCopy] = useState({
        headline: "Luxury Living in South Mumbai | Sea Facing Apartments",
        primaryText: "Experience the pinnacle of luxury with our new sea-facing apartments. World-class amenities, prime location, and exclusive community.",
        cta: "Sign Up"
    });

    // New State for Preview Flow
    const [previewMode, setPreviewMode] = useState('demo'); // 'demo' | 'generated' | 'uploaded' | 'promoted'
    const [uploadedMedia, setUploadedMedia] = useState(null);
    const [promotedPost, setPromotedPost] = useState(null);
    const [showCreditWarning, setShowCreditWarning] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

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

    // Format Change Logic - Reset preview if needed
    useEffect(() => {
        if (previewMode === 'generated' || previewMode === 'demo') {
            setPreviewMode('demo');
            setUploadedMedia(null);
            setPromotedPost(null);
        }
    }, [activeFormat]);

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
                    copy,
                    media: uploadedMedia || promotedPost || { type: 'ai-generated' }
                }
            });
        }
    };

    // Preview Generation Logic
    const handleGeneratePreviewClick = () => {
        const config = AD_FORMAT_RECOMMENDATIONS[activeFormat];
        const remaining = getRemaining('marketing', config.resource);

        if (remaining < config.cost) {
            alert(`Insufficient credits! You need ${config.cost} ${config.resource} credits.`);
            return;
        }

        setShowCreditWarning(true);
    };

    const confirmGeneratePreview = () => {
        const config = AD_FORMAT_RECOMMENDATIONS[activeFormat];
        const remaining = getRemaining('marketing', config.resource);

        if (remaining < config.cost) {
            alert("Insufficient credits!");
            setShowCreditWarning(false);
            return;
        }

        setShowCreditWarning(false);
        setIsGenerating(true);

        // Simulate API call and Consume Credits
        setTimeout(() => {
            let success = true;
            for (let i = 0; i < config.cost; i++) {
                if (!consume('marketing', config.resource)) success = false;
            }

            if (success) {
                setPreviewMode('generated');
            } else {
                alert("Error consuming credits.");
                setPreviewMode('demo'); // Revert
            }
            setIsGenerating(false);
        }, 1500);
    };

    const handleFileUpload = (fileData) => {
        setUploadedMedia(fileData);
        setPreviewMode('uploaded');
        setPromotedPost(null);
    };

    const handlePromotePost = (post) => {
        setPromotedPost(post);
        setPreviewMode('promoted');
        setUploadedMedia(null);

        // Pre-fill copy from post
        setCopy(curr => ({
            ...curr,
            primaryText: post.caption || curr.primaryText
        }));
    };

    // Calculate Dynamic Credit Stats
    const currentFormatRec = useMemo(() => {
        const config = AD_FORMAT_RECOMMENDATIONS[activeFormat];
        const remaining = getRemaining('marketing', config.resource);

        return {
            ...config,
            credits: {
                remaining: remaining,
                total: config.totalLimit, // approximation for UI
                used: Math.max(0, config.totalLimit - remaining) // approximation
            }
        };
    }, [activeFormat, getRemaining, consume]); // Trigger update when consume happens (via component re-render on subscription change)

    return (
        <div className="animate-fade-in-up w-full max-w-[1400px] mx-auto">
            <CreditWarningModal
                isOpen={showCreditWarning}
                onClose={() => setShowCreditWarning(false)}
                onConfirm={confirmGeneratePreview}
                format={activeFormat}
            />

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Configuration (Approx 60-65%) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

                    {/* 1. Platform Selection */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <label className={`text-sm font-semibold uppercase tracking-wide text-gray-900`}>
                                Target Platforms
                            </label>
                            {showError && selectedPlatforms.length === 0 && <span className="text-red-500 text-xs font-medium">Please select at least one</span>}
                        </div>

                        {/* Recommended */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {recommendedPlatforms.map(platform => {
                                const Icon = platform.icon;
                                const isSelected = selectedPlatforms.includes(platform.id);
                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => togglePlatform(platform.id)}
                                        className={`
                                            relative flex items-start gap-3 p-4 pr-12 rounded-xl border text-left transition-all group h-full
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
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h5 className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {platform.name}
                                                </h5>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 whitespace-nowrap">
                                                    Recommended
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2 leading-relaxed">{platform.subtext}</p>
                                        </div>
                                        <div className={`
                                            w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 absolute top-4 right-4
                                            ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}
                                        `}>
                                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Other Platforms */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-3 block">
                                Other Available Platforms
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {otherPlatforms.map(platform => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => togglePlatform(platform.id)}
                                            className={`
                                                relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all group
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                            `}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={`text-xs font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                {platform.name}
                                            </span>
                                            <div className={`
                                                w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 absolute top-2 right-2
                                                ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}
                                            `}>
                                                {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 2. Ad Format & Performance */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                AI Recommended Ad Format
                            </label>
                        </div>

                        <div className="flex bg-gray-100 p-1 rounded-lg w-full mb-6 max-w-md">
                            {Object.entries(AD_FORMAT_RECOMMENDATIONS).map(([id, format]) => {
                                const Icon = format.icon;
                                const isActive = activeFormat === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActiveFormat(id)}
                                        className={`
                                            flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                                            ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {format.title}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Performance Insight */}
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/80 shadow-sm border border-purple-100 flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-purple-900 mb-0.5">Why this format?</p>
                                        <p className="text-lg font-bold text-purple-700 mb-1">{currentFormatRec.stat}</p>
                                        <p className="text-xs text-purple-800/80 leading-relaxed">
                                            {currentFormatRec.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Credit Balance */}
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/80 shadow-sm border border-amber-100 flex items-center justify-center shrink-0">
                                        <CreditCard className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-semibold text-amber-900">Ad Credits</p>
                                            <span className="text-xs font-bold text-amber-800">{currentFormatRec.credits.remaining} Left</span>
                                        </div>
                                        <div className="h-1.5 bg-amber-200/50 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-amber-500"
                                                style={{ width: `${(currentFormatRec.credits.used / currentFormatRec.credits.total) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-amber-700 leading-tight">
                                            Previewing costs <strong>{currentFormatRec.cost} credits</strong>. Uploading your own media is free.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Promote Post (Full Width) */}
                    <PromotePostSection onSelect={handlePromotePost} />

                    {/* 4. Ad Copy */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
                        <h4 className="font-semibold text-gray-900">Ad Copy & Details</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-medium text-gray-700">Primary Text</label>
                                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">AI Generated</span>
                                </div>
                                <Textarea
                                    value={copy.primaryText}
                                    onChange={(e) => setCopy(curr => ({ ...curr, primaryText: e.target.value }))}
                                    className="min-h-[100px] text-sm resize-none"
                                    placeholder="Enter the main text for your ad..."
                                    error={showError && !copy.primaryText.trim() ? "Primary text is required" : undefined}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-medium text-gray-700">Headline</label>
                                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">AI Generated</span>
                                </div>
                                <Input
                                    value={copy.headline}
                                    onChange={(e) => setCopy(curr => ({ ...curr, headline: e.target.value }))}
                                    className="text-sm font-medium"
                                    placeholder="Short, catchy headline"
                                    error={showError && !copy.headline.trim() ? "Headline is required" : undefined}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1.5">Call to Action</label>
                                <select
                                    value={copy.cta}
                                    onChange={(e) => setCopy(curr => ({ ...curr, cta: e.target.value }))}
                                    disabled={selectedPlatforms.length === 0}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:alert-50 disabled:cursor-not-allowed"
                                >
                                    {selectedPlatforms.length === 0 && <option>Select a platform first</option>}
                                    {ctaOptions.map(opt => (
                                        <option key={opt.value} value={opt.value} disabled={!opt.isValid}>
                                            {opt.value} {!opt.isValid ? `(Not supported on ${opt.missingIn.map(p => ALL_PLATFORMS.find(ap => ap.id === p)?.name).join(', ')})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer Navigation (Moved to Left Column Content) */}
                    <div className="pt-4 pb-8">
                        <StepNavigation
                            onNext={handleNext}
                            onBack={onBack}
                            nextLabel="Continue to Budget →"
                        />
                    </div>
                </div>

                {/* Right Column: Rich Ad Preview (Sticky) */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ minHeight: 640 }}>
                        {/* Panel header */}
                        <div className="shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-gray-900 text-sm">Ad Preview</h3>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${previewMode === 'generated' ? 'bg-green-50 border-green-200 text-green-700' :
                                previewMode === 'uploaded' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                    previewMode === 'promoted' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                        'bg-gray-100 border-gray-200 text-gray-500'
                                }`}>
                                {previewMode === 'demo' ? 'Sample' : previewMode === 'generated' ? 'AI Generated' : previewMode === 'uploaded' ? 'Your Media' : 'Promoted Post'}
                            </span>
                        </div>

                        {/* The panel itself */}
                        <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
                            <AdPreviewPanel
                                copy={copy}
                                uploadedMedia={uploadedMedia}
                                format={activeFormat}
                                previewMode={previewMode}
                                selectedPlatforms={selectedPlatforms}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StepAdCreation;
