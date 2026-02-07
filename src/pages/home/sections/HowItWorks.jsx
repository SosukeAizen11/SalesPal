import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { Megaphone, Phone, Users, Heart, ChevronDown } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            icon: Megaphone,
            title: "AI Runs Your Ads",
            desc: "AI creates and optimizes ad campaigns. Leads are automatically captured and qualified.",
            side: "left"
        },
        {
            number: "02",
            icon: Phone,
            title: "AI Engages Leads",
            desc: "Human-like AI conversations on WhatsApp and calls. Objections handled, meetings booked.",
            side: "right"
        },
        {
            number: "03",
            icon: Users,
            title: "AI Onboards Customers",
            desc: "Automated onboarding and engagement. Every customer feels valued and guided.",
            side: "left"
        },
        {
            number: "04",
            icon: Heart,
            title: "AI Retains & Grows",
            desc: "24/7 support, sentiment tracking, and proactive retention. Customers become advocates.",
            side: "right"
        }
    ];

    return (
        <SectionWrapper id="how-it-works" className="bg-white relative overflow-hidden">
            {/* Subtle radial glow background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
                    How <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">SalesPal</span> Works
                </h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                    From first touch to loyal customer - automated, intelligent, and always on.
                </p>
            </div>

            {/* Vertical Timeline */}
            <div className="max-w-5xl mx-auto relative">
                {/* Center line - very light grey */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-20 w-px bg-gray-200 hidden lg:block"></div>

                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isLeft = step.side === "left";

                    return (
                        <div key={idx} className="relative mb-20 last:mb-0">
                            {/* Timeline dot - deep navy with white text */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-gray-900 shadow-lg">
                                <span className="text-white font-bold text-base">{step.number}</span>
                            </div>

                            {/* Content card */}
                            <div className={`lg:w-[42%] ${isLeft ? 'lg:ml-0 lg:mr-auto lg:pr-12' : 'lg:ml-auto lg:mr-0 lg:pl-12'}`}>
                                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg shrink-0">
                                            <Icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-blue-600 text-sm font-medium mb-1">Step {step.number}</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile step number */}
                            <div className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 mx-auto mb-4">
                                <span className="text-white font-bold text-sm">{step.number}</span>
                            </div>
                        </div>
                    );
                })}

                {/* Down arrow at bottom with bouncing animation */}
                <div className="flex justify-center mt-8">
                    <div className="p-3 bg-blue-500 rounded-full shadow-md animate-bounce-slow">
                        <ChevronDown className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 1.5s ease-in-out infinite;
                }
            `}</style>
        </SectionWrapper>
    );
};

export default HowItWorks;
