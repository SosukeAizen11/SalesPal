import React from 'react';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import Badge from '../../../components/ui/Badge';
import { Layout, Zap, Shield, BarChart3, Bot } from 'lucide-react';

const ModularApproach = () => {
    return (
        <SectionWrapper className="bg-white/5 border-y border-white/5">
            <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <Badge variant="outline">
                        <Layout className="w-3 h-3" /> Scalable Architecture
                    </Badge>

                    <h2 className="text-3xl md:text-4xl font-bold">Build Your AI Workforce</h2>
                    <p className="text-lg text-gray-400">
                        Select the specific AI agents you need for your business.
                        SalesPal's modular architecture lets you start with Marketing and expand to Sales or Support instantly.
                    </p>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/50 border border-white/10">
                            <Zap className="w-8 h-8 text-yellow-400" />
                            <div>
                                <h4 className="font-semibold">Instant Activation</h4>
                                <p className="text-sm text-gray-400">Deploy AI agents in seconds.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/50 border border-white/10">
                            <Shield className="w-8 h-8 text-green-400" />
                            <div>
                                <h4 className="font-semibold">Scalable Power</h4>
                                <p className="text-sm text-gray-400">Add more compute as you grow.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full flex justify-center">
                    {/* Visual representation of modularity */}
                    <div className="relative w-full max-w-md aspect-square rounded-full border border-white/10 flex items-center justify-center animate-spin-slow-reverse">
                        <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                        <div className="grid grid-cols-2 gap-4 p-8">
                            <div className="bg-secondary p-6 rounded-2xl w-32 h-32 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(118,247,197,0.3)] transform translate-y-4">
                                <Zap className="w-8 h-8 text-primary mb-2" />
                                <span className="text-primary font-bold text-xs">MKT</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-32 h-32 flex flex-col items-center justify-center border border-white/10 transform -translate-y-4">
                                <BarChart3 className="w-8 h-8 text-white mb-2" />
                                <span className="text-white font-bold text-xs">SALES</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-32 h-32 flex flex-col items-center justify-center border border-white/10 transform translate-y-4">
                                <Bot className="w-8 h-8 text-white mb-2" />
                                <span className="text-white font-bold text-xs">SUP</span>
                            </div>
                            <div className="bg-white/5 border border-dashed border-white/20 p-6 rounded-2xl w-32 h-32 flex flex-col items-center justify-center transform -translate-y-4">
                                <span className="text-gray-500 font-bold text-xs">+ ADD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ModularApproach;
