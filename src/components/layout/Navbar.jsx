import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import useReducedMotion from '../../hooks/useReducedMotion';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();

    const [activeSection, setActiveSection] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'modules', 'how-it-works', 'pricing', 'contact'];
            const scrollPosition = window.scrollY + 100;

            // Update navbar style based on scroll
            setIsScrolled(window.scrollY > 20);

            // Specific check for bottom of page to prioritize Contact section
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                setActiveSection('contact');
                return;
            }

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        return;
                    }
                }
            }

            if (window.scrollY < 50) {
                setActiveSection('');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            window.location.href = `/#${id}`;
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });

                // Brief highlight effect on section title
                const sectionTitle = element.querySelector('h2, h1');
                if (sectionTitle && !prefersReducedMotion) {
                    sectionTitle.style.transition = 'text-shadow 0.4s ease-out';
                    sectionTitle.style.textShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
                    setTimeout(() => {
                        sectionTitle.style.textShadow = 'none';
                    }, 400);
                }
            }
        }
    };

    const getLinkClasses = (sectionId) => {
        const baseClasses = "hover:text-blue-600 transition-all py-1 border-b-2";
        const activeClasses = activeSection === sectionId
            ? "text-blue-600 border-blue-600"
            : "text-gray-600 border-transparent";

        return `${baseClasses} ${activeClasses}`;
    };

    return (
        <motion.nav
            className="fixed top-0 w-full z-50 border-b border-gray-200"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -10, filter: 'blur(8px)' }}
            animate={prefersReducedMotion ? {} : {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                height: isScrolled ? '64px' : '80px',
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: isScrolled ? 'blur(16px)' : 'blur(12px)',
                boxShadow: isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
            transition={{
                opacity: { duration: 0.5 },
                y: { duration: 0.5 },
                filter: { duration: 0.5 },
                height: { duration: 0.25, ease: 'easeOut' },
                backgroundColor: { duration: 0.25 },
                backdropFilter: { duration: 0.25 },
                boxShadow: { duration: 0.25 }
            }}
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)'
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    {/* Custom circular logo with dot */}
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="13" stroke="#1F2937" strokeWidth="2.5" fill="none" />
                        <circle cx="22" cy="10" r="2.5" fill="#1F2937" />
                    </svg>
                    <span className="text-xl font-semibold text-gray-900">SalesPal</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <button onClick={() => scrollToSection('about')} className={getLinkClasses('about')}>About</button>
                    <button onClick={() => scrollToSection('modules')} className={getLinkClasses('modules')}>Products</button>
                    <button onClick={() => scrollToSection('how-it-works')} className={getLinkClasses('how-it-works')}>How It Works</button>
                    <button onClick={() => scrollToSection('pricing')} className={getLinkClasses('pricing')}>Pricing</button>
                    <Link to="/contact" className={getLinkClasses('contact')}>Contact</Link>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Shopping Cart Icon with Badge */}
                    <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                        <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/marketing"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:-translate-y-0.5"
                            style={{
                                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                                boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
