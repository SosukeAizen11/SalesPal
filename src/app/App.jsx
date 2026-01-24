import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProjectProvider } from '../context/ProjectContext';

const App = () => {
    return (
        <AuthProvider>
            <ProjectProvider>
                <ScrollRestoration />
                <Outlet />
            </ProjectProvider>
        </AuthProvider>
    );
};

export default App;
