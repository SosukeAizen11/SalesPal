import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen bg-primary flex items-center justify-center text-secondary">Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to home page but save the attempted url
        return <Navigate to="/" state={{ from: location, openAuth: true }} replace />;
    }

    return children;
};

export default ProtectedRoute;
