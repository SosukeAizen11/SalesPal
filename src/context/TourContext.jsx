import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TourContext = createContext();

export const TourProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [steps, setSteps] = useState([]);
    const [tourId, setTourId] = useState(null);

    // Initial check to prevent auto-start if already completed
    const hasCompletedTour = (id) => {
        return localStorage.getItem(`tour_completed_${id}`) === 'true';
    };

    const startTour = useCallback((id, tourSteps, force = false) => {
        if (!force && hasCompletedTour(id)) return;

        setTourId(id);
        setSteps(tourSteps);
        setCurrentStep(0);
        setIsActive(true);
        setScrolled(false);
    }, []);

    const endTour = useCallback(() => {
        setIsActive(false);
        setSteps([]);
        setTourId(null);
        // Persist completion
        if (tourId) {
            localStorage.setItem(`tour_completed_${tourId}`, 'true');
        }
    }, [tourId]);

    const restartTour = useCallback((id, tourSteps) => {
        startTour(id, tourSteps, true);
    }, [startTour]);

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setScrolled(false); // Reset scroll flag for new step
        } else {
            endTour();
        }
    }, [currentStep, steps.length, endTour]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setScrolled(false);
        }
    }, [currentStep]);

    const value = {
        isActive,
        currentStep,
        steps,
        startTour,
        endTour,
        restartTour,
        nextStep,
        prevStep,
        scrolled,     // expose if needed for overlay logic
        setScrolled   // expose for overlay to confirm ready
    };

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
