import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.webp';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            // If not on home, just go home (anchor will be lost but that's fine for now, or we can use hash router logic)
            window.location.href = `/#${id}`;
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-primary/90 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="SalesPal" className="h-12 w-auto" />
                </Link>

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#A8B3BD]">
                    <button onClick={() => scrollToSection('modules')} className="hover:text-secondary transition-colors">Features</button>
                    <button onClick={() => scrollToSection('pricing')} className="hover:text-secondary transition-colors">Pricing</button>
                    <button onClick={() => scrollToSection('how-it-works')} className="hover:text-secondary transition-colors">How it Works</button>
                </div>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/marketing"
                                className="hidden md:block text-sm font-medium text-white hover:text-secondary transition-colors"
                            >
                                AI Console
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-[#7C8A96] hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs border border-secondary/20">
                                D
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/signin"
                            className="bg-secondary text-primary px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-secondary/90 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
