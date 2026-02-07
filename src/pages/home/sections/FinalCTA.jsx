import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const FinalCTA = () => {
    return (
        <SectionWrapper className="bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="relative p-12 rounded-[32px] bg-gradient-to-br from-[#243748] to-[#2D4152] text-center overflow-hidden" style={{
                    boxShadow: '0px 30px 80px rgba(0,0,0,0.18), inset 0px 1px 0px rgba(255,255,255,0.06)'
                }}>
                    {/* Removed background decoration for cleaner look */}

                    <div className="relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            color: 'rgba(255,255,255,0.90)'
                        }}>
                            <Calendar className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.75)' }} />
                            Get Started Today
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Automate<br />
                            <span className="text-[#1677FF]" style={{ textShadow: '0 0 20px rgba(22,119,255,0.3)' }}>Your Revenue?</span>
                        </h2>

                        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
                            Join hundreds of businesses that have transformed their sales with AI. See SalesPal in action with a personalized demo.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/contact">
                                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5" style={{
                                    background: 'linear-gradient(135deg, #2E8BFF 0%, #0B3B86 100%)',
                                    boxShadow: '0px 12px 35px rgba(0,120,255,0.25)'
                                }}>
                                    Book Your Demo
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                            <Link to="/contact">
                                <button className="px-6 py-3 rounded-xl font-semibold transition-all" style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    color: 'rgba(255,255,255,0.85)'
                                }} onMouseEnter={(e) => {
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.40)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                }} onMouseLeave={(e) => {
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.25)';
                                    e.currentTarget.style.background = 'transparent';
                                }}>
                                    Contact Sales
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default FinalCTA;
