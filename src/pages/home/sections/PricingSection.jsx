import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import SectionWrapper from '../../../components/layout/SectionWrapper';
import { Phone, Check, ShoppingCart, Layers, Plus, PhoneCall, MessageSquare, Image, Grid3x3, Video, Zap, Bot, UserCheck, Megaphone, Headphones } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
    const { addToCart } = useCart();
    const [addedItems, setAddedItems] = useState({});



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
                "No hallucination (escalates if unsure)",
                "Call diversion ON/OFF",
                "Complaint registration with ID",
                "Sentiment detection"
            ]
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {products.map((product, idx) => {
                    const Icon = product.icon;
                    const isAdded = addedItems[product.id];
                    return (
                        <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all">
                            <div className={`w-14 h-14 ${product.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{product.subtitle}</p>

                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                <span className="text-gray-600">/mo</span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {product.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={isAdded ? "primary" : "outline"}
                                className="w-full"
                                onClick={() => handleAddToCart(product)}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {isAdded ? "Added to Cart!" : "Add to Cart"}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* SalesPal 360 Section */}
            <div className="relative mb-12">
                {/* Best Value Badge */}
                <div className="absolute -top-3 right-6 z-10">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-lg">
                        <span>⭐</span>
                        <span>Best Value</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl transition-all">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left side - Icon, Title, Price */}
                        <div className="lg:w-1/3">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl w-fit mb-4 shadow-lg shadow-blue-500/30">
                                <Layers className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">SalesPal 360</h3>
                            <p className="text-sm text-gray-600 mb-6">Complete AI revenue operating system</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">₹29,999</span>
                                <span className="text-gray-600"> /month</span>
                            </div>

                            <Link to="/contact">
                                <button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white w-full lg:w-auto px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                                    Get Started with 360
                                </button>
                            </Link>
                        </div>

                        {/* Right side - Features in 2 columns */}
                        <div className="lg:w-2/3">
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                                {salesPal360Features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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


