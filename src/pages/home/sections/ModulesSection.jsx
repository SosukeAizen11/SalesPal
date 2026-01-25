import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { CheckCircle2 } from 'lucide-react';
import { modules } from '../../../data/homepageData';

const ModulesSection = () => {
    return (
        <SectionWrapper id="modules">
            <div className="text-center mb-16">
                <span className="text-secondary font-medium tracking-wide uppercase text-sm">AI Capabilities</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Your Complete AI Growth Engine</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <div key={module.id} className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-secondary/50 transition-all duration-300">
                            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 text-secondary">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{module.title}</h3>
                                <ul className="space-y-3 text-[#A8B3BD]">
                                    {module.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </SectionWrapper>
    );
};

export default ModulesSection;
