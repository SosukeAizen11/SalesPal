import React, { createContext, useContext, useState, useEffect } from 'react';

const WalkthroughContext = createContext();

export const useWalkthrough = () => {
    const context = useContext(WalkthroughContext);
    if (!context) {
        throw new Error('useWalkthrough must be used within a WalkthroughProvider');
    }
    return context;
};

export const WalkthroughProvider = ({ children, steps = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Load completion state from local storage on mount
    useEffect(() => {
        const completed = localStorage.getItem('salespal_marketing_walkthrough_completed');
        if (completed === 'true') {
            setIsCompleted(true);
        }
    }, []);

    const startWalkthrough = () => {
        setIsOpen(true);
        setCurrentStepIndex(0);
        document.body.style.overflow = 'hidden'; // Lock scroll
    };

    const nextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            finishWalkthrough();
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const skipWalkthrough = () => {
        finishWalkthrough();
    };

    const finishWalkthrough = () => {
        setIsOpen(false);
        setIsCompleted(true);
        localStorage.setItem('salespal_marketing_walkthrough_completed', 'true');
        document.body.style.overflow = ''; // Unlock scroll
        setCurrentStepIndex(0);
    };

    const restartWalkthrough = () => {
        startWalkthrough();
    };

    const value = {
        isOpen,
        currentStepIndex,
        isCompleted,
        currentStep: steps[currentStepIndex],
        totalSteps: steps.length,
        startWalkthrough,
        nextStep,
        prevStep,
        skipWalkthrough,
        restartWalkthrough,
        steps
    };

    return (
        <WalkthroughContext.Provider value={value}>
            {children}
        </WalkthroughContext.Provider>
    );
};
