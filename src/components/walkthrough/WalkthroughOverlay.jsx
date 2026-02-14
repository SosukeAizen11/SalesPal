import React, { useState, useEffect, useRef } from 'react';
import { useWalkthrough } from '../../context/WalkthroughContext';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const WalkthroughOverlay = () => {
    const { isOpen, currentStep, nextStep, prevStep, skipWalkthrough, currentStepIndex, totalSteps } = useWalkthrough();
    const [targetRect, setTargetRect] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!isOpen || !currentStep) return;

        // 1. Reset rect immediately to avoid "stuck" highlights
        setTargetRect(null);

        if (currentStep.isModal) return;

        let pollCount = 0;
        const maxPolls = 20; // 2 seconds approx (100ms * 20)

        const findAndSetPosition = () => {
            const element = document.querySelector(currentStep.target);

            if (element) {
                const rect = element.getBoundingClientRect();

                // Only update if we have meaningful dimensions
                if (rect.width > 0 && rect.height > 0) {
                    setTargetRect({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        viewportTop: rect.top,
                        viewportLeft: rect.left
                    });

                    // Check if element is in viewport, if not scroll
                    // Relaxed check: Only require top-left to be visible or within reasonable bounds
                    // Allow elements taller/wider than viewport (like sidebar) without forcing scroll
                    const isInViewport = (
                        rect.top >= -50 && // Allow small negative top (e.g. sticky header overlap)
                        rect.left >= -50 &&
                        rect.top < window.innerHeight &&
                        rect.left < window.innerWidth
                    );

                    if (!isInViewport) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    }

                    return true; // Found!
                }
            }
            return false; // Not found yet
        };

        // Try immediately
        if (!findAndSetPosition()) {
            // Poll if not found
            const intervalId = setInterval(() => {
                pollCount++;
                if (findAndSetPosition() || pollCount >= maxPolls) {
                    clearInterval(intervalId);
                }
            }, 100);

            return () => clearInterval(intervalId);
        }

        const handleResizeOrScroll = () => {
            // Debounced re-check
            findAndSetPosition();
        };

        window.addEventListener('resize', handleResizeOrScroll);
        window.addEventListener('scroll', handleResizeOrScroll);

        return () => {
            window.removeEventListener('resize', handleResizeOrScroll);
            window.removeEventListener('scroll', handleResizeOrScroll);
        };
    }, [isOpen, currentStep]);

    if (!isOpen) return null;

    // Calculate Tooltip Position
    // Calculate Tooltip Position with Auto-Flip
    const getTooltipStyle = () => {
        if (currentStep.isModal || !targetRect) {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000
            };
        }

        const spacing = 12;
        let position = currentStep.position || 'bottom';
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Helper to check if rect fits
        const checkFit = (pos, t, l, w, h) => {
            // Simple check based on assumed tooltip dimensions (max 320px width, ~150px height)
            const ttW = 320;
            const ttH = 200;

            if (pos === 'top') return t - ttH > 0;
            if (pos === 'bottom') return t + h + ttH < viewportHeight;
            if (pos === 'left') return l - ttW > 0;
            if (pos === 'right') return l + w + ttH < viewportWidth;
            return true;
        };

        // Auto-flip logic
        if (position === 'top' && !checkFit('top', targetRect.top, targetRect.left, targetRect.width, targetRect.height)) position = 'bottom';
        else if (position === 'bottom' && !checkFit('bottom', targetRect.top, targetRect.left, targetRect.width, targetRect.height)) position = 'top';
        else if (position === 'left' && !checkFit('left', targetRect.top, targetRect.left, targetRect.width, targetRect.height)) position = 'right';
        else if (position === 'right' && !checkFit('right', targetRect.top, targetRect.left, targetRect.width, targetRect.height)) position = 'left';

        let top = 0;
        let left = 0;
        const rect = targetRect;

        switch (position) {
            case 'top':
                top = rect.top - spacing;
                left = rect.left + rect.width / 2;
                break;
            case 'bottom':
                top = rect.top + rect.height + spacing;
                left = rect.left + rect.width / 2;
                break;
            case 'left':
                top = rect.top + rect.height / 2;
                left = rect.left - spacing;
                break;
            case 'right':
                top = rect.top + rect.height / 2;
                left = rect.left + rect.width + spacing;
                break;
            default:
                break;
        }

        // Clamp to viewport edges to prevent partial overflow
        // We use translate transform, so we need to be careful.
        // For simplicity, we just rely on flip.

        return {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            transform: position === 'top' ? 'translate(-50%, -100%)' :
                position === 'bottom' ? 'translate(-50%, 0)' :
                    position === 'left' ? 'translate(-100%, -50%)' :
                        'translate(0, -50%)',
            zIndex: 10000,
            width: 'max-content',
            maxWidth: '320px'
        };
    };

    return (
        <div className="fixed inset-0 z-9998 pointer-events-auto" style={{ zIndex: 9998 }}>
            {/* Dark Overlay with Cutout */}
            {/* 
               We simply use a full overlay. For the "cutout" effect, we can use a high-z-index element that mimics the target 
               or use SVG mask. SVG mask is cleanest.
            */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 9998 }}>
                <defs>
                    <mask id="walkthrough-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {targetRect && !currentStep.isModal && (
                            <rect
                                x={targetRect.left}
                                y={targetRect.top}
                                width={targetRect.width}
                                height={targetRect.height}
                                rx="8" // Rounded corners for valid look
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    fillOpacity="0.55"
                    mask="url(#walkthrough-mask)"
                />
            </svg>

            {/* Click blocking layer for everywhere except target? 
                Actually, usually we want to block interactions with the target too unless specified. 
                Request says "No layout shifts... Scroll lock".
                We just put a transparent div over everything to block clicks.
            */}
            <div className="absolute inset-0" style={{ zIndex: 9998 }} />

            {/* Highlight Border (Optional, for better visibility) */}
            {targetRect && !currentStep.isModal && (
                <div
                    className="absolute pointer-events-none border-2 border-white/50 rounded-lg shadow-[0_0_0_4px_rgba(255,255,255,0.2)] transition-all duration-300 ease-in-out"
                    style={{
                        zIndex: 9999,
                        top: targetRect.top,
                        left: targetRect.left,
                        width: targetRect.width,
                        height: targetRect.height,
                    }}
                />
            )}

            {/* Tooltip Card */}
            <div
                className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-4 animate-fade-in transition-all duration-300 ease-in-out"
                style={getTooltipStyle()}
            >
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {currentStep.title}
                    </h3>
                    {!currentStep.isModal && (
                        <button
                            onClick={skipWalkthrough}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                    {currentStep.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-gray-400">
                        {currentStepIndex + 1} of {totalSteps}
                    </span>

                    <div className="flex items-center gap-2">
                        {currentStepIndex > 0 && (
                            <button
                                onClick={prevStep}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                        >
                            {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkthroughOverlay;
