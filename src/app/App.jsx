import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionProvider } from '../commerce/SubscriptionContext';
import { CartProvider } from '../commerce/CartContext';
import { MarketingProvider } from '../context/MarketingContext';

import { ProjectProvider } from '../context/ProjectContext';
import { IntegrationProvider } from '../context/IntegrationContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import WalkthroughOverlay from '../components/walkthrough/WalkthroughOverlay';
import { MARKETING_WALKTHROUGH_STEPS } from '../components/walkthrough/marketingWalkthroughSteps';
import MiniCartDrawer from '../components/cart/MiniCartDrawer';
import { ToastProvider } from '../components/ui/Toast';

const App = () => {
    return (
        <AuthProvider>
            <SubscriptionProvider>
                <CartProvider>
                    <IntegrationProvider>
                        <MarketingProvider>
                            <ProjectProvider>
                                <WalkthroughProvider steps={MARKETING_WALKTHROUGH_STEPS}>
                                    <ToastProvider>
                                        <ScrollRestoration />
                                        <Outlet />
                                        <MiniCartDrawer />
                                        <WalkthroughOverlay />
                                    </ToastProvider>
                                </WalkthroughProvider>
                            </ProjectProvider>
                        </MarketingProvider>
                    </IntegrationProvider>
                </CartProvider>
            </SubscriptionProvider>
        </AuthProvider>
    );
};

export default App;
