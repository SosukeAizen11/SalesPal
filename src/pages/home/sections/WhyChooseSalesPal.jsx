import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import Card from '../../../components/ui/Card';
import { comparisonPoints } from '../../../data/homepageData';
import { Check, X } from 'lucide-react';

const WhyChooseSalesPal = () => {
    return (
        <SectionWrapper className="bg-primary/50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Businesses Choose SalesPal</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">See the difference between disjointed tools and a unified platform.</p>
            </div>

            <div className="space-y-4 max-w-5xl mx-auto">
                {/* Header Row (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                    <div className="col-span-4">Feature</div>
                    <div className="col-span-4 text-center">Traditional Way</div>
                    <div className="col-span-4 text-center text-secondary">SalesPal Advantage</div>
                </div>

                {comparisonPoints.map((point, idx) => (
                    <Card key={idx} className="grid md:grid-cols-12 gap-4 p-6 items-center">

                        {/* Title */}
                        <div className="col-span-12 md:col-span-4 font-bold text-white text-lg md:text-base mb-2 md:mb-0">
                            {point.title}
                        </div>

                        {/* Traditional (Negative) */}
                        <div className="col-span-12 md:col-span-4 flex items-start gap-3 text-gray-400 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-lg">
                            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span className="text-sm">{point.traditional}</span>
                        </div>

                        {/* SalesPal (Positive) */}
                        <div className="col-span-12 md:col-span-4 flex items-start gap-3 text-white bg-secondary/5 md:bg-transparent p-3 md:p-0 rounded-lg border border-secondary/20 md:border-none">
                            <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{point.salespal}</span>
                        </div>

                    </Card>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default WhyChooseSalesPal;
