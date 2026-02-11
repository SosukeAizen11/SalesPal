import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    ArrowRight,
    Zap,
    Sparkles,
    Rocket,
    BarChart3,
    ShieldCheck,
    Globe,
    Layout,
    ArrowUpRight,
    Search,
    MessageSquare,
    Phone,
    Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { PLANS, TOP_UPS, FEATURES } from '../data/billing';

const PurchaseSuccess = () => {
    const navigate = useNavigate();
    const { ownedProducts, addToCart } = useCart();

    // Map owned products to static data
    const activeItems = ownedProducts.filter(p => p.status === 'active').map(owned => {
        const staticData = PLANS.find(p => p.id === owned.id) ||
            TOP_UPS.find(t => t.id === owned.id) ||
            FEATURES.find(f => f.id === owned.id);
        return { ...owned, ...staticData };
    });

    const ownedIds = activeItems.map(i => i.id);

    // Available Enhancements (Not owned)
    const availableItems = [...PLANS, ...TOP_UPS, ...FEATURES].filter(item =>
        !ownedIds.includes(item.id)
    );

    // Smart Recommendations (Max 3)
    const recommendedUpgrades = React.useMemo(() => {
        const recs = [];

        // Logic: Upsell path
        if (ownedIds.includes('marketing') && !ownedIds.includes('sales')) {
            recs.push({ ...PLANS.find(p => p.id === 'sales'), reason: "Direct conversion engine for your marketing leads." });
        }

        if (ownedIds.includes('sales') && !ownedIds.includes('postsale')) {
            recs.push({ ...PLANS.find(p => p.id === 'postsale'), reason: "Automate retention after closing deals." });
        }

        // Add top-up if not owned
        const topup = TOP_UPS.find(t => !ownedIds.includes(t.id));
        if (topup && recs.length < 3) recs.push({ ...topup, reason: "Essential resources for active workspaces." });

        return recs.slice(0, 3);
    }, [ownedIds]);

    const formatCurrency = (val) => `₹${Number(val).toLocaleString()}`;

    return (
        <div className="min-h-screen bg-[#0A0F16]">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[120px]" />
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4 relative z-10">Your Workspace Is Ready</h1>
                        <p className="text-[#A8B3BD] text-lg max-w-xl mx-auto relative z-10">
                            Your plans and credits have been activated successfully. You can now start building your next high-impact campaign.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* LEFT COLUMN: ACTIVE STATUS */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* SECTION A: PURCHASED ITEMS */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Your Active Plans & Credits</h2>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {activeItems.map((item) => {
                                        const Icon = item.icon || Zap;
                                        return (
                                            <div key={item.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                                        Active
                                                    </span>
                                                </div>
                                                <h3 className="text-white font-bold mb-1">{item.name}</h3>
                                                <p className="text-xs text-[#A8B3BD] mb-6">
                                                    {item.type === 'subscription'
                                                        ? `Auto-renews on ${item.renewalDate}`
                                                        : `Balance: ${item.balance || 0} credits remain`
                                                    }
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    {item.type === 'subscription' ? (
                                                        <Button variant="secondary" size="sm" onClick={() => navigate('/marketing')} className="text-[10px] flex-1">
                                                            Manage Plan
                                                        </Button>
                                                    ) : (
                                                        <Button variant="secondary" size="sm" onClick={() => navigate('/marketing/campaigns/new')} className="text-[10px] flex-1">
                                                            Use Credits
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* SECTION B: NOT PURCHASED (AVAILABLE) */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                    <Globe className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Available To Enhance Your Setup</h2>
                                </div>
                                <div className="space-y-4">
                                    {availableItems.slice(0, 4).map((item) => {
                                        const Icon = item.icon || Plus;
                                        return (
                                            <div key={item.id} className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#A8B3BD] group-hover:text-white transition-colors">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold text-sm">{item.name}</h4>
                                                        <p className="text-[11px] text-[#A8B3BD]">{item.subtitle || item.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-white">{formatCurrency(item.price)}</span>
                                                    <button
                                                        onClick={() => { addToCart(item); navigate('/cart'); }}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A8B3BD] hover:text-white transition-all"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: RECOMMENDATIONS & CTAS */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* SECTION C: RECOMMENDED UPGRADES */}
                            <div className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 shadow-2xl relative overflow-hidden backdrop-blur-md">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />
                                <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    Recommended
                                </h2>

                                <div className="space-y-6">
                                    {recommendedUpgrades.map(rec => (
                                        <div key={rec.id} className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                            <h4 className="text-white font-bold text-sm mb-1">{rec.name}</h4>
                                            <p className="text-[11px] text-[#A8B3BD] mb-4 leading-relaxed">{rec.reason}</p>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="w-full text-[10px] h-9 bg-blue-600 hover:bg-blue-500 rounded-xl"
                                                onClick={() => { addToCart(rec); navigate('/cart'); }}
                                            >
                                                Upgrade Now
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* NEXT STEPS NAV */}
                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    icon={Rocket}
                                    onClick={() => navigate('/marketing')}
                                    className="w-full py-4 text-sm font-black"
                                >
                                    GO TO DASHBOARD
                                </Button>
                                <Button
                                    variant="secondary"
                                    icon={BarChart3}
                                    onClick={() => navigate('/marketing/campaigns/new')}
                                    className="w-full py-4 text-sm font-bold"
                                >
                                    START CAMPAIGN
                                </Button>
                                <Link to="/marketing/subscription" className="block text-center text-xs font-bold text-[#A8B3BD] hover:text-white transition-colors py-2 tracking-widest uppercase mt-4">
                                    View Detailed Billing
                                </Link>
                            </div>

                            {/* Trust Badge */}
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center shrink-0">
                                    <Search className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-[10px] text-[#A8B3BD] leading-relaxed">
                                    <span className="text-white font-bold block mb-0.5">Automated Syncing</span>
                                    Your workspace is currently syncing with your active data sources. This may take up to 2 minutes.
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
