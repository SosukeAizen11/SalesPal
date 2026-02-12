import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Sparkles } from 'lucide-react';

const StatBox = ({ label, value, trend, isPositive, icon: Icon }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 text-gray-900">
                {Icon && <Icon className="w-4 h-4" />}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
        <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h4>
            <div className={`flex items-center text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${isPositive ? 'text-blue-600' : 'text-gray-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {trend}
            </div>
        </div>
    </div>
);

const AnalyticsSnapshot = () => {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-hidden relative group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-900" /> Performance
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live Revenue Snapshot</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Real-time</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <StatBox
                    icon={Target}
                    label="Campaign Revenue"
                    value="₹1,24,500"
                    trend="+12%"
                    isPositive={true}
                />
                <StatBox
                    icon={Sparkles}
                    label="AI Conversion Rate"
                    value="4.2%"
                    trend="+0.8%"
                    isPositive={true}
                />
                <StatBox
                    icon={DollarSign}
                    label="Customer LTV"
                    value="₹18,200"
                    trend="-2%"
                    isPositive={false}
                />
            </div>

            <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-[10px]">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">Cycle: </span>
                        <span className="text-gray-900 font-black">Feb 01 - Feb 28</span>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95">
                    View Impact Report
                </button>
            </div>
        </div>
    );
};

export default AnalyticsSnapshot;
