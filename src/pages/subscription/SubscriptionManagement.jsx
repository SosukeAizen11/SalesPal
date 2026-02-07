import React, { useState, useRef } from 'react';
import { Zap, ArrowUpCircle, ShoppingCart, CreditCard, FileText } from 'lucide-react';
import CurrentPlanCard from './components/CurrentPlanCard';
import PlanUpgradeCard from './components/PlanUpgradeCard';
import TopUpCard from './components/TopUpCard';
import PaymentModal from './components/PaymentModal';
import BillingHistoryModal from './components/BillingHistoryModal';
import RecentInvoicesCard from './components/RecentInvoicesCard';
import AnalyticsSnapshot from './components/AnalyticsSnapshot';

// PLANS DATA
const PLANS = [
    {
        id: 'marketing',
        name: 'SalesPal Marketing',
        price: '5,999',
        features: ['AI Content Generation', 'Auto-posting', 'Basic Analytics'],
        color: 'blue',
        tier: 1
    },
    {
        id: 'sales',
        name: 'SalesPal Sales',
        price: '9,999',
        features: ['Lead Qualification', 'CRM Integration', 'Email Sequences'],
        color: 'green',
        tier: 2
    },
    {
        id: 'postsale',
        name: 'SalesPal Post-Sale',
        price: '9,999',
        features: ['Customer Onboarding', 'Feedback Loops', 'Upsell Triggers'],
        color: 'purple',
        tier: 2
    },
    {
        id: 'support',
        name: 'SalesPal Support',
        price: '9,999',
        features: ['24/7 AI Chatbot', 'Ticket Routing', 'Knowledge Base'],
        color: 'orange',
        tier: 2
    },
    {
        id: '360',
        name: 'SalesPal 360',
        price: '29,999',
        features: ['All Modules Included', 'Priority Support', 'Dedicated Manager'],
        isBestValue: true,
        color: 'indigo',
        tier: 3
    }
];

// MOCK SUBSCRIPTION STATE
const MOCK_SUBSCRIPTION = {
    planId: 'marketing',
    status: 'active', // active, trial, expiring_soon, expired, cancelled
    renewalDate: 'Feb 12, 2026',
    daysLeft: 5
};

// TOP-UPS DATA (Same as before)
const TOP_UPS = [
    { id: 'mins', title: 'AI Calling Minutes', quantity: '200 Mins', price: '999', icon: PhoneIcon },
    { id: 'whatsapp', title: 'WhatsApp Conversations', quantity: '200 Convs', price: '1,499', icon: MessageIcon },
    { id: 'images', title: 'AI Images', quantity: '10 Images', price: '499', icon: ImageIcon },
    { id: 'carousels', title: 'AI Carousels', quantity: '5 Carousels', price: '799', icon: LayersIcon },
    { id: 'videos', title: 'AI Videos', quantity: '2 Videos', price: '999', subtext: '≤30 sec', icon: VideoIcon }
];

// Helper Icons
function PhoneIcon({ className }) { return <Zap className={className} />; }
function MessageIcon({ className }) { return <ShoppingCart className={className} />; }
function ImageIcon({ className }) { return <FileText className={className} />; }
function LayersIcon({ className }) { return <FileText className={className} />; }
function VideoIcon({ className }) { return <FileText className={className} />; }


const SubscriptionManagement = () => {
    // State
    const [currentPlan, setCurrentPlan] = useState('marketing');
    const [paymentItem, setPaymentItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Ref for scrolling
    const plansRef = useRef(null);

    const currentPlanTier = PLANS.find(p => p.id === currentPlan)?.tier || 1;

    const handleUpgrade = (plan) => {
        setPaymentItem(plan);
        setIsModalOpen(true);
    };

    const handleTopUp = (item) => {
        setPaymentItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPaymentItem(null);
    };

    const handleManageSubscription = () => {
        plansRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handlePaymentMethods = () => {
        alert("Payment Method management is coming soon.");
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in-up">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Billing Dashboard</h1>
                    <p className="text-gray-500 text-sm">Manage your enterprise subscription, resource usage, and payment history.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" /> Billing History
                    </button>
                    <button
                        onClick={handlePaymentMethods}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <CreditCard className="w-4 h-4" /> Payment Methods
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* LEFT COLUMN (Plans) - Span 8 */}
                <div className="xl:col-span-8 space-y-8">

                    {/* Current Plan */}
                    <section>
                        <CurrentPlanCard
                            subscription={MOCK_SUBSCRIPTION}
                            onManage={handleManageSubscription}
                        />
                    </section>

                    {/* Analytics Snapshot */}
                    <AnalyticsSnapshot />

                    {/* Upgrades */}
                    <section ref={plansRef}>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ArrowUpCircle className="w-5 h-5 text-gray-700" /> Available Plans
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {PLANS.map(plan => (
                                <PlanUpgradeCard
                                    key={plan.id}
                                    plan={plan}
                                    currentTier={currentPlanTier}
                                    isCurrent={currentPlan === plan.id}
                                    onSelect={() => handleUpgrade(plan)}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN (History & Top Ups) - Span 4 */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Recent Billing View */}
                    <RecentInvoicesCard onViewAll={() => setIsHistoryOpen(true)} />

                    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm border-t-4 border-t-primary/20">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> Resource Top-Up Store
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Instant usage boost. No plan change required.</p>
                        </div>

                        <div className="space-y-4">
                            {TOP_UPS.map(item => (
                                <TopUpCard
                                    key={item.id}
                                    item={item}
                                    onBuy={handleTopUp}
                                />
                            ))}
                        </div>
                    </section>
                </div>

            </div>

            {/* Global Payment Modal */}
            <PaymentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                item={paymentItem}
            />

            {/* Billing History Modal */}
            <BillingHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />

        </div>
    );
};

export default SubscriptionManagement;
