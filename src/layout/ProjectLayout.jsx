import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { LayoutGrid, AlertCircle, LogOut, Bell, User } from 'lucide-react';
import Sidebar from './Sidebar';

const ProjectLayout = () => {
    const { activeProject, loading } = useProject();
    const { logout } = useAuth();
    const location = useLocation();

    if (loading) return null;

    // Route Guard: Must have active project
    if (!activeProject) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <div className="min-h-screen bg-primary flex flex-col">
            {/* Top Bar */}
            <header className="h-14 border-b border-white/5 bg-primary/95 backdrop-blur flex items-center justify-between px-4 fixed top-0 w-full z-50">
                <div className="flex items-center gap-4 h-full">
                    <Link to="/" className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                        <img src={logo} alt="SalesPal" className="h-8 w-auto" />
                    </Link>

                    <div className="h-6 w-px bg-white/10"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{activeProject.name}</span>
                        <span className="text-xs text-gray-500 border border-white/10 px-1.5 py-0.5 rounded capitalize">
                            {activeProject.industry}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <Bell className="w-4 h-4" />
                    </button>
                    <button
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        title="Sign out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                    <div className="ml-2 w-7 h-7 rounded-full bg-gradient-to-tr from-secondary to-blue-500 flex items-center justify-center text-[10px] font-bold text-primary border border-secondary/20">
                        JD
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex pt-14 h-screen">
                {/* Sidebar Placeholder */}
                <Sidebar />

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProjectLayout;
