import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { Phone, Check, ShoppingCart, Layers, Plus, PhoneCall, MessageSquare, Image, Grid3x3, Video, Zap, Bot, UserCheck, Megaphone, Headphones } from 'lucide-react';
import Button from '../../../components/ui/Button';

import { useCart } from '../../../commerce/CartContext';
import { useSubscription } from '../../../commerce/SubscriptionContext';

const PricingSection = () => {
    const navigate = useNavigate();
    const { addSubscription } = useCart();
    const { isModuleActive } = useSubscription();



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
            subtitle: "Complete AI revenue operating system",
            icon: Layers,
            iconBg: "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20",
            features: [
                "All 4 products included",
                "2200 WhatsApp conversations / month",
                "One shared AI memory",
                "Role-based access",
                "2200 AI calling minutes / month",
                "Single customer timeline",
                "Owner control center",
                "Outcome dashboards"
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
                    const isOwned = product.id === 'marketing' ? false : isPlanOwned(product.id);
                    const isAdded = addedItems[product.id] || isInCart(product.id);

                    return (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col bg-white border-gray-100 shadow-lg hover:shadow-xl`}
                        >


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

                            <button
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isOwned
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                                    : isAdded
                                        ? 'bg-green-50 text-green-600 border border-green-200'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white shadow-sm hover:shadow-lg hover:shadow-blue-500/25'
                                    }`}
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
                                                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                                                <span>Add to Cart</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}

                {/* SalesPal 360 Flagship Plan */}
                {products.filter(p => p.isFlagship).map((product, idx) => {
                    const isOwned = isPlanOwned(product.id);

                    return (
                        <div
                            key={idx}
                            className="lg:col-span-4 p-8 md:p-12 rounded-[32px] bg-white border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-12 mt-8"
                        >
                            {/* Best Value Badge */}
                            <div className="absolute top-0 right-0">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl shadow-sm flex items-center gap-1.5">
                                    <span className="text-yellow-400">★</span> Best Value
                                </div>
                            </div>

                            {/* Left Content Side */}
                            <div className="w-full md:w-5/12 relative z-10 flex flex-col justify-center items-start">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-6">
                                    <Layers className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 text-base mb-6">{product.subtitle}</p>

                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-bold text-gray-900 tracking-tight">₹{product.price.toLocaleString()}</span>
                                    <span className="text-gray-400 text-lg font-medium"> /month</span>
                                </div>

                                <button
                                    onClick={() => !isOwned && handleAddToCart(product)}
                                    disabled={isOwned}
                                    className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-600/20 transition-all ${isOwned
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 hover:scale-[1.02]'
                                        }`}
                                >
                                    {isOwned ? "Active Plan" : "Get Started with 360"}
                                </button>
                            </div>

                            {/* Right Feature Side */}
                            <div className="w-full md:w-7/12 flex items-center">
                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {product.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-blue-600" strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Top-Up Section */}
            <div className="mt-8 p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                        <Plus className="w-7 h-7 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">₹1,000 Top-Up</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                            Choose ANY ONE of the following options. Works with all products. No plan change required.
                        </p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => handleAddToCart({
                            id: 'top-up-1000',
                            name: 'Top-Up Credit',
                            subtitle: '₹1,000 Universal Credit',
                            price: 1000,
                            features: ['Works with all products', 'No expiry', 'Instant credit']
                        })}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:border-transparent transition-all shrink-0 ml-auto shadow-sm">
                        Add Top-Up
                    </button>
                </div>

                {/* Top-up options */}
                <div className="mt-8 flex flex-wrap gap-3">
                    {topUpOptions.map((option, idx) => {
                        const Icon = option.icon;
                        return (
                            <div key={idx} className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-gray-50 border border-gray-100/50">
                                <Icon className={`w-4 h-4 ${option.color}`} strokeWidth={2.5} />
                                <span className="text-[13px] font-semibold text-gray-600">{option.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom Solution CTA */}
            <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">Need a custom solution for your enterprise?</p>
                <Link to="/contact">
                    <button className="bg-white border border-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-gray-900 px-8 py-2.5 rounded-lg font-medium transition-all">
                        Contact Sales
                    </button>
                </Link>
            </div>


        </SectionWrapper >
    );
};

export default PricingSection;


