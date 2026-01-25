import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import Card from '../../../components/ui/Card';
import { comparisonPoints } from '../../../data/homepageData';
import { Check, X } from 'lucide-react';

const WhyChooseSalesPal = () => {
    return (
        <SectionWrapper className="bg-primary/50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Businesses Choose SalesPal</h2>
                <p className="text-[#A8B3BD] max-w-2xl mx-auto">See the difference between disjointed tools and a unified platform.</p>
            </div>

            <div className="max-w-5xl mx-auto">
                {/* Header Row (Desktop) */}
                <div className="hidden md:grid grid-cols-3 gap-6 px-6 py-4 text-sm font-semibold tracking-wider text-[#7C8A96] uppercase">
                    <div>Feature</div>
                    <div>Traditional Way</div>
                    <div className="text-secondary">SalesPal Advantage</div>
                </div>

                <div className="space-y-4">
                    {comparisonPoints.map((point, idx) => (
                        <div key={idx} className="grid md:grid-cols-3 gap-6 p-6 items-center bg-[#132B3A] border border-white/5 rounded-lg hover:border-white/10 transition-colors">

                            {/* Title */}
                            <div className="font-bold text-white text-lg md:text-base">
                                {point.title}
                            </div>

                            {/* Traditional (Negative) */}
                            <div className="flex items-start gap-3 text-[#7C8A96]">
                                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <span className="text-sm">{point.traditional}</span>
                            </div>

                            {/* SalesPal (Positive) */}
                            <div className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-[#76F7C5] shrink-0 mt-0.5" />
                                <span className="text-sm font-medium">{point.salespal}</span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default WhyChooseSalesPal;
