import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { LogOut, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useMarketing } from '../../../context/MarketingContext';
import { getProjectsBackRoute } from '../../../utils/navigationUtils';

// Components
import StepHeader from './components/StepHeader';
import StepIndicator from './components/StepIndicator';
import StepNavigation from './components/StepNavigation';
import Button from '../../../components/ui/Button';

// Steps
import StepBusinessInput from './steps/StepBusinessInput';
import StepAIAnalysis from './steps/StepAIAnalysis';
import StepAdCreation from './steps/StepAdCreation';
import StepPlatformBudget from './steps/StepPlatformBudget';
import StepReviewLaunch from './steps/StepReviewLaunch';

const STEPS = [
    {
        label: 'Business',
        title: 'Tell SalesPal AI About Your Business',
        subtitle: 'Share your business details via text, website, or PDF. Include your location for automatic currency detection.'
    },
    {
        label: 'Analysis', title: 'AI Business Analysis', subtitle: "Here's what SalesPal AI understood about your business."
    },
    { label: 'Ads', title: 'Ad Creation', subtitle: 'SalesPal prepares optimized ads based on your business analysis.' },
    { label: 'Budget', title: 'Budget & Spend', subtitle: 'Review and adjust how much you want to spend on your campaign.' },
    { label: 'Review', title: 'Review & Launch', subtitle: 'Review your campaign details before going live.' },
];

const WIZARD_STATE_KEY = 'salespal_campaign_wizard_state';

const NewCampaign = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const {
        activeDraft,
        startNewDraft,
        updateDraftStep,
        setDraftStepIndex,
        canAccessStep,
        launchCampaign,
        cancelDraft
    } = useMarketing();

    // Derived state directly from context
    const currentStep = activeDraft?.currentStepIndex || 0;

    const [restoredState, setRestoredState] = useState(null);

    const navigate = useNavigate();

    // PART 1: Check for returning from platform connection
    useEffect(() => {
        // Check if we're returning from a successful platform connection
        const urlParams = new URLSearchParams(location.search);
        const platformConnected = urlParams.get('connected');

        if (platformConnected) {
            // Show success toast
            setShowSuccessToast(true);

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => setShowSuccessToast(false), 5000);

            // Clean up URL
            navigate(location.pathname, { replace: true });

            return () => clearTimeout(timer);
        }
    }, [location.search]);

    // PART 2: Initialize or Restore State
    // Handle persistent state during platform integration flow
    useEffect(() => {
        const savedState = localStorage.getItem(WIZARD_STATE_KEY);

        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                // Only restore if it's for the same project
                if (parsed.projectId === projectId) {
                    console.log('[Campaign Wizard] Found saved state, preparing restoration...');
                    setRestoredState(parsed);

                    // Initialize a fresh draft - we will overwrite it with restored data
                    if (!activeDraft) {
                        startNewDraft(projectId);
                    }

                    // Clear storage to prevent stale restores
                    localStorage.removeItem(WIZARD_STATE_KEY);
                } else {
                    // Mismatched project, just start new
                    if (!activeDraft) startNewDraft(projectId);
                }
            } catch (error) {
                console.error('[Campaign Wizard] Failed to parse saved state:', error);
                localStorage.removeItem(WIZARD_STATE_KEY);
                if (!activeDraft) startNewDraft(projectId);
            }
        } else {
            // Normal flow: Start new draft if none exists
            if (!activeDraft) {
                startNewDraft(projectId);
            }
        }
    }, [projectId]);

    // PART 3: Apply Restored Data
    // Waits for activeDraft to be initialized by context before applying data
    useEffect(() => {
        if (restoredState && activeDraft) {
            console.log('[Campaign Wizard] Applying restored state to active draft:', restoredState);

            const { draftData, stepIndex } = restoredState;

            // Apply specific step data
            if (draftData && Object.keys(draftData).length > 0) {
                Object.entries(draftData).forEach(([key, value]) => {
                    updateDraftStep(key, value);
                });
            }

            // Move to correct step
            // We use a small timeout to let the state updates settle
            setTimeout(() => {
                setDraftStepIndex(stepIndex);
                setRestoredState(null); // Mark restoration as complete
            }, 100);
        }
    }, [activeDraft, restoredState]);

    // Guard: Prevent deep linking to locked steps
    React.useEffect(() => {
        if (activeDraft && !canAccessStep(currentStep)) {
            // Find highest accessible step? For now just go to 0 or previous
            // Simple logic: if restricted, go to 0
            if (currentStep > 0) {
                // Try to go back until we find an accessible step
                let safeStep = currentStep - 1;
                while (safeStep >= 0 && !canAccessStep(safeStep)) {
                    safeStep--;
                }
                setDraftStepIndex(Math.max(0, safeStep));
            }
        }
    }, [currentStep, activeDraft]);

    if (!activeDraft) return null; // or loading spinner

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setDraftStepIndex(currentStep + 1);
        } else {
            launchCampaign();
            navigate(getProjectsBackRoute(projectId));
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDraftStepIndex(currentStep - 1);
        }
    };

    const handleExit = () => {
        if (window.confirm('Are you sure you want to exit? Process will be lost.')) {
            cancelDraft();
            navigate(getProjectsBackRoute(projectId));
        }
    };

    // Inject handleNext/save logic into steps
    const onStepComplete = (stepKey, data) => {
        updateDraftStep(stepKey, data);
        if (currentStep < STEPS.length - 1) {
            setDraftStepIndex(currentStep + 1);
        }
    };

    const renderStepContent = () => {
        const commonProps = {
            data: activeDraft.data,
            onBack: handleBack // Pass the handleBack function we already defined
        };

        switch (currentStep) {
            case 0: return <StepBusinessInput onComplete={(data) => onStepComplete('business', data)} {...commonProps} />;
            case 1: return <StepAIAnalysis onComplete={(data) => onStepComplete('analysis', data)} ai={activeDraft.ai} {...commonProps} />;
            case 2: return <StepAdCreation onComplete={(data) => onStepComplete('ads', data)} {...commonProps} />;
            case 3: return <StepPlatformBudget onComplete={(data) => onStepComplete('budget', data)} {...commonProps} />;
            case 4: return <StepReviewLaunch onLaunch={() => {
                const campaign = launchCampaign();
                navigate(getProjectsBackRoute(projectId));
            }} {...commonProps} />;
            default: return null;
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6">
            {/* Success Toast - Platform Connected */}
            {showSuccessToast && (
                <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
                    <div className="bg-white rounded-xl shadow-2xl border border-green-200 p-4 flex items-start gap-3 max-w-sm">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                Platform Connected Successfully
                            </h4>
                            <p className="text-xs text-gray-600">
                                You can now continue your campaign setup.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccessToast(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Breadcrumbs & Actions */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/marketing" className="hover:text-gray-900 transition-colors">Marketing</Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link to="/marketing/projects" className="hover:text-gray-900 transition-colors">Projects</Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">New Campaign</span>
                </div>
                <Button
                    variant="secondary"
                    onClick={handleExit}
                >
                    <X className="w-4 h-4 mr-2" />
                    Exit
                </Button>
            </div>

            {/* Step Indicator - OUTSIDE CARD */}
            <div className="mb-8 px-2">
                <StepIndicator steps={STEPS} currentStep={currentStep} />
            </div>

            {/* Wizard Main Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Step Content */}
                <div className="p-8 md:p-12">
                    <StepHeader
                        title={STEPS[currentStep].title}
                        subtitle={STEPS[currentStep].subtitle}
                    />

                    <div className="mt-8 min-h-[400px]">
                        {renderStepContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCampaign;
