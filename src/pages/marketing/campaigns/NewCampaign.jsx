import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { LogOut, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useMarketing } from '../../../context/MarketingContext';

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
    { label: 'Analysis', title: 'AI Business Analysis', subtitle: 'Here’s what SalesPal AI understood about your business.' },
    { label: 'Ads', title: 'Ad Creation', subtitle: 'SalesPal prepares optimized ads based on your business analysis.' },
    { label: 'Budget', title: 'Budget & Spend', subtitle: 'Review and adjust how much you want to spend on your campaign.' },
    { label: 'Review', title: 'Review & Launch', subtitle: 'Review your campaign details before going live.' },
];

const NewCampaign = () => {
    const { projectId } = useParams();
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

    const navigate = useNavigate();

    // Guards: Initialize draft or redirect
    React.useEffect(() => {
        if (!activeDraft) {
            startNewDraft(projectId);
        }
    }, [projectId]);

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
            navigate(`/marketing/projects/${projectId}`);
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
            navigate(`/marketing/projects/${projectId}`);
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
                navigate(`/marketing/projects/${projectId}`);
            }} {...commonProps} />;
            default: return null;
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6">
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
