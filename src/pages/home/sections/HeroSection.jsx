import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Megaphone, Phone, Users, Headphones, Star, UserCheck } from 'lucide-react';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
    const orbitCards = [
        {
            icon: Megaphone,
            label: 'Marketing',
            iconBg: 'bg-blue-500',
            position: 'top-[72px] left-[72px]'
        },
        {
            icon: Phone,
            label: 'Sales',
            iconBg: 'bg-green-500',
            position: 'top-[72px] right-[72px]'
        },
        {
            icon: UserCheck,
            label: 'Post-Sale',
            iconBg: 'bg-yellow-500',
            position: 'bottom-[72px] left-[72px]'
        },
        {
            icon: Headphones,
            label: 'Support',
            iconBg: 'bg-red-500',
            position: 'bottom-[72px] right-[72px]'
        },
    ];

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className="text-left">
                        {/* Top badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{
                            background: 'rgba(29, 124, 255, 0.10)',
                            border: '1px solid rgba(29, 124, 255, 0.22)',
                            color: '#0B5DDA'
                        }}>
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Revenue Automation
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                            The World's First
                            <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #1D7CFF 0%, #073B8F 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>AI Workforce</span> for
                            <br />
                            Revenue Automation
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                            Replace manual marketing, sales & support with human-like AI. Zero missed follow-ups. 24×7 availability. Real revenue growth.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <Link to="/contact">
                                <Button variant="primary" icon={ArrowRight}>
                                    Book a Demo
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const element = document.getElementById('modules');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                Explore Products
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Orbit Graphic */}
                    <div className="relative h-[500px] hidden lg:block">
                        {/* Background glow effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-100/50 rounded-full blur-3xl"></div>

                        {/* Orbit rings - 2 dashed circles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px]">
                            {/* Outer dashed circle */}
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200/60"></div>
                            {/* Inner dashed circle */}
                            <div className="absolute inset-16 rounded-full border-2 border-dashed border-blue-200/60"></div>
                        </div>

                        {/* Center Circle - SalesPal 360 with glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            {/* Glow effect behind center */}
                            <div className="absolute inset-0 w-28 h-28 bg-blue-500/30 rounded-full blur-2xl"></div>

                            {/* Center circle */}
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-white font-bold text-base">SalesPal</div>
                                    <div className="text-white text-2xl font-bold">360</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Product Cards - positioned to match first screenshot */}
                        {orbitCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={index}
                                    className={`absolute ${card.position} animate-float z-10`}
                                    style={{ animationDelay: `${index * 0.5}s` }}
                                >
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-gray-200 backdrop-blur-sm shadow-lg">
                                        <div className={`w-9 h-9 ${card.iconBg} rounded-md flex items-center justify-center`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium text-base whitespace-nowrap text-gray-900">{card.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile Orbit Graphic */}
                    <div className="relative h-80 lg:hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                            <div className="absolute inset-0 rounded-full border border-blue-200/60"></div>
                            <div className="absolute inset-8 rounded-full border border-blue-200/60"></div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border-4 border-white/10 shadow-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-white font-bold text-sm">SalesPal</div>
                                    <div className="text-white text-lg font-bold">360</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-200 shadow-md">
                                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                                    <Megaphone className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-medium">Marketing</span>
                            </div>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-4">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-200 shadow-md">
                                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                                    <Phone className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-medium">Sales</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-200 shadow-md">
                                <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
                                    <UserCheck className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-medium">Post-Sale</span>
                            </div>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-4">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-200 shadow-md">
                                <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                                    <Headphones className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-medium">Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
