import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import Card from '../../../components/ui/Card';
import { problems } from '../../../data/homepageData';

const WhySalesPal = () => {
    return (
        <SectionWrapper id="about" className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">

            <div className="relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        Leads Come, But <span className="text-red-500">Revenue Leaks</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Every day, potential revenue slips through the cracks. Manual processes can't keep up with the speed of modern business.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((item, idx) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={idx}
                                className="group p-6 rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-md"
                            >
                                {/* Icon container */}
                                <div className="inline-flex p-3 rounded-lg mb-4" style={{
                                    background: 'rgba(255, 59, 48, 0.10)'
                                }}>
                                    <Icon className="w-5 h-5 text-red-500" />
                                </div>

                                {/* Card title */}
                                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                    {item.title}
                                </h3>

                                {/* Card description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default WhySalesPal;
