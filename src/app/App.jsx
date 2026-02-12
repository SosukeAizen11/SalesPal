import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionProvider } from '../commerce/SubscriptionContext';
import { CartProvider } from '../commerce/CartContext';

import { ProjectProvider } from '../context/ProjectContext';
import { IntegrationProvider } from '../context/IntegrationContext';
import { WalkthroughProvider } from '../walkthrough/WalkthroughProvider';
import WalkthroughOverlay from '../walkthrough/WalkthroughOverlay';

const App = () => {
    return (
        <AuthProvider>
            <SubscriptionProvider>
                <CartProvider>
                    <IntegrationProvider>
                        <ProjectProvider>
                            <WalkthroughProvider>
                                <ScrollRestoration />
                                <Outlet />
                                {/* Walkthrough rendered at app root to prevent unmounts */}
                                <WalkthroughOverlay />
                            </WalkthroughProvider>
                        </ProjectProvider>
                    </IntegrationProvider>
                </CartProvider>
            </SubscriptionProvider>
        </AuthProvider>
    );
};

export default App;
