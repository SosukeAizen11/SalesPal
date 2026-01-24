import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

// Components
import StepHeader from './components/StepHeader';
import StepIndicator from './components/StepIndicator';
import StepNavigation from './components/StepNavigation';

// Steps
import StepBusinessInput from './steps/StepBusinessInput';
import StepAIAnalysis from './steps/StepAIAnalysis';
import StepAdCreation from './steps/StepAdCreation';
import StepPlatformBudget from './steps/StepPlatformBudget';
import StepReviewLaunch from './steps/StepReviewLaunch';

const STEPS = [
    { label: 'Business', title: 'Business & Goals', subtitle: 'Tell us about your business so our AI can understand your goals.' },
    { label: 'Analysis', title: 'AI Market Analysis', subtitle: 'Review AI insights on your target audience and competitors.' },
    { label: 'Ads', title: 'Ad Creative', subtitle: 'Select from AI-generated ad copy and visual concepts.' },
    { label: 'Budget', title: 'Platform & Budget', subtitle: 'Allocate budget across recommended platforms.' },
    { label: 'Review', title: 'Review & Launch', subtitle: 'Finalize your campaign settings and go live.' },
];

const NewCampaign = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Launch logic would go here
            console.log("Launching campaign...");
            navigate('/marketing/campaigns');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleExit = () => {
        if (window.confirm('Are you sure you want to exit? Process will be lost.')) {
            navigate('/marketing/campaigns');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <StepBusinessInput />;
            case 1: return <StepAIAnalysis />;
            case 2: return <StepAdCreation />;
            case 3: return <StepPlatformBudget />;
            case 4: return <StepReviewLaunch />;
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
                    <Link to="/marketing/campaigns" className="hover:text-gray-900 transition-colors">Campaigns</Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">New Campaign</span>
                </div>
                <button
                    onClick={handleExit}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow active:scale-95"
                >
                    <X className="w-4 h-4" />
                    Exit
                </button>
            </div>

            {/* Wizard Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Progress Bar Area */}
                <div className="bg-gray-50/50 border-b border-gray-100 px-8 pt-8 pb-0">
                    <StepIndicator steps={STEPS} currentStep={currentStep} />
                </div>

                {/* Step Content */}
                <div className="p-8 md:p-12">
                    <StepHeader
                        title={STEPS[currentStep].title}
                        subtitle={STEPS[currentStep].subtitle}
                    />

                    <div className="min-h-[400px]">
                        {renderStepContent()}
                    </div>

                    {currentStep < STEPS.length - 1 && (
                        <StepNavigation
                            onNext={handleNext}
                            onBack={handleBack}
                            isFirstStep={currentStep === 0}
                            isLastStep={currentStep === STEPS.length - 1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewCampaign;
