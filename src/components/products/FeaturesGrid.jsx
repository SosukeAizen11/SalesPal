import React, { useEffect, useRef, useState } from 'react';
import { Bot, Target, Zap, BarChart3, Share2, TrendingUp } from 'lucide-react';

const features = [
    {
        icon: Bot,
        title: "AI Ad Creative Generation",
        description: "Generate multiple ad variations in seconds. Our AI understands what works for your industry."
    },
    {
        icon: Target,
        title: "Automatic A/B Testing",
        description: "Continuous testing and optimization. AI learns what converts and allocates budget accordingly."
    },
    {
        icon: Zap,
        title: "Smart Lead Routing",
        description: "Qualified leads are instantly routed to the right salesperson based on criteria you define."
    },
    {
        icon: BarChart3,
        title: "Campaign Analytics",
        description: "Deep insights into what's working. Track cost per lead, conversion rates, and ROI in real-time."
    },
    {
        icon: Share2,
        title: "Multi-Channel Support",
        description: "Run campaigns across Facebook, Instagram, Google, and LinkedIn from one dashboard."
    },
    {
        icon: TrendingUp,
        title: "Budget Optimization",
        description: "AI automatically adjusts budgets to maximize conversions within your spend limits."
    }
];

const FeaturesGrid = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            id="powerful-features"
            ref={sectionRef}
            className="py-20 px-6 bg-white"
            style={{ scrollMarginTop: '80px' }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        Powerful Features
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to automate and scale your revenue operations.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isVisible ? 'animate-fade-in-stagger' : 'opacity-0'
                                    }`}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    boxShadow: '0px 4px 12px rgba(0,0,0,0.08)'
                                }}
                            >
                                {/* Icon Container */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                                    style={{
                                        background: 'rgba(59, 130, 246, 0.1)'
                                    }}
                                >
                                    <Icon className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInStagger {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-stagger {
                    animation: fadeInStagger 0.6s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

export default FeaturesGrid;
