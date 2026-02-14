import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionProvider } from '../commerce/SubscriptionContext';
import { CartProvider } from '../commerce/CartContext';

import { ProjectProvider } from '../context/ProjectContext';
import { IntegrationProvider } from '../context/IntegrationContext';
import { WalkthroughProvider } from '../walkthrough/WalkthroughProvider';
import WalkthroughOverlay from '../walkthrough/WalkthroughOverlay';
import MiniCartDrawer from '../components/cart/MiniCartDrawer';
import { ToastProvider } from '../components/ui/Toast';

const App = () => {
    return (
        <AuthProvider>
            <SubscriptionProvider>
                <CartProvider>
                    <IntegrationProvider>
                        <ProjectProvider>
                            <WalkthroughProvider>
                                <ToastProvider>
                                    <ScrollRestoration />
                                    <Outlet />
                                    {/* Walkthrough rendered at app root to prevent unmounts */}
                                    <WalkthroughOverlay />
                                    <MiniCartDrawer />
                                </ToastProvider>
                            </WalkthroughProvider>
                        </ProjectProvider>
                    </IntegrationProvider>
                </CartProvider>
            </SubscriptionProvider>
        </AuthProvider>
    );
};

export default App;
