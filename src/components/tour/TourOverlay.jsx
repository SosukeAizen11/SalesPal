import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTour } from '../../context/TourContext';
import { X, ArrowRight, ArrowLeft, Play, SkipForward } from 'lucide-react';
import { createPortal } from 'react-dom';

const TourOverlay = () => {
    const { isActive, currentStep, steps, nextStep, prevStep, endTour } = useTour();
    const [position, setPosition] = useState(null); // { highlight: {}, tooltip: {} } or 'centered' (for modal)
    const [isTransitioning, setIsTransitioning] = useState(false);

    const prevStepRef = useRef(currentStep);

    // --- SCROLL LOCK ---
    useEffect(() => {
        if (isActive) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = originalOverflow; };
        }
    }, [isActive]);

    // --- HELPER: Manual Scroll with Callback ---
    const smoothScrollToTarget = (target, callback) => {
        if (!target) { callback(); return; } // No target? No scroll.

        const rect = target.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        // Calculate centered position
        let targetY = (rect.top + scrollTop) - (viewportHeight / 2) + (rect.height / 2);

        const maxScroll = document.documentElement.scrollHeight - viewportHeight;
        if (targetY < 0) targetY = 0;
        if (targetY > maxScroll) targetY = maxScroll;

        // Execute Scroll
        window.scrollTo({ top: targetY, behavior: 'smooth' });

        // Wait...
        let lastScrollY = window.scrollY;
        let checks = 0;
        const maxChecks = 50;

        const checkScroll = () => {
            if (Math.abs(window.scrollY - targetY) < 5 || (Math.abs(window.scrollY - lastScrollY) < 1 && checks > 5)) {
                callback();
            } else {
                lastScrollY = window.scrollY;
                checks++;
                if (checks < maxChecks) requestAnimationFrame(checkScroll);
                else callback();
            }
        };
        requestAnimationFrame(checkScroll);
    };

    // --- CALCULATE POSITION ---
    const calculatePosition = useCallback(() => {
        if (!isActive || !steps[currentStep]) return;

        const step = steps[currentStep];

        // --- CASE: WELCOME MODAL (No Selector) ---
        if (!step.selector) {
            setPosition('welcome-modal');
            setIsTransitioning(false);
            return;
        }

        const target = document.querySelector(step.selector);

        if (!target) {
            console.warn(`Tour target ${step.selector} not found.`);
            // Fallback to center if element missing
            setPosition('centered-fallback');
            setIsTransitioning(false);
            return;
        }

        // 1. Scroll Logic
        smoothScrollToTarget(target, () => {
            const rect = target.getBoundingClientRect();
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            // Mobile Fallback
            if (viewportW <= 768) {
                setPosition('centered-fallback');
                setIsTransitioning(false);
                return;
            }

            // Highlight Box
            const highlight = {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            };

            // Tooltip Config
            const tooltipW = 340; // Max width
            const tooltipH = 220; // Approx max height
            const gap = 20;
            let tooltip = null;

            const spaceBelow = viewportH - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportW - rect.right;
            const spaceLeft = rect.left;

            // --- STRICT PRIORITY: RIGHT -> BOTTOM -> TOP ---

            // 1. Try RIGHT (Sidebar usually needs this)
            if (spaceRight > tooltipW + gap) {
                tooltip = {
                    top: rect.top + (rect.height / 2) - (tooltipH / 2),
                    left: rect.right + gap,
                    placement: 'right'
                };
            }
            // 2. Try BOTTOM
            else if (spaceBelow > tooltipH + gap) {
                tooltip = {
                    top: rect.bottom + gap,
                    left: rect.left + (rect.width / 2) - (tooltipW / 2),
                    placement: 'bottom'
                };
            }
            // 3. Try TOP
            else if (spaceAbove > tooltipH + gap) {
                tooltip = {
                    top: rect.top - tooltipH - gap, // Approximate, flex would be better but keeping abs for anim
                    left: rect.left + (rect.width / 2) - (tooltipW / 2),
                    placement: 'top'
                };
            }
            // 4. Try LEFT (Last resort)
            else if (spaceLeft > tooltipW + gap) {
                tooltip = {
                    top: rect.top + (rect.height / 2) - (tooltipH / 2),
                    left: rect.left - tooltipW - gap,
                    placement: 'left'
                };
            }
            else {
                // Centered fallback if extremely pressed
                setPosition('centered-fallback');
                setIsTransitioning(false);
                return;
            }

            // Clamp Horizontal
            if (tooltip.left < gap) tooltip.left = gap;
            if (tooltip.left + tooltipW > viewportW - gap) tooltip.left = viewportW - tooltipW - gap;

            // Clamp Vertical
            if (tooltip.top < gap) tooltip.top = gap;
            if (tooltip.top + tooltipH > viewportH - gap) tooltip.top = viewportH - tooltipH - gap;

            setPosition({ highlight, tooltip });
            setIsTransitioning(false); // Fade In
        });

    }, [isActive, currentStep, steps]);

    // --- EFFECT: Handle Step Change ---
    useEffect(() => {
        if (!isActive) return;

        // If step changed OR first load
        if (prevStepRef.current !== currentStep || !position) {
            // Immediate transition request (already handled by handlers? 
            // If just loaded via startTour, transition might be false initially.
            // But we want to run calc.
            calculatePosition();
        }
        prevStepRef.current = currentStep;

        const handleResize = () => calculatePosition();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isActive, currentStep, calculatePosition, position]);

    // --- HANDLERS ---
    const performTransition = (action) => {
        if (isTransitioning) return;
        setIsTransitioning(true); // Phase 1: Fade Out
        setTimeout(() => {
            action();
            // calculatePosition will naturally run after step update
        }, 150);
    };

    const handleNext = () => performTransition(nextStep);
    const handlePrev = () => performTransition(prevStep);
    const handleEnd = () => performTransition(endTour);

    if (!isActive) return null;

    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;
    const isWelcome = position === 'welcome-modal';
    const isCenteredFallback = position === 'centered-fallback';

    // --- RENDERERS ---

    const renderBackdrop = () => {
        // Full dark for modal, SVG mask for Highlight
        if (isWelcome || isCenteredFallback || !position) {
            return (
                <div
                    className="fixed inset-0 bg-black/70 z-[9998] transition-opacity duration-200 ease-in-out"
                    style={{ opacity: isTransitioning ? 0 : 1 }}
                />
            );
        }

        return (
            <div
                className="fixed inset-0 z-[9998] pointer-events-auto transition-opacity duration-200 ease-in-out"
                style={{ opacity: isTransitioning ? 0 : 1 }}
            >
                <svg className="w-full h-full text-black/60 fill-current">
                    <defs>
                        <mask id="tour-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect
                                x={position.highlight.left}
                                y={position.highlight.top}
                                width={position.highlight.width}
                                height={position.highlight.height}
                                rx="8"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" mask="url(#tour-mask)" />
                </svg>
                {/* Soft Glow Highlight - Scaled slightly up */}
                <div
                    className="absolute border-2 border-white/50 rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse pointer-events-none"
                    style={{
                        top: position.highlight.top - 4,
                        left: position.highlight.left - 4,
                        width: position.highlight.width + 8,
                        height: position.highlight.height + 8,
                        transition: 'all 200ms ease-in-out'
                    }}
                />
            </div>
        );
    };

    const renderCard = () => {
        // Common Card Styles
        const cardClass = `z-[9999] bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col transition-all duration-200 ease-in-out`;
        const initialStyle = { opacity: isTransitioning ? 0 : 1 };

        // --- WELCOME MODAL MODE ---
        if (isWelcome) {
            return (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
                    {/* Inner wrapper for pointer events */}
                    <div
                        className={`${cardClass} w-full max-w-md pointer-events-auto`}
                        style={{ ...initialStyle, transform: isTransitioning ? 'scale(0.95)' : 'scale(1)' }}
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Play className="w-8 h-8 ml-1" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {step.description}
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleNext}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    Start Tour
                                </button>
                                <button
                                    onClick={handleEnd}
                                    className="w-full bg-white text-gray-500 py-3 rounded-xl font-medium hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Skip Tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // --- TOOLTIP MODE ---
        // Fallback or Highlighted
        if (!position) return null;

        const isCentered = isCenteredFallback;
        const style = isCentered
            ? {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '360px'
            }
            : {
                position: 'absolute',
                top: position.tooltip.top,
                left: position.tooltip.left,
                width: '360px', // Fixed width for consistency
                transition: 'top 200ms ease-in-out, left 200ms ease-in-out'
            };

        return (
            <div
                className={cardClass}
                style={{ ...style, ...initialStyle }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    {/* Counter */}
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                        Step {currentStep} of {steps.length - 1}
                    </span>
                    <button onClick={handleEnd} disabled={isTransitioning} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed mb-8">{step.description}</p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto">
                    {/* Dots? OR Just Back Button */}
                    {currentStep > 1 ? (
                        <button
                            onClick={handlePrev}
                            disabled={isTransitioning}
                            className="text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center gap-1 transition-colors pl-0"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    ) : (
                        <div /> // Spacer
                    )}

                    <button
                        onClick={handleNext}
                        disabled={isTransitioning}
                        className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
                    >
                        {isLast ? 'Finish' : 'Next'}
                        {!isLast && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        );
    };

    return createPortal(
        <>
            {renderBackdrop()}
            {renderCard()}
        </>,
        document.body
    );
};

export default TourOverlay;
