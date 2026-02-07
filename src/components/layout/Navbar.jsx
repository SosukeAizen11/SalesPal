import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();

    const [activeSection, setActiveSection] = React.useState('');

    React.useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'modules', 'how-it-works', 'pricing', 'contact'];
            // Offset for navbar height (80px) + some buffer
            const scrollPosition = window.scrollY + 100;

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
            // If at the very top, maybe clear it or set to nothing
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
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
                                className="hidden md:block text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                AI Console
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Sign Out
                            </button>
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                                D
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/signin"
                            className="px-5 py-2.5 rounded-md text-sm font-semibold text-white transition-all shadow-lg"
                            style={{
                                background: 'linear-gradient(90deg, #1D7CFF 0%, #073B8F 100%)',
                                boxShadow: '0px 14px 40px rgba(29, 124, 255, 0.25)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(90deg, #2A88FF 0%, #0A4DB4 100%)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(90deg, #1D7CFF 0%, #073B8F 100%)';
                            }}
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
