import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import PricingCard from './PricingCard';
import { plans } from '../../../data/homepageData';

const PricingSection = () => {
    return (
        <SectionWrapper id="pricing">
            <div className="text-center mb-16">
                <span className="text-secondary font-medium tracking-wide uppercase text-sm">Pricing Plans</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Transparent, Modular Pricing</h2>
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                    Choose the modules you need. Scale as you grow. No hidden fees.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, idx) => (
                    <PricingCard key={idx} {...plan} />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default PricingSection;
