import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedAuth = localStorage.getItem('isActiveUser');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            // Mock network delay
            setTimeout(() => {
                if (email === 'demo@salespal.ai' && password === 'demo123') {
                    setIsAuthenticated(true);
                    localStorage.setItem('isActiveUser', 'true');
                    resolve({ success: true });
                } else {
                    reject({ message: 'Invalid credentials. Try demo@salespal.ai / demo123' });
                }
            }, 800);
        });
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isActiveUser');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
