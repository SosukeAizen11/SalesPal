import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronDown, User, LogOut, ShoppingCart } from 'lucide-react';
import { useCart } from '../../commerce/CartContext';

const AppHeader = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Initial fallback if user context is missing (though it should be there because of ProtectedRoute)
    const userInitials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'SP';

    const userEmail = user?.email || 'user@salespal.ai';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-8 relative z-50">
            {/* Left side: Logo */}
            <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900 tracking-tight">SalesPal</span>
            </div>

            {/* Right side: User Profile */}
            <div className="flex items-center gap-4">
                <Link
                    to="/cart"
                    className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cart.length > 0 && (
                        <span className="absolute top-1 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                            {cart.length}
                        </span>
                    )}
                </Link>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold border border-blue-200">
                            {userInitials}
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {userEmail}
                                </p>
                            </div>

                            <div className="py-1">
                                {/* Placeholder Profile Link */}
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <User className="w-4 h-4 mr-3 text-gray-400" />
                                    Your Profile
                                </button>

                                <button
                                    onClick={logout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
