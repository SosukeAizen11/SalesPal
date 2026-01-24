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
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <Button
                variant="primary"
                onClick={onNext}
                disabled={isLastStep && onNext.name !== 'handleLaunch'} // Only disable if it's the very last step and logic dictates (logic here was isLastStep? 'Launch' : 'Next')
            // Actually the original code had disabled={isLastStep} with a comment.
            // Preserving logic but fixing syntax.
            >
                {isLastStep ? (
                    <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Launch Campaign
                    </>
                ) : (
                    <>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                )}
            </Button>
        </div>
    );
};

export default StepNavigation;
