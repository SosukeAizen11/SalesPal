import React from 'react';
import { useProject } from '../../context/ProjectContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Dashboard = () => {
    const { activeProject } = useProject();

    // Guard included in Layout, but safe optional chaining
    if (!activeProject) return null;

    return (
        <div className="max-w-5xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome to {activeProject.name}</h1>
                <p className="text-gray-400">Manage your AI growth engine from this unified dashboard.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Active Modules</h3>
                    <div className="flex flex-wrap gap-2">
                        {activeProject.modules?.map(mod => (
                            <Badge key={mod} variant="secondary" className="capitalize">
                                {mod}
                            </Badge>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Project Status</h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-green-400 font-medium">Operational</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">All systems running normally.</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
