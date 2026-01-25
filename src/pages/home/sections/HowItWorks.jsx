import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import StepCard from './StepCard';
import { steps } from '../../../data/homepageData';

const HowItWorks = () => {
    return (
        <SectionWrapper id="how-it-works">
            <div className="text-center mb-16">
                <span className="text-secondary font-medium tracking-wide uppercase text-sm">Workflow</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">How SalesPal Works</h2>
                <p className="text-[#A8B3BD] mt-4 max-w-2xl mx-auto">
                    A simple, modular approach to supercharge your growth.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, idx) => (
                    <StepCard key={idx} {...step} />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default HowItWorks;
