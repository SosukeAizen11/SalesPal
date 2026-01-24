import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import Card from '../../../components/ui/Card';
import { problems } from '../../../data/homepageData';

const WhySalesPal = () => {
    return (
        <SectionWrapper className="bg-primary/50 relative">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Sales Intelligence Matters</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">The old way of managing growth is broken.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {problems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Card key={idx} className="p-6">
                            <div className="p-3 bg-white/5 w-fit rounded-lg mb-4">
                                <Icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </Card>
                    );
                })}
            </div>
        </SectionWrapper>
    );
};

export default WhySalesPal;
