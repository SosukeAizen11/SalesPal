import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-primary border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-white font-semibold text-lg">SalesPal</div>
                <div className="flex gap-8 text-sm text-gray-400">
                    <a href="#" className="hover:text-secondary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-secondary transition-colors">Terms</a>
                    <a href="#" className="hover:text-secondary transition-colors">Contact</a>
                </div>
                <div className="text-xs text-gray-500">
                    © {new Date().getFullYear()} SalesPal Inc.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
