import React from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-medium mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                    SalesPal AI Platform v1.0
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto">
                    AI-powered <span className="text-secondary">Marketing Automation</span><br className="hidden md:block" /> for Modern Businesses
                </h1>

                <p className="text-lg md:text-xl text-[#A8B3BD] mb-10 max-w-2xl mx-auto leading-relaxed">
                    Launch campaigns, optimize budgets, and generate leads automatically with your 24/7 AI workforce.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/signin">
                        <Button variant="primary" icon={ArrowRight}>
                            Start Free Trial
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        See How It Works
                    </Button>
                </div>
            </div>

            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000"></div>
            </div>
        </section>
    );
};

export default HeroSection;
