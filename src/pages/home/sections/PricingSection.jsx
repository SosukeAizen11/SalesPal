import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { Phone, Check, ShoppingCart, Layers, Plus, PhoneCall, MessageSquare, Image, Grid3x3, Video, Zap, Bot, UserCheck, Megaphone, Headphones } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
    const { addToCart, ownedProducts, cartItems } = useCart();
    const [addedItems, setAddedItems] = useState({});

    const isPlanOwned = (id) => ownedProducts?.some(p => p.id === id && p.status === 'active');
    const isInCart = (id) => cartItems?.some(i => i.id === id);



    const products = [
        {
            id: 'marketing',
            name: "SalesPal Marketing",
            price: 5999,
            subtitle: "AI-powered ad campaigns",
            icon: Megaphone,
            iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20",
            features: [
                "20 AI image creatives / month",
                "4 AI videos (≥30 sec) / month",
                "6 AI carousel creatives / month",
                "30 scheduled posts / month",
                "AI ad copy & captions",
                "Multi-platform publishing"
            ]
        },
        {
            id: 'sales',
            name: "SalesPal Sales",
            price: 9999,
            subtitle: "Human-like conversations",
            icon: Phone,
            iconBg: "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20",
            features: [
                "1000 AI calling minutes / month",
                "1000 WhatsApp conversations / month",
                "AI outbound & inbound calling",
                "AI WhatsApp replies",
                "Follow-up & re-scheduling logic",
                "Context memory",
                "Human escalation when needed"
            ]
        },
        {
            id: 'post-sale',
            name: "SalesPal Post-Sale",
            price: 9999,
            subtitle: "Automated customer success",
            icon: UserCheck,
            iconBg: "bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/20",
            features: [
                "1000 AI calling minutes / month",
                "1000 WhatsApp conversations / month",
                "Automated payment reminders",
                "Payment proof collection",
                "Owner verified closure",
                "Document checklist & re-upload",
                "Full audit log"
            ]
        },
        {
            id: 'support',
            name: "SalesPal Support",
            price: 9999,
            subtitle: "24/7 AI support",
            icon: Headphones,
            iconBg: "bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-red-500/20",
            features: [
                "1000 AI calling minutes / month",
                "1000 WhatsApp conversations / month",
                "AI answers from your knowledge",
                "No hallucination logic",
                "Complaint registration ID",
                "Sentiment detection"
            ]
        },
        {
            id: 'salespal360',
            name: "SalesPal 360",
            price: 29999,
            subtitle: "Total Revenue OS",
            icon: Layers,
            iconBg: "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20",
            features: [
                "All 4 Products Integrated",
                "3000 AI Calling Mins / mo",
                "3000 WhatsApp Convs / mo",
                "Shared AI Intelligence",
                "Master Business Controls",
                "Dedicated Account Manager",
                "24/7 Priority Support",
                "Custom API Access"
            ],
            isFlagship: true
        }
    ];

    const salesPal360Features = [
        "All 4 products included",
        "2200 WhatsApp conversations / month",
        "One shared AI memory",
        "Role-based access",
        "2200 AI calling minutes / month",
        "Single customer timeline",
        "Owner control center",
        "Outcome dashboards"
    ];

    const topUpOptions = [
        { icon: PhoneCall, label: "+200 AI calling minutes", color: "text-green-400" },
        { icon: MessageSquare, label: "+200 WhatsApp conversations", color: "text-blue-400" },
        { icon: Image, label: "+10 AI images", color: "text-purple-400" },
        { icon: Grid3x3, label: "+5 AI carousels", color: "text-orange-400" },
        { icon: Video, label: "+2 AI videos (≥30 sec)", color: "text-red-400" }
    ];

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedItems(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
        }, 2000);
    };

    return (
        <SectionWrapper id="pricing" className="bg-gradient-to-b from-white to-gray-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    Simple, <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Transparent</span> Pricing
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Choose individual products or get everything with SalesPal 360. No hidden fees.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.filter(p => !p.isFlagship).map((product, idx) => {
                    const Icon = product.icon;
                    const isOwned = isPlanOwned(product.id);
                    const isAdded = addedItems[product.id] || isInCart(product.id);

                    return (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col ${isOwned
                                    ? 'bg-blue-50/30 border-blue-200'
                                    : 'bg-white border-gray-100 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isOwned && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm">
                                    Current Plan
                                </div>
                            )}

                            <div className={`w-14 h-14 ${product.iconBg} rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/10`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{product.subtitle}</p>

                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                <span className="text-gray-600 text-sm">/mo</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {product.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={isOwned ? "outline" : (isAdded ? "primary" : "outline")}
                                className="w-full gap-2.5"
                                onClick={() => !isOwned && handleAddToCart(product)}
                                disabled={isOwned}
                            >
                                {isOwned ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Active Plan</span>
                                    </>
                                ) : (
                                    <>
                                        {isAdded ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                <span>Plan in Cart</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5 shrink-0" />
                                                <span className="whitespace-nowrap">Add to Cart</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    );
                })}

                {/* SalesPal 360 Flagship Plan - Spanning All Columns */}
                {products.filter(p => p.isFlagship).map((product, idx) => {
                    const isOwned = isPlanOwned(product.id);
                    const isAdded = addedItems[product.id] || isInCart(product.id);

                    return (
                        <div
                            key={idx}
                            className={`lg:col-span-4 p-8 md:p-12 rounded-[32px] border transition-all relative overflow-hidden group flex flex-col md:flex-row gap-12 items-center ${isOwned
                                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                                    : 'bg-white border-blue-100 shadow-[0_20px_50px_rgba(59,130,246,0.12)] hover:border-blue-300'
                                } mt-4`}
                        >
                            {/* Visual Accents */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="absolute top-0 left-0 px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-br-2xl shadow-lg z-10">
                                Platinum Flagship Suite
                            </div>

                            {/* Left Content Side */}
                            <div className="w-full md:w-5/12 relative z-10">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:rotate-6 transition-transform duration-500">
                                        <Layers className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-gray-900 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">{product.subtitle}</p>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-6xl font-black text-gray-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
                                        <span className="text-gray-500 text-xl font-medium"> / month</span>
                                    </div>
                                    <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                                        Empower your entire organization with unified intelligence, total oversight, and unlimited scaling potential.
                                    </p>
                                </div>

                                <Button
                                    variant={isOwned ? "outline" : (isAdded ? "outline" : "primary")}
                                    className={`w-full md:w-auto px-12 py-5 text-lg font-black rounded-2xl transition-all ${!isOwned && !isAdded ? 'bg-blue-600 hover:bg-black text-white shadow-2xl shadow-blue-500/20 active:scale-95' : ''}`}
                                    onClick={() => !isOwned && handleAddToCart(product)}
                                    disabled={isOwned}
                                >
                                    {isOwned ? (
                                        <><Check className="w-6 h-6" /> <span className="ml-2">Manage Plan</span></>
                                    ) : (
                                        <>{isAdded ? <Check className="w-6 h-6" /> : <Layers className="w-6 h-6 shrink-0" />}
                                            <span className="ml-2">{isAdded ? "Plan in Cart" : "Get Started with 360"}</span>
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Right Feature Side */}
                            <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 bg-gray-50/50 p-10 rounded-[40px] border border-gray-100 relative z-10">
                                {product.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className={`text-sm font-bold ${feature.includes('Integrated') ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {feature}
                                            </span>
                                            {feature.includes('Support') && <p className="text-[10px] text-gray-400 mt-0.5">Response in &lt;15 mins</p>}
                                        </div>
                                    </div>
                                ))}

                                <div className="sm:col-span-2 mt-8 pt-8 border-t border-gray-200 grid grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Security</p>
                                        <p className="text-xs font-bold text-gray-900">SSO & RBAC</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Infrastructure</p>
                                        <p className="text-xs font-bold text-gray-900">Priority API</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Compliance</p>
                                        <p className="text-xs font-bold text-gray-900">Full Audit Log</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Top-Up Section */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left side - Icon and Info */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shrink-0">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">₹1,000 Top-Up</h3>
                            <p className="text-sm text-gray-600">
                                Choose ANY ONE of the following options. Works with all products. No plan change required.
                            </p>
                        </div>
                    </div>

                    {/* Right side - Button */}
                    <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-900 px-6 py-2.5 rounded-lg font-medium transition-all shrink-0">
                        Add Top-Up
                    </button>
                </div>

                {/* Top-up options */}
                <div className="mt-6 flex flex-wrap gap-4">
                    {topUpOptions.map((option, idx) => {
                        const Icon = option.icon;
                        return (
                            <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200">
                                <Icon className={`w-4 h-4 ${option.color}`} />
                                <span className="text-sm text-gray-700">{option.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom Solution CTA */}
            <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">Need a custom solution for your enterprise?</p>
                <Link to="/contact">
                    <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-900 px-8 py-2.5 rounded-lg font-medium transition-all">
                        Contact Sales
                    </button>
                </Link>
            </div>
        </SectionWrapper>
    );
};

export default PricingSection;


