import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { Shield, Cpu, Users } from 'lucide-react';
import { trustLogos } from '../../../data/homepageData';

const TrustSection = () => {
    return (
        <SectionWrapper>
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Trusted by Modern Enterprises</h2>
                <p className="text-gray-400">Secure, scalable, and built for high-performance teams.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {trustLogos.map((logo, idx) => (
                    <div key={idx} className="h-16 flex items-center justify-center border border-white/10 rounded-lg hover:bg-white/5">
                        <span className="font-bold text-xl">{logo.name}</span>
                    </div>
                ))}
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-8 text-center border-t border-white/5 pt-12">
                <div>
                    <Shield className="w-10 h-10 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Enterprise Security</h3>
                    <p className="text-sm text-gray-400">SOC2 Type II ready & data encryption</p>
                </div>
                <div>
                    <Cpu className="w-10 h-10 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Infinite Scalability</h3>
                    <p className="text-sm text-gray-400">Handle millions of leads effortlessly</p>
                </div>
                <div>
                    <Users className="w-10 h-10 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Human + AI</h3>
                    <p className="text-sm text-gray-400">Perfect synergy for complex sales</p>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default TrustSection;
