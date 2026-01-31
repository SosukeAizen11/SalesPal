import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';
import { useMarketing } from '../../../context/MarketingContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export default function Projects() {
    const navigate = useNavigate();
    const { projects } = useMarketing();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <Button onClick={() => navigate('/marketing/projects/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                </Button>
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <Card
                            key={project.id}
                            onClick={() => navigate(`/marketing/projects/${project.id}`)}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Folder className="w-6 h-6 text-blue-600" />
                                </div>
                                <Badge variant={project.status === 'active' ? 'success' : 'default'}>
                                    {project.status === 'active' ? 'Active' : 'Archived'}
                                </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{project.industry} • {project.website}</p>
                            <div className="text-xs text-gray-400">Created {new Date(project.createdAt).toLocaleDateString()}</div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card noPadding className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Folder className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 max-w-sm mb-6">Create your first project to start organizing your marketing campaigns.</p>
                    <Button onClick={() => navigate('/marketing/projects/new')}>
                        Create Project
                    </Button>
                </Card>
            )}
        </div>
    );
}
