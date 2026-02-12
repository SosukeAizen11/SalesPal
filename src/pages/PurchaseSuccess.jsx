import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    Zap,
    Sparkles,
    ShieldCheck,
    Globe,
    Plus,
    ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { PLANS, TOP_UPS, FEATURES } from '../data/billing';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PurchaseSuccess = () => {
    const navigate = useNavigate();
    const { ownedProducts, addToCart } = useCart();

    const activeItems = React.useMemo(() => {
        return ownedProducts.filter(p => p.status === 'active').map(owned => {
            const staticData = PLANS.find(p => p.id === owned.id) ||
                TOP_UPS.find(t => t.id === owned.id) ||
                FEATURES.find(f => f.id === owned.id);

            return {
                ...owned,
                ...staticData,
                // Ensure icon is a valid component (func/object) and not a plain serialized object
                icon: (staticData?.icon && (typeof staticData.icon === 'function' || typeof staticData.icon === 'object')) ? staticData.icon : Zap
            };
        });
    }, [ownedProducts]);

    const ownedIds = activeItems.map(i => i.id);

    const availableItems = React.useMemo(() => {
        return [...PLANS, ...TOP_UPS, ...FEATURES]
            .filter(item => !ownedIds.includes(item.id))
            .map(item => ({
                ...item,
                icon: (item.icon && (typeof item.icon === 'function' || typeof item.icon === 'object')) ? item.icon : Plus
            }));
    }, [ownedIds]);

    const recommendedUpgrades = React.useMemo(() => {
        const recs = [];
        const salesPlan = PLANS.find(p => p.id === 'sales');
        if (ownedIds.includes('marketing') && !ownedIds.includes('sales') && salesPlan) {
            recs.push({ ...salesPlan, reason: "Direct conversion engine for your marketing leads." });
        }
        const postSalePlan = PLANS.find(p => p.id === 'postsale');
        if (ownedIds.includes('sales') && !ownedIds.includes('postsale') && postSalePlan) {
            recs.push({ ...postSalePlan, reason: "Automate retention after closing deals." });
        }
        const topup = TOP_UPS.find(t => !ownedIds.includes(t.id));
        if (topup && recs.length < 3) recs.push({ ...topup, reason: "Essential resources for active workspaces." });

        return recs.slice(0, 3).map(rec => ({
            ...rec,
            icon: (rec.icon && (typeof rec.icon === 'function' || typeof rec.icon === 'object')) ? rec.icon : Sparkles
        }));
    }, [ownedIds]);

    const formatCurrency = (val) => `₹${Number(val).toLocaleString()}`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-white border border-gray-100 rounded-3xl p-12 mb-12 text-center shadow-sm relative overflow-hidden">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Activation Successful</h1>
                        <p className="text-gray-500 mt-1 max-w-lg mx-auto leading-relaxed">
                            Your institutional modules and credits have been provisioned. Your workspace is now equipped with the selected expansion packs.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-12">
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active Inventory
                                    </h2>
                                    <span className="text-[10px] font-bold text-gray-400">{activeItems.length} Provisions</span>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {activeItems.map((item) => {
                                        const ItemIcon = item.icon || Zap;
                                        return (
                                            <div key={item.id} className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm transition-all group">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        <ItemIcon className="w-5 h-5" />
                                                    </div>
                                                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                                                        Live
                                                    </span>
                                                </div>
                                                <h3 className="text-gray-900 font-bold text-sm mb-1">{item.name}</h3>
                                                <p className="text-[10px] text-gray-400 font-medium mb-6">
                                                    {item.type === 'subscription' ? 'Periodic Module' : 'Resource Bundle'}
                                                </p>
                                                <button
                                                    className="w-full text-[10px] uppercase font-bold tracking-widest h-10 rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-900 hover:text-white transition-all"
                                                    onClick={() => navigate('/marketing')}
                                                >
                                                    Access Module
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-blue-600" /> Ecosystem Recommendations
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {availableItems.slice(0, 3).map((item) => {
                                        const ItemIcon = item.icon || Plus;
                                        return (
                                            <div key={item.id} className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                                                        <ItemIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-gray-900 font-bold text-sm leading-tight">{item.name}</h4>
                                                        <p className="text-[10px] text-gray-400 font-medium">{item.subtitle || 'Module available for expansion'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-xs font-bold text-gray-900">{formatCurrency(item.price)}</span>
                                                    <button
                                                        onClick={() => { addToCart(item); navigate('/cart'); }}
                                                        className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                                                    >
                                                        Add to Hub
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="p-8 rounded-3xl bg-gray-900 text-white shadow-xl relative overflow-hidden">
                                <h2 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Priority Path
                                </h2>

                                <div className="space-y-8">
                                    {recommendedUpgrades.map(rec => (
                                        <div key={rec.id} className="group">
                                            <h4 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{rec.name}</h4>
                                            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed italic border-l border-gray-800 pl-3">"{rec.reason}"</p>
                                            <button
                                                className="w-full text-[10px] h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-widest border-none transition-all"
                                                onClick={() => { addToCart(rec); navigate('/cart'); }}
                                            >
                                                Provision Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    className="w-full py-5 text-[11px] font-bold uppercase tracking-widest bg-gray-900 text-white hover:bg-black rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                                    onClick={() => navigate('/marketing')}
                                >
                                    Jump to Control Center <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest pt-2">
                                    Installation complete. System live.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PurchaseSuccess;
