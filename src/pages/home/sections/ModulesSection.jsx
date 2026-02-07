import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { ArrowRight, Layers } from 'lucide-react';
import { modules } from '../../../data/homepageData';
import Button from '../../../components/ui/Button';

const ModulesSection = () => {
    return (
        <SectionWrapper id="modules" className="bg-gradient-to-b from-white to-gray-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    5 AI Products. <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">One Mission.</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    From the first ad to loyal customer, SalesPal automates every touchpoint in your revenue journey.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <div key={module.id} className="group relative p-6 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                style={{
                                    background: module.id === 'marketing' ? '#3b82f6' :
                                        module.id === 'sales' ? '#22c55e' :
                                            module.id === 'postsale' ? '#f59e0b' :
                                                '#ef4444',
                                    boxShadow: '0px 6px 16px rgba(0,0,0,0.08)'
                                }}
                            >
                                <Icon
                                    className="w-6 h-6"
                                    strokeWidth={2.5}
                                    style={{ color: '#ffffff' }}
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{module.title}</h3>
                            <p className="text-sm font-medium text-gray-700 mb-3">{module.subtitle}</p>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{module.description}</p>

                            <button className="text-gray-700 hover:bg-blue-50 border border-blue-400 hover:border-blue-500 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 inline-flex items-center gap-1">
                                Learn More <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* SalesPal 360 Section */}
            <div className="relative">
                {/* Best Value Badge */}
                <div className="absolute -top-3 right-6 z-10">
                    <div className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-lg">
                        <span>⭐</span>
                        <span>Best Value</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Left side - Icon and Content */}
                        <div className="flex items-start gap-6 flex-1">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shrink-0 shadow-lg">
                                <Layers className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">SalesPal 360</h3>
                                <p className="text-base font-medium text-gray-700 mb-3">Complete AI Revenue System</p>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                    All 4 products unified into one powerful platform. Single customer timeline, shared AI memory, and complete owner control.
                                </p>
                            </div>
                        </div>

                        {/* Right side - Button */}
                        <div className="shrink-0">
                            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                Learn More
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ModulesSection;

