import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api, { setTokens, clearTokens, getAccessToken, getRefreshToken } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ─── Bootstrap: check for existing JWT on mount ──────────────────────
    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            setLoading(false);
            return;
        }

        api.get('/users/me')
            .then((data) => {
                setUser(data.user || data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                clearTokens();
                setIsAuthenticated(false);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // ─── Login ───────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        const data = await api.post('/auth/login', { email, password });
        setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
    }, []);

    // ─── Signup ──────────────────────────────────────────────────────────
    const signup = useCallback(async (email, password, fullName) => {
        const data = await api.post('/auth/register', { email, password, fullName });
        setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
    }, []);

    // ─── Logout ──────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        const refreshToken = getRefreshToken();
        try {
            await api.post('/auth/logout', { refreshToken });
        } catch { /* ignore */ }
        clearTokens();
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        isAuthenticated,
        user,
        session: null, // no Supabase session — JWT-based now
        login,
        signup,
        logout,
        loading,
    }), [isAuthenticated, user, loading, login, signup, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
