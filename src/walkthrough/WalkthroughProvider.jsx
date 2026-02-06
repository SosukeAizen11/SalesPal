import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { WALKTHROUGH_STEPS, STORAGE_KEYS } from './walkthroughSteps';

/**
 * WALKTHROUGH PROVIDER
 * Production-grade single global controller for onboarding
 */

const WalkthroughContext = createContext(null);

export const WalkthroughProvider = ({ children }) => {
    // --- CORE STATE ---
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSkipped, setIsSkipped] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Prevent multiple initializations
    const initRef = useRef(false);

    // --- LOAD FROM SESSION STORAGE ---
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        try {
            const active = sessionStorage.getItem(STORAGE_KEYS.ACTIVE);
            const step = sessionStorage.getItem(STORAGE_KEYS.STEP);
            const completed = sessionStorage.getItem(STORAGE_KEYS.COMPLETED);
            const skipped = sessionStorage.getItem(STORAGE_KEYS.SKIPPED);

            if (completed === 'true') {
                setIsCompleted(true);
                setIsActive(false);
            } else if (skipped === 'true') {
                setIsSkipped(true);
                setIsActive(false);
            } else if (active === 'true' && step) {
                // Resume from previous step
                setIsActive(true);
                setCurrentStepIndex(parseInt(step, 10) || 0);
            } else {
                // Fresh start - show intro
                setIsActive(true);
                setCurrentStepIndex(0);
                sessionStorage.setItem(STORAGE_KEYS.ACTIVE, 'true');
                sessionStorage.setItem(STORAGE_KEYS.STEP, '0');
            }
        } catch (e) {
            // Storage error, start fresh
            setIsActive(true);
            setCurrentStepIndex(0);
        }

        setIsInitialized(true);
    }, []);

    // --- PERSIST TO SESSION STORAGE ---
    useEffect(() => {
        if (!isInitialized) return;

        try {
            sessionStorage.setItem(STORAGE_KEYS.ACTIVE, String(isActive));
            sessionStorage.setItem(STORAGE_KEYS.STEP, String(currentStepIndex));
            sessionStorage.setItem(STORAGE_KEYS.COMPLETED, String(isCompleted));
            sessionStorage.setItem(STORAGE_KEYS.SKIPPED, String(isSkipped));
        } catch (e) {
            // Ignore storage errors
        }
    }, [isActive, currentStepIndex, isCompleted, isSkipped, isInitialized]);

    // --- CURRENT STEP DATA ---
    const currentStep = useMemo(() => {
        return WALKTHROUGH_STEPS[currentStepIndex] || null;
    }, [currentStepIndex]);

    const totalSteps = WALKTHROUGH_STEPS.length;

    // --- ACTIONS ---
    const startWalkthrough = useCallback(() => {
        // Move from intro (step 0) to first real step (step 1)
        setCurrentStepIndex(1);
        setIsActive(true);
        setIsCompleted(false);
        setIsSkipped(false);
    }, []);

    const nextStep = useCallback(() => {
        if (currentStepIndex >= totalSteps - 1) {
            // Complete
            setIsActive(false);
            setIsCompleted(true);
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [currentStepIndex, totalSteps]);

    const prevStep = useCallback(() => {
        // Never go back to intro (step 0) once started
        if (currentStepIndex > 1) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    const skipWalkthrough = useCallback(() => {
        setIsActive(false);
        setIsSkipped(true);
    }, []);

    const restartWalkthrough = useCallback(() => {
        setIsCompleted(false);
        setIsSkipped(false);
        setCurrentStepIndex(0);
        setIsActive(true);
    }, []);

    const goToStep = useCallback((index) => {
        if (index >= 0 && index < totalSteps) {
            setCurrentStepIndex(index);
        }
    }, [totalSteps]);

    // --- CONTEXT VALUE (MEMOIZED) ---
    const value = useMemo(() => ({
        // State
        isActive,
        isInitialized,
        currentStepIndex,
        currentStep,
        totalSteps,
        isCompleted,
        isSkipped,
        steps: WALKTHROUGH_STEPS,

        // Derived
        isIntro: currentStep?.isIntro === true,
        isFinal: currentStep?.isFinal === true,
        progress: totalSteps > 0 ? ((currentStepIndex) / (totalSteps - 1)) * 100 : 0,

        // Actions
        startWalkthrough,
        nextStep,
        prevStep,
        skipWalkthrough,
        restartWalkthrough,
        goToStep
    }), [
        isActive,
        isInitialized,
        currentStepIndex,
        currentStep,
        totalSteps,
        isCompleted,
        isSkipped,
        startWalkthrough,
        nextStep,
        prevStep,
        skipWalkthrough,
        restartWalkthrough,
        goToStep
    ]);

    return (
        <WalkthroughContext.Provider value={value}>
            {children}
        </WalkthroughContext.Provider>
    );
};

export const useWalkthrough = () => {
    const context = useContext(WalkthroughContext);
    if (!context) {
        throw new Error('useWalkthrough must be used within WalkthroughProvider');
    }
    return context;
};

export default WalkthroughProvider;
