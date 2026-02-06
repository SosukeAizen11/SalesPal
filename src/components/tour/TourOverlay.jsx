import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTour } from '../../context/TourContext';
import { X, ArrowRight, ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

// --- HELPERS ---
const getScrollParent = (node) => {
    if (!node) return null;
    if (node === document.body || node === document.documentElement) return window;

    const overflowY = window.getComputedStyle(node).overflowY;
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

    if (isScrollable && node.scrollHeight > node.clientHeight) {
        return node;
    }
    return getScrollParent(node.parentNode);
};

const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const TourOverlay = () => {
    // --- CONSUME GLOBAL STATE ---
    const {
        isIntroVisible,
        isWalkthroughActive,
        currentStep,
        isCompleted,
        steps,
        startWalkthrough,
        endTour,
        nextStep,
        prevStep
    } = useTour();

    // --- LOCAL UI STATE (Position, Transitions) ---
    const [position, setPosition] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const isScrollingRef = useRef(false);

    // --- DERIVED RENDER FLAGS ---
    const showIntroModal = isIntroVisible && !isWalkthroughActive && !isCompleted;
    const showActiveTooltip = isWalkthroughActive && !isCompleted && currentStep > 0;

    // --- SCROLL LOCK (Only when Active) ---
    useEffect(() => {
        if (!isWalkthroughActive) return;

        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
                e.preventDefault();
            }
        };

        const handleWheel = (e) => {
            if (!isScrollingRef.current) e.preventDefault();
        };

        const handleTouchMove = (e) => {
            if (!isScrollingRef.current) e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isWalkthroughActive]);

    // --- SCROLL TO TARGET (Promise-based) ---
    const scrollToTarget = useCallback((target) => {
        return new Promise((resolve) => {
            if (!target) { resolve(); return; }

            const container = getScrollParent(target);
            const isWindow = container === window;

            const targetRect = target.getBoundingClientRect();
            const containerHeight = isWindow ? window.innerHeight : container.clientHeight;
            const currentScrollTop = isWindow ? window.scrollY : container.scrollTop;

            let desiredScrollTop;

            if (isWindow) {
                desiredScrollTop = currentScrollTop + targetRect.top - (containerHeight / 2) + (targetRect.height / 2);
            } else {
                const containerRect = container.getBoundingClientRect();
                const relativeTop = targetRect.top - containerRect.top;
                desiredScrollTop = currentScrollTop + relativeTop - (containerHeight / 2) + (targetRect.height / 2);
            }

            const maxScroll = isWindow
                ? document.documentElement.scrollHeight - containerHeight
                : container.scrollHeight - containerHeight;

            desiredScrollTop = Math.max(0, Math.min(desiredScrollTop, maxScroll));

            const margin = 80;
            const isInView = targetRect.top >= margin && targetRect.bottom <= containerHeight - margin;

            if (isInView) { resolve(); return; }

            const startScrollTop = currentScrollTop;
            const distance = desiredScrollTop - startScrollTop;
            const duration = 400;
            const startTime = performance.now();

            isScrollingRef.current = true;
            setIsScrolling(true);

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = easeInOutQuad(progress);

                const newScroll = startScrollTop + (distance * ease);

                if (isWindow) { window.scrollTo(0, newScroll); }
                else { container.scrollTop = newScroll; }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    isScrollingRef.current = false;
                    setIsScrolling(false);
                    // Small delay for DOM reflow
                    setTimeout(resolve, 50);
                }
            };
            requestAnimationFrame(step);
        });
    }, []);

    // --- CALCULATE POSITION (Viewport Safe) ---
    const calculatePosition = useCallback(async () => {
        if (!isWalkthroughActive || !steps[currentStep]) return;

        const step = steps[currentStep];

        // Final Step -> Modal
        if (step.isFinal) {
            setPosition('final-modal');
            setIsTransitioning(false);
            return;
        }

        // No selector -> Fallback
        if (!step.selector) {
            setPosition('centered-fallback');
            setIsTransitioning(false);
            return;
        }

        const target = document.querySelector(step.selector);

        if (!target) {
            setPosition('centered-fallback');
            setIsTransitioning(false);
            return;
        }

        // 7. SCROLL HANDLING - Scroll FIRST, then position
        await scrollToTarget(target);

        // Now measure after scroll
        const rect = target.getBoundingClientRect();

        const highlight = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        };

        const vpW = window.innerWidth;
        const vpH = window.innerHeight;
        const tooltipW = 360;
        const tooltipH = 250;
        const gap = 15;

        const spaceBottom = vpH - rect.bottom - gap;
        const spaceTop = rect.top - gap;

        let placement = step.placement || 'bottom';
        let fits = false;

        // Check if preferred placement fits
        if (placement === 'bottom') fits = spaceBottom >= tooltipH;
        else if (placement === 'top') fits = spaceTop >= tooltipH;
        else if (placement === 'right') {
            const spaceRight = vpW - rect.right - gap;
            fits = spaceRight >= tooltipW && rect.top + rect.height / 2 + tooltipH / 2 <= vpH && rect.top + rect.height / 2 - tooltipH / 2 >= 0;
        } else if (placement === 'left') {
            const spaceLeft = rect.left - gap;
            fits = spaceLeft >= tooltipW && rect.top + rect.height / 2 + tooltipH / 2 <= vpH && rect.top + rect.height / 2 - tooltipH / 2 >= 0;
        }

        // 8. TOOLTIP SAFETY - Auto-correct if overflow
        if (!fits) {
            if (spaceBottom >= tooltipH) placement = 'bottom';
            else if (spaceTop >= tooltipH) placement = 'top';
            else {
                setPosition('centered-fallback');
                setIsTransitioning(false);
                return;
            }
        }

        // Calculate final coords
        let topPos = 0, leftPos = 0;

        if (placement === 'bottom') {
            topPos = rect.bottom + gap;
            leftPos = rect.left + (rect.width / 2) - (tooltipW / 2);
        } else if (placement === 'top') {
            // Position from bottom of viewport
            topPos = rect.top - gap - tooltipH;
            leftPos = rect.left + (rect.width / 2) - (tooltipW / 2);
        } else if (placement === 'right') {
            topPos = rect.top + (rect.height / 2) - (tooltipH / 2);
            leftPos = rect.right + gap;
        } else if (placement === 'left') {
            topPos = rect.top + (rect.height / 2) - (tooltipH / 2);
            leftPos = rect.left - tooltipW - gap;
        }

        // Horizontal clamping
        if (leftPos < gap) leftPos = gap;
        if (leftPos + tooltipW > vpW - gap) leftPos = vpW - tooltipW - gap;

        // Vertical clamping for top/bottom
        if (topPos < gap) topPos = gap;
        if (topPos + tooltipH > vpH - gap) topPos = vpH - tooltipH - gap;

        const tooltip = {
            placement,
            style: { top: topPos, left: leftPos }
        };

        setPosition({ highlight, tooltip });
        setIsTransitioning(false);

    }, [isWalkthroughActive, currentStep, steps, scrollToTarget]);

    // --- TRIGGER POSITION CALCULATION ON STEP CHANGE ---
    useEffect(() => {
        if (showActiveTooltip) {
            setIsTransitioning(true);
            const timer = setTimeout(() => calculatePosition(), 100);
            return () => clearTimeout(timer);
        }
    }, [showActiveTooltip, currentStep, calculatePosition]);

    // --- ACTION HANDLERS ---
    const handleStartTour = () => {
        setIsTransitioning(true);
        setTimeout(() => startWalkthrough(), 150);
    };

    const handleNext = () => {
        if (!isTransitioning && !isScrolling) {
            setIsTransitioning(true);
            setTimeout(() => nextStep(), 150);
        }
    };

    const handlePrev = () => {
        if (!isTransitioning && !isScrolling) {
            setIsTransitioning(true);
            setTimeout(() => prevStep(), 150);
        }
    };

    const handleEnd = () => {
        setIsTransitioning(true);
        setTimeout(() => endTour(), 150);
    };

    // --- RENDER NOTHING IF NOT APPLICABLE ---
    if (!showIntroModal && !showActiveTooltip) return null;

    const step = steps[currentStep] || steps[0];

    // Determine render mode
    const isFinal = showActiveTooltip && step?.isFinal;
    const isCenteredFallback = position === 'centered-fallback';
    const showHighlight = position && position.highlight;

    // --- BACKDROP ---
    const renderBackdrop = () => {
        if (showIntroModal || isFinal || isCenteredFallback || !showHighlight) {
            return (
                <div
                    className="fixed inset-0 bg-black/70 z-[9998] transition-opacity duration-300"
                    style={{ opacity: isTransitioning ? 0 : 1 }}
                />
            );
        }

        return (
            <div
                className="fixed inset-0 z-[9998] transition-opacity duration-300"
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
                <div
                    className="absolute border-2 border-indigo-400/50 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] pointer-events-none transition-all duration-300"
                    style={{
                        top: position.highlight.top - 4,
                        left: position.highlight.left - 4,
                        width: position.highlight.width + 8,
                        height: position.highlight.height + 8,
                    }}
                />
            </div>
        );
    };

    // --- CARD ---
    const renderCard = () => {
        const cardClass = `z-[9999] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden`;
        const baseStyle = {
            opacity: isTransitioning ? 0 : 1,
            maxHeight: '85vh',
            width: '360px',
            maxWidth: '90vw'
        };

        const renderContent = (isModal = false) => (
            <>
                <div className="p-6 md:p-8 overflow-y-auto flex-1 min-h-0">
                    {/* Icon Header - Modal Only */}
                    {isModal && step.isFinal && (
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                    )}
                    {isModal && !step.isFinal && (
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0">
                            <Play className="w-8 h-8 ml-1" />
                        </div>
                    )}

                    {/* Step Counter - Tooltip Only */}
                    {!isModal && (
                        <div className="flex justify-between items-start mb-3 shrink-0">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Step {currentStep} of {steps.length - 1}
                            </span>
                            <button onClick={handleEnd}>
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                    )}

                    <h2 className={`${isModal ? 'text-2xl text-center' : 'text-lg'} font-bold text-gray-900 mb-3`}>
                        {step.title}
                    </h2>
                    <p className={`${isModal ? 'text-center' : ''} text-gray-600 text-[15px] leading-relaxed`}>
                        {step.description}
                    </p>
                </div>

                {/* Footer */}
                <div className={`p-6 bg-gray-50 border-t border-gray-100 shrink-0 ${isModal ? 'flex flex-col gap-3' : 'flex justify-between items-center'}`}>

                    {/* INTRO Modal */}
                    {showIntroModal && (
                        <>
                            <button onClick={handleStartTour} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
                                Start Walkthrough
                            </button>
                            <button onClick={handleEnd} className="w-full bg-white text-gray-500 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50">
                                Skip
                            </button>
                        </>
                    )}

                    {/* FINAL Modal */}
                    {isFinal && (
                        <>
                            <button onClick={handleEnd} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                                Create Campaign <ArrowRight className="w-4 h-4" />
                            </button>
                            <button onClick={handleEnd} className="w-full bg-white text-gray-500 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50">
                                Close
                            </button>
                        </>
                    )}

                    {/* REGULAR Step Buttons */}
                    {showActiveTooltip && !isFinal && (
                        <>
                            {currentStep > 1 ? (
                                <button onClick={handlePrev} className="text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center gap-1 pl-0">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            ) : <div />}

                            <button onClick={handleNext} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-black flex items-center gap-2">
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                {currentStep !== steps.length - 1 && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </>
                    )}
                </div>
            </>
        );

        // Modal Layouts (Intro, Final, Fallback)
        if (showIntroModal || isFinal || isCenteredFallback) {
            return (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className={`${cardClass} w-full max-w-md mx-auto`} style={baseStyle}>
                        {renderContent(true)}
                    </div>
                </div>
            );
        }

        // Positioned Tooltip
        if (!position || !position.tooltip) return null;

        return (
            <div
                className={cardClass}
                style={{
                    ...baseStyle,
                    position: 'fixed',
                    ...position.tooltip.style
                }}
            >
                {renderContent(false)}
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
