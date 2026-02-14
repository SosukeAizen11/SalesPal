import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedAuth = localStorage.getItem('isActiveUser');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
            setUser({ name: 'Demo User', email: 'demo@salespal.ai' });
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            // Mock network delay
            setTimeout(() => {
                if (email === 'demo@salespal.ai' && password === 'demo123') {
                    setIsAuthenticated(true);
                    setUser({ name: 'Demo User', email: email });
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
        setUser(null);
        localStorage.removeItem('isActiveUser');
        // Clear cart from localStorage
        localStorage.removeItem('salespal_cart');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
