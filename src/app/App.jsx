import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { OrgProvider } from '../context/OrgContext';
import { SubscriptionProvider } from '../commerce/SubscriptionContext';
import { CartProvider } from '../commerce/CartContext';
import { MarketingProvider } from '../context/MarketingContext';
import { ProjectProvider } from '../context/ProjectContext';
import { IntegrationProvider } from '../context/IntegrationContext';
import { SalesProvider } from '../context/SalesContext';
import MiniCartDrawer from '../components/cart/MiniCartDrawer';
import { ToastProvider } from '../components/ui/Toast';
import ScrollToTop from '../components/common/ScrollToTop';
import { PreferencesProvider } from '../context/PreferencesContext';
import { NotificationProvider } from '../context/NotificationContext';

const App = () => {
    return (
        <PreferencesProvider>
            <AuthProvider>
                <OrgProvider>
                    <SubscriptionProvider>
                        <CartProvider>
                            <IntegrationProvider>
                                <SalesProvider>
                                    <MarketingProvider>
                                        <ProjectProvider>
                                            <NotificationProvider>
                                                <ToastProvider>
                                                    <ScrollRestoration />
                                                    <ScrollToTop />
                                                    <Outlet />
                                                    <MiniCartDrawer />
                                                </ToastProvider>
                                            </NotificationProvider>
                                        </ProjectProvider>
                                    </MarketingProvider>
                                </SalesProvider>
                            </IntegrationProvider>
                        </CartProvider>
                    </SubscriptionProvider>
                </OrgProvider>
            </AuthProvider>
        </PreferencesProvider>
    );
};

export default App;

