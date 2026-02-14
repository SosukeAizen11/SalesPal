import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../commerce/SubscriptionContext';
import ProjectSwitcher from '../components/ProjectSwitcher';
import GlobalCreditDisplay from '../components/GlobalCreditDisplay';
import TopUpDrawer from '../components/credits/TopUpDrawer';

const MarketingLayoutContent = () => {
    // We keep the header for ProjectSwitcher and GlobalCreditDisplay
    // But remove the sidebar entirely as it's now in AppLayout
    const location = useLocation();
    const { isModuleActive } = useSubscription();
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    const showCredits = isModuleActive('marketing') && location.pathname.startsWith('/marketing');

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar - Now visible for Project Switcher & Credits */}
                <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
                    <div className="w-64">
                        <ProjectSwitcher />
                    </div>
                    <div id="credit-bar" className="flex items-center gap-4">
                        {showCredits && <GlobalCreditDisplay onTopUpClick={() => setIsTopUpOpen(true)} />}
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>


            {/* Top Up Drawer */}
            <TopUpDrawer isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
        </div>
    );
};

const MarketingLayout = () => {
    return (
        <MarketingLayoutContent />
    );
};

export default MarketingLayout;
