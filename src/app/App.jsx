import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionProvider } from '../commerce/SubscriptionContext';
import { CartProvider } from '../commerce/CartContext';
import { MarketingProvider } from '../context/MarketingContext';

import { ProjectProvider } from '../context/ProjectContext';
import { IntegrationProvider } from '../context/IntegrationContext';
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
                                <ToastProvider>
                                    <ScrollRestoration />
                                    <Outlet />
                                    <MiniCartDrawer />
                                </ToastProvider>
                            </ProjectProvider>
                        </MarketingProvider>
                    </IntegrationProvider>
                </CartProvider>
            </SubscriptionProvider>
        </AuthProvider>
    );
};

export default App;
