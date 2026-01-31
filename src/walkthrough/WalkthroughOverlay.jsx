import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useWalkthrough } from './WalkthroughProvider';
import { X, ArrowRight, ArrowLeft, Play, CheckCircle } from 'lucide-react';

/**
 * WALKTHROUGH OVERLAY
 * Production-grade highlight + tooltip system
 */

const WalkthroughOverlay = () => {
    const {
        isActive,
        isInitialized,
        currentStep,
        currentStepIndex,
        totalSteps,
        isIntro,
        isFinal,
        startWalkthrough,
        nextStep,
        prevStep,
        skipWalkthrough
    } = useWalkthrough();

    // --- LOCAL UI STATE ---
    const [targetRect, setTargetRect] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const observerRef = useRef(null);
    const resizeObserverRef = useRef(null);

    // --- CONSTANTS ---
    const TOOLTIP_WIDTH = 360;
    const TOOLTIP_HEIGHT = 220;
    const GAP = 16;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 200;

    // --- FIND AND MEASURE TARGET ---
    const measureTarget = useCallback(() => {
        if (!currentStep?.targetSelector) {
            setTargetRect(null);
            return null;
        }

        const target = document.querySelector(currentStep.targetSelector);
        if (!target) {
            return null;
        }

        const rect = target.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
            viewportTop: rect.top,
            viewportLeft: rect.left,
            viewportBottom: rect.bottom,
            viewportRight: rect.right,
            element: target
        };
    }, [currentStep?.targetSelector]);

    // --- SCROLL TO TARGET ---
    const scrollToTarget = useCallback(async (rect) => {
        if (!rect?.element) return;

        const viewportHeight = window.innerHeight;
        const scrollOffset = currentStep?.scrollOffset || 80;

        // Check if element is in view
        const isInView = rect.viewportTop >= scrollOffset &&
            rect.viewportBottom <= viewportHeight - scrollOffset;

        if (!isInView) {
            rect.element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Wait for scroll to complete
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }, [currentStep?.scrollOffset]);

    // --- CALCULATE TOOLTIP POSITION ---
    const calculateTooltipPosition = useCallback((rect) => {
        if (!rect) return { top: 0, left: 0 };

        const vpW = window.innerWidth;
        const vpH = window.innerHeight;
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let placement = currentStep?.placement || 'bottom';
        let top = 0;
        let left = 0;

        // Calculate available space
        const spaceTop = rect.viewportTop;
        const spaceBottom = vpH - rect.viewportBottom;
        const spaceLeft = rect.viewportLeft;
        const spaceRight = vpW - rect.viewportRight;

        // Auto-flip if not enough space
        if (placement === 'bottom' && spaceBottom < TOOLTIP_HEIGHT + GAP) {
            placement = spaceTop >= TOOLTIP_HEIGHT + GAP ? 'top' : 'bottom';
        } else if (placement === 'top' && spaceTop < TOOLTIP_HEIGHT + GAP) {
            placement = spaceBottom >= TOOLTIP_HEIGHT + GAP ? 'bottom' : 'top';
        } else if (placement === 'right' && spaceRight < TOOLTIP_WIDTH + GAP) {
            placement = spaceLeft >= TOOLTIP_WIDTH + GAP ? 'left' : 'right';
        } else if (placement === 'left' && spaceLeft < TOOLTIP_WIDTH + GAP) {
            placement = spaceRight >= TOOLTIP_WIDTH + GAP ? 'right' : 'left';
        }

        // Calculate position based on placement
        switch (placement) {
            case 'bottom':
                top = rect.viewportBottom + GAP;
                left = rect.viewportLeft + (rect.width / 2) - (TOOLTIP_WIDTH / 2);
                break;
            case 'top':
                top = rect.viewportTop - TOOLTIP_HEIGHT - GAP;
                left = rect.viewportLeft + (rect.width / 2) - (TOOLTIP_WIDTH / 2);
                break;
            case 'right':
                top = rect.viewportTop + (rect.height / 2) - (TOOLTIP_HEIGHT / 2);
                left = rect.viewportRight + GAP;
                break;
            case 'left':
                top = rect.viewportTop + (rect.height / 2) - (TOOLTIP_HEIGHT / 2);
                left = rect.viewportLeft - TOOLTIP_WIDTH - GAP;
                break;
            default:
                break;
        }

        // Clamp to viewport
        if (left < GAP) left = GAP;
        if (left + TOOLTIP_WIDTH > vpW - GAP) left = vpW - TOOLTIP_WIDTH - GAP;
        if (top < GAP) top = GAP;
        if (top + TOOLTIP_HEIGHT > vpH - GAP) top = vpH - TOOLTIP_HEIGHT - GAP;

        return { top, left, placement };
    }, [currentStep?.placement]);

    // --- POSITION UPDATE LOOP ---
    const updatePosition = useCallback(async () => {
        const rect = measureTarget();

        if (!rect && currentStep?.targetSelector) {
            // Target not found, retry
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setTimeout(updatePosition, RETRY_DELAY);
                return;
            }
            // Max retries, skip to next step
            console.warn(`Walkthrough: Target not found for step ${currentStepIndex}`);
            setTargetRect(null);
            setIsVisible(true);
            return;
        }

        if (rect) {
            await scrollToTarget(rect);
            // Re-measure after scroll
            const newRect = measureTarget();
            if (newRect) {
                setTargetRect(newRect);
                setTooltipPosition(calculateTooltipPosition(newRect));
            }
        }

        setIsVisible(true);
        setRetryCount(0);
    }, [measureTarget, scrollToTarget, calculateTooltipPosition, currentStep?.targetSelector, currentStepIndex, retryCount]);

    // --- STEP CHANGE HANDLER ---
    useEffect(() => {
        if (!isActive || !isInitialized || !currentStep) return;

        // Intro and Final are centered modals, no target positioning needed
        if (isIntro || isFinal) {
            setTargetRect(null);
            setIsVisible(true);
            return;
        }

        // Reset and reposition
        setIsVisible(false);
        setRetryCount(0);

        const timer = setTimeout(() => {
            updatePosition();
        }, 100);

        return () => clearTimeout(timer);
    }, [isActive, isInitialized, currentStep, currentStepIndex, isIntro, isFinal, updatePosition]);

    // --- RESIZE HANDLER ---
    useEffect(() => {
        if (!isActive) return;

        const handleResize = () => {
            if (currentStep?.targetSelector && !isIntro && !isFinal) {
                updatePosition();
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize);
        };
    }, [isActive, currentStep?.targetSelector, isIntro, isFinal, updatePosition]);

    // --- RENDER NOTHING IF NOT APPLICABLE ---
    if (!isActive || !isInitialized || !currentStep) return null;

    // --- RENDER BACKDROP WITH CUTOUT ---
    const renderBackdrop = () => {
        // Solid backdrop for intro/final modals
        if (isIntro || isFinal || !targetRect) {
            return (
                <div
                    className="fixed inset-0 bg-black/60 transition-opacity duration-300"
                    style={{
                        zIndex: 40,
                        opacity: isVisible ? 1 : 0
                    }}
                />
            );
        }

        // Backdrop with cutout for targeted steps
        return (
            <div
                className="fixed inset-0 transition-opacity duration-300"
                style={{
                    zIndex: 40,
                    opacity: isVisible ? 1 : 0
                }}
            >
                <svg className="w-full h-full" style={{ position: 'fixed', inset: 0 }}>
                    <defs>
                        <mask id="walkthrough-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect
                                x={targetRect.viewportLeft - 4}
                                y={targetRect.viewportTop - 4}
                                width={targetRect.width + 8}
                                height={targetRect.height + 8}
                                rx="8"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.6)"
                        mask="url(#walkthrough-mask)"
                    />
                </svg>
            </div>
        );
    };

    // --- RENDER HIGHLIGHT RING ---
    const renderHighlight = () => {
        if (!targetRect || isIntro || isFinal) return null;

        return (
            <div
                className="fixed pointer-events-none transition-all duration-300"
                style={{
                    zIndex: 50,
                    top: targetRect.viewportTop - 6,
                    left: targetRect.viewportLeft - 6,
                    width: targetRect.width + 12,
                    height: targetRect.height + 12,
                    borderRadius: '10px',
                    border: '2px solid rgba(99, 102, 241, 0.8)',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.4)',
                    opacity: isVisible ? 1 : 0,
                    animation: 'pulse-ring 2s infinite'
                }}
            />
        );
    };

    // --- RENDER TOOLTIP ---
    const renderTooltip = () => {
        const isModal = isIntro || isFinal || !targetRect;

        const cardStyle = {
            zIndex: 60,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            maxWidth: `${TOOLTIP_WIDTH}px`,
            width: '100%'
        };

        const content = (
            <div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{ maxHeight: '85vh' }}
            >
                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Modal Icons */}
                    {isModal && isFinal && (
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                    )}
                    {isModal && isIntro && (
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Play className="w-8 h-8 ml-1" />
                        </div>
                    )}

                    {/* Step Counter (non-modal only) */}
                    {!isModal && (
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Step {currentStepIndex} of {totalSteps - 1}
                            </span>
                            <button
                                onClick={skipWalkthrough}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Title + Description */}
                    <h3 className={`font-bold text-gray-900 mb-2 ${isModal ? 'text-2xl text-center' : 'text-lg'}`}>
                        {currentStep.title}
                    </h3>
                    <p className={`text-gray-600 text-sm leading-relaxed ${isModal ? 'text-center' : ''}`}>
                        {currentStep.description}
                    </p>
                </div>

                {/* Footer */}
                <div className={`p-5 bg-gray-50 border-t border-gray-100 ${isModal ? 'flex flex-col gap-3' : 'flex items-center justify-between'}`}>
                    {/* Intro Modal */}
                    {isIntro && (
                        <>
                            <button
                                onClick={startWalkthrough}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Start Walkthrough
                            </button>
                            <button
                                onClick={skipWalkthrough}
                                className="w-full bg-white text-gray-500 py-2.5 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Skip Tour
                            </button>
                        </>
                    )}

                    {/* Final Modal */}
                    {isFinal && (
                        <>
                            <button
                                onClick={nextStep}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Get Started <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={skipWalkthrough}
                                className="w-full bg-white text-gray-500 py-2.5 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </>
                    )}

                    {/* Step Navigation */}
                    {!isModal && (
                        <>
                            {currentStepIndex > 1 ? (
                                <button
                                    onClick={prevStep}
                                    className="text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            ) : (
                                <div />
                            )}

                            <button
                                onClick={nextStep}
                                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-black transition-colors flex items-center gap-2"
                            >
                                {currentStepIndex === totalSteps - 2 ? 'Finish' : 'Next'}
                                {currentStepIndex !== totalSteps - 2 && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );

        // Centered modal layout
        if (isModal) {
            return (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4"
                    style={{ zIndex: 60 }}
                >
                    <div style={cardStyle}>
                        {content}
                    </div>
                </div>
            );
        }

        // Positioned tooltip
        return (
            <div
                className="fixed"
                style={{
                    ...cardStyle,
                    top: tooltipPosition.top,
                    left: tooltipPosition.left
                }}
            >
                {content}
            </div>
        );
    };

    // --- RENDER ---
    return createPortal(
        <>
            <style>{`
                @keyframes pulse-ring {
                    0%, 100% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.4); }
                    50% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.5); }
                }
            `}</style>
            {renderBackdrop()}
            {renderHighlight()}
            {renderTooltip()}
        </>,
        document.body
    );
};

export default WalkthroughOverlay;
