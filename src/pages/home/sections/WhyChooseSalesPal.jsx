import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { comparisonPoints } from '../../../data/homepageData';
import { Check, X } from 'lucide-react';
import { ScrollRevealHeading, ScrollRevealSubheading } from '../../../components/animations/ScrollReveal';
import useScrollReveal from '../../../hooks/useScrollReveal';
import useReducedMotion from '../../../hooks/useReducedMotion';

const WhyChooseSalesPal = () => {
    const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const rowVariants = {
        hidden: {
            opacity: 0,
            x: -20
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <SectionWrapper className="bg-primary/50">
            <div className="text-center mb-16">
                <ScrollRevealHeading>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Traditional vs AI-Powered Revenue Operations</h2>
                </ScrollRevealHeading>
                <ScrollRevealSubheading>
                    <p className="text-[#A8B3BD] max-w-2xl mx-auto">See how AI automation outperforms manual processes across every metric.</p>
                </ScrollRevealSubheading>
            </div>

            <div className="max-w-5xl mx-auto">
                {/* Header Row (Desktop) */}
                <div className="hidden md:grid grid-cols-3 gap-6 px-6 py-4 text-sm font-semibold tracking-wider text-[#7C8A96] uppercase">
                    <div>Feature</div>
                    <div>Traditional Way</div>
                    <div className="text-secondary">SalesPal Advantage</div>
                </div>

                <motion.div
                    ref={ref}
                    className="space-y-4"
                    variants={prefersReducedMotion ? {} : containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                >
                    {comparisonPoints.map((point, idx) => (
                        <motion.div
                            key={idx}
                            className="grid md:grid-cols-3 gap-6 p-6 items-center bg-[#132B3A] border border-white/5 rounded-lg transition-colors"
                            variants={prefersReducedMotion ? {} : rowVariants}
                            whileHover={prefersReducedMotion ? {} : {
                                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                                borderColor: 'rgba(59, 130, 246, 0.2)',
                                transition: {
                                    duration: 0.15,
                                    ease: [0.22, 1, 0.36, 1]
                                }
                            }}
                        >
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
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </SectionWrapper>
    );
};

export default WhyChooseSalesPal;
