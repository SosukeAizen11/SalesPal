import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProjectProvider } from '../context/ProjectContext';
import { IntegrationProvider } from '../context/IntegrationContext';

const App = () => {
    return (
        <AuthProvider>
            <IntegrationProvider>
                <ProjectProvider>
                    <ScrollRestoration />
                    <Outlet />
                </ProjectProvider>
            </IntegrationProvider>
        </AuthProvider>
    );
};

export default App;
