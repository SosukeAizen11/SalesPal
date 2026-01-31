import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';

// --- LOCALSTORAGE KEY ---
const STORAGE_KEY = 'salespal_marketing_walkthrough_completed';

const TourContext = createContext(null);

export const TourProvider = ({ children }) => {
    // --- 1. SINGLE GLOBAL WALKTHROUGH STATE ---
    const [isIntroVisible, setIsIntroVisible] = useState(false);
    const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Tour Configuration
    const [steps, setSteps] = useState([]);
    const [tourId, setTourId] = useState(null);

    // Initialization guard to prevent multiple inits
    const isInitializedRef = useRef(false);

    // --- 5. PERSISTENCE (MANDATORY) - Load on Mount ---
    useEffect(() => {
        const completed = localStorage.getItem(STORAGE_KEY) === 'true';
        if (completed) {
            setIsCompleted(true);
            setIsIntroVisible(false);
            setIsWalkthroughActive(false);
        }
    }, []);

    // --- REGISTER TOUR (Called by Dashboard) ---
    const registerTour = useCallback((id, tourSteps, force = false) => {
        // Guard: Only initialize once per session unless forced
        if (isInitializedRef.current && !force) return;

        // Check completion status
        const completed = localStorage.getItem(STORAGE_KEY) === 'true';

        if (completed && !force) {
            // Already completed, do nothing
            setIsCompleted(true);
            setIsIntroVisible(false);
            setIsWalkthroughActive(false);
            return;
        }

        // Initialize Tour
        setTourId(id);
        setSteps(tourSteps);

        if (force) {
            // Forced restart
            localStorage.removeItem(STORAGE_KEY);
            setIsCompleted(false);
        }

        // Show intro modal
        setIsIntroVisible(true);
        setIsWalkthroughActive(false);
        setCurrentStep(0);

        isInitializedRef.current = true;
    }, []);

    // --- 3. START WALKTHROUGH FLOW ---
    const startWalkthrough = useCallback(() => {
        setIsIntroVisible(false);
        setIsWalkthroughActive(true);
        setCurrentStep(1); // Jump to first real step (index 1)
    }, []);

    // --- SKIP / COMPLETE ---
    const endTour = useCallback(() => {
        setIsCompleted(true);
        setIsIntroVisible(false);
        setIsWalkthroughActive(false);
        setCurrentStep(0);
        // Persist completion
        localStorage.setItem(STORAGE_KEY, 'true');
    }, []);

    // --- 4. STEP NAVIGATION ---
    const nextStep = useCallback(() => {
        if (currentStep >= steps.length - 1) {
            // Last step -> Complete
            endTour();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, steps.length, endTour]);

    const prevStep = useCallback(() => {
        // Guard: Never go back to step 0 (intro) once active
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    // --- RESTART (Manual trigger via HelpCircle button) ---
    const restartTour = useCallback((id, tourSteps) => {
        isInitializedRef.current = false; // Reset guard
        registerTour(id, tourSteps, true);
    }, [registerTour]);

    // --- MEMOIZED CONTEXT VALUE ---
    const value = useMemo(() => ({
        // State
        isIntroVisible,
        isWalkthroughActive,
        currentStep,
        isCompleted,
        steps,
        tourId,

        // Actions
        registerTour,       // Dashboard calls this to init
        startWalkthrough,   // Intro Modal calls this
        endTour,            // Skip or Finish
        nextStep,
        prevStep,
        restartTour         // HelpCircle button
    }), [
        isIntroVisible,
        isWalkthroughActive,
        currentStep,
        isCompleted,
        steps,
        tourId,
        registerTour,
        startWalkthrough,
        endTour,
        nextStep,
        prevStep,
        restartTour
    ]);

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
};
