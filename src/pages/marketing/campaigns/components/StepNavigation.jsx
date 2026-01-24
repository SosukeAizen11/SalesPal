import React from 'react';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import Button from '../../../../components/ui/Button';

const StepNavigation = ({ onNext, onBack, isFirstStep, isLastStep }) => {
    return (
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
            <Button
                variant="outline"
                onClick={onBack}
                disabled={isFirstStep}
                className={isFirstStep ? 'opacity-0 pointer-events-none' : ''}
                icon={ArrowLeft}
            >
                Back
            </Button>

            <Button
                variant="primary"
                onClick={onNext}
                icon={isLastStep ? Rocket : ArrowRight}
                className={isLastStep ? 'bg-secondary text-primary hover:bg-secondary/90' : ''}
                disabled={isLastStep} // Disabled for now as per requirements "Launch Campaign (disabled)"
            >
                {isLastStep ? 'Launch Campaign' : 'Next Step'}
            </Button>
        </div>
    );
};

export default StepNavigation;
