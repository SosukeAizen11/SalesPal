import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-between w-full mb-12 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
            <div
                className="absolute top-1/2 left-0 h-0.5 bg-secondary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <div key={index} className="flex flex-col items-center gap-2 bg-gray-50 px-2 transition-colors duration-300">
                        <div
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300
                                ${isCompleted
                                    ? 'bg-secondary border-secondary text-primary'
                                    : isCurrent
                                        ? 'bg-primary border-primary text-white scale-110'
                                        : 'bg-white border-gray-300 text-gray-400'
                                }
                            `}
                        >
                            {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <span
                            className={`
                                text-xs font-medium uppercase tracking-wider hidden sm:block transition-colors duration-300
                                ${isCurrent ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-gray-400'}
                            `}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
